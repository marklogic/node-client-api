/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const createAuthInitializer = require('./www-authenticate-patched/www-authenticate');
const Kerberos              = require('./optional.js')
                            .libraryProperty('kerberos', 'Kerberos');
const Multipart             = require('multipart-stream');
const through2              = require('through2');
const mlutil                = require('./mlutil.js');
const responder             = require('./responder.js');
let kerberos = null;
const https = require('https');
const formData = require('form-data');

function createAuthenticator(client, user, password, challenge) {
  const authenticator = createAuthInitializer.call(null, user, password)(challenge);
  if (!client.authenticator) {
    client.authenticator = {};
  }
  client.authenticator[user] = authenticator;
  return authenticator;
}

function createAuthenticatorKerberos(client, credentials) {
  const authenticatorKerberos = {
    'credentials': credentials
  };
  client.authenticatorKerberos = authenticatorKerberos;
  return authenticatorKerberos;
}

function getAuthenticator(client, user) {
  if (!client.authenticator) {
    return null;
  }
  return client.authenticator[user];
}

function getAuthenticatorKerberos(client) {
  if (!client.authenticatorKerberos) {
    return null;
  }
  return client.authenticatorKerberos;
}

function getAccessToken(operation){
  const postData = `${encodeURI('grant_type')}=${encodeURI('apikey')}&${encodeURI('key')}=${encodeURI(operation.client.connectionParams.apiKey)}`;
  const path = operation.client.connectionParams.accessTokenDuration?'/token?duration='+encodeURIComponent(operation.client.connectionParams.accessTokenDuration):'/token';
  function handleTokenError(error, contextMessage) {
    if (!operation.lockAccessToken) {
      return;
    }

    operation.lockAccessToken = false;

    const baseMessage = (contextMessage == null) ? 'Failed to obtain access token' : contextMessage;
    const errorMessage = (error && error.message) ? `${baseMessage}: ${error.message}` : baseMessage;
    operation.errorListener(new Error(errorMessage));
  }

  const options = {
    hostname: operation.client.connectionParams.host,
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (d) => {
      responseBody += d.toString();
    });

    res.on('end', () => {
      if(res.statusCode === 400){
        handleTokenError(null, 'Token endpoint returned 400: ' + responseBody);
        return;
      }

      try {
        const responseValue = JSON.parse(responseBody);
        if (!responseValue.access_token || !responseValue['.expires']) {
          throw new Error('missing required token fields');
        }

        const expiration = new Date(responseValue['.expires']);
        if (Number.isNaN(expiration.getTime())) {
          throw new Error('invalid .expires value');
        }

        operation.accessToken = responseValue.access_token;
        operation.expiration = expiration;
        operation.lockAccessToken = false;
      } catch (error) {
        handleTokenError(error, 'Invalid token endpoint response');
        return;
      }

      authenticatedRequest(operation);
    });

    res.on('error', (e) => {
      handleTokenError(e, 'Failed to obtain access token');
    });
  });

  req.on('error', (e) => {
    handleTokenError(e, 'Failed to obtain access token');
  });

  req.write(postData);
  req.end();
}

function startRequest(operation) {
  const options = operation.options;
  const operationErrorListener = responder.operationErrorListener;
  operation.errorListener = mlutil.callbackOn(operation, operationErrorListener);

  let headers = options.headers;
  if (headers == null) {
    headers = {};
    options.headers = headers;
  }
  headers['X-Error-Accept'] = 'application/json';
  if (!options.disableTelemetryHeader) {
    headers['ML-Agent-ID'] = 'nodejs'; // Telemetry header
  }

  if(options.enableGzippedResponses) {
    headers['Accept-Encoding'] = 'gzip';
  }
  let started                = null;
  let operationResultPromise = null;

  switch(operation.requestType) {
  case 'empty':
    break;
  case 'single':
    operation.inputSender = singleRequester;
    break;
  case 'multipart':
    operation.inputSender = multipartRequester;
    break;
  case 'chunked':
    operationResultPromise = responder.operationResultPromise;
    started = through2();
    started.result = mlutil.callbackOn(operation, operationResultPromise);
    operation.requestWriter = started;
    operation.inputSender = chunkedRequester;
    break;
  case 'chunkedMultipart':
    operationResultPromise = responder.operationResultPromise;
    started = through2();
    started.result = mlutil.callbackOn(operation, operationResultPromise);
    operation.requestWriter = started;
    operation.inputSender = chunkedMultipartRequester;
    break;
  default:
    throw new Error('unknown request type '+operation.requestType);
  }

  const authType = options.authType.toUpperCase();
  let needsAuthenticator = (
      authType === 'DIGEST' ||
      authType === 'KERBEROS'
  );
  if (needsAuthenticator) {
    let authenticator = null;
    switch(authType) {
    case 'DIGEST':
      authenticator = getAuthenticator(operation.client, options.user);
      break;
    case 'KERBEROS':
      authenticator = getAuthenticatorKerberos(operation.client);
      break;
    default:
      throw new Error('initialization for unknown authenticator type '+authType);
    }
    if (authenticator !== null) {
      needsAuthenticator = false;
      operation.authenticator = authenticator;
    }
  }
  if (needsAuthenticator) {
    switch(authType) {
    case 'DIGEST':
      challengeRequest(operation);
      break;
    case 'KERBEROS':
      credentialsRequest(operation);
      break;
    default:
      throw new Error('request for unknown authenticator type '+authType);
    }
  } else {
    if(operation.client.connectionParams.apiKey && !operation.accessToken){
      if(!operation.lockAccessToken){
        operation.lockAccessToken = true;
        getAccessToken(operation);
      } else {
        authenticatedRequest(operation);
      }
    } else {
      authenticatedRequest(operation);
    }
  }

  if (started === null) {
    const ResponseSelector = responder.ResponseSelector;
    started = new ResponseSelector(operation);
  }

  return started;
}
function challengeRequest(operation) {
  const isRead        = (operation.inputSender === null);
  const options       = operation.options;
  const challengeOpts = isRead ? options : {
    method:     'HEAD',
    path:       '/v1/ping'
  };
  if (!isRead) {
    Object.keys(options).forEach(function optionKeyCopier(key) {
      if (challengeOpts[key] === void 0) {
        const value = options[key];
        if (value != null) {
          challengeOpts[key] = value;
        }
      }
    });
  }

  operation.logger.debug('challenge request for %s', challengeOpts.path);
  var request1 = operation.client.request(challengeOpts, function challengeResponder(response1) {
    const statusCode1   = response1.statusCode;
    const successStatus = (statusCode1 < 400);
    const challenge     = response1.headers['www-authenticate'];
    const hasChallenge  = (challenge != null);

    operation.logger.debug('response with status %d and %s challenge for %s',
        statusCode1, hasChallenge, challengeOpts.path);
    if ((statusCode1 === 401 && hasChallenge) || (successStatus && !isRead)) {
      try{
        operation.authenticator = (hasChallenge) ? createAuthenticator(
            operation.client, options.user, options.password, challenge
        ) : null;

      } catch(error){
        request1.emit('error', new Error('Authentication failed.'));
      }
      authenticatedRequest(operation);
    // should never happen
    } else if (successStatus && isRead) {
      const responseDispatcher = responder.responseDispatcher;
      responseDispatcher.call(operation, response1);
    } else if (isRetry(response1)) {
      retryRequest(operation, response1, challengeRequest);
    } else {
      operation.errorListener('challenge request failed for '+options.path);
    }
  });

  request1.on('error', operation.errorListener);
  request1.end();
}
function credentialsRequest(operation) {
  kerberos = new Kerberos();
  const uri = 'HTTP@'+operation.options.host;
  kerberos.authGSSClientInit(uri, 0, function(err, ctx) {
    if (err) {
      operation.errorListener('kerberos initialization failed at '+uri);
    }
    operation.logger.debug('kerberos initialized at '+uri);
    kerberos.authGSSClientStep(ctx, '', function (err) {
      if (err) {
        operation.errorListener('kerberos credentials failed');
      }
      operation.logger.debug('kerberos credentials retrieved');
      operation.authenticator = createAuthenticatorKerberos(
        operation.client,
        ctx.response
      );
      authenticatedRequest(operation);
      kerberos.authGSSClientClean(ctx, function(err) {
        if (err) {
          operation.errorListener('kerberos client clean failed');
        }
      });
    });
  });
}
function authenticatedRequest(operation) {
  const isRead = (operation.inputSender === null);
  const options = operation.options;
  operation.logger.debug('authenticated request for %s', options.path);
  const authenticator = operation.authenticator;
  const responseDispatcher = operation.isReplayable ? retryDispatcher : responder.responseDispatcher;
  const request = operation.client.request(
      options, mlutil.callbackOn(operation, responseDispatcher)
      );
  const authType = options.authType.toUpperCase();
  if (authenticator != null) {
    switch(authType) {
      case 'DIGEST':
        operation.logger.debug('digest authentication');
        request.setHeader(
            'authorization',
            authenticator.authorize(options.method, options.path)
        );
        break;
      case 'KERBEROS':
        operation.logger.debug('kerberos authentication');
        request.setHeader(
            'authorization',
            'Negotiate '+authenticator.credentials
        );
        break;
      default:
        operation.errorListener('unknown authentication type '+authType);
    }
  } else {
    switch(authType) {
      case 'SAML':
        operation.logger.debug('saml authentication');
        request.setHeader(
            'authorization',
            options.auth
        );
        break;
      case 'CLOUD':
        operation.logger.debug('cloud authentication');
        request.setHeader(
            'authorization',
            'bearer ' + operation.accessToken
        );
        break;
      case 'OAUTH':
        request.setHeader(
            'Authorization',
            'Bearer ' +options.oauthToken
        );
    }
  }
  request.on('error', operation.errorListener);
  if (isRead) {
    request.end();
  } else {
    operation.inputSender(request);
  }
}
function retryDispatcher(response) {
  /*jshint validthis:true */
  const operation = this;

  if (isRetry(response)) {
    retryRequest(operation, response, authenticatedRequest);
  } else {
    responder.responseDispatcher.call(operation, response);
  }
}
function isRetry(response) {
  const retryStatus = [502, 503, 504];

  return retryStatus.indexOf(response.statusCode) > -1;
}
function retryRequest(operation, response, requestSender) {
  const retryAfterRaw = response.headers['retry-after'];
  const retryAfter    = (retryAfterRaw === void 0 || retryAfterRaw === null) ? -1 :
      Number.parseInt(retryAfterRaw, 10);

  operation.retryAttempt++;

  const retryTimeout = 120000; // 2 minutes
  const retryMin     = 50; // milliseconds
  const retryExpMax  = 6; // maximum exponential range
  const randomized   = Math.floor(Math.random() * (retryMin + 1)) + retryMin; // 50 to 100
  const nextRetry    = Math.max(
      retryAfter,
      // 1 = 100 to 200, 2 = 200 to 400, 3 = 400 to 800, 4 = 800 to 1600, 5 = 1600 to 3200, N = 3200 to 6400
      randomized * Math.pow(2, Math.min(operation.retryAttempt, retryExpMax))
  );

  operation.retryDuration += nextRetry;
  if (operation.retryDuration > retryTimeout) {
    operation.errorListener(`retry failed for ${response.statusCode} status after ${
        operation.retryAttempt} attempts over ${operation.retryDuration / 1000} seconds`);
  } else {
    operation.logger.debug('retry status = %d next = %d attempt = %d duration = %d',
        response.statusCode, nextRetry, operation.retryAttempt, operation.retryDuration);
    setTimeout(requestSender, nextRetry, operation);
  }
}

function singleRequester(request) {
  /*jshint validthis:true */
  const operation = this;

  const requestSource = mlutil.marshal(operation.requestBody, operation);
  if (requestSource == null) {
    request.end();
  } else if (typeof requestSource === 'string' || requestSource instanceof String) {
    request.write(requestSource, 'utf8');
    request.end();
  // readable stream might not inherit from ReadableStream
  } else if (typeof requestSource._read === 'function') {
    requestSource.pipe(request);
  } else {
    request.write(requestSource);
    request.end();
  }
}
function multipartRequester(request) {
  /*jshint validthis:true */
  const operation = this;

  const operationBoundary = operation.multipartBoundary;
  const boundary = (operationBoundary == null) ? mlutil.multipartBoundary : operationBoundary;
  const CRNL = '\r\n';

  const requestPartsProvider = operation.requestPartsProvider;
  if (operation.bindingParam) {
    // bindingParam path: use multipart-stream (form-data body is a stream)
    const multipartStream = new Multipart(boundary);
    const form = new formData();
    const bindingParam = operation.bindingParam;
    const query = bindingParam.query;
    const key = bindingParam.key;
    const binding = bindingParam[key];
    const attachments = bindingParam.attachments;
    const metadata = bindingParam.metadata;

    form.setBoundary(mlutil.multipartBoundary);
    form.append('query', query, {contentType:  'application/json', filename: 'fromParam-AST.js'});
    form.append(key, JSON.stringify(binding), {contentType: 'application/json', filename: 'data.json'});

    if(attachments && attachments instanceof Array && attachments.length) {
        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];
          const keys = Object.keys(attachment);
          for(let j = 0; j < keys.length; j++) {
            const key = keys[j];
            if(typeof attachment[key] === 'object') {
              form.append('doc', JSON.stringify(attachment[key]), {filename: key});
            } else {
              form.append('doc', attachment[key], {filename: key});
            }
          }
        }
    } else {
      if(typeof attachments === 'object') {
        const keys = Object.keys(attachments);
        for(let j = 0; j < keys.length; j++) {
          const key = keys[j];
          if(typeof attachments[key] === 'object') {
            form.append('doc', JSON.stringify(attachments[key]), {filename: key});
          } else {
            form.append('doc', attachments[key], {filename: key});
          }
        }
      }
    }

    if(metadata) {
      form.append('metadata',  JSON.stringify(metadata), {contentType: 'application/json', filename: 'metadata.json'});
    }

    multipartStream.add({
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + mlutil.multipartBoundary,
        Accept: 'application/json',
      },
      body: form,
    });
    multipartStream.on('data', chunk => request.write(chunk));
    multipartStream.on('end', () => request.end());
  } else if (typeof requestPartsProvider === 'function') {
    // requestPartsProvider path: use multipart-stream (provider controls parts)
    const multipartStream = new Multipart(boundary);
    requestPartsProvider.call(operation, multipartStream);
    multipartStream.on('data', chunk => request.write(chunk));
    multipartStream.on('end', () => request.end());
  } else {
    // requestPartList path: all parts have synchronous content — build body directly
    // as a Buffer to avoid sandwich-stream's 'readable' event regression on Node.js v26+.
    const parts = operation.requestPartList;
    const bufs = [Buffer.from('--' + boundary + CRNL)];
    let written = 0;
    if (Array.isArray(parts)) {
      operation.logger.debug('writing %s parts', parts.length);
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const headers = part.headers;
        const content = part.content;
        if ((headers != null) && (content != null)) {
          if (written > 0) bufs.push(Buffer.from(CRNL + '--' + boundary + CRNL));
          operation.logger.debug('starting part %s', i);
          Object.entries(headers).forEach(([k, v]) => bufs.push(Buffer.from(k + ': ' + v + CRNL)));
          bufs.push(Buffer.from(CRNL));
          bufs.push(Buffer.isBuffer(content) ? content : Buffer.from(content));
          operation.logger.debug('finished part %s', i);
          written++;
        } else {
          operation.logger.debug('nothing to write for part %d', i);
        }
      }
    } else {
      operation.logger.debug('no part list to write');
    }
    bufs.push(Buffer.from(CRNL + '--' + boundary + '--'));
    request.end(Buffer.concat(bufs));
  }
}
function chunkedRequester(request) {
  /*jshint validthis:true */
  const operation = this;

  const requestWriter = operation.requestWriter;
  if (requestWriter === null || requestWriter === undefined) {
    operation.errorListener('no request writer for streaming request');
    request.end();
  }

  requestWriter.pipe(request);
}
function chunkedMultipartRequester(request) {
  /*jshint validthis:true */
  const operation = this;

  const requestWriter = operation.requestWriter;
  const requestDocument = operation.requestDocument;
  if (requestWriter == null) {
    operation.errorListener('no request writer for streaming request');
    request.end();
  } else if (requestDocument == null) {
    operation.errorListener('no request document for streaming request');
    request.end();
  } else {
    const operationBoundary = operation.multipartBoundary;
    const boundary = (operationBoundary == null) ? mlutil.multipartBoundary : operationBoundary;
    const CRNL = '\r\n';

    // Write all non-stream (metadata) parts directly as Buffers, then pipe the
    // streaming content part into the request. This avoids the sandwich-stream
    // 'readable' event regression on Node.js v26+ where multi-chunk PassThrough
    // streams are not fully drained, leaving the closing boundary unemitted.
    const partLast = requestDocument.length - 1;
    request.write(Buffer.from('--' + boundary + CRNL));
    let written = 0;
    for (let i=0; i <= partLast; i++) {
      const part = requestDocument[i];
      const headers = part.headers;
      if (i < partLast) {
        const content = part.content;
        if ((headers != null) && (content != null)) {
          if (written > 0) request.write(Buffer.from(CRNL + '--' + boundary + CRNL));
          Object.entries(headers).forEach(([k, v]) => request.write(Buffer.from(k + ': ' + v + CRNL)));
          request.write(Buffer.from(CRNL));
          const marshaledContent = mlutil.marshal(content, operation);
          request.write(Buffer.isBuffer(marshaledContent) ? marshaledContent : Buffer.from(marshaledContent));
          written++;
        } else {
          operation.logger.debug('could not write metadata part');
        }
      } else {
        if (headers != null) {
          if (written > 0) request.write(Buffer.from(CRNL + '--' + boundary + CRNL));
          Object.entries(headers).forEach(([k, v]) => request.write(Buffer.from(k + ': ' + v + CRNL)));
          request.write(Buffer.from(CRNL));
          requestWriter.on('data', chunk => request.write(chunk));
          requestWriter.on('end', () => {
            request.write(Buffer.from(CRNL + '--' + boundary + '--'));
            request.end();
          });
        } else {
          operation.logger.debug('could not write content part');
          request.end();
        }
      }
    }
  }
}

module.exports = {
  startRequest: startRequest,
  getAccessToken: getAccessToken
};

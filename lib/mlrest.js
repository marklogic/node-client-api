/*
 * Copyright 2014 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var util                  = require("util");
var events                = require("events");
var http                  = require('http');
var createAuthInitializer = require('www-authenticate');
var Promise               = require("bluebird");
var mlutil                = require('./mlutil.js');

function createAuthenticator(client, user, password, challenge) {
  var authenticator = createAuthInitializer.call(null, user, password)(challenge);
  if (!client.authenticator) {
    client.authenticator = {};
  }
  client.authenticator[user] = authenticator;
  return authenticator;
}

function getAuthenticator(client, user) {
  if (!client.authenticator) {
    return null;
  }
  return client.authenticator[user];
}

function RequestProxy(client, options, responder) {
  events.EventEmitter.call(this);

  var requestStatus = 'authenticating';
  var writeStatus   = 'appending';
  
  var self = this;

  var request = http.request(options, function(response) {
    var challenge = response.headers['www-authenticate'];
    if (response.statusCode < 300) {
      responder(response);
      requestStatus = 'writing';
      self.write();
    } else if (response.statusCode === 401 && challenge) {
      var authenticator = createAuthenticator(
          this, options.user, options.password, challenge
          );
      request = http.request(options, responder);
      request.setHeader('authorization',
          authenticator.authorize(options.method, options.path)
          );
      requestStatus = 'writing';
      self.write();
      response.resume();
    } else {
      // TODO: throw error
    }
  }.bind(client));

  var chunks = null;
  function writeChunk(chunk, encoding, callback){
    if (requestStatus === 'done') {
      return false;
    }

    if (writeStatus === 'closing') {
      request.end();
      writeStatus = 'closed';
    }

    switch (requestStatus) {
    case 'authenticating':
      if (chunk) {
        if (chunks === null) {
          chunks = [];
        }
        chunks.push([chunk, encoding]);
      }
      break;
    case 'writing':
      if (chunks) {
        chunks.forEach(function(item, index, array) {
          request.write.apply(request, item);
        });
        chunks = null;
      }

      if (chunk) {
        request.write(chunk, encoding);
      }

      if (writeStatus !== 'appending') {
        request.end();
        requestStatus = 'done';
      }
      break;
    }

    return true;
  }

  this.options = options;
  this.write   = writeChunk;
  this.end     = function(chunk, encoding, callback) {
    writeStatus = 'closing';
    self.write(chunk, encoding, callback);
  };
  this.abort = function() {
    if (request) {
      request.abort();
    } // TODO: second request invocation
  };
  this.setTimeout = function(timeout, callback) {
    if (request) {
      request.setTimeout(timeout, callback);
    } // TODO: second request invocation
  };
  this.setNoDelay = function(noDelay) {
    if (request) {
      request.setNoDelay(noDelay);
    } // TODO: second request invocation
  };
  this.setSocketKeepAlive = function(enable, initialDelay) {
    if (request) {
      request.setSocketKeepAlive(enable, initialDelay);
    } // TODO: second request invocation
  };
/*
  this.addListener = function(event, listener) {
    if (request) {
      request.addListener(event, listener);
    } // TODO: second request invocation
  };
  this.on = function(event, listener) {
console.log('on '+event);
if (event === 'drain') {
  console.log('listener '+listener);
}
    if (request) {
      request.on(event, listener);
    }
  }; // TODO: second request invocation
  this.once = function(event, listener) {
    if (request) {
      request.once(event, listener);
    }
  }; // TODO: second request invocation
  this.removeListener = function(event, listener) {
console.log('remove '+event);
    if (request) {
// TODO
//      request.emit(event, listener);
    }
  };
  this.removeAllListeners = function(event) {
    if (request) {
      request.removeAllListeners();
    }
  };
  this.setMaxListeners = function(n) {
    if (request) {
      request.setMaxListeners(n);
    }
  }; // TODO: second request invocation
  this.listeners = function(event) {
    if (request) {
      return request.listeners();
    }
  };
  this.emit = function(event) {
console.log('emit '+event);
    if (request) {
      request.emit(event);
    }
  }; // TODO: second request invocation
 */

  this.on('pipe',  function(src) {
// TODO: fire drain event? 
    src.on('data', function(chunk) {
      self.write(chunk);
    });
  });
}
util.inherits(RequestProxy, events.EventEmitter);

function responseCollector(response) {
  // TODO: awareness of mime type for conversion
  this.mapper(response, this);
}
function proxyOnData(chunk) {
  if (chunk === undefined)
    return;

  if (this.data === null)
    this.data = [ chunk ];
  else
    this.data.push(chunk);
}
function proxyOnEnd() {
  if (this.error !== null && this.reject !== null) {
    this.reject(this.error);
  } else if (this.resolve !== null) {
    if (!(this.hasSingleResult)) {
      this.resolve(this.data);
    } else if (this.data === null) {
      this.resolve();          
    } else if (this.data.length === 1) {
// TODO: set the format in the mapper to signal whether to parse
      if (mlutil.isString(this.data[0])) {
        this.resolve((this.format === 'text') ? this.data[0] : JSON.parse(this.data[0]));          
      } else if (this.data[0] instanceof Buffer) {
        this.resolve(JSON.parse(this.data[0].toString()));
      } else {
        this.resolve(this.data[0]);
      }
    } else {
      this.resolve(this.data);
    }
  }
}
function proxyOnError(error) {
  if (error === undefined)
    return;

  if (this.error === null)
    this.error = [ error ];
  else
    this.error.push(error);
}
function proxyResult(fullfilled, rejected) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    if (self.done) {
      if (self.error) {
        if (reject)
          reject(self.error);
      } else if (self.resolve) {
        if (!(self.hasSingleResult)) {
          self.resolve(self.data);
        } else if (self.data === null) {
          self.resolve();          
        } else if (self.data.length === 1) {
          self.resolve(self.data[0]);          
        } else {
          self.resolve(self.data);
        }
      }
    } else {
      if (resolve)
        self.resolve = resolve;
      if (reject)
        self.reject  = reject;
    }
  });
  self.on('data',  proxyOnData.bind(self));
  self.on('end',   proxyOnEnd.bind(self));
  self.on('error', proxyOnError.bind(self));
  return promise.then(fullfilled, rejected);
}
function proxyStream() {
  return this;
}

function Responder(responseProxy, withStream) {
  this.result = proxyResult.bind(responseProxy);
  if (withStream) {
    this.stream = proxyStream.bind(responseProxy);
  }
}

// TODO: add stream() function when appropriate
// TODO: support error listener for request as well
function ResponseProxy(mapper, hasSingleResult) {
  events.EventEmitter.call(this);
  this.data            = null;
  this.error           = null;
  this.resolve         = null;
  this.reject          = null;
  this.mapper          = mapper;
  this.hasSingleResult = (hasSingleResult === true);
  this.collector       = responseCollector.bind(this);
  this.format          = null;
}
util.inherits(ResponseProxy, events.EventEmitter);

function emptyEventMapper(response, proxy) {
  var addErrorListener = true;
  var eventNames = ['error', 'end'];
  for (var i=0; i < eventNames.length; i++) {
    var event = eventNames[i];
    var listeners = proxy.listeners(event);
    if (listeners.length === 0)
      continue;
    switch(event) {
    case 'error':
      addErrorListener = false;
      break;
    }
    for (var j=0; j < listeners.length; j++) {
      response.on(event, listeners[j]);
    }
  }
  if (addErrorListener) {
    response.on('error', mlutil.requestErrorHandler);
  }
  response.resume();
}

// TODO: accept response proxy instead of responder
function createRequest(client, options, writable, responder) {
  var request = null;
  options.Connection = 'keep-alive';
  var authenticator = getAuthenticator(client, options.user);
  if (options.authType !== 'DIGEST' || authenticator) {
    request = http.request(options, responder);
    if (authenticator) {
      request.setHeader('authorization',
          authenticator.authorize(options.method, options.path)
          );
    }
  } else if (!writable) {
    request = http.request(options, function(response) {
      var challenge = response.headers['www-authenticate'];
      if (response.statusCode === 401 && challenge) {
        var authenticator = createAuthenticator(
            this, options.user, options.password, challenge
            );
        response.on('end', function() {
          var request2 = http.request(options, responder);
          request2.setHeader('authorization',
              authenticator.authorize(options.method, options.path)
              );
          request2.end();
        }.bind(this));
        response.resume();
      } else {
        responder(response);
      }
    }.bind(client));
  } else {
    request = new RequestProxy(client, options, responder);
  }
  return request;
}

function createResponse(eventNames, hasSingleResult) {
  return new ResponseProxy(eventNames, hasSingleResult);
}
function createResponder(responseProxy, withStream) {
  return new Responder(responseProxy, withStream);
}

module.exports = {
    request:          createRequest,
    response:         createResponse,
    responder:        createResponder,
    emptyEventMapper: emptyEventMapper
};

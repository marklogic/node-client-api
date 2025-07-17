/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const expect = require('chai').expect;

const testutil    = require('../testutil');
const ValueStream = require('../../../test-basic/test-util.js').ValueStream;

const PostOfMultipartForNone = require("../generated/postOfMultipartForNone.js");

describe('supplemental mappings for node parameters', function() {
  const service = PostOfMultipartForNone.on(testutil.makeClient());

  it('array as buffer', function(done) {
    service.postOfMultipartArrayForNone0(Buffer.from(`["text1", 1]`))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('array as set', function(done) {
    service.postOfMultipartArrayForNone0(new Set(["text1", 1]))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('array as stream', function(done) {
    service.postOfMultipartArrayForNone0(new ValueStream(`["text1", 1]`))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('array as string', function(done) {
    service.postOfMultipartArrayForNone0(`["text1", 1]`)
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });

  it('binaryDocument as stream', function(done) {
    service.postOfMultipartBinaryDocumentForNone0(new ValueStream(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAA0AAAATCAYAAABLN4eXAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oIEQEjMtAYogQAAAKvSURBVCjPlZLLbhxFAEVPVVdXVz/G8zCOn0CsKGyQkSIIKzas8xfsWbLkp/gJhCKheIlAJDaj2MYez6u7p7vrxQKUPVc6+yOdK77/4cfXQohJqlOVZdmBSpKY6jQKBM45oVMlgHvrvMuNWRljvlNKq69G2YyqLDg4mLE/2yPNYFRWlFXF/nTC2clRWbc7Fss1IcZzqTA8eWY5eu7p1Hv+WvyBVjnGZOQmI9UKISUqSXDO0bS7Tko0xfGSp18kjM7v+P3+NUMr8T5grWMYLCEErHM474khoCw1t78eU/8mEOpjXpxekJUORIZSCbkxSCnRWpPnBikTqbx31E1DjJHpeIzRhnW9xceI857H5Yr1Zku765jf3DIMtlUAIQRCiFhnabsOH1IEAmstAGWRY11ApykmM0oplTKZjNGZREpJoUueHI0ZFRV7exX7+1Nm0yn9YLm5u2fX96lUseLwxQ0vX8H04i2/XP9Et5H44OkHS920hBDo+56u77GDjcrHjvV1ya3TDO2M01mOUAEAhED+R5IkpKmCiFCOjoc/p+xuLbPpCc+P95HaEqIBIhHoB8t2W/PwsKBudl5FH7GxwUYYouJh5ci7nLbtWW02LBaPvLuef1AdrItKKolJpkivwGrG5QxTCsq8pCxLqqrk7PiIwTmW6y0xRCVTSg4vFnz+raM4+5ur1RtSUZHnOUWeMx5VVFWJTlOstfTWRuk96NIyOUgRRc188RZvgRg/3OffjoFESohxUMvmjqufP+X+MqDTU77+5EvMKKBUQpZpijxHSkluDHvjMW8uL79Rnz07bwSyzDLFqCzwDNw/PNI0O9bbhvVmQ7vb0bQdi+Wq327rl+rko8krodKnCHnofJju+r5oupBstg1KJT7Vuruev185O9zVm/WVUmouYoz83/0DxhRmafe2kasAAAAASUVORK5CYII=', 'base64')))
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });

  it('jsonDocument as buffer', function(done) {
    service.postOfMultipartJsonDocumentForNone0(Buffer.from(`{"root":{"child":"text1"}}`))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('jsonDocument as map', function(done) {
    service.postOfMultipartJsonDocumentForNone0(new Map([['root', {"child":"text1"}]]))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('jsonDocument as stream', function(done) {
    service.postOfMultipartJsonDocumentForNone0(new ValueStream(`{"root":{"child":"text1"}}`))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('jsonDocument as string', function(done) {
    service.postOfMultipartJsonDocumentForNone0(`{"root":{"child":"text1"}}`)
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });

  it('object as buffer', function(done) {
    service.postOfMultipartObjectForNone0(Buffer.from(`{"root":{"child":"text1"}}`))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('object as map', function(done) {
    service.postOfMultipartObjectForNone0(new Map([['root', {"child":"text1"}]]))
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('object as stream', function(done) {
    service.postOfMultipartObjectForNone0(new ValueStream(`{"root":{"child":"text1"}}`))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('object as string', function(done) {
    service.postOfMultipartObjectForNone0(`{"root":{"child":"text1"}}`)
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });

  it('textDocument as buffer', function(done) {
    service.postOfMultipartTextDocumentForNone0(Buffer.from('abc'))
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('textDocument as stream', function(done) {
    service.postOfMultipartTextDocumentForNone0(new ValueStream('abc'))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });

  it('xmlDocument as buffer', function(done) {
    service.postOfMultipartXmlDocumentForNone0(Buffer.from('<root><child>text1</child></root>\n'))
       .then(output => {
          expect(output).to.be.undefined;
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('xmlDocument as stream', function(done) {
    service.postOfMultipartXmlDocumentForNone0(new ValueStream('<root><child>text1</child></root>\n'))
        .then(output => {
          expect(output).to.be.undefined;
          done();
        })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
});

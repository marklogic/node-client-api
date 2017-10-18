const op = require('/MarkLogic/optic');

op.fromLiterals([
            {id:1, val: 2, uri:'/test/binary/test1.png'},
            {id:2, val: 4, uri:'/test/write/stream1.png'}
            ])
    .orderBy('id')
    .joinDoc(op.col('doc'), op.col('uri'))
    .export();

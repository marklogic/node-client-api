const p = require('/MarkLogic/optic');

p.fromLiterals([
      {row:1, gp:1, nm:'alpha', str:'a', num:10, bool:true},
      {row:2, gp:1, nm:'beta',  str:'b', num:20, bool:false},
      {row:3, gp:2, nm:'gamma', str:'c', num:30, bool:true},
      {row:4, gp:2, nm:'delta', str:'d', num:40, bool:false}
      ])
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.xmlDocument(
                    p.xmlElement(p.col('nm'), null,
                        p.xmlElement(p.col('str'), null, p.xmlText(p.col('bool')))
                        )
                    )),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
.export();

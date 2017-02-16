# Template for JSDoc API Documentation

This directory contains a template for generating JSDoc API docs
for the Node.js Client API with
[gulp-jsdoc3](https://www.npmjs.com/package/gulp-jsdoc3).
The template is based on the "cerulean" Bootswatch theme as generated
by [DocStrap](https://github.com/docstrap/docstrap) (v1.3.0).

To generate the docs using this template, run the following from the
root project directory:

`gulp doc`

The docs are generated into a doc/ subdirectory. You can change this
destination as well as other settings by editing this project's
jsdoc.json file.

The original template was modified to remove embedded javascript
from layout.tmpl so the pages can safely be hosted by MarkLogic Server
as XHTML. The embedded JavaScript has been moved to the
static/scripts/extracted/ subdirectory and is referenced from there.

You can use an alternative templates and themes by editing the
jsdoc.json file in the root project directory. Change the "template"
and "theme" values.

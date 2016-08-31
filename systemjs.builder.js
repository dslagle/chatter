var path = require('path');
var Builder = require('systemjs-builder');
var del = require('del');

var builder = new Builder('public', 'public/systemjs.config.js');

builder.bundle('app/boot.js', './public/js/app/boot.js', { minify: true, encodeNames: false })
    .then(function() {
        del([ './public/js/app/**/*.js', '!./public/js/app/boot.js' ])
            .then(function(paths) {
                console.log('Cleanup Complete:\n' + paths.join('\n'));
            });
    })
    .catch(function(err) {
        console.log('Bundle Error: ' + err);
    });
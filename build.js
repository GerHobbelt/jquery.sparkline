const fs = require('fs');
const package = require('./package.json');
const uglify = require('uglify-js');

const files = [
    'src/header.js',
    'src/defaults.js',
    'src/utils.js',
    'src/simpledraw.js',
    'src/rangemap.js',
    'src/interact.js',
    'src/base.js',
    'src/chart-line.js',
    'src/chart-bar.js',
    'src/chart-tristate.js',
    'src/chart-discrete.js',
    'src/chart-bullet.js',
    'src/chart-pie.js',
    'src/chart-box.js',
    'src/vcanvas-base.js',
    'src/vcanvas-canvas.js',
    'src/vcanvas-vml.js',
    'src/footer.js'
];
var content = '';
files.map(file => {
    console.log(file);
    content += fs.readFileSync(file, 'utf8');
});

content = content.replace('@VERSION@', package.version);

fs.writeFile('dist/jquery.sparkline.js', content, (err) => {
    if (err) throw err;

    console.log('dist/jquery.sparkline.js created');

    var result = uglify.minify('dist/jquery.sparkline.js');
    fs.writeFile('dist/jquery.sparkline.min.js', result.code, (err) => {
        if (err) throw err;
        console.log('dist/jquery.sparkline.min.js created');
    });
});

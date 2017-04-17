module.exports = function (grunt) {
  
  // Yes, this is reptative: https://github.com/gruntjs/grunt/issues/547
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  
  // if you simply run "grunt" these default tasks will execute, IN THE ORDER THEY APPEAR!
  grunt.registerTask('default', ["concat", "uglify"]);
  grunt.registerTask('lint', ["jshint"]); // does not pass, and for now, I'm not gunna make it pass.
  
  grunt.initConfig({
    /* a pointer to an external package.json file */
    pkg: grunt.file.readJSON('package.json'),
    
    /* http://www.jshint.com/options/ */
    /* NOTE: rules in the source files will override these settings! */
    jshint: {
      files: ['./dist/jquery.sparkline.js'],
      options: {
        indent: 2, /* indent sets white to true in jshint 0.9.1, but we want it to be false */
        white: false, /* so white goes after indent gets set */
        curly: true, /* requires you to always put curly braces around blocks in loops and conditionals */
        devel: true, /* expose console.log and alert and other globals */
        eqeqeq: true, /* prohibits the use of == and != in favor of === and !== */
        immed: true, /* prohibits the use of immediate function invocations without wrapping them in parentheses */
        latedef: true, /* prohibits the use of a variable before it was defined (ie, no hoisting) */
        newcap: false, /* true forces you to capitalize names of constructor functions (we have a 3rd party lib that doesn't) */
        noarg: true, /* prohibits the use of arguments.caller and arguments.callee (ecma5 strict) */
        sub: true, /* suppresses warnings about using [] notation when it can be expressed in dot notation */
        strict: true, /* requires all functions to run in EcmaScript 5's strict mode */
        undef: true, /* no explicitly undefined vars (ie, no spontaneous globals) */
        boss: true, /* suppresses warnings about the use of assignments in cases where comparisons are expected */
        eqnull: true, /* suppresses warnings about == null comparisons */
        browser: true, /* defines globals exposed by modern browsers */
        laxcomma: true, /* suppresses warnings about comma-first coding style */
        globals: {
          _: true // example global for underscore.js
        }
      },
    },
    
    concat: {
      dist: {
        src: [
          './src/header.js',
          './src/defaults.js',
          './src/utils.js',
          './src/simpledraw.js',
          './src/rangemap.js',
          './src/interact.js',
          './src/base.js',
          './src/chart-line.js',
          './src/chart-bar.js',
          './src/chart-stack.js',
          './src/chart-tristate.js',
          './src/chart-discrete.js',
          './src/chart-bullet.js',
          './src/chart-pie.js',
          './src/chart-box.js',
          './src/chart-timeline.js',
          './src/vcanvas-base.js',
          './src/vcanvas-canvas.js',
          './src/vcanvas-vml.js',
          './src/footer.js'
        ],
        dest: './dist/jquery.sparkline.js',
      },
    },
    
    uglify: {
      options: {
        banner: '<%= pkg.banner %>'
      },
      
      sparkline: {
        src: ['./dist/jquery.sparkline.js'],
        dest: './dist/jquery.sparkline.min.js'
      },
    },
    
    /* watch the development files for saves and do stuff when we observe a save */
    watch: {
      js: {
        files: "<%= './src/*.js' %>", // when any of these files are updated...
        tasks: ["default"] // ...do these tasks
      }
    }
  });
};

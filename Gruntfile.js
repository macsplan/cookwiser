module.exports = function(grunt) {
  require( 'load-grunt-tasks' )( grunt );

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-newer');

  grunt.initConfig({
    clean: {
      img: ['htdocs/img/'],
      css: ['htdocs/css/*.css'],
      js: ['htdocs/js/*.js']
    },
    stylus: {
      compile: {
        options: {
          paths: ['styl'],
          use: [
            require('nib'),
            require('jeet'),
            require('rupture')
          ]
        },
        files: {
          'htdocs/css/app.min.css': 'styl/app.styl'
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      css: {
        src: ['bower_components/normalize-css/normalize.css'],
        dest: 'htdocs/css/lib.css',
      },
      js: {
        src: ['bower_components/jquery/dist/jquery.js', 
              'bower_components/jquery.scrollTo/jquery.scrollTo.js', 
              'bower_components/moment/moment.js', 
              'bower_components/picturefill/dist/picturefill.js', 
              'bower_components/stickyNavbar.js/jquery.easing.min.js', 
              'bower_components/jquery-sticky/jquery.sticky.js', 
              'bower_components/jquery-scrollTo/jquery.scrollTo.js', 
              'bower_components/vide/dist/jquery.vide.js'],
        dest: 'htdocs/js/lib.js',
      },
    },
    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: 'htdocs/',
      },      
      js: {
        src: 'js/app.js',
        dest: 'htdocs/js/app.js'
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'htdocs/css/lib.min.css': ['htdocs/css/lib.css']
        }
      }
    },        
    uglify: {
      main: {
        files: {
          'htdocs/js/lib.min.js': ['htdocs/js/lib.js'],
          'htdocs/js/app.min.js': ['htdocs/js/app.js']
        }
      }
    },
    imagemin: {                          // Task
      quick: {                         // Another target
        options: {                       // Target options
          optimizationLevel: 0,
          svgoPlugins: [{ removeViewBox: false }]
        },
        files: [{
          expand: true,                  // Enable dynamic expansion
          src: ['img/**/*.{png,jpg,gif,svg,mp4,ogv,webm}'],   // Actual patterns to match
          dest: 'htdocs'                  // Destination path prefix
        }]
      },
      slow: {                         // Another target
        options: {                       // Target options
          optimizationLevel: 7,
          svgoPlugins: [{ removeViewBox: false }]
        },
        files: [{
          expand: true,                  // Enable dynamic expansion
          src: ['img/**/*.{png,jpg,gif,svg,mp4,ogv,webm}'],   // Actual patterns to match
          dest: 'htdocs'                  // Destination path prefix
        }]
      }
    },
    // rename: {
    //   main: {
    //     files: [
    //       {src: ['htdocs/_img'], dest: 'htdocs/img'},
    //     ]
    //   }
    // },
    // watch: {
    //   styles: {
    //     files: ['js/*',
    //             'styl/*',
    //             'styl/base/*',
    //             'styl/modules/*',
    //             'styl/pages/*',
    //             'htdocs/*.php'],
    //     tasks: ['clean', 'stylus', 'concat'],
    //     options: {
    //       interrupt : true,
    //       atBegin : true,
    //       livereload : true
    //     }
    //   }
    // }
  });

  grunt.registerTask('default', ['clean:css', 'clean:js', 'stylus', 'concat', 'copy', 'cssmin', 'uglify', 'newer:imagemin:quick']);
  grunt.registerTask('optim', ['clean:img', 'imagemin:slow']);
};

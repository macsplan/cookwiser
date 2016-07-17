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
  grunt.loadNpmTasks('grunt-sass');

  grunt.initConfig({
    clean: {
      img: ['htdocs/img/'],
      css: ['htdocs/css/*.css'],
      js: ['htdocs/js/*.js']
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'htdocs/css/app.css': 'css/app.scss'       // 'destination': 'source'
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      css: {
        src: ['bower_components/normalize-css/normalize.css',
              'bower_components/magnific-popup/dist/magnific-popup.css'],
        dest: 'htdocs/css/lib.css'
      },
      js: {
        src: ['bower_components/jquery/dist/jquery.js',
              'bower_components/masonry/dist/masonry.pkgd.js',
              'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
              'bower_components/scotchPanels/dist/scotchPanels.js'],
        dest: 'htdocs/js/lib.js'
      }
    },
    copy: {
      fonts: {
        expand: true,
        src: 'fonts/**/*',
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
          'htdocs/css/app.min.css': ['htdocs/css/app.css'],
          'htdocs/css/lib.min.css': ['htdocs/css/lib.css']
        }
      }
    },
    uglify: {
      main: {
        files: {
          'htdocs/js/app.min.js': ['htdocs/js/app.js'],
          'htdocs/js/lib.min.js': ['htdocs/js/lib.js']
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
    watch: {
      styles: {
        files: ['js/*',
                'css/*',
                'fonts/**/*',
                'img/**/*'],
        tasks: ['default'],
        options: {
          interrupt : true,
          atBegin : true,
          livereload : true
        }
      }
    }
  });

  grunt.registerTask('default', ['clean:css', 'clean:js', 'sass', 'concat', 'copy', 'cssmin', 'uglify', 'newer:imagemin:quick']);
  grunt.registerTask('optim', ['clean:img', 'imagemin:slow']);
};

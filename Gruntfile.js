/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

var ngrok = require('ngrok');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });

  grunt.initConfig({


    pagespeed: {
      options: {
        nokey: true,
        locale: "en_GB",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    },
    htmlmin: {
              options: {                                 // Target options
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true
            },
            dist: {
                files: {
                  'final/index.html': 'dev/index.html'
                }
            }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          expand: true,
          cwd: 'dev/css/',
          src: ['*.css'],
          dest: 'final/css/'
        }]
      }
    },

    uglify: {
      target: {
        files: [{
          expand: true,
          cwd: 'app/js/',
          src: ['*.js'],
          dest: 'final/js/'
        },
        {
          expand: true,
          cwd: 'views/js_src/',
          src: ['*.js'],
          dest: 'views/js/'
        }]
      }
    },

    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            width: 70,
            suffix: '_small_1x',
            quality: 60
          },
          {
            width: 115,
            suffix: '_medium_2x',
            quality: 60
          }]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/',
          dest: 'images/'
        }]
      },
      pizza: {
        options: {
          engine: 'im',
          sizes: [{
            width: 400,
            suffix: '_medium_2x',
            quality: 50
          },
          {
            width: 200,
            suffix: '_small_1x',
            quality: 50
          }]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'views/images_src/',
          dest: 'views/images/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images', 'views/images'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['images', 'views/images']
        },
      },
    },

    /* Copy the "fixed" images that don't go through processing into the images/directory */
    copy: {
      dev: {
        files: [{
          expand: true,
          src: 'images_src/fixed/*.{gif,jpg,png}',
          dest: 'images/'
        },
        {
          expand: true,
          src: 'views/images_src/fixed/*.{gif,jpg,png}',
          dest: 'images/'
        }]
      },
    },
  });

  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 50000;
    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images', 'htmlmin', 'cssmin', 'uglify', 'psi-ngrok', 'ngrok']);


};

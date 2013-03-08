/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta:{
            version:'0.1.0'
        },

        compass:{
             dev:{
                 options: {
                     config: './assets/compass_config.rb',
                 }
            }
        },

        concat: {
            options: {
                separator: ""
            },
            dist: {
                src: ['assets/js/modernizr-2.6.1.min.js', 'assets/js/jquery.js', 'assets/js/jquery-ui-1.8.19.custom.min.js', 'assets/js/underscore.js', 'assets/js/main.js'],
                dest: 'js/main.js'
            }
        },

        watch:{
            sass: {
                files: "assets/stylesheets/**/*.scss",
                tasks: "compass"
            },
            scripts: {
                files: "assets/js/**/*.js",
                tasks: "concat"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['watch', 'concat']);
};

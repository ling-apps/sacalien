/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        meta:{
            version:'0.1.0'
        },

        compass:{
            dev:{
                basePath: '.',
                sassDir: 'assets/stylesheets/**/*.scss',
                cssDir: 'css',
                imagesDir: 'assets/images',
                generatedImagesDir: 'img',
                relativeAssets: true,
                outputStyle: 'expanded'
            }
        },

        concat: {
            options: {
                separator: ""
            },
            dist: {
                src: ['assets/js/jquery.js', 'assets/js/underscore.js', 'assets/js/main.js'],
                dest: 'js/main.js'
            }
        },

        watch:{
            sass: {
                files: "assets/stylesheets/**/*.scss",
                tasks: "compass:dev"
            },
            scripts: {
                files: "assets/js/**/*.js",
                tasks: "concat"
            }
        }
    });

    grunt.loadNpmTasks('grunt-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', 'watch:sass watch:scripts compass:dev concat');
};

# Generated on 2014-07-06 using generator-angular 0.9.1

module.exports = (grunt) ->

  # Load grunt tasks automatically
  require('load-grunt-tasks')(grunt)

  # Configurable paths for the application
  appConfig = {
    app: require('./bower.json').appPath || 'app',
  }

  # Define the configuration for all the tasks
  grunt.initConfig({

  # Project settings
    yeoman: appConfig

    watch:
      bower:
        files: ['bower.json'],
        tasks: ['shell:build']

      coffee:
        files: [
          'app/**/**.coffee'
          'browserify/**/**.coffee'
        ],
        tasks: ['shell:build']

      compass:
        files: ['<%= yeoman.app %>/**/**.sass'],
        tasks: ['shell:build']

      html2js:
        files: ['<%= yeoman.app %>/**/**.tpl.html'],
        tasks: ['shell:build']

    shell:
      build:
        command: 'gulp build'

  })

  grunt.registerTask 'default', [
    'shell:build',
    'watch'
  ]

  grunt.registerTask 'test', []

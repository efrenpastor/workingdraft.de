module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: require('./package'),
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'js/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Build modernizr
		modernizr: {
			devFile: 'js/vendor/modernizr-2.6.2.js',
			outputFile : 'dist/js/vendor/modernizr-for-<%= pkg.version %>.min.js',

			extra: {
				shiv: true,
				mq: true
			},

			// Minify
			uglify: true,

			// Files
			files: ['js/**/*.js', 'scss/**/*.scss']
		},

		sass: {
			dev: {
				options: {
					unixNewlines: true,
					style: 'expanded'
				},
				files: {
					'css/main.css': 'scss/main.scss'
				}
			},
			deploy: {
				options: {
					style: 'compressed'
				},
				files: {
					'dist/css/main-<%= pkg.version %>.min.css': 'scss/main.scss'
				}

			}
		},

		clean: {
			deploy: ['dist']
		},

		requirejs: {
			compile: {
				options: {
					baseUrl: 'js/',
					mainConfigFile: 'js/config.js',
					include: ['Vendor/require'],
					out: 'dist/js/main-<%= pkg.version %>.min.js'
				}
			}
		},

		copy: {
			deploy: {
				files: [{
					src: ['js/**'],
					dest: 'dist/'
				}]
			}
		},

		jasmine: {
			src: 'js/*.js',
			options: {
				specs: 'tests/*.js',
				vendor: ['js/vendor/jquery-1.9.1.min.js'],
				outfile: 'tests/_SpecRunner.html'
			}
		},

		watch: {
			scss: {
				files: ['scss/**/*.scss'],
				tasks: 'sass:dev'
			},

			js: {
				files: [
					'Gruntfile.js',
					'js/*.js'
				],
				tasks: 'jshint'
			}
		},

		// Server config
		connect: {
			server: {
				options: {
					port: 9001,
					keepalive: true
				}
			}
		}
	});

	// Load some stuff
	grunt.loadNpmTasks('grunt-modernizr');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// A task for development
	grunt.registerTask('dev', ['jshint', 'jasmine', 'sass:dev']);

	// A task for deployment
	grunt.registerTask('deploy', ['jshint', 'jasmine', 'clean', 'modernizr', 'sass:deploy', 'requirejs', 'copy']);

	// Default task
	grunt.registerTask('default', ['jshint', 'jasmine', 'sass:dev', 'requirejs', 'copy']);

	// Travis CI task
	grunt.registerTask('travis', ['jshint', 'jasmine']);

};

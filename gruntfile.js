module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  uglify: {
		  options: {
			  mangle: false
		},
		my_target: {
			files: {
				'dist/display-time.min.js': ['src/*.js']
			}
		}
	  }
  });

  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Default task(s).
  grunt.registerTask('default', ['uglify']);
};
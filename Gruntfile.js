
module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	var pkg = grunt.file.readJSON("package.json");
	var options = {
		banner : grunt.template.process(grunt.file.read("src/banner.js"), {data: pkg})
	};

	grunt.initConfig({
		concat : {
			dist : {
				options : options,
				files : {
					"dist/fbready.js" : ["src/fbready.js"]
				}
			}
		},
		uglify : {
			dist : {
				options : options,
				files : {
					"dist/fbready.min.js" : ["src/fbready.js"]
				}
			}
		}
	});

	grunt.registerTask("default", ["concat", "uglify"]);


};
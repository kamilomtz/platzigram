var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

//definir una tarea para gulp con task(define una nueva tarea)
gulp.task('styles', function(){
	gulp
		.src('index.scss')//empieza desde este archivo
		.pipe(sass())//pasa el archivo por el pre-procesador sass
		.pipe(rename('app.css'))
		.pipe(gulp.dest('public'));//con el archivo procesado, donde se pone

})

gulp.task('assets', function(){
	gulp
		.src('assets/*')
		.pipe(gulp.dest('public'));
})

function compile(watch){
	var bundle = browserify('./src/index.js')

	if(watch){
		bundle.on('update', function(){
			console.log('-->Bundling...');
			rebundle();
		});
	}

	function rebundle(){
		bundle = watchify(bundle);
		bundle	
			.transform(babel, {presets: ["es2015"], plugins: ['syntax-async-functions', 'transform-regenerator']})
			.bundle()
			.on('error', function(error){ console.log(err); this.emit('end') })
			.pipe(source('index.js')) //source transforma el resultado de bundle() por browserify para que lo entiende gulp
			.pipe(rename('app.js'))
			.pipe(gulp.dest('public'));
	}

	rebundle();
}


gulp.task('build', function(){
	return compile();
});

gulp.task('watch', function(){
	return compile(true);
});

gulp.task('default', ['styles', 'assets', 'build'])
'use strict'

var gulp=require('gulp')
var copy=require('../index')

gulp.task('default',function(){
	gulp.src('./src/index.html').pipe(copy({
		dest:'./dest',
		target:['foo.html','bar.html']
	})).on('end',function(){
		
	})
})
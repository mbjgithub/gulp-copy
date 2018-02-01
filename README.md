# gulp-just-copy
batch copy file and rename,origin stream still pipe down

#Usage
```
  //将origin.html文件的内容复制到当前dest目录下，名称分别为foo.html,bar.html
  var copy=require('gulp-copy')
  gulp.src('origin.html').pipe(copy({
  	  target:['foo.html','bar.html'],  
  	  dest:'./dest'
  	}))
```

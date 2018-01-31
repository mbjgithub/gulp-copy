'use strict'

var gutil = require('gulp-util')
var es = require('event-stream')
var path = require('path')
var PLUGIN_NAME = require('./package.json').name
var PluginError = gutil.PluginError
var colors = gutil.colors
var fs=require('fs')

module.exports=function(options){
	var errMsg=''
	if(!options.dest){
		errMsg='dest param is needed'
	}else if(!options.target){
		errMsg='target param is needed'
	}
	if(errMsg){
    	throw new gutil.PluginError(PLUGIN_NAME, errMsg);
    }
	return es.map(function(tpl,cb){
		if (tpl.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream is not supported for template!'))
            return cb(null, tpl)
        }
        if (tpl.isNull()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Template should not be null!'))
            return cb(null, tpl)
        }
        var dest=options.dest
        var target=options.target||[]
        var cnt=tpl.contents
        var tarPath
        fs.access(dest, function(err) {
		    if(err){
		    	fs.mkdirSync(dest)
		    }
		    target.map(function(name){
		    	tarPath=path.join(dest,name)
	        	fs.writeFileSync(tarPath,cnt)
	        	gutil.log(
		            PLUGIN_NAME + ': ' + colors.yellow('✔') + ' Copy to ' + colors.blue(path.resolve(tarPath)) + ' success'
		        )
	        })
	        cb(null,tpl)
		});
        
	})
}
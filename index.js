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
	}else if(!options.target.length){
		errMsg='target param is empty'
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
        var start=+new Date()
        var dest=options.dest
        var target=options.target||[]
        var cnt=tpl.contents
        var base=PLUGIN_NAME + ': ' + colors.yellow('✔') + ' Copy to '
        var tarPath
        fs.access(dest, function(err) {
		    if(err){
		    	fs.mkdirSync(dest)
		    }
		    var len=target.length
		    var curr=0
		    target.map(function(name){
		    	tarPath=path.join(dest,name)
	        	fs.writeFile(tarPath,cnt,function(err){
	        		if(err){
	        			gutil.log(base+ colors.blue(path.resolve(tarPath))+' fail')
	        		}else{
	        			gutil.log( base+ colors.blue(path.resolve(tarPath)) + ' success')
	        		}
	        		curr++
	        		if(curr===len){
	        			_succ()
	        		}
	        	})
	        })
		});
        function _succ(){
        	cb(null,tpl)
	        var end=+new Date()
	        var interval=end-start
	        var timeStr=interval>1000?(interval/1000).toFixed(2)+'s':interval+'ms'
	        gutil.log(
	        	PLUGIN_NAME + ': ' + colors.yellow('✔')	+' finished after '+timeStr
	       	)
        }
	})
}
var fs = require('fs');
var path = require('path');
 
var cfgFileName = require('./config.cfg');
var cache = {};
 console.log(cfgFileName);
module.exports.getConfigs = function () {
    if (!cache[cfgFileName]) {
        if (!process.env.cloudDriveConfig) {
            process.env.cloudDriveConfig = path.join(process.cwd(), cfgFileName);
        }
        if (fs.existsSync(process.env.cloudDriveConfig)) {
            var contents = fs.readFileSync(
                process.env.cloudDriveConfig, {encoding: 'utf-8'});
            cache[cfgFileName] = JSON.parse(contents);
        }
    }
    console.log(cfgFileName);
    return cache[cfgFileName];
};
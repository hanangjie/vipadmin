/**
 * Created by Administrator on 2015/10/14.
 */

var sqlServer={
    sqlPromise:function(option){
        "use strict";
        return (new Promise(function(resolve, reject) {
            var sql = option.sql;
            option.con.query(sql, function (err1, res1) {
                option.debug(option.name, ":error:" + err1 + ";result:" + res1);
                if (res1) {
                    resolve(res1);
                } else {
                    reject(err1);
                }
            });
        }));
    }
};

module.exports = sqlServer;
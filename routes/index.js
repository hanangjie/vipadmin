var express = require('express');
var router = express.Router();
var conn=require("../server/config");
var sqlServer=require("../server/sqlServer.js");
var debug = require('debug')('vipadmin:index');
var moment=require('moment');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/index', function(req, res, next) {
   try{
       var con=conn.conn();
       con.connect();
       var sql="select * from customer where storeid='1' limit 10";
       con.query(sql,function(err1,res1){
            debug("error:%o;result:%o",res1,err1);
            push(res1);
        });
       function push(res1){
           res1.forEach(function(e){
               e.creattime=moment(e.creattime).format("YYYY-MM-DD");
           });
           res.render('index', { name: 'index',
               list:res1
           });
       }
       con.end();

    }catch(e){
        console.log(e.stack);
    }

});


router.post('/addCustomer',function(req, res, next){
    "use strict";
    /*function selectUser(){
        var sql=`select * from customer where mobile='${req.body.mobile}'`;
        con.query(sql,function(err1,res1){
            debug("selectUser:error:"+err1+";result:"+res1);
        })
    }

    function insertUser(){
        var sql=`insert all into customer(storeid,mobile,name) values(1,"${req.body.mobile}","${req.body.name}")`;
        con.query(sql,function(err1,res1){
            debug("insertUser:error:"+err1+";result:"+res1);
            return res1;
        });
    }

    function insertMoney(){
        var sql=`insert into money(storeid,userid,money,status)
                    values(1,6,500,1)`;
        con.query(sql,function(err1,res1){
            debug("insertMoney:error:"+err1+";result:"+res1);
            return res1;
        });
    }
*/

    var con=conn.conn();
    con.connect();
    /*var promise = new Promise(function(resolve, reject) {
        var sql=`select * from customer where mobile='${req.body.mobile}'`;
        con.query(sql,function(err1,res1){
            debug("selectUser:error:%o;result:%o",err1,res1);
            if (res1){
                resolve(res1);
            } else {
                reject(err1);
            }
        });
    });*/

    sqlServer.sqlPromise({con:con,debug:debug,sql:`select * from customer where mobile='${req.body.mobile}'`,name:"select"}).then(function(res1){
        if(res1.length<1){
           return sqlServer.sqlPromise({con:con,debug:debug,sql:`insert into customer(storeid,mobile,name) values(1,"${req.body.mobile}","${req.body.name}")`,name:"insert"})
        }else{
            res.send({
                code:"-1",
                msg:"用户已存在"
            });
            con.end();
        }
    }).then(function(res){
        debug("res:",res);
        return sqlServer.sqlPromise({con:con,debug:debug,sql:`insert into money(storeid,userid,money,status)
                    values(1,6,500,1)`,name:"insert"});
    });
   /* promise.then(function(p){
        if(p.length<1) {
            var promise2 = new Promise(function (resolve, reject) {
                var sql = `insert into customer(storeid,mobile,name) values(1,"${req.body.mobile}","${req.body.name}")`;
                con.query(sql, function (err1, res1) {
                    debug("selectUser:error:%o;result:%o",err1,res1);
                    if (res1) {
                        resolve(res1);
                    } else {
                        reject(err1);
                    }
                });
            });
        }

        con.end();

    });
*/
    /*
    var promise3 = new Promise(function(resolve, reject) {
        var sql=`insert into money(storeid,userid,money,status)
                    values(1,6,500,1)`;
        con.query(sql,function(err1,res1){
            debug("selectUser:error:"+err1+";result:"+res1);
            if (res1){
                resolve(res1);
            } else {
                reject(error);
            }
        });
    });
    var promise4 = new Promise(function(resolve, reject) {
        var sql=`insert into money(storeid,userid,money,status)
                    values(1,6,500,1)`;
        con.query(sql,function(err1,res1){
            debug("selectUser:error:"+err1+";result:"+res1);
            if (res1){
                resolve(res1);
            } else {
                reject(error);
            }
        });
    });*/
});


router.get('/costHistory', function(req, res, next) {
    try{
        var con=conn.conn();
        con.connect();
        var sql="select * from money inner join customer on money.userid = customer.id";
        con.query(sql,function(err1,res1){
            debug("error:%o;result:%o",res1,err1);
            push(res1);
        });
        function push(res1){
            res1.forEach(function(e){
                e.time=moment(e.time).format("YYYY-MM-DD HH:mm:ss");
            });
            res.render('costHistory', { name: 'costHistory',
                list:res1
            });
        }
        con.end();
    }catch(e){
        console.log(e.stack);
    }
});

/*
router.get('/customer/:id',function(req,res){
    "use strict";
    try{
        var id=req.params.id;
        var con=conn.conn();
        con.connect();
        var sql="select * from customer where storeid='1' limit 10";
        con.query(sql,function(err1,res1){
            debug("error:%o;result:%o",res1,err1);
            push(res1);
        });
        function push(res1){
            res1.forEach(function(e){
                e.creattime=moment(e.creattime).format("YYYY-MM-DD");
            });
            res.render('index', { name: 'index',
                list:res1
            });
        }
        con.end();

    }catch(e){
        console.log(e.stack);
    }
});*/

router.post('/regist', function(req, res, next) {
    try{
        var con=conn.conn();
        con.connect();
        var mobile=req.body.mobile&req.body.mobile.trim();

        if(mobile.toString().length>11){
            res.send({
                code:-2,
                msg:"手机格式不对"
            });
            return;
        }
        var sql="insert into store(storename,mobile,pwd,status) values('"+req.body.name+"','"+mobile+"','"+req.body.pwd+"','1')";
        con.query(sql,function(err1,res1){
            console.log("error:"+err1+";result:"+res1);
            if(res1.length>1) {
                console.log("false");
                res1.code="-1";
                res1.msg="手机已经注册！";
                push(res1);
            }else{
                res1.code="1";
                res1.msg="注册成功！";
                push(res1);
            }
        });
        function push(res1){
            res.send(res1);
        }
        con.end();

    }catch(e){
        console.log(e.stack);
    }
});

router.post('/login', function(req, res, next) {
    try{
        var con=conn.conn();
        con.connect();
        var sql=`select * from store where mobile='${req.body.mobile}' and pwd='${req.body.pwd}'`;
        con.query(sql,function(err1,res1){
            debug("error:"+err1+";result:"+res1);
            push(res1);
        });
        function push(res1){
            if(res1.length>=1){
                res.send({
                    code:1,
                    msg:"登录成功！"
                });
            }else{
                res.send({
                   code:-1,
                    msg:"用户名或者密码失败"
                });
            }
        }
        con.end();
    }catch(e){
        console.log(e.stack);
    }
});


module.exports = router;

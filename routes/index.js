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
       sqlServer.sqlPromise({con:con,debug:debug,sql:"select * from customer where storeid='1' limit 10",name:"select"}).then(function(res1){
           "use strict";
            var selectStr="";
           if(res1.length>0){
               res1.forEach(function(e){
                   e.creattime=moment(e.creattime).format("YYYY-MM-DD");
                   e.money=0;
                   selectStr+=`or userid=\"${e.id}\" `;
               });
               selectStr=`select * from balance where `+selectStr.slice(3);
               sqlServer.sqlPromise({con:con,debug:debug,sql:selectStr,name:"selectMoney"}).then(function(result){
                   result.forEach(function(e){
                        for(var q=0;q<res1.length;q++){
                            if(res1[q].id==e.userid){
                                res1[q].money=e.money;
                               
                            }
                        }
                   });
                   debug("res1",res1);
                   res.render('index', { name: 'index',
                       list:res1
                   });
                   con.end();
               });
           }else{
               con.end();
               res.render('index', { name: 'index',
                   list:res1
               });
           }
       });

    }catch(e){
        console.log(e.stack);
    }

});


router.post('/addCustomer',function(req, res, next){
    "use strict";
    req.body.mobile=parseInt(req.body.mobile)||0;

    var con=conn.conn();
    con.connect();
    var userId=0;

    sqlServer.sqlPromise({con:con,debug:debug,sql:`select * from customer where mobile='${req.body.mobile}'`,name:"select"}).then(function(res1){
        if(res1.length<1){
           return sqlServer.sqlPromise({con:con,debug:debug,sql:`insert into customer(storeid,mobile,name,remark) values(1,"${req.body.mobile}","${req.body.name}","${req.body.remark}")`,name:"insert"})
        }else{
            res.send({
                code:"-1",
                msg:"用户已存在"
            });
            con.end();
        }
    }).then(function(result){
        userId=result.insertId;
        return sqlServer.sqlPromise({con:con,debug:debug,sql:`insert into money(storeid,userid,money,status)
                    values(1,"${result.insertId}","${req.body.money}",1)`,name:"insertMoney"});
    }).then(function(result){
        if(result) {

            console.log(1);
            return sqlServer.sqlPromise({
                con: con, debug: debug, sql: `insert into balance(userid,money)
                    values("${userId}","${req.body.money}")`,name:"insertBalance"
            });
        }else{
            res.send({
                code: "-2",
                msg:"充值错误"
            });
        }
    }).then(function(result1){
        if(result1) {
            res.send({
                userid:userId,
                code: "1",
                msg: "用户添加成功"
            });
        }else{
            res.send({
                code: "-2",
                msg:"未知错误"
            });
        }
        con.end();
    });
});

//消费
router.get('/cost/:id', function(req, res, next) {
    try{
        var con=conn.conn();
        con.connect();
        req.body.money=parseFloat(req.body.money)||0.00;
        var id=req.params.id;
        sqlServer.sqlPromise({con:con,debug:debug,sql:`insert into money(storeid,userid,money,status)
                    values(1,"${id}","${req.body.money}",2)`,name:"insertMoney"}).then(function(result){
            res.send({
                code: "1",
                msg:"消费成功"
            });

        });
        con.end();
    }catch(e){
        console.log(e.stack);
    }
});

//充值
router.get('/recharge/:id', function(req, res, next) {
    try{
        var con=conn.conn();
        con.connect();
        req.query.money=parseFloat(req.query.money)||0.00;
        var id=req.params.id;
        sqlServer.sqlPromise({con:con,debug:debug,sql:`insert into money(storeid,userid,money,status)
                    values(1,"${id}","${req.query.money}",1)`,name:"insertMoney"}).then(function(res1){
           return sqlServer.sqlPromise({con:con,debug:debug,sql:`select * from balance where userid='${id}'`,name:"selectBalance"})
        }).then(function(result) {
            debug(result[0].money);
            var resultMoney=result[0].money+req.query.money
            return sqlServer.sqlPromise({con:con,debug:debug,sql:`update balance set money=${resultMoney} where userid='${id}'`,name:"updateBalance"})
        }).then(function(result) {
            con.end();
            res.send({
                code: "1",
                msg:"充值成功"
            });
        });
    }catch(e){
        console.log(e.stack);
    }
});



//消费
router.get('/consume/:id', function(req, res, next) {
    try{
        var con=conn.conn();
        con.connect();
        req.query.money=parseFloat(req.query.money)||0.00;
        var id=req.params.id;
        sqlServer.sqlPromise({con:con,debug:debug,sql:`insert into money(storeid,userid,money,status)
                    values(1,"${id}","${req.query.money}",2)`,name:"insertMoney"}).then(function(res1){
           return sqlServer.sqlPromise({con:con,debug:debug,sql:`select * from balance where userid='${id}'`,name:"selectBalance"})
        }).then(function(result) {
            debug(result[0].money);
            var resultMoney=result[0].money-req.query.money
            if(resultMoney<0){
                con.end();
                res.send({
                    code: "1",
                    msg:"余额不足"
                });
                return;
            }
            return sqlServer.sqlPromise({con:con,debug:debug,sql:`update balance set money=${resultMoney} where userid='${id}'`,name:"updateBalance"})
        }).then(function(result) {
            con.end();
            res.send({
                code: "1",
                msg:"消费成功"
            });
        });
    }catch(e){
        console.log(e.stack);
    }
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


router.get('/costList/:id', function(req, res, next) {
    var con=conn.conn();
    con.connect();
    var id=req.params.id;
    var sql=`select * from money  where money.userid = "${id}"`;
    var resultObj={};
    sqlServer.sqlPromise({con:con,debug:debug,sql:sql,name:"select"}).then(function(result){
        result.forEach(function(e,i){
            e.time=moment(e.time).format("YYYY-MM-DD HH:mm:ss");
            e.status=e.status==1?"充值":"消费";
            e.index=i;
        });
        resultObj={name: 'index',list:result};
        return sqlServer.sqlPromise({con:con,debug:debug,sql:`select * from customer where id = "${id}"`,name:"selectUser"});
    }).then(function(result){
        "use strict";
        if(result.length>0){
            resultObj.user={
                name:result[0].name,
                mobile:result[0].mobile,
                id:result[0].id
            };
            debug("result:",resultObj);
            res.render('costList', resultObj);
        }
    });
});

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

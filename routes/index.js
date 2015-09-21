var express = require('express');
var router = express.Router();
var conn=require("../server/config");
var debug = require('debug')('vipadmin:index');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/index', function(req, res, next) {
   try{
       var con=conn.conn();
       con.connect();
        var sql="select * from customer where storeid='4' limit 10";
       con.query(sql,function(err1,res1){
            debug("error:"+err1+";result:"+res1);
            push(res1);
        });
       function push(res1){

           res.render('index', { name: 'index',
               list:res1
           });
       }
       con.end();

    }catch(e){
        console.log(e.stack);
    }

});


router.get('/costHistory', function(req, res, next) {
    res.render('costHistory', { name: 'costHistory' });
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

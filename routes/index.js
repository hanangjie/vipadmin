var express = require('express');
var router = express.Router();
var conn=require("../server/config");
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
            console.log("error:"+err1+";result:"+res1);
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
        var time=new Date();
        var mobile=parseInt(req.body.mobile);

        if(mobile!=req.body.mobile||mobile.toString().length>15){
            res.send({
                code:-2,
                msg:"手机格式不对"
            });
            return;
        }
        var sql="insert into store(storename,mobile,pwd,time,status) values('"+req.body.name+"','"+mobile+"','"+req.body.pwd+"','"+time.getTime()+"','1')";
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



module.exports = router;

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'han',
    password: '64540614',
    database: 'vipadmin',
    port: 3306
});
function creatconn(){
    conn=conn = mysql.createConnection(conn.config);
    return conn;
}
exports.conn=creatconn;


//var insertSQL = 'insert into t_user(name) values("conan"),("fens.me")';
//var selectSQL = 'select * from t_user limit 10';
//var deleteSQL = 'delete from t_user';
//var updateSQL = 'update t_user set name="conan update"  where name="conan"';

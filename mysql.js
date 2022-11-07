const mysql=require('mysql')
const router=require('./router')
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123',
    database:'ct-test',
    port:'3306'
})

function sqlFun(sql,arr,callback){
    con.query(sql,arr,function(error,result){
        if(error){
            console.log('错误');
            return;
        }
        callback(result)
    })
}
module.exports=sqlFun
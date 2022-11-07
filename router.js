const express=require('express');
// const { config } = require('vue/types/umd');

const router=express.Router()
const sqlFun=require('./mysql')
//图片上传模块
const multer=require('multer')
const fs=require('fs')
//导入模块jsonwebtoken 密钥
// const jwt=require('jsonwebtoken')
// const config=require('./secert')
const jwt=require('jsonwebtoken');
const config=require('./secert')
router.use(express.urlencoded({extended:true}))

//上传图片
var jlm=[];
fs.readdir('./upload',(err,data)=>{
    for(var i=0;i<data.length;i++){
        jlm[i]=data[i].slice(14)
    }
})
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./upload/")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})
var createFolder=function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
}
var uploadFolder='./upload';
createFolder(uploadFolder);
var upload=multer({
    storage:storage
});
router.post('/upload',upload.single('file'),function(req,res,next){
    var file=req.file;
    console.log('文件',file.originalname);
    console.log(jlm);
    
    res.json({
        status:200,
        res_code:'0',
        name:file.originalname,
        url:file.path
    })
})
//登录
router.post('/login',(req,res)=>{
    let {username,pass}=req.body ;
    let arr=[username,pass];
    let sql="select * from login where username=? and pass=?";
    sqlFun(sql,arr,result=>{
        if(result.length>0){
            let token=jwt.sign({
                username:result[0].username,
                id:result[0].id
            },config.jwtSecert,{
                expiresIn:20*1
            })
            res.send({
                status:200,
                data:token
            })
        }else{
            res.send({
                status:404,
                msg:'信息错误'
            })

        }
    })
})
//查看所以id
router.get('/lll',(req,res)=>{
    const sql='SELECT id FROM `project`';
    sqlFun(sql,null,result=>{
        const kg=[];
        for(let i=0;i<result.length;i++){
            kg[i]=result[i].id
        }
        res.send(kg)
    })
})
////获取echarts图表数据
router.get('/ech',(req,res)=>{
    const sql='SELECT * FROM `tubiao` ';
    sqlFun(sql,null,result=>{
        res.send({
            data:result
        })
    })
})
//商品表格
router.get('/pro',(req,res)=>{
    const sqlLen='select id from project';
    const pages=req.query.pages || 1;
    sqlFun(sqlLen,null,re=>{
        const len='select * from project limit 6 offset '+(pages-1)*6;
        const total=re.length;
        sqlFun(len,null,result=>{
            res.send({
                pagesize:6,
                total:total,
                data:result,
                info:'成功',
                pi:re
        })
        })
    })
})

router.get('/add',(req,res)=>{
    const id=req.query.id || "";
    const name=req.query.name || "";
    const jig=req.query.jig || "";
    const lp="INSERT INTO `project`(`id`, `name`, `jig`) VALUES ('"+id+"','"+name+"','"+jig+"')";
    if(id!=0){
    sqlFun(lp,null,result=>{
        const sql="select id from project";
        sqlFun(sql,null,rty=>{
            
            res.send({
                status:200,
                data:rty,
                info:'插入数据成功'
            })
        })

    })
}
})
//修改
router.get('/update',(req,res)=>{
    const id=req.query.id || "";
    const name=req.query.name || "";
    const jig=req.query.jig || "";
    const cid=req.query.cid || "";
    const sql="UPDATE `project` SET `id`="+id+",`name`='"+name+"',`jig`="+jig+" WHERE `id`="+cid+""
    // const sql="UPDATE `project` SET `id`=69,`name`='傻逼',`jig`=99 WHERE id=1"
    sqlFun(sql,null,result=>{
        res.send({
            info:'OK'
        })
    })
})
//D登录
// router.get('login',(req,res)=>{
//     const username=req.query.username || "";
//     const pass=req.query.pass || "";
//     const sql="select * from login where username='"+username+"' and pass='"+pass+"'";
//     sqlFun(sql,null,result=>{
//         if(result.length){
//             res.send({
//                 token:true
//             })
//         }
//     })
// })

//删除
router.get('/delete',(req,res)=>{
    const id=req.query.id || "";
    const name=req.query.name || "";
    const jig=req.query.jig || "";
    const sql="DELETE FROM `project` WHERE id="+id+" and jig="+jig+" and name='"+name+"'";
    // const sql="DELETE FROM `project` where id='3'";
    // const sql="DELETE FROM `project` WHERE id="+id+"";
    sqlFun(sql,null,result=>{
        res.send({
            info:'ok'
        })
    })
})

router.get('/search',(req,res)=>{
    var search=req.query.search;
    const sql="select * from project where concat(id,name,jig) like '%"+search+"%'";
    sqlFun(sql,null,result=>{
        const len=result.length;
        if(result.length>0){
            res.send({
                status:200,
                data:result,
                total:len
            })
        }else{
            res.send({
                status:500,
                msg:'暂无数据'
            })
        }
    })
})

module.exports=router
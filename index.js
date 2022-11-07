const express=require('express')
const app=express()
app.use(express.urlencoded({extended:true}))
//静态文件托管
app.use(express.static('upload'))
const router=require('./router')

app.use(router)


app.listen(8888,()=>{
    console.log('8888');
})
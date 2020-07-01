const express = require("express")
var http=require("http")
const app = express()
var server=http.createServer(app)
var io=require("socket.io").listen(server)
const bodyparser = require("body-parser")
const urlencodedparser = bodyparser.urlencoded({ extended: false })
const mongocontrol = require("./mongo.js").mongocotrol
const users = new mongocontrol("berbizhipin", "users")
const chats = new mongocontrol("berbizhipin", "chats")
const md5 = require("blueimp-md5")
const cookieparser = require("cookie-parser")

app.use("/socket.io.js",express.static("./node_modules/socket.io-client/dist/socket.io.js"))

let whiteList = ['http://localhost:3000']
app.use('*', function (req, res, next) {
    let origin = req.headers.origin
    if (whiteList.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin)
        res.setHeader("Content-Type", "application/json;charset=utf-8")
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Access-Token")
        res.setHeader("Access-Control-Allow-Methods", "POST,GET")
        res.setHeader("Access-Control-Allow-Credentials", true)
    }else{
        res.send("出现跨域问题")
    }
    next()
});

app.use(cookieparser())

function filter(obj, keynamearr) {
    var newobj = {}
    for (var i in obj) {
        if (keynamearr.includes(i)) {
            continue
        }
        newobj[i] = obj[i]
    }
    return newobj
}
//注册接口
app.post("/register", urlencodedparser, function (req, res) {
    const { username, password, type } = req.body
    console.log(username, password, type)
    users.find({ username }, function (err, result) {
        if (result.length !== 0) {
            res.send({ code: 1, msg: "此用户已存在" })
        } else {
            users.insert({ username, password: md5(password), type }, function (err, result) {
                const data = { _id: result.ops[0]._id, username: result.ops[0].username, type: result.ops[0].type }
                res.cookie("userid", result.ops[0]._id, { maxAge: 1000 * 60 * 60 * 24 })//用cookie进行身份认证和持久化登录
                res.send({ code: 0, data })
            })
        }
    })
})
//登录接口
app.post("/login", urlencodedparser, function (req, res) {
    const { username, password } = req.body
    users.find({ username, password: md5(password) }, function (err, result) {
        if (result.length !== 0) {//登录成功
            res.cookie("userid", result[0]._id, { maxAge: 1000 * 60 * 60 * 24 })
            const data = filter(result[0], ["password"])
            res.send({ code: 0, data })
        } else {//登录失败
            res.send({ code: 1, msg: "用户名或密码不正确" })
        }
    })
})

//完善信息更新数据
app.post("/update", urlencodedparser, function (req, res) {
    //从请求的cookie得到userid
    const userid = req.cookies.userid//user对象
    if (!userid) {//没有cookie
        return res.send({ code: 1, msg: "请先登录" })
    }
    const user = req.body
    users.updatebyid(userid, user, function (err, result) {
        console.log(result.result.ok)
        if (result.result.ok !== 1) {
            //cookie不对 删除cookie
            res.clearCookie("userid")
            //返回一个提示信息
            res.send({ code: 1, msg: "请先登录" })
        } else {
            users.findbyid(userid,function(err,result){
                const data = filter(result[0], ["password"])
                res.send({code:0,data})
            })
        }
    })
})

//根据用户信息的路由（根据cookie中的userid）
app.get("/user",function(req,res){
    //从请求的cookie得到userid
    const userid=req.cookies.userid
    //如果不存在，直接返回一个提示信息
    if(!userid){
        return res.send({code:1,msg:"请先登录"})
    }
    //根据userid查询对应的user
    users.findbyid(userid,function(err,result){
        if(result.length==0){
            return res.send({code:1,msg:"请先登录"})
        }else{
            const data = filter(result[0], ["password"])
            res.send({code:0,data})
        }
    })
})
//获取用户列表（根据类型）
app.get("/userlist",function(req,res){
    const {type}=req.query
    users.find({type},function(error,result){
        var data= result.map(item=>{
            return item=filter(item,["password"])
        })
        res.send({code:0,data})
    })
})
//获取消息列表
app.get("/msglist",function(req,res){
    //获取cookie中的userid
    const userid=req.cookies.userid
    //查询得到所有user文档数组
    users.find({},function(error,result){
        //用对象存储所有user信息：key为user的_id,val为username和header组成的user对象
        const usersobj=result.reduce((users,user)=>{
            users[user._id]={username:user.username,header:user.header}
            return users
        },{})
        //查询userid相关的所有聊天信息
        chats.find({"$or":[{from:userid},{to:userid}]},function(error,result){
            var result= result.map(item=>{
                return item=filter(item,["password"])
            })
            res.send({code:0,data:{users:usersobj,chatMsgs:result}})
        })

    })
})

//修改指定消息为已读
app.post("/readmsg",urlencodedparser,function(req,res){
    //得到请求中的from和to
    const {from} =req.body
    const to =req.cookies.userid
    //更新数据库chats的数据
    chats.update({from,to,read:false},{read:true},function(error,result){
        res.send({code:0,data:result.result.n})//更新的数量
    })
})

//监视客户端与服务器的连接
io.on("connection",function(socket){
    //绑定监听，接收客户端发送的消息
    socket.on("sendMsg",function({from,to,content}){
        //处理数据
        const chat_id=[from,to].sort().join("_")
        const create_time=Date.now()
        chats.insert({from,to,content,chat_id,create_time,read:false},function(error,result){
            //想所有连接上的客户端发消息
            io.emit("receiveMsg",result.ops[0])
        })
    })
})
server.listen(4000)
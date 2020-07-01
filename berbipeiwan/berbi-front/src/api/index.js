// 包含多个接口请求函数的模块，函数返回值为：promise
import ajax from "./ajax"

//注册接口
export const reqRegister=(user)=>ajax("http://localhost:4000/register",user,"POST")
//登录接口
export const reqLogin=(username,password)=>ajax("http://localhost:4000/login",{username,password},"POST")
//更新接口
export const reqUpdateUser=(user)=>ajax("http://localhost:4000/update",user,"POST")
//获取用户信息
export const reqUser=()=>ajax("http://localhost:4000/user")

//获取用户列表
export const reqUserList=(type)=>ajax("http://localhost:4000/userlist",{type})

//获取当前用户的聊天消息列表
export const reqChatMsgList=()=>ajax("http://localhost:4000/msglist")

//修改指定消息为已读
export const reqReadMsg=(from)=>ajax("http://localhost:4000/readmsg",{from},"POST")
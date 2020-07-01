// 包含多个action 包含异步action和同步action
import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg
} from "../api"
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
} from "./action-type"
import io from "socket.io-client"
//授权成功的同步action
export const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
//授权失败的同步action
export const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg })
//接收用户的同步action
export const receiverUser=(user)=>({ type: RECEIVE_USER, data: user })
//重置用户路由去登录的同步action
export const resetUser=(msg)=>({ type: RESET_USER, data: msg })
//获取用户列表的同步action
export const receiverUserList=(userList)=>({type:RECEIVE_USER_LIST,data:userList})
//接收消息列表的同步action
export const receiveMsgList=({users,chatMsgs,userid})=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
//接收一个消息的同步action
export const receiveeMsg=(chatMsg,userid)=>({type:RECEIVE_MSG,data:{chatMsg,userid}})
//读取了某个聊天消息的同步action
export const msgRead=({count,from,to})=>({type:MSG_READ,data:{count,from,to}})

//注册异步action
export const register = (user) => {
    const { username, password, password2, type } = user

    if (!username) {
        return errorMsg("用户名必须指定")
    } else if (password !== password2) {
        return errorMsg("两次密码必须一致")
    }
    return (dispatch) => {
        const promise = reqRegister({ username, password, type })
        promise.then(
            response => {
                const result = response.data
                if (result.code == 0) {//成功
                    getMsgList(dispatch,result.data._id)
                    dispatch(authSuccess(result.data))
                } else {//失败
                    dispatch(errorMsg(result.msg))
                }
            }

        )
    }
}

//登录异步action
export const login = (user) => {
    const { username, password } = user
    if (!username) {
        return errorMsg("用户名必须指定!")
    } else if (!password) {
        return errorMsg("密码必须指定！")
    }
    return  dispatch => {
        const promise = reqLogin(username, password)
        promise.then(
            response => {
                const result = response.data
                if (result.code == 0) {//成功
                    getMsgList(dispatch,result.data._id)
                    dispatch(authSuccess(result.data))
                } else {//失败
                    dispatch(errorMsg(result.msg))
                }
            }
        )
    }
}

//更新用户异步action
export const updateUser=(user)=>{
    return dispatch=>{
        const promise=reqUpdateUser(user)
        promise.then(
            response=>{
                const result=response.data
                if(result.code==0){//更新成功 data
                    dispatch(receiverUser(result.data))
                }else{//更新失败 msg
                    dispatch(resetUser(result.msg))
                }
            }
        )
    }
}

//获取用户异步action
export const getUser=()=>{
    return dispatch=>{
        const promise=reqUser()
        promise.then(
            response=>{
                const result=response.data
                if(result.code==0){//获取成功
                    getMsgList(dispatch,result.data._id)
                    dispatch(receiverUser(result.data))
                }else{//获取失败
                    dispatch(resetUser(result.msg))
                }
            }
        )
    }
}
//获取用户列表的异步action
export const getUserList =(type)=>{
    return dispatch=>{
        const promise=reqUserList(type)
        promise.then(response=>{
            const result=response.data
            if(result.code==0){
                dispatch(receiverUserList(result.data))
            }
        })
    }
}

//异步获取消息列表数据
function getMsgList(dispatch,userid){
    initIO(dispatch,userid)
    const promise =reqChatMsgList()
    promise.then(response=>{
        const result=response.data
        if(result.code===0){
            const {users,chatMsgs}=result.data
            //分发同步action
            dispatch(receiveMsgList({users,chatMsgs,userid}))
        }
    })
}   

//单例对象
//1.创建对象之前：判断对象是否已经存在，只有不存在才去创建
//2.创建对象之后：保存对象

function initIO(dispatch,userid){
    if(!io.socket){
        //连接服务器，得到与服务器的连接对象
        io.socket=io("ws://localhost:4000")
        //绑定监听,接收服务器发送的消息
        io.socket.on("receiveMsg",function(data){
            //只有当chatMsg是与当前用户相关的消息，才去分发同步action保存消息
            if(userid==data.from||userid==data.to){
                dispatch(receiveeMsg(data,userid))
            }
        })
    }
}
//发送消息的异步action 
export const sendMsg=({from,to,content})=>{
    return dispatch=>{
        //发消息
        io.socket.emit("sendMsg",{from,to,content})
    }
}

//读取消息的异步action
export const readMsg=(from,to)=>{
    return dispatch=>{
        const promiser=reqReadMsg(from)
        promiser.then(
            response=>{
                const result=response.data
                if(result.code==0){
                    const count=result.data
                    dispatch(msgRead({count,from,to}))
                }
            }
        )
    }
}
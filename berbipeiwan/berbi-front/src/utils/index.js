//包含多个工具函数的模块

//用户主界面路由
// peiwan：/peiwan
// laoban：/laoban
// 用户信息完善界面路由
// peiwan/peiwaninfo
// laoban/laobaninfo
// 判断是否已经完善信息？user.header是否有值
// 判断用户类型：user.type

export function getRedirectTo(type,header){
    let path
    //类型
    if(type=="laoban"){
        path="/laoban"
    }else{
        path="/peiwan"
    }
    //header
    if(!header){//没有值,返回信息完善界面的path
        path+="info"
    }
    return path
}
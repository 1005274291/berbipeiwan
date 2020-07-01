// 主界面路由组件
import React,{Component} from "react"
import {Switch,Route, Redirect} from "react-router-dom"
import {connect} from "react-redux"
import Cookies from "js-cookie"  //可以操作前端cookie的对象 set()/get()/remove()
import {NavBar} from "antd-mobile"

import LaobanInfo from "../laoban-info/laoban-info"
import PeiwanInfo from "../peiwan-info/peiwan-info"
import Laoban from "../laoban/laoban"
import Peiwan from "../peiwan/peiwan"
import Message from "../message/message"
import Personal from "../personal/personal"
import NotFound from "../../components/not-found/not-found"
import {getRedirectTo} from "../../utils"
import {getUser} from "../../redux/actions"
import NavFooter from "../../components/nav-footer/nav-footer"
import Chat from "../chat/chat"
class Main extends Component{
    //给组件对象添加属性
    navList=[//包含所有导航组件的相关信息数据
        {
            path:"/laoban",//路由组件
            component:Laoban,
            title:"陪玩列表",
            icon:"peiwan",
            text:"陪玩"
        },
        {
            path:"/peiwan",//路由组件
            component:Peiwan,
            title:"老板列表",
            icon:"laoban",
            text:"老板"
        },
        {
            path:"/message",//路由组件
            component:Message,
            title:"消息列表",
            icon:"message",
            text:"消息"
        },
        {
            path:"/personal",//路由组件
            component:Personal,
            title:"用户中心",
            icon:"personal",
            text:"个人"
        },
    ]

    componentDidMount(){
        //实现自动登录发起请求
        const userid=Cookies.get("userid")
        const {_id}=this.props.user
        if(userid&&!_id){
            //发送异步请求，获取user
            this.props.getUser()
        }
    }

    render(){
        //读取cookie中的userid
        const userid=Cookies.get("userid")
        //如果没有，自动重定向到登录界面
        if(!userid){
            return <Redirect to="/login" />
        }
        //如果有，读取redux中的user状态
        const {user,unReadCount}=this.props
        //如果有user没有_id,返回null(不做任何显示等到componentDidMount中去处理,曾经登录过关掉窗口，现在没有登录等待自动登录)
        if(!user._id){
            return null
        }else{
            //如果有_id,显示对应的界面
            let path=this.props.location.pathname
            if(path=="/"){
                //根据user的type和header来计算出一个重定向的路由路径，并自动重定向
                path=getRedirectTo(user.type,user.header)
                return <Redirect to={path}/>
            }
        }
        const {navList}=this
        const path=this.props.location.pathname//请求的路径
        const currentNav=navList.find(nav=>nav.path===path)//的到当前的nav可能没有
        if(currentNav){
            //决定哪个路由需要隐藏
            if(user.type=="laoban"){
                navList[1].hide=true
            }else{
                navList[0].hide=true
            }
        }

        return(
            <div>
                {currentNav ?<NavBar className="fixed-header">{currentNav.title}</NavBar>:null }
                <Switch>
                    {
                        navList.map(nav=>(<Route path={nav.path} component={nav.component}></Route>))
                    }
                    <Route path="/laobaninfo" component={LaobanInfo}></Route>
                    <Route path="/peiwaninfo" component={PeiwanInfo}></Route>
                    <Route path="/chat/:userid" component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {currentNav ?<NavFooter navList={navList} unReadCount={unReadCount}></NavFooter>:null }
            </div>
        )
    }
}

var mapstate=(state)=>{
    return{
        user:state.user,
        unReadCount:state.chat.unReadCount
    }
}

export default connect(mapstate,{getUser})(Main)


// 1.实现自动登录；
// 1）.如果cookie中有userid,发请求获取对应的user,暂时不做任何显示
//2）.如果cookie中没有userid,自动进入login界面
//2.如果已经登录，请求根路径：
//根据user的type和header来计算出一个重定向的路由路径，并自动重定向

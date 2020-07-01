//陪玩主界面路由容器组件

import React,{Component} from "react"
import {connect} from "react-redux"

import {getUserList} from "../../redux/actions"
import UserList from "../../components/user-list/user-list"
class Peiwan extends Component{
    componentDidMount(){
        //获取userList
        this.props.getUserList("laoban")
    }
    render(){
        return(
            <UserList userList={this.props.userList}></UserList>
        )
    }
}

var mapstate=(state)=>{
    return{
        userList:state.userList
    }
}

export default connect(mapstate,{getUserList})(Peiwan)
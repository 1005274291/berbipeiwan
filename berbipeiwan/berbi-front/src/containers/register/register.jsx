// 注册路由组件
import React, { Component } from "react"
import {
    NavBar, //导航按钮
    WingBlank,//两边留白的布局
    List,//列表
    InputItem,//带标识的输入框
    WhiteSpace,//分割线
    Radio,//单选框
    Button//按钮
} from "antd-mobile"
import {connect} from "react-redux"
import {Redirect} from "react-router-dom"

import {register} from "../../redux/actions"
import Logo from "../../components/logo/logo"


const ListItem = List.Item //列表中的一项
class Register extends Component {
    state = {
        username: "",//用户名
        password: "",//密码
        password2: "",//确认密码
        type: "laoban",//用户类型名称
    }
    register=()=>{
        // console.log(this.state)
        this.props.register(this.state)
    }
    //处理输入数据的改变，更新对应的状态
    handleChange=(name,val)=>{
        this.setState({
            [name]:val
        })
    }
    goLogin=()=>{
        this.props.history.replace("/login")
    }
    render() {
        const {type}=this.state
        const {msg,redirectTo}=this.props.user
        //如果redirectTo有值需要重定向
        if(redirectTo){
            return <Redirect to={redirectTo} />
        }
        return (
            <div>
                <NavBar>波&nbsp;比&nbsp;陪&nbsp;玩</NavBar>
                <Logo></Logo>
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> :null}
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入用户名" onChange={val=>{this.handleChange("username",val)}}>用户名&nbsp;:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入密码" type="password" onChange={val=>{this.handleChange("password",val)}}>密&nbsp;&nbsp;&nbsp;码&nbsp;:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请再次确认密码" type="password" onChange={val=>{this.handleChange("password2",val)}}>确认密码&nbsp;:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <ListItem>
                            <span>用户类型&nbsp;：</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type==="peiwan"} onChange={()=>{this.handleChange("type","peiwan")}}>陪玩</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type==="laoban"} onChange={()=>{this.handleChange("type","laoban")}}>老板</Radio>
                        </ListItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
                        {/* <WhiteSpace></WhiteSpace> */}
                        <Button type="ghost" onClick={this.goLogin}>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
var mapstate=(state)=>{
    return {
        user:state.user
    }
}
export default connect(mapstate,{register})(Register)
//包装成容器组件，进行redux交互
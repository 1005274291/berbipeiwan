// 登录路由组件
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
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"

import { login } from "../../redux/actions"
import Logo from "../../components/logo/logo"
class Login extends Component {
    state = {
        username: "",//用户名
        password: "",//密码
    }
    login = () => {
        this.props.login(this.state)
    }
    //处理输入数据的改变，更新对应的状态
    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }
    goRegister = () => {
        this.props.history.replace("/register")
    }
    render() {
        const { msg, redirectTo } = this.props.user
        //如果redirectTo有值需要重定向
        if (redirectTo) {
            return <Redirect to={redirectTo} />
        }
        return (
            <div>
                <NavBar>波&nbsp;比&nbsp;陪&nbsp;玩</NavBar>
                <Logo></Logo>
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入用户名" onChange={val => { this.handleChange("username", val) }}>用户名&nbsp;:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入密码" type="password" onChange={val => { this.handleChange("password", val) }} type="password">密&nbsp;&nbsp;&nbsp;码&nbsp;:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
                        {/* <WhiteSpace></WhiteSpace> */}
                        <Button type="ghost" onClick={this.goRegister}>没有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
var mapstate = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapstate, { login })(Login)
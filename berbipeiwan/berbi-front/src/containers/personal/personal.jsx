//个人中心主界面路由容器组件

import React, { Component } from "react"
import { connect } from "react-redux"
import { Result, List, WhiteSpace, Button ,Modal} from "antd-mobile"
import Cookies from "js-cookie"

import {resetUser} from "../../redux/actions"

const Item = List.Item
const Brief = Item.Brief//简要

class Personal extends Component {
    logout=()=>{
        Modal.alert("退出","确定退出登录吗？",[
            {
                text:"取消"
            },
            {
                text:"确定",
                onPress:()=>{
                    //清除cookie中的userid
                    Cookies.remove("userid")
                    //干掉redux管理的user
                    this.props.resetUser()
                }
            }
        ])
    }
    render() {
        const { username, header, section, grading, sex, hobby, salary, info } = this.props.user
        return (
            <div style={{marginBottom:50,marginTop:50}}>
                <Result
                    img={<img src={require(`../../assets/images/${header}.png`).default} style={{ width: 50 }} alt="header" />}
                    title={username}
                    message={section}
                ></Result>
                <List renderHeader={() => "相关信息"}>
                    {/* 列表的项是多行的 */}
                    <Item multipleLine>
                        {grading ? <Brief>段位：{grading}</Brief> : null}
                        {sex ? <Brief>性别：{sex}</Brief> : null}
                        {hobby ? <Brief>兴趣爱好：{hobby}</Brief> : null}
                        {salary ? <Brief>时薪：{salary}</Brief> : null}
                        {info ? <Brief>个人简介：{info}</Brief> : null}
                    </Item>
                </List>
                <WhiteSpace></WhiteSpace>
                <List>
                    <Button type="warning" onClick={this.logout}>退出登录</Button>
                </List>
            </div>
        )
    }
}

var mapstate = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapstate, {resetUser})(Personal)
// 老板信息完善的路由容器组件
import React, { Component } from "react"
import { connect } from "react-redux"
import {NavBar,InputItem,TextareaItem,Button} from "antd-mobile"
import {Redirect} from "react-router-dom"

import HeaderSelector from "../../components/header-selector/header-selector"
import {updateUser} from "../../redux/actions"

class PeiwanInfo extends Component{
    state={
        header:"",//头像
        section:"",//板块
        grading:"",//段位
        salary:"",//时薪
        info:""//个人简介

    }
    //更新header状态
    setHeader=(header)=>{
        this.setState({
            header
        })
    }

    handleChange=(name,value)=>{
        this.setState({
            [name]:value
        })
    }
    save=()=>{
        this.props.updateUser(this.state)
    }
    render(){
        const {header,type}=this.props.user
        if(header){//说明信息已经完善
            const path= (type==="peiwan") ? "/peiwan":"laoban"
            return <Redirect to={path}/>
        } 
        return(
            <div>
                <NavBar>陪玩信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}></HeaderSelector>
                <InputItem placeholder="请输入板块" onChange={val=>{this.handleChange("section",val)}}>板块:</InputItem>
                <InputItem placeholder="请输入段位" onChange={val=>{this.handleChange("grading",val)}}>段位:</InputItem>
                <InputItem placeholder="请输入时薪" onChange={val=>{this.handleChange("salary",val)}}>时薪:</InputItem>
                <TextareaItem title="展示自己：" rows={3} onChange={val=>{this.handleChange("info",val)}}></TextareaItem>
                <Button type="primary" onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}
var mapstate = (state) => {
    return {
        user:state.user
    }
}
export default connect(mapstate, {updateUser})(PeiwanInfo)
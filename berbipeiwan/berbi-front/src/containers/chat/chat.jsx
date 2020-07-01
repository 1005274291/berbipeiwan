import React, { Component } from "react"
import { connect } from "react-redux"
import { NavBar, List, InputItem, Grid, Icon } from "antd-mobile"
import { sendMsg, readMsg } from "../../redux/actions"
const Item = List.Item
//对话聊天的路由组件
class Chat extends Component {
    state = {
        content: "",
        isShow: false //是否显示表情列表

    }

    //在第一次render()之前执行
    componentWillMount() {
        //初始化表情数据
        const emojis = ["🙈", "🙉", "🙊", "💥", "💫", "💦", "💨", "🐵",
            "🐒", "🦍", "🦧", "🐶", "🐕", "🦮", "🐕‍🦺", "🐩",
            "🐺", "🦊", "🦝", "🐱", "🐈", "🦁", "🐯", "🦄",
            "🐅", "🐆", "🐴", "🐎"]
        this.emojis = emojis.map(item => ({ text: item }))
    }
    componentDidMount() {
        //初始显示列表底部
        window.scrollTo(0, document.body.scrollHeight)

    }
    componentDidUpdate() {
        //更新显示列表底部
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentWillUnmount() {
        //发请求更新消息的未读状态
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
    }
    toggleShow = () => {
        console.log("触发")
        const isShow = !this.state.isShow
        this.setState({ isShow })
        if (isShow) {
            //异步手动派发resize时间，解决表情列表bug
            setTimeout(() => {
                window.dispatchEvent(new Event("resize"))
            }, 0)
        }
    }
    handleSend = () => {
        //收集数据
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        //发送请求(发消息)
        if (content) {
            this.props.sendMsg({ from, to, content })
        }
        //清除输入数据
        this.setState({ content: "", isShow: false })
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        //计算当前聊天的chatId
        const meId = user._id
        if (!users[meId]) {//如果还没有获取数据，直接不做处理
            return null
        }
        const targetId = this.props.match.params.userid
        const chatId = [meId, targetId].sort().join("_")
        //对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id == chatId)

        //得到目标用户的header图片对象
        let targetHeader
        if (users[targetId].hasOwnProperty("header")) {
            targetHeader = users[targetId].header
        }
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`).default : null
        return (
            <div id="chat-page">
                <NavBar
                    className="fixed-header"
                    icon={<Icon type="left"></Icon>}
                    onLeftClick={() => this.props.history.goBack()}
                >{users[targetId].username}</NavBar>
                <List style={{ marginBottom: 50, marginTop: 50 }}>

                    {
                        msgs.map(msg => {
                            // console.log("目标id",targetId,msg.from)
                            if (targetId == msg.from) {//对方发给我的
                                return (
                                    <Item key={msg._id} thumb={targetIcon}>{msg.content}</Item>
                                )
                            } else {
                                return (//我发给对方的
                                    <Item className="chat-me" extra="我" key={msg._id}>{msg.content}</Item>
                                )
                            }
                        })

                    }
                </List>
                <div className="am-tab-bar">
                    <InputItem placeholder="请输入" value={this.state.content} onChange={val => this.setState({ content: val })} extra={
                        <span>
                            <span onClick={this.toggleShow} style={{ marginRight: 5 }}>😀</span>
                            <span onClick={this.handleSend}>发送</span>
                        </span>}
                        onFocus={() => this.setState({ isShow: false })}
                    />
                    {
                        this.state.isShow ? (
                            <Grid
                                data={this.emojis}
                                columnNum={6}
                                carouselMaxRow={4}
                                isCarousel={true}
                                onClick={(item) => {
                                    this.setState({ content: this.state.content + item.text })
                                }}
                            ></Grid>
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user, chat: state.chat }),
    { sendMsg, readMsg }
)(Chat)
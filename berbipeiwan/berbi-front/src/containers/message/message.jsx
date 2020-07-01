//消息主界面路由容器组件

import React, { Component } from "react"
import { connect } from "react-redux"
import { List, Badge } from "antd-mobile"
import QueueAnim from "rc-queue-anim"

const Item = List.Item
const Brief = Item.Brief

function getLastMsgs(chatMsgs, userid) {
    //1.找出每个聊天的lastMsg,并用一个对象容器来保存{chat_id:lastMsg}
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        // console.log(msg)
        if (msg.to === userid && !msg.read) {
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }
        //得到msg的聊天标识id
        const chatId = msg.chat_id
        //获取已保存的当前组件的lastMsg
        const lastMsg = lastMsgObjs[chatId]
        if (!lastMsg) {//之前没有，当前msg就是所在组的lastMsg
            lastMsgObjs[chatId] = msg
        } else {//有
            //保存之前统计的未读数量
            const unReadCount = lastMsg.unReadCount
            //如果msg比lastMsg晚，就将msg保存为lastMsg
            if (msg.create_time > lastMsg.create_time) {
                lastMsgObjs[chatId] = msg
            }
            lastMsgObjs[chatId].unReadCount = unReadCount + msg.unReadCount
        }
    })
    //2.得到所有lastMsg的数组
    const lastMsgs = Object.values(lastMsgObjs)
    //2.对数组进行降序（create_time）
    lastMsgs.sort((a, b) => b.create_time - a.create_time)
    return lastMsgs
}

class Message extends Component {
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        //对chatMsgs按chat_id进行分组
        const lastMsgs = getLastMsgs(chatMsgs, user._id)
        return (
            <List style={{ marginTop: 50, marginBottom: 50 }}>
                <QueueAnim type="top" delay={100}>
                    {
                        lastMsgs.map(msg => {
                            const targetUserId = msg.to === user._id ? msg.from : msg.to
                            const targetUser = users[targetUserId]
                            return (
                                <Item
                                    key={msg._id}
                                    extra={<Badge text={msg.unReadCount}></Badge>}//未读消息
                                    thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`).default : null}
                                    arrow="horizontal"
                                    onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                                >
                                    {/* 内容和对方用户名 */}
                                    {msg.content}
                                    <Brief>{targetUser.username}</Brief>
                                </Item>
                            )
                        })
                    }
                </QueueAnim>
            </List>
        )
    }
}

var mapstate = (state) => {
    return {
        user: state.user,
        chat: state.chat
    }
}

export default connect(mapstate)(Message)
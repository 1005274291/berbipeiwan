import React, { Component } from "react"
import PropTypes from "prop-types"
import { WingBlank, WhiteSpace, Card } from "antd-mobile"
import QueueAnim from "rc-queue-anim"
import { withRouter } from "react-router-dom"
const Header = Card.Header
const Body = Card.Body

class UserList extends Component {
    static propTypes = {
        userList: PropTypes.array.isRequired
    }

    render() {
        let { userList } = this.props
        userList = userList.filter(item => item.header)
        // console.log(userList)
        return (
            <WingBlank style={{ marginBottom: 50, marginTop: 50 }}>
                <QueueAnim type="scale">
                    {
                        userList.map(user => (
                            <div key={user._id}>
                                <WhiteSpace></WhiteSpace>
                                <Card onClick={() => this.props.history.push(`/chat/${user._id}`)}>
                                    {user.header ? <Header thumb={require(`../../assets/images/${user.header}.png`).default} extra={user.username}></Header> : null}
                                    <Body>
                                        {user.section ? <div>板块：{user.section}</div> : null}
                                        {user.grading ? <div>段位：{user.grading}</div> : null}
                                        {user.sex ? <div>性别：{user.sex}</div> : null}
                                        {user.hobby ? <div>爱好：{user.hobby}</div> : null}
                                        {user.salary ? <div>时薪：{user.salary}</div> : null}
                                        {user.info ? <div>个人简介：{user.info}</div> : null}
                                    </Body>
                                </Card>
                            </div>
                        ))
                    }
                </QueueAnim>
            </WingBlank>
        )
    }
}
export default withRouter(UserList)
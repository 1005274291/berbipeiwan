import App from "./App"
import React from "react"
import ReactDom from "react-dom"
import { HashRouter as Router, Route, Switch } from "react-router-dom"
import { Provider } from "react-redux"

import store from "./redux/store"
import Register from "./containers/register/register"
import Login from "./containers/login/login"
import Main from "./containers/main/mian"
import "./assets/css/index.less"
if (module.hot) { //如果配置了热替换就接收热替换进来的东西
    module.hot.accept(err => {
        if (err) {
            console.log("热替换出BUG了")
        }
    })
}
ReactDom.render((
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/register" component={Register}></Route>
                <Route path="/login" component={Login}></Route>
                <Route component={Main}></Route>
            </Switch>
        </Router>
    </Provider>
), document.getElementById("root"))
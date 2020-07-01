//redux核心的管理对象模块
import {createStore,applyMiddleware} from "redux"
import thunk from "redux-thunk" //可以向reducer传递异步action
import {composeWithDevTools} from "redux-devtools-extension" //redux调试工具

import reducers from "./reducers"

//向外暴露store对象
export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))
//能发送ajax请求的函数模块，函数的返回值是promise方便后续调用

import axios from "axios"
import qs from "qs"
export default function ajax(url,data={},type="GET"){
    if(type=="GET"){
        let paramStr=""
        Object.keys(data).forEach(key=>{
            paramStr+=key+"="+data[key]+"&"
        })
        if(paramStr){
            paramStr=paramStr.slice(0,paramStr.length-1)
            paramStr="?"+paramStr
        }
        return axios.get(url+paramStr,{
            withCredentials:true
        })
    }else{
        console.log(url,data)
        var data=qs.stringify(data)
        return axios.post(url,data,{
            headers:{
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
            },
            withCredentials:true//axios在跨域请求时会携带cookie
        })
    }
}
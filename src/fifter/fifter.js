import base64 from "js-base64";
import axios from 'axios';
import layer from '@/fifter/layer.js';
import qs from 'qs';
import {myapp} from '@/main.js';

axios.defaults.headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}
axios.defaults.timeout = 10000
export default {
    get10Time: time => {
        var date = time ? new Date(time) : new Date();
        return Math.round(date.getTime() / 1000);
    },
    timeToStr: (time, fmt) => {
        return new Date(time * 1000).pattern(fmt || 'yyyy-MM-dd');
    },
    getQueryString: (name, url) =>{
        if (url === undefined) {
            url = $$.getUrl();
        }
        if (url.indexOf('?') == -1) {
            return undefined;
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var q = url.split("?");
        var r = q[1].match(reg);
        if (r != null) return unescape(r[2]);
    },
    getUserInfo:() => {
        var uInfoStr = sessionStorage.getItem('__UINFO__');
        if (!uInfoStr) {
            return false;
        }
        return analyzeToken(uInfoStr);
    },
    post:(url,data,succ,err) => {
        if(!data.WToken){
            data.WToken = this.a.getToken();
        }
        if (url.indexOf("http://") == -1) {
            url = this.a.config.serverAddr + url;
        }
        
        axios.post(url, qs.stringify(data))
        .then(function (res) {
            if(res.data.Status == -1){
                layer.alert('登录验证超时或账号重复登录，请重新登录账号', action => {
                    myapp.$router.push({ path: '/login' });
                });
            }else{
                if(succ){
                    succ(res.data);
                }
            }
        })
        .catch(function (error) {
            if(err){ 
                err(error);
            }
        });
    },
    setToken: token => {
        sessionStorage.setItem('__TOKEN__', token);
    },
    getToken: () => {
        var token = sessionStorage.getItem('__TOKEN__');
        if (token) {
            return token;
        } else {
            layer.alert('登录验证超时或账号重复登录，请重新登录账号', action => {
                myapp.$router.push({ path: '/login' });
            });
        }
    },
    getUserInfo: () => {
        var uInfoStr = sessionStorage.getItem('__UINFO__');
        if (!uInfoStr) {
            return false;
        }
        return analyzeToken(uInfoStr);
    },
}

function analyzeToken(token) {
    var uInfo = base64.decode(unescape(token)),
        uObj = JSON.parse(uInfo);
    return uObj;
}

Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
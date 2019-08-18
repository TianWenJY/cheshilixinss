import axios from 'axios'
import { Message } from 'element-ui'
import { param } from '@/utils/index'
import { isEmpty } from '@/utils/validate'
import store from '@/store/index'
  
const utils = require('axios/lib/utils')
const normalizeHeaderName = require('axios/lib/helpers/normalizeHeaderName')

// create an axios instance
const service = axios.create({
baseURL: "http://192.168.0.179/", // api的base_urln
    //    baseURL: "http://csl.ycpicc.com/", // api的base_url456

  timeout: 5000, // request timeout
  transformRequest: [
    function transformRequest(data, headers) {
      normalizeHeaderName(headers, "Content-Type");
      if (
        utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(
          headers,
          "application/x-www-form-urlencoded;charset=utf-8"
        );
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(
          headers,
          "application/x-www-form-urlencoded;charset=utf-8"
        );
        const result = param(data);
        return result;
      }
      return data;
    }
  ]
});

// request interceptor
service.interceptors.request.use(
    config => {
        if (config.method.toLowerCase() === 'get' && !isEmpty(config.data)) {
            config.url += '?' + param(config.data)
            delete config.data
        }
        return config
    },
    error => {
        alert(error)
        // Do something with request error
        console.error(error) // for debug
        Promise.reject(error)
    }
)

// respone interceptor
service.interceptors.response.use(
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */
    response => {
        // if (process.env.NODE_ENV !== 'production') {
        //     console.log(
        //         'response==>    status==>    ' +
        //         response.status +
        //         '    --url==>    ' +
        //         response.request.responseURL
        //     )
        //     console.log('responseData => ')
        //     console.log(response.data)
        //     console.log('\n')
        // }
        if (response.status !== 200) {
            Message({
                message: '请求错误，请刷新后重试！',
                type: 'error',
                duration: 0,
                showClose: true
            })
            return Promise.reject('error')
        } else {
            // 处理授权失败
            if (
                response.data &&
                response.data.status === 0 &&
                response.data.code === 'AUTH_ERROR'
            ) {
                Message({
                    message: '授权失败，请重新登录！',
                    type: 'error',
                    duration: 0,
                    showClose: true
                })
                router.push('/logout')
            }
            return response.data
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = "请求错误";
                    break;
                case 401:
                    error.message = "未授权，请登录";
                    break;
                case 403:
                    error.message = "拒绝访问";
                    break;
                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`;
                    break;
                case 408:
                    error.message = "请求超时";
                    break;
                case 500:
                    error.message = "服务器内部错误";
                    break;
                case 501:
                    error.message = "服务未实现";
                    break;
                case 502:
                    error.message = "网关错误";
                    break;
                case 503:
                    error.message = "服务不可用";
                    break;
                case 504:
                    error.message = "网关超时";
                    break;
                case 505:
                    error.message = "HTTP版本不受支持";
                    break;
                default:
            }
        }
        Message({
            message: error.message +'请重新刷新页面后重试',
            type: 'error',
            duration: 5 * 1000
        })
        console.error('err' + error) // for debug
        return Promise.reject(error)
    }
    
)


export default service

function setContentTypeIfUnset(headers, value) {
    if (
        !utils.isUndefined(headers) &&
        utils.isUndefined(headers['Content-Type'])
    ) {
        headers['Content-Type'] = value
    }
}


/**
 * Created by tianw on 2018/5/30.
 */
import { MessageBox } from "element-ui";
export default {
  install: function(Vue, VueResource) {
 Vue.prototype.url = "http://192.168.0.179/",
      //  (Vue.prototype.url = "http://csl.ycpicc.com/"),
      // (Vue.prototype.url = "http://192.168.0.105:8099/"),
      (Vue.prototype.getToken = function() {
        var token = sessionStorage.getItem("__TOKEN__");
        if (token) {
          return token;
        } else {
          // this.$alert("对不起，您没有登录", "去登陆系统", {
          //   confirmButtonText: "确定",
          //   showClose: false,
          //   callback: action => {
              // this.$router.push("/");
          //   }
          // });
        }
      })(
        (Vue.prototype.setToken = function(token) {
          sessionStorage.setItem("__TOKEN__", token);
        })
      ),
      (Vue.prototype.get = function(url, params, func) {
        // let token = this.getToken();
        if (typeof String.prototype.startsWith != "function") {
          String.prototype.startsWith = function(prefix) {
            return this.slice(0, prefix.length) === prefix;
          };
        }
        //  if(token) {
        // if (!url.startsWith(this.url)) {
        //   url = this.url + url;
        // }
        if (url.indexOf("http://") == -1) {
          url = this.url + url;
        } else {
          url = url;
        }
        //  if(!params.token) {
        //   params = Object.assign(params,{WToken:token})
        // }
        //  }
        this.$http.get(url, params, { emulateJSON: true }).then(func);
      }),
      (Vue.prototype.post = function(url, params, func) {
        // let token = this.getToken();
        if (typeof String.prototype.startsWith != "function") {
          String.prototype.startsWith = function(prefix) {
            return this.slice(0, prefix.length) === prefix;
          };
        }
        //  if(token) {
        // if (!url.startsWith(this.url)) {
        //   url = this.url + url;
        // }
        if (url.indexOf("http://") == -1) {
          url = this.url + url;
        } else {
          url = url;
        }
        //  if(!params.token) {
        //   params = Object.assign(params,{WToken:token})
        // }
        //  }
        this.$http.post(url, params, { emulateJSON: true }).then(func);
      }),
      (Vue.prototype.api = function(url, params, sunc, isJudge) {
        // let token = this.getToken();
        let token = this.getToken();
        if (typeof String.prototype.startsWith != "function") {
          String.prototype.startsWith = function(prefix) {
            return this.slice(0, prefix.length) === prefix;
          };
        }
        if (token) {
          if (url.indexOf("http://") == -1) {
            url = this.url + url;
          } else {
            url = url;
          }
        }
        this.$http
          .post(url, params, { emulateJSON: true })
          .then(res => {
            if (res.body.Status == 0) {
              if (sunc) {
                sunc(res.body);
              }
            } else if (res.body.Status == -1) {
              this.$alert("对不起，您没有登录", "去登陆系统", {
                confirmButtonText: "确定",
                showClose: false,
                callback: action => {
                  this.$router.push("/");
                }
              });
            } else {
              if (isJudge) {
                isJudge(res.body);
              } else {
                this.$message({
                  message: "操作失败, " + res.body.Data,
                  type: "error"
                });
              }
            }
          })
          .catch(function(response) {
            // this.$message({
            //   message: "请求失败 ， " + response.url,
            //   type: "error"
            // });
            // if(error) {
            // error()
            // }
          });
      }),
      // 获取用户信息
      (Vue.prototype.getUserInfo = function() {
        let uInfoStr = sessionStorage.getItem("__UINFO__");
        if (!uInfoStr) {
          return false;
        }
        return this.analyzeToken(uInfoStr);
      }),
      (Vue.prototype.analyzeToken = function(token) {
        var uInfo = Base64.decode(unescape(token)),
          uObj = JSON.parse(uInfo);
        return uObj;
      });
    Vue.prototype.Delete = function(url, param, func) {
      //删除
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.api(url, param, res => {
          this.$message({ message: "删除成功", type: "success" });
          this.pageRequest.N = 1;
          func();
        });
      });
    };
  }
};

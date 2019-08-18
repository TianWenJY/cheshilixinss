<template>
  <div class="outwrapper">
    <!--外层盒子开始-->
    <!--头部开始-->
    <header>
      <div class="banxin"></div>
      <section>
        <div class="caption">
          <h1></h1>
          <p></p>
          <p></p>
          <p></p>
        </div>
        <form>
          <h2>登录</h2>
          <div class="input center-block">
            <label>账号</label>
            <input
              style="border:0;width:249px;height:36px;"
              type="text"
              name="uname"
              placeholder="请输入用户名"
            >
          </div>
          <div class="input center-block">
            <label>密码</label>
            <input
              style="border:0;width:249px;height:36px;"
              type="password"
              name="pwd"
              placeholder="请输入密码"
            >
          </div>
          <!-- <a class="input center-block userLogin" >登录</a> -->
          <el-button class="input center-block userLogin myStyle" :loading="onLoading">登录</el-button>
        </form>
      </section>
    </header>
    <!--头部结束-->
    <!--页脚开始-->
    <footer>
      <div class="banxin center-block"></div>
      <p class="center-block">
        <span>Copyright © 2017-2018 Cheshili. All Rights Reserved. 山东保利物业有限公司 提供技术支持</span>
        <span class="lan">中国站 - 简体中文</span>
      </p>
    </footer>
    <!--页脚结束-->
  </div>
  <!--外层盒子结束-->
</template>

<script>
import $ from "jquery";
import $$ from "@/fifter/fifter.js";
import layer from "@/fifter/layer.js";
import comm from "@/utils/utils.js";
import Cookies from "js-cookie";
import { Login, LoginMenu } from "@/api/login";
import KtButton from "@/components/KtButton";

export default {
  name: "BLLogin",
  data() {
    return {
      onLoading: false
    };
  },
  created() {},
  methods: {},
  mounted() {
    var _this = this;
       document.title="堡煜物业"
    var superAdmin = "creator",
      getForget = $(".getForget"),
      countdown = 60;
    function pintai(info) {
      let data = {
        mer_id: info.mer_id
      };
      LoginMenu(data).then(res => {
        if (res.Status == 0) {
          if (res.Data[1][0].length == 0) {
            if (res.Data[2][0].length > 0) {
              _this.$router.push({
                name: "carServer_statics",
                params: {
                  mer_id: info.mer_id
                }
              });
            } else if (res.Data[4][0].length > 0) {
              _this.$router.push({
                path: "/smartCommunity"
              });
            }
          } else {
            _this.$router.push({
              path: "/generalPart"
            });
          }
        } else {
          _this.$notify.error({
            title: "错误",
            message: "请求错误",
            offset: 100
          });
        }
      });
    }
    $("form input[name=uname]").blur(function() {
      if ($(this).val() == superAdmin) {
        $("div.main").addClass("creator");
      } else {
        $("div.main").removeClass("creator");
      }
    });
    $(".userLogin").click(function() {
      var uItem = $("form input[name=uname]"),
        pItem = $("form input[name=pwd]"),
        uname = $.trim(uItem.val()),
        pwd = $.trim(pItem.val());
      if (!uname) {
        layer.msg("请输入用户名！");
        uItem.focus();
        return false;
      }
      if (!pwd) {
        layer.msg("请输入密码！");
        pItem.focus();
        return false;
      }
      let params = {
        mobile: uname,
        pwd: pwd,
        Platform: 99,
        Mobile: 1
      };
      _this.onLoading = true;
      Login(params).then(res => {
         _this.onLoading = false;
        if (res.Status == 0 && res.Data) {
          $$.setToken(res.Data.WToken);
          sessionStorage.setItem("__TOKEN__", res.Data.WToken);
          Cookies.set("token", res.Data.WToken);
          sessionStorage.setItem("__UINFO__", res.Data.Info);
          sessionStorage.setItem("uname", $("input[name=uname]").val());
          var uInfo = Base64.decode(unescape(res.Data.Info)),
            uObj = JSON.parse(uInfo);
          layer.msg("登录成功！");
          if (uObj.bin_id == 1) {
            pintai(uObj);
          } else if (uObj.bin_id == 2) {
            _this.$router.push({
              name: "carServer_statics",
              params: {
                mer_id: uObj.mer_id
              }
            });
          } else if (uObj.bin_id == 3) {
            _this.$router.push({
              path: "/piccPart"
            });
          } else if (uObj.bin_id == 4) {
            _this.$router.push({
              path: "/smartCommunity"
            });
          }
        } else if (res.Status == 20) {
          layer.msg("用户未授权此应用");
          return false;
        } else if (res.Status == 99) {
          layer.msg("账户或密码错误");
          return false;
        } else if (res.Status == -2) {
          layer.msg("应用没有权限");
          return false;
        } else if (res.Status == -3) {
          layer.msg("验证码错误");
          return false;
        } else if (res.Status == -4) {
          layer.msg("数据验证错误");
          return false;
        } else if (res.Status == -5) {
          layer.msg("文件类型错误");
          return false;
        } else if (res.Status == -6) {
          layer.msg("文件扩展类型错误");
          return false;
        } else if (res.Status == -7) {
          layer.msg("文件大小错过限制");
          return false;
        } else if (res.Status == -8) {
          layer.msg("文件上传失败");
          return false;
        } else if (res.Status == -9) {
          layer.msg("图片文件尺寸错误");
          return false;
        } else if (res.Status == -10) {
          layer.msg("枚举类型错误");
          return false;
        } else if (res.Status == -11) {
          layer.msg("验证码不可用");
          return false;
        } else if (res.Status == -12) {
          layer.msg("表达式验证不通过");
          return false;
        } else if (res.Status == -100) {
          layer.msg("用户已冻结");
          return false;
        } else if (res.Status == 5) {
          layer.msg("没有此用户");
          return false;
        } else if (res.Status == 4) {
          layer.msg("密码错误");
          return false;
        } else {
          layer.msg("未知错误");
          return false;
        }
      }).catch(function (error) {
         layer.msg("请求错误，请刷新后重试");
  });;
    });
  },
  methods: {}
};
</script>

<style lang="less" scoped>
/*头部开始*/
.outwrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  background: url(../../assets/images/login/zhengnan_bg.png) no-repeat center;
  background-size: 100% 100%;
}

.banxin {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

header {
  width: 100%;
  height: 70%;
}

/*商标*/
header > .banxin {
  width: 80%;
  height: 133px;
  background: url(../../assets/images/login/bl.png) no-repeat left
    50px;
  background-size: 160px 40px;
  margin: 0 auto;
}

header > section {
  width: 80%;
  height: 100%;
  margin: 0 auto;
  background: url(../../assets/images/login/line.png) no-repeat left 12px;
  background-size: 739px 1px;
}

header > section > .caption {
  width: 343px;
  height: auto;
  padding-top: 37px;
}

header > section > .caption > h1 {
  width: 256px;
  height: 47px;
  line-height: 37px;
  font-size: 28px;
  color: #ffffff;
}

header > section > .caption > p {
  height: 36px;
  width: 208px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
}

header > section > form {
  width: 430px;
  height: 291px;
  background-color: #fff;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -o-border-radius: 4px;
  -ms-border-radius: 4px;
  /*margin:0 auto;*/
  /*margin-right:377px;*/
  /*margin-left:377px;*/
  /*margin-top:-200px;*/
  position: absolute;
  top: 12%;
  right: 19%;
}

header > section > form > h2 {
  width: 100%;
  height: 84px;
  line-height: 84px;
  text-align: center;
}

header > section > form > .input {
  width: 310px;
  height: 40px;
  display: block;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -o-border-radius: 4px;
  -ms-border-radius: 4px;
  margin: 0 auto;
  margin-bottom: 15px;
}

header > section > form > .input > label {
  display: inline-block;
  width: 54px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #919191;
  font-size: 14px;
}

header .myStyle {
  background-color: #00a1ff;
  color: #ffffff;
}

/*页脚开始*/
footer {
  width: 100%;
}

footer .banxin {
  width: 100%;
  height: 110px;
  border-bottom: 1px solid #d9dde3;
}

footer > .banxin > .row {
  width: 1184px;
  background-color: #f7f8fa;
  margin: 0 auto;
  padding-left: 20px;
}

footer > .banxin > .row > div {
  padding-right: 0px;
  padding-left: 0px;
}

footer .thumbnail {
  height: 157px;
  display: block;
  padding: 0px;
  margin-bottom: 0px;
  line-height: 0px;
  background-color: #f7f8fa;
  border: 1px solid #ddd;
  border-right: none;
  border-bottom: none;
  border-left: 1px solid #ddd;
  border-radius: 0px;
  -webkit-transition: border 0.2s ease-in-out;
  -o-transition: border 0.2s ease-in-out;
  transition: border 0.2s ease-in-out;
}

footer > .banxin > .row > div:nth-child(1) .thumbnail {
  border-left: none;
}

footer > .banxin .caption > p {
  width: 258px;
  color: #666666;
  font-size: 14px;
  line-height: 30px;
  padding-top: 10px;
}

footer > p {
  width: 1184px;
  color: #ffffff;
  padding-top: 40px;
  font-size: 14px;
  margin: 0 auto;
  /*margin-left: 100px;*/
}

.lan {
  width: 190px;
  height: 36px;
  line-height: 36px;
  display: inline-block;
  color: #ffffff;
  font-size: 14px;
  /*float: right;*/
  text-align: center;
  border: 1px solid #dfdfdf;
  background: url(../../assets/login/earth_white.png) no-repeat 15px center;
  text-indent: 1em;
  background-size: 14px 14px;
  position: absolute;
  top: 91%;
  right: 19%;
}

/*页脚结束*/
</style>
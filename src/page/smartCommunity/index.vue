<template>
  <div class="indexPage">
    <header-top :isCollapse="isCollapse" :activeIndex="activeIndex" :showMenu="showMenu" @setSecret="setSecret" @setSys="setSys" :imgSrc="imgSrc"></header-top>
    <Nav :isCollapse="isCollapse" :defaultActive="defaultActive" :tableTreeDdata="tableTreeDdata" :menuIndex="menuIndex"></Nav>
    <chlid-page :isCollapse="isCollapse" :acheCompents="acheCompents"></chlid-page>
    <pa-dio ref="padio" :dataForm="info"></pa-dio>
    <transition name="el-zoom-in-bottom">
      <reset-pass ref="resetPass"></reset-pass>
    </transition>
    <transition name="el-zoom-in-bottom">
      <set-lay ref="setLay"></set-lay>
    </transition>
  </div>
</template>

<script>
  import PaDio from "@/components/PaDio";
  import resetPass from "@/components/resetPass";
  import setLay from "@/components/setLay";
  import headerTop from "@/components/header";
  import Nav from "@/components/nav";
  import chlidPage from "@/components/childPage";
  export default {
    name: "smartCommunity",
    components: {
      PaDio,
      resetPass,
      setLay,
      headerTop,
      Nav,
      chlidPage
    },
    data() {
      return {
        acheCompents: [
          {
            path: "/smartCommunity",
            name: "smartCommunity_statics",
            tagName: "监控"
          }
        ],
        imgSrc: false,
        defaultActive: "/smartCommunity",
        info: {},
        showMenu: {
          1: [[]],
          2: [[]],
          3: [[]],
          4: [[]]
        },
        outId: "",
        menuIndex: [],
        tableTreeDdata: [],
        includedComponents: "",
        isCollapse: false,
        activeIndex: "/smartCommunity"
      };
    },
    mounted() {
      var myHerf = location.href;
      if (myHerf.indexOf("csl.ycpicc.com") == -1) {
        this.$nextTick(() => {
          if (
            this.getUserInfo().default_pay == null ||
            this.getUserInfo().default_pay == "-1"
          ) {
            this.$confirm("暂未设置停车场收费方式，是否跳转设置？", "提示", {
              type: "warning"
            }).then(() => {
              this.$router.push({ path: "/smartCommunity/chargeWay" });
            });
          } else {
            this.outMsgAlert();    
          }
        });
      }
    },
    created() {
      let s = this.$route.params.mer_id;
      this.getMenu({ mer_id: this.getUserInfo().mer_id });
      if (
        this.acheCompents.length == 1 &&
        this.acheCompents[0].path == "/smartCommunity"
      ) {
        this.$router.push({
          path: "/smartCommunity"
        });
      }
    },
    methods: {
      getMenu(params) {
        var api;
        if (this.getUserInfo().bin_id == 1) {
          api = "PubInterface/UserMenu/QueryUserMenu";
        } else {
          api = "PubInterface/User/QueryUserMenuList";
        }
        this.post(api, params, res => {
          if (res.body.Status == 0) {
            if (this.getUserInfo().bin_id == 1) {
              this.showMenu = res.body.Data;
              this.tableTreeDdata = res.body.Data[4][0];
              for (var i = 0; i < this.tableTreeDdata.length; i++) {
                this.menuIndex.push("'" + i + "'");
              }
            } else {
              this.tableTreeDdata = res.body.Data[0];
              for (var i = 0; i < this.tableTreeDdata.length; i++) {
                this.menuIndex.push("'" + i + "'");
              }
            }
            this.loading = false;
          } else if (res.body.Status == -1) {
            this.$notify.error({
              title: "登录失效",
              message: "将进入登录页面",
              offset: 100
            });
            this.$router.push("/login");
          } else {
            this.$notify.error({
              title: "错误",
              message: "请求错误",
              offset: 100
            });
            return false;
          }
        });
      },
      setSecret() {
        this.$refs.resetPass.setPassWord = true;
      },
      setSys() {
        this.$refs.setLay.flag = true;
        this.$refs.setLay.findPage();
      },
      outMsgAlert() {
        let timer;
        timer = setInterval(() => {
          if (location.href.indexOf("smartCommunity") != -1) {
            this.api(
              "NoSense/CarManage/QueryFeeAlert",
              {
                device_num: this.getUserInfo().DefaultDeviceNum,
                type: this.getUserInfo().default_pay,
                mer_id: this.getUserInfo().mer_id,
                WToken: this.getToken()
              },
              res => {
                this.info = res.Data;
                this.$refs.padio.feeData = res.Data;
                this.info.id = this.info.in_id;
                if (this.info.Type == 1 && this.info.Fee != 0) {
                  if (this.$refs.padio.dialogVisible == false) {
                    this.$refs.padio.dialogVisible = true;
                    this.$refs.padio.payType = 1;
                    this.$refs.padio.check = this.getUserInfo().Defaultopen == 2 ? true : false;
                    this.$refs.padio.blue = this.getUserInfo().default_pay;
                  }
                }
              },
              res => {
                if (res.Status == -4) {
                  this.$message({
                    message: "请求错误, " + res.Data,
                    type: "error"
                  });
                  clearInterval(timer);
                } else if (res.Status == 82) {
                  return false;
                } else if (res.Status == 99) {
                  this.$message({
                    message: "缴费失败,登录失效，请重新登录",
                    type: "error"
                  });
                  this.$router.push({ path: "/login" });
                }
              }
            );
          } else {
            clearInterval(timer);
          }
        }, 5000);
      }
    }
  };
</script>

<style lang="less" scoped>
  .indexPage {
    .el-menu-vertical:not(.el-menu--collapse) {
      width: 300px;
      height: calc(100vh - 80px- 62px);
    }

    width: 100%;
    height: 100%;
    position: relative;

    .tagList {
      font-size: 14px;
    }
  }

  .transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409eff;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }
</style>
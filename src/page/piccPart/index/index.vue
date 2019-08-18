<template>
  <div class="indexPage">
    <header-top :isCollapse="isCollapse" :activeIndex="activeIndex" :showMenu="showMenu" @setSecret="setSecret" @setSys="setSys"></header-top>
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
    name: "carServer",
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
            path: "/carServer",
            name: "carServer_statics",
            tagName: "监控"
          }
        ],
        defaultActive: "/carServer",
        info: {},
        showMenu: {
          1: [[]],
          2: [[]],
          3: [[]],
          4: [[]]
        },
        outId: "",
        // payType: "1",
        menuIndex: [],
        tableTreeDdata: [],
        includedComponents: "",
        isCollapse: false,
        activeIndex: "/carServer"
      };
    },
    mounted() {
      var myHerf = location.href;
    },
    created() {
      let s = this.$route.params.mer_id;
      this.getMenu({ mer_id: this.getUserInfo().mer_id });
      if (
        this.acheCompents.length == 1 &&
        this.acheCompents[0].path == "/carServer"
      ) {
        this.$router.push({
          path: "/carServer"
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



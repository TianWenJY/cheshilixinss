<template>
  <div class="header">
    <span class="collapseBtn">
      <img src="@/assets/menu-open.png"
           v-if="!isCollapse"
           :label="false"
           @click="closeMenu">
      <img src="@/assets/menu-close.png"
           v-if="isCollapse"
           :label="true"
           @click="openMenu">
    </span>
    <header-img style="margin-left: 21px;
    margin-right: auto;" :imgSelect='imgSelect'></header-img>
    <el-menu :default-active="activeIndex"
             router
             class="el-menu-nav"
             mode="horizontal"
             background-color="#252A2F"
             text-color="#fff"
             active-text-color="#ffd04b">
      <el-menu-item index="/generalPart"
                    v-show="myInfo.bin_id == 1 && showMenu[1][0].length > 0">总平台</el-menu-item>
       <!-- <el-menu-item index="/piccPart"
                    v-show="(myInfo.bin_id == 1 && showMenu[3][0].length > 0) || (myInfo.bin_id == 3)">移车码板块</el-menu-item>  -->
      <el-menu-item index="/carServer"
                    v-show="(myInfo.bin_id == 1&& showMenu[2][0].length > 0) || (myInfo.bin_id == 2)">汽车服务板块</el-menu-item>
      <el-menu-item index="/smartCommunity"
                    v-show="(myInfo.bin_id == 1&& showMenu[4][0].length > 0) || (myInfo.bin_id == 4)">智慧社区板块</el-menu-item>
    </el-menu>
    <img class="user"
         src="@/assets/user.png"
    <el-dropdown trigger="click">
    <span class="el-dropdown-link userMoblie">
      {{this.getUserInfo().mobile}}
      <span v-if='this.getUserInfo().name'> - {{this.getUserInfo().name}}</span>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="setSecret">修改密码</el-dropdown-item>
      <el-dropdown-item @click.native="setSys"
                        v-if="myInfo.bin_id == 4 && myInfo.p_id != 0">设置</el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
    <span class="loginOut"
          @click="loginOut">
      退出
    </span>
  </div>
</template>

<script>
  import headerImg from "@/components/img";
export default {
  name: "headerTop",
  props: {
    isCollapse: Boolean,
    activeIndex: String,
    showMenu: Object,
    imgSrc: Boolean
  },

  components: {
    headerImg
  },
  data () {
    return {
      size: "small",
      myInfo: "",
      imgSelect: this.imgSrc
    };
  },
  methods: {
    closeMenu () {
      this.$parent.isCollapse = true;
    },
    setSecret () {
      this.$emit('setSecret')
    },
    setSys () {
      this.$emit('setSys')
    },
    openMenu () {
      this.$parent.isCollapse = false;
    },
    loginOut () {
      this.$confirm("您确定退出登录", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
         if(!this.imgSelect && this.getUserInfo().bin_id == 4){
          this.$router.push({
            path: "/bllogin"
          });
         }else {
          this.$router.push({
            path: "/login"
          });
         }
          sessionStorage.setItem("__TOKEN__", "");
        })
        .catch(action => { });
    }
  },
  created () {
    this.myInfo = this.getUserInfo();
  },
  mounted () {
        console.log(this.showMenu)
  }
};
</script>

<style lang="less">
.header {
  width: 100%;
  height: 70px;
  background: #252a2f;
  color: #ffffff;
  display: flex;
  align-items: center;
  font-size: 14px;

  .collapseBtn {
    width: 64px;
    height: 100%;
    text-align: center;
    border-right: 1px solid #434a50;
    line-height: 70px;

    img {
      width: 16px;
      height: 16px;
    }
  }

  .logo {
    margin-left: 21px;
    widows: 88px;
    margin-right: auto;
  }

  .el-menu-nav {
    margin-right: 30px;
    height: 100%;
  }

  .el-menu--horizontal > .el-menu-item {
    height: 70px;
    line-height: 70px;
  }

  .user {
    width: 16px;
    margin-right: 8px;
  }

  .userMoblie {
    color: #ffffff;

    &:hover {
      color: #409eff;
      cursor: pointer;
    }
  }

  .loginOut {
    width: 50px;
    height: 100%;
    line-height: 70px;
    text-align: center;
    margin: 0 30px;

    &:hover {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
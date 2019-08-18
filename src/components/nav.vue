<template>
  <div id="nav">
    <el-col :md="24">
      <el-menu :default-active="defaultActive"
               class="el-menu-vertical"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               :collapse="isCollapse"
               unique-opened
               router>
        <el-submenu v-for="(data,$index) in tableTreeDdata"
                    :key="$index"
                    :index="menuIndex[$index]">
          <template slot="title">
            <i :class="data.icon"></i>
            <span>{{data.name}}</span>
          </template>
          <el-menu-item v-for="(item,index) in data.Children"
                        :index="item.url"
                        :key="index">
            {{item.name}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    defaultActive: String,
    isCollapse: Boolean,
    tableTreeDdata: Array,
    menuIndex: Array
  },
  data () {
    return {
    };
  },
  methods: {
  },
  created () {
  },
  mounted () {
  }
};
</script>

<style lang="less">
.el-menu-vertical:not(.el-menu--collapse) {
  width: 250px;
  height: calc(100vh - 70px- 62px);
}

#nav {
  height: calc(100vh - 70px);
  background: rgb(84, 92, 100);
  position: absolute;
  top: 70px;

  .userInfo {
    width: 100%;
    height: 62px;
    display: flex;
    color: #ffffff;
    padding: 0 20px 0 24px;
    align-items: center;
    font-size: 14px;
    background: #434a50;
    box-sizing: border-box;

    img {
      width: 18px;

      &.right_icon {
        width: 10px;
      }
    }

    span {
      margin-left: 10px;
      margin-right: auto;
    }
  }

  .el-menu {
    border-right: none;
  }
}
</style>
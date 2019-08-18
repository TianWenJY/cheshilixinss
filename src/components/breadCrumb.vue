<template>
  <div class="header_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta"
                          :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "breadCrumb"
};
</script>

<style lang="less">
.header_container {
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
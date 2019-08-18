<template>
  <div>
    <img class="logo" src="@/assets/login/zhengnan_logo.png" v-if="imgSelect">
    <img class="logo" src="@/assets/login/bl.png" v-if="!imgSelect">
  </div>
</template>

<script>
export default {
  name: "imgTop",
  props: {
    imgSelect: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less">
</style>
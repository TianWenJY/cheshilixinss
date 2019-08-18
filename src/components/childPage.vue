
<template>
  <div id="chlidPage"
       :class="isCollapse?'scale':''">
    <div class="tagList">
      <el-tabs v-model="editableTabsValue"
               type="card"
               closable
               @tab-remove="removeTab"
               @tab-click="chooseTab">
        <el-tab-pane v-for="item in acheCompents"
                     :key="item.name"
                     :label="item.tagName"
                     :name="item.name"
                     :path="item.path"></el-tab-pane>
      </el-tabs>
    </div>
    <el-breadcrumb class="bread"
                   v-model="bread"
                   separator="/">
      <el-breadcrumb-item>{{bread.partName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{bread.fatherTag}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{bread.childTag}}</el-breadcrumb-item>
    </el-breadcrumb>
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "chlidPage",
  props: {
    isCollapse: Boolean,
    acheCompents: Array
  },
  data () {
    return {
      editableTabsValue: "smartCommunity_statics",
      bread: {
        partName: "汽车服务板块",
        fatherTag: "监控",
        childTag: "监控"
      }
    };
  },
  methods: {
    hasSameVal: (arr, key, val) => {
      let isHad = false;
      arr.forEach((value, index) => {
        if (value[key] == val) {
          isHad = true;
        }
      });
      return isHad;
    },
    chooseTab (targetName) {
      this.$router.push({
        path: targetName.$attrs.path
      });
    },
    removeTab (targetName) {
      let tabs = this.$parent.acheCompents;
      let activeName = this.editableTabsValue;
      let activePath = "";
      if (tabs.length == 1) {
        this.$message("最后一个标签不能删除");
        return false;
      }
      if (activeName === targetName) {
        console.log(tabs);
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              activePath = nextTab.path;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.$router.push({
        path: activePath
      });
      this.$parent.acheCompents = tabs.filter(tab => tab.name !== targetName);
      this.includedComponents = this.$parent.acheCompents.join(",");
    }
  },
  created () {
    this.$router.beforeEach((to, from, next) => {
      if (!this.hasSameVal(this.$parent.acheCompents, "name", to.name)) {
        this.$parent.acheCompents.push({
          tagName: to.meta.tagName,
          path: to.path,
          name: to.name
        });
        this.includedComponents = this.$parent.acheCompents.join(",");
      }
      this.editableTabsValue = to.name;
      this.bread = {
        partName: to.meta.partName,
        fatherTag: to.meta.fatherTag,
        childTag: to.meta.tagName
      };
      next();
    });
  },
  mounted () { }
};
</script>

<style lang="less">
#chlidPage {
  margin-left: 250px;
  transition: 0.3s;
  height: calc(100vh - 80px);
  overflow-y: auto;
  .bread {
    padding-left: 20px;
    align-items: center;
    display: flex;
    height: 45px;
  }
  &.scale {
    margin-left: 64px;
    transition: 0.6s;
  }
}
</style>
<template>
    <div>
        <!--工具栏-->
        <bread-crumb></bread-crumb>
        <!--角色菜单，表格树内容栏-->
        <el-row class="containt">
            <div class="menu-header">
                <span><B>{{this.$route.params.name}}----接口授权</B></span>
            </div>
            <!-- v-loading="menuLoading element-loading-text="拼命加载中" " -->
            <el-tree :data="menuData" size="mini" show-checkbox node-key="id" :props="defaultProps" style="width: 100%;pading-top:20px;" ref="menuTree" :render-content="renderContent" :check-strictly="true" @check-change="handleMenuCheckChange">
            </el-tree>
            <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
                <el-checkbox v-model="checkAll" @change="handleCheckAll"><b>全选</b></el-checkbox>
            </div>
            <div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
              <kt-button label="返回菜单" type="primary" @click="goBack" />
                <kt-button label="重置" perms="sys:role:edit" type="primary" @click="resetSelection" />
                <!-- :loading="authLoading" -->
                <kt-button label="提交" perms="sys:role:edit" type="primary" @click="submitAuthForm" />
            </div>
        </el-row>
    </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb";
import KtButton from "@/page/Core/KtButton";
export default {
  name: "menuPersimion",
  components: {
    KtButton,
    breadCrumb
  },
  data() {
    return {
      size: "small",
      filters: {
        name: ""
      },
      selectRole: {},
      menuData: [],
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      currentRoleMenus: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  mounted() {
    alert(2)
    console.log(this.$route.name)
  },
  methods: {
    // 获取数据
    findTreeData: function() {
      this.menuLoading = true;
      this.tpost("allMenu", {}, res => {
        console.log(res.body);
        if (res.body.Status == 0) {
          this.menuData = res.body.Data.data;
          console.log(this.menuData);
          this.totalCount = parseInt(res.body.Data.Count);
          this.deviceList = res.body.Data.Rows;
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
            message: "请输入正确的用户名密码",
            offset: 100
          });
          return false;
        }
      });
      this.menuLoading = false;
    },
    // 角色选择改变监听
    handleRoleSelectChange(val) {
      console.log(val);
      if (val == null || val.val == null) {
        return;
      }
      this.selectRole = val.val;
      this.currentRoleMenus = {
        code: 200,
        msg: null,
        data: [
          {
            id: 1,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 0,
            name: "系统管理",
            url: null,
            perms: null,
            type: 0,
            icon: "el-icon-setting",
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 2,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 1,
            name: "用户管理",
            url: "/sys/user",
            perms: null,
            type: 1,
            icon: "el-icon-service",
            orderNum: 1,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 3,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 1,
            name: "机构管理",
            url: "/sys/dept",
            perms: null,
            type: 1,
            icon: "el-icon-news",
            orderNum: 2,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 4,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 1,
            name: "角色管理",
            url: "/sys/role",
            perms: null,
            type: 1,
            icon: "el-icon-view",
            orderNum: 4,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 5,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 1,
            name: "菜单管理",
            url: "/sys/menu",
            perms: null,
            type: 1,
            icon: "el-icon-menu",
            orderNum: 5,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 6,
            createBy: null,
            createTime: null,
            lastUpdateBy: "admin",
            lastUpdateTime: "2018-10-24T06:39:24.000+0000",
            parentId: 29,
            name: "SQL??",
            url: "iframe:/druid/login.html",
            perms: null,
            type: 1,
            icon: "el-icon-info",
            orderNum: 1,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 7,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 1,
            name: "字典管理",
            url: "/sys/dict",
            perms: null,
            type: 1,
            icon: "el-icon-edit-outline",
            orderNum: 7,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 8,
            createBy: null,
            createTime: null,
            lastUpdateBy: "admin",
            lastUpdateTime: "2018-09-23T11:32:28.000+0000",
            parentId: 1,
            name: "系统日志",
            url: "/sys/log",
            perms: "sys:log:view",
            type: 1,
            icon: "el-icon-info",
            orderNum: 8,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 9,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 2,
            name: "查看",
            url: null,
            perms: "sys:user:view",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 10,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 2,
            name: "新增",
            url: null,
            perms: "sys:user:add",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 11,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 2,
            name: "修改",
            url: null,
            perms: "sys:user:edit",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 12,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 2,
            name: "删除",
            url: null,
            perms: "sys:user:delete",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 13,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 3,
            name: "查看",
            url: null,
            perms: "sys:dept:view",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 14,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 3,
            name: "新增",
            url: null,
            perms: "sys:dept:add",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 15,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 3,
            name: "修改",
            url: null,
            perms: "sys:dept:edit",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 16,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 3,
            name: "删除",
            url: null,
            perms: "sys:dept:delete",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 17,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 4,
            name: "查看",
            url: null,
            perms: "sys:role:view",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 18,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 4,
            name: "新增",
            url: null,
            perms: "sys:role:add",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 19,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 4,
            name: "修改",
            url: null,
            perms: "sys:role:edit",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 20,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 4,
            name: "删除",
            url: null,
            perms: "sys:role:delete",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 21,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 5,
            name: "查看",
            url: null,
            perms: "sys:menu:view",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 22,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 5,
            name: "新增",
            url: null,
            perms: "sys:menu:add",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 23,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 5,
            name: "修改",
            url: null,
            perms: "sys:menu:edit",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 24,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 5,
            name: "删除",
            url: null,
            perms: "sys:menu:delete",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 28,
            createBy: null,
            createTime: null,
            lastUpdateBy: "admin",
            lastUpdateTime: "2018-09-23T11:28:15.000+0000",
            parentId: 0,
            name: "使用案例",
            url: null,
            perms: null,
            type: 0,
            icon: "el-icon-picture-outline",
            orderNum: 4,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 29,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 28,
            name: "国际化",
            url: "/demo/i18n",
            perms: null,
            type: 1,
            icon: "el-icon-edit",
            orderNum: 1,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 30,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 28,
            name: "换皮肤",
            url: "/demo/theme",
            perms: null,
            type: 1,
            icon: "el-icon-picture",
            orderNum: 2,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 31,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 7,
            name: "查看",
            url: null,
            perms: "sys:dict:view",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 32,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 7,
            name: "新增",
            url: null,
            perms: "sys:dict:add",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 33,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 7,
            name: "修改",
            url: null,
            perms: "sys:dict:edit",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 34,
            createBy: null,
            createTime: null,
            lastUpdateBy: null,
            lastUpdateTime: null,
            parentId: 7,
            name: "删除",
            url: null,
            perms: "sys:dict:delete",
            type: 2,
            icon: null,
            orderNum: 0,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          },
          {
            id: 35,
            createBy: null,
            createTime: null,
            lastUpdateBy: "admin",
            lastUpdateTime: "2018-09-23T11:27:40.000+0000",
            parentId: 0,
            name: "接口文档",
            url: "iframe:/swagger-ui.html",
            perms: null,
            type: 1,
            icon: "el-icon-tickets",
            orderNum: 2,
            delFlag: 0,
            parentName: null,
            level: null,
            children: null
          }
        ]
      };
      this.currentRoleMenus = this.currentRoleMenus.data;
      console.log(this.currentRoleMenus);
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
      // })
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentId = data.parentId;
        this.$refs.menuTree.setChecked(parentId, true, false);
        // if(data.children != null) {
        // 	data.children.forEach(element => {
        // 		this.$refs.menuTree.setChecked(element.id, true, false)
        // 	});
        // }
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, true);
          });
        }
      }
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false;
      console.log(this.currentRoleMenus);
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = [];
        this.checkAllMenu(this.menuData, allMenus);
        console.log(this.$refs.menuTree);
        this.$refs.menuTree.setCheckedNodes(allMenus);
      } else {
        this.$refs.menuTree.setCheckedNodes([]);
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu);
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus);
        }
      });
    },
    // 角色菜单授权提交
    submitAuthForm() {
      this.$router.push({
        path: "/menu"
      });
      let roleId = this.selectRole.id;
      if ("admin" == this.selectRole.name) {
        this.$message({
          message: "超级管理员拥有所有菜单权限，不允许修改！",
          type: "error"
        });
        return;
      }
      this.authLoading = true;
      console.log(this.$refs.menuTree.getCheckedNodes(false, true));
      // let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
      let roleMenus = [];
      for (let i = 0, len = checkedNodes.length; i < len; i++) {
        let roleMenu = { roleId: roleId, menuId: checkedNodes[i].id };
        roleMenus.push(roleMenu);
      }
      // this.$api.role.saveRoleMenus(roleMenus).then(res => {
      //   if (res.code == 200) {
      //     this.$message({ message: "操作成功", type: "success" });
      //   } else {
      //     this.$message({ message: "操作失败, " + res.msg, type: "error" });
      //   }
      //   this.authLoading = false;
      // });
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;margin-right:80px; width:100px; display: inline-block;">
            {data.name}
          </span>
          <span style="text-algin:center;margin-right:80px;">
            <el-tag
              type={data.type === 0 ? "" : data.type === 1 ? "success" : "info"}
              size="small"
            >
              {data.type === 0 ? "目录" : data.type === 1 ? "菜单" : "按钮"}
            </el-tag>
          </span>
          <span style="text-algin:center;margin-right:80px;">
            {" "}
            <i class={data.icon} />
          </span>
          <span style="text-algin:center;margin-right:80px;">
            {data.parentName ? data.parentName : "顶级菜单"}
          </span>
          <span style="text-algin:center;margin-right:80px;">
            {data.url ? data.url : "\t"}
          </span>
        </div>
      );
    },
    goBack() {
      this.$router.push({
        path: "/menu"
      });
    }
  },
  mounted() {
    console.log(this.$route.params);
    console.log(this.$route.params.name);
    this.findTreeData();
  }
};
</script>
<style scoped  lang="less">
.menu-container {
  margin-top: 10px;
}
.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
.containt {
  padding: 20px;
  padding-top: 0;
}
.filterBlock {
  margin-bottom: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  .filterHeader {
    background-color: #fcfcfc;
    padding: 0 14px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebebeb;
    font-size: 16px;
  }
  .filterContent {
    padding: 25px 16px 16px 16px;
    background-color: #f2f2f2;
    .filterInput {
      //box-shadow: 0 0 1.5px #eee;
      .filterText {
        margin-bottom: 6px;
      }
    }
    .filterFirst {
      margin-right: 15px;
    }
  }
}
.breadStyle {
  height: 50px;
}
.tableTop {
  height: 40px;
  line-height: 40px;
  font-size: 0;
  :last-child {
    border-right: 2px solid #eee;
  }
}
.table {
  padding: 32px;
  border: 2px solid #eee;
  border-top: 0;
  box-shadow: 0 0 1.5px #eee;
  .el-table__header-wrapper {
    /*border-top: 1px solid #ebeef5;*/
  }
}
.el-tabs__header {
  margin: 0;
}
.el-tabs__item {
  width: 150px;
  text-align: center;
  font-size: 20px;
}
.el-tabs__item.is-active {
  border-top: 2px solid #2d4fa7;
}
.el-tabs--card > .el-tabs__header {
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 0 1.5px #eee;
}
.el-table th {
  background: #fafafa;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-dialog__title {
  font-weight: 700;
}
</style>
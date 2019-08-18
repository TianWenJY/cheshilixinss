<template>
  <div style="margin-top: 20px;">
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form :inline="true" :model="pageRequest" size="medium" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <el-form-item label="用户名">
            <el-select placeholder="请选择板块" v-model="pageRequest.plate_id">
              <el-option
                v-for="plate in allPlate"
                :key="plate.id"
                :label="plate.description"
                :value="plate.id"
              >
                <!-- <el-option :label="汽车服务" :value="1"></el-option> -->
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="角色类型">
            <el-select v-model="pageRequest.Type" placeholder="角色类型" size="medium">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="店长" :value="1"></el-option>
              <el-option label="员工" :value="2"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <kt-button
              label="查询"
              type="primary"
              @click="findPage(null)"
              size="medium"
              :loading="onLoading"
            />
          </el-form-item>
          <el-form-item>
            <kt-button label="新增" type="primary" @click="handleAdd" size="medium"/>
          </el-form-item>
        </el-row>
      </el-form>
      <!--表格内容栏-->
      <!-- @findPage="findPage" -->
      <kt-table
        :highlightCurrentRow="true"
        :stripe="false"
        @findPage="findPage"
        :data="pageResult"
        :pageRequest="pageRequest"
        :columns="columns"
        :showBatchDelete="false"
        @handleCurrentChange="handleRoleSelectChange"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        ref="table"
      ></kt-table>
      <!-- </el-col> -->
      <!--新增编辑界面-->
      <el-dialog
        :title="operation?'新增':'编辑'"
        width="40%"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
      >
        <el-form
          :model="dataForm"
          label-width="80px"
          :rules="dataFormRules"
          ref="dataForm"
          :size="size"
        >
          <el-form-item label="id" prop="id" v-if="false">
            <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="板块">
            <el-select placeholder="请选择板块" size="medium" v-model="dataForm.plate_id">
              <el-option
                v-for="plate in allPlate"
                :key="plate.id"
                :label="plate.description"
                :value="plate.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色类型">
            <el-input v-model="dataForm.sm" placeholder="请输入角色类型"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
          <!-- :loading="editLoading" -->
          <el-button :size="size" type="primary" @click.native="submitForm">提交</el-button>
        </div>
      </el-dialog>
      <!--角色菜单，表格树内容栏-->
      <div class="menu-container">
        <div class="menu-header">
          <span>
            <B>{{slect}} {{selectName}} 菜单授权</B>
          </span>
        </div>
        <!-- v-loading="menuLoading element-loading-text="拼命加载中" " -->
        <el-tree
          :data="menuData"
          size="mini"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          style="width: 100%;pading-top:20px;"
          ref="menuTree"
          :render-content="renderContent"
          :check-strictly="false"
        ></el-tree>
        <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
          <el-checkbox v-model="checkAll" @change="handleCheckAll">
            <b>全选</b>
          </el-checkbox>
        </div>
        <div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
          <kt-button label="重置" type="primary" @click="resetSelection"/>
          <!-- :loading="authLoading" -->
          <kt-button label="提交" type="primary" @click="submitAuthForm"/>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
import { Delete } from "../../../static/utils.js";
import { roleList } from "@/api/smart";

export default {
  name: "rolePersimion",
  components: {
    KtTable,
    KtButton,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      filters: {
        plate_id: "1",
        Type: ""
      },
      parameter: {
        // WToken: "",
        id: "",
        plate_id: "1",
        role_type: "-1",
        sm: "",
        N: "",
        Rows: ""
      },
      columns: [
        // { prop: "id", label: "角色id", minWidth: 50 },
        {
          prop: "plate_id",
          label: "所属板块",
          minWidth: 100,
          change: this.plateType
        },
        {
          prop: "sm",
          label: "角色类型",
          minWidth: 120
        }
      ],
      pageRequest: {
        // WToken: "",
        plate_id: "1",
        role_type: "-1",
        sm: "",
        N: 1,
        Rows: 8
      },
      pageResult: {},
      onLoading: false,
      selectName: "",
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        plate_id: "1",
        sm: ""
      },
      selectRole: {},
      plate_id: "",
      allPlate: [],
      selectPlan: "",
      menuData: [],
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      currentRoleMenus: [],
      defaultProps: {
        children: "Children",
        label: "Name"
      }
    };
  },
  computed: {
    slect() {
      if (this.pageRequest.plate_id == "1") {
        return "总平台";
      } else if (this.pageRequest.plate_id == "2") {
        return "汽车服务";
      }
    }
  },
  methods: {
    formatterColumn(row, column) {
      switch (row.Type) {
        case "1":
          return "店长";
          break;
        case "2":
          return "员工";
          break;
        default:
          return "未知";
      }
    },
    plateType(row, column) {
      if (row.plate_id == "1") {
        return "总平台";
      } else if (row.plate_id == "2") {
        return "汽车服务";
      }else if(row.plate_id == '4') {
        return '智慧社区'
      }else if(row.plate_id == '3') {
        return '移车板块'
      }
    },
    // 获取分页数据
    findPage: function(data) {
      this.loading = true;
      if (data && data != null) {
        this.pageRequest = Object.assign(this.pageRequest, data.pageRequest);
      }
      if (data == null) {
        this.pageRequest.N = 1;
        this.onLoading = true;
        this.$refs.table.loading = true;
      }
      roleList(this.pageRequest)
        .then(res => {
          if (res.Status == 0) {
            this.pageResult = res.Data;
            this.onLoading = false;
            this.$refs.table.loading = false;
          }
        })
        .then(data != null ? data.callback : "");
      this.plate_id = this.pageRequest.plate_id;
      if (this.plate_id == 1) {
        this.plate_id = -1;
      }
      this.findTreeData({ mer_id: this.getUserInfo().mer_id });
    },
    // 删除
    handleDelete(row) {
      this.Delete(
        "PubInterface/Role/DelRole",
        { id: row.id, Parentid: row.Parentid },
        this.findPage
      );
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        plate_id: "1",
        sm: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = {
        id: row.id,
        plate_id: row.plate_id,
        sm: row.sm
      };
      this.dataForm.Type = parseInt(this.dataForm.Type);
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if (this.dataForm.id) {
              api = "PubInterface/Role/UpdateRole";
            } else {
              api = "PubInterface/Role/AddRole";
            }
            let params = Object.assign({}, this.dataForm);
            this.post(api, params, res => {
              if (res.body.Status == 0) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                this.findPage();
              } else if (res.body.Status == -1) {
                this.$notify.error({
                  title: "登录失效",
                  message: "将进入登录页面",
                  offset: 100
                });
                this.$router.push("/login");
              } else {
                this.$message({
                  message: "操作失败, " + res.body.Data,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    // 获取数据
    findTreeData: function(data) {
      this.menuLoading = true;
      var api;
      if (this.getUserInfo().bin_id == 1) {
        api = "PubInterface/UserMenu/QueryUserMenu";
      } else {
        api = "PubInterface/User/QueryUserMenuList";
      }
      this.post(api, data, res => {
        if (res.body.Status == 0) {
          if (this.getUserInfo().bin_id == 1) {
            this.menuData = [
              { name: "总平台", id: "-1", Children: res.body.Data[1][0] },
              {
                name: "汽车服务",
                id: "-2",
                Children: res.body.Data[2][0]
              },
              // {
              //   name: "移车码",
              //   id:"-3",
              //   disabled: true,
              //   Children: res.body.Data[3][0]
              // },
              {
                name: "智慧社区",
                id: "-4",
                Children: res.body.Data[4][0]
              }
            ];
          } else {
            this.menuData = res.body.Data[0];
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
      this.menuLoading = false;
    },
    // 角色选择改变监听
    handleRoleSelectChange(val) {
      if (val == null || val.val == null) {
        return;
      }
      this.selectRole = val.val;
      this.selectName = this.selectRole.sm;
      this.post(
        "PubInterface/RoleMenu/QueryRoleMenuDetail",
        { role_id: this.selectRole.id },
        res => {
          if (res.body.Status == 0) {
            this.currentRoleMenus = res.body.Data;
            console.log(this.currentRoleMenus);
            this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
            this.loading = false;
          } else if (res.body.Status == -1) {
            this.$notify.error({
              title: "登录失效",
              message: "将进入登录页面",
              offset: 100
            });
            this.$router.push("/login");
          } else {
            this.$message({
              message: "该员工暂无任何菜单权限",
              type: "warning"
            });
            return false;
          }
        }
      );

      // })
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentid = data.parent_id;
        this.$refs.menuTree.setChecked(parentid, true, false);
        // if (data.Children.length > 0) {
        //   console.log(data)
        //   data.Children.forEach(element => {
        //     this.$refs.menuTree.setChecked(element.id, true, false);
        //   });
        // }
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.Children != null) {
          data.Children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, true);
          });
        }
      }
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false;
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = [];
        this.checkAllMenu(this.menuData, allMenus);
        this.$refs.menuTree.setCheckedNodes(allMenus);
      } else {
        this.$refs.menuTree.setCheckedNodes([]);
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu);
        if (menu.Children) {
          this.checkAllMenu(menu.Children, allMenus);
        }
      });
    },
    // 角色菜单授权提交
    submitAuthForm() {
      let role_id = this.selectRole.id;
      if ("admin" == this.selectRole.Name) {
        this.$message({
          message: "超级管理员拥有所有菜单权限，不允许修改！",
          type: "error"
        });
        return;
      }
      this.authLoading = true;
      let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);
      let ids = checkedNodes.map(item => item.id).toString();
      this.post(
        "PubInterface/RoleMenu/AddRoleMenuMap",
        { role_id: role_id, MenuIDs: ids },
        res => {
          if (res.body.Status == 0) {
            this.$message({ message: "提交成功", type: "success" });
            this.findPage();
          } else if (res.body.Status == -1) {
            this.$notify.error({
              title: "登录失效",
              message: "将进入登录页面",
              offset: 100
            });
            this.$router.push("/login");
          } else {
            this.$message({
              message: "操作失败, " + res.body.Data,
              type: "error"
            });
          }
        }
      );
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;margin-right:80px; width:100px; display: inline-block;">
            {data.name}
          </span>
          <span style="text-algin:center;margin-right:80px; width:40px; display: inline-block;">
            <el-tag
              type={data.type === 0 ? "" : data.type === 1 ? "success" : "info"}
              size="small"
            >
              {data.type == 1 ? "目录" : data.type == 2 ? "菜单" : "按钮"}
            </el-tag>
          </span>
          <span style="text-algin:center;margin-right:80px; width:40px; display: inline-block;">
            {" "}
            <i class={data.icon} />
          </span>
          <span style="text-algin:center;margin-right:80px; width:100px; display: inline-block;">
            {data.parent_name ? data.parent_name : "顶级菜单"}
          </span>
          <span style="text-algin:center;margin-right:80px;  display: inline-block;">
            {data.url ? data.url : "\t"}
          </span>
        </div>
      );
    },
    getPlate() {
      this.post("PubInterface/Plate/QueryAuthList", {}, res => {
        if (res.body.Status == 0) {
          this.allPlate = res.body.Data.Rows;
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
    }
  },
  mounted() {
    this.getPlate();
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
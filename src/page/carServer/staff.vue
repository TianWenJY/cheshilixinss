<template>
  <div>
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form :inline="true" :model="filters" size="medium" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <el-form-item label="所属门店" v-if="this.getUserInfo().bin_id == 1">
            <el-select placeholder="选择所属门店" size="medium" v-model="pageRequest.p_id">
              <el-option label="全部" value="-1"></el-option>
              <el-option
                v-for="(shop,index) in shopNameList"
                :label="shop.name"
                :value="shop.mer_id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工姓名">
            <el-input v-model.trim="pageRequest.Keys" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button
              label="查询"
              type="primary"
              @click="findPage(null)"
              size="medium"
              :loading="onLoaidng"
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
        @findPage="findPage"
        ref="table"
        :data="pageResult"
        :pageRequest="pageRequest"
        :havePassWord="havePassWord"
        :columns="columns"
        :showBatchDelete="false"
        @handleCurrentChange="handleRoleSelectChange"
        @resPassword="resPassword"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
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
          <el-form-item label="id" prop="mer_id" v-if="false">
            <el-input v-model="dataForm.mer_id" :disabled="true" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属门店" v-if="this.getUserInfo().bin_id == 1">
            <el-select placeholder="选择所属门店" size="medium" v-model="dataForm.p_id">
              <el-option
                v-for="(shop,index) in shopNameList"
                :label="shop.name"
                :value="shop.mer_id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属班组">
            <el-select placeholder="选择所属班组" size="medium" v-model="dataForm.bz_id">
              <el-option
                v-for="(team,index) in teamList"
                :label="team.bzmc"
                :value="team.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="法人姓名" prop="name">
            <el-input v-model="dataForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model.number="dataForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dataForm.sm" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="resource">
            <el-radio-group v-model="dataForm.xb">
              <el-radio label="男" value="1"></el-radio>
              <el-radio label="女" value="2"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证号" prop="name">
            <el-input v-model="dataForm.sfz" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="name">
            <el-input v-model.number="dataForm.nl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="开单通知" prop="delivery">
            <el-switch
              v-model="dataForm.kdtz"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="2"
              inactive-value="1"
              active-text="开启"
              inactive-text="关闭"
            ></el-switch>
          </el-form-item>
          <el-form-item label="预约通知" prop="delivery">
            <el-switch
              v-model="dataForm.yytz"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="2"
              inactive-value="1"
              active-text="开启"
              inactive-text="关闭"
            ></el-switch>
          </el-form-item>
          <!-- <el-form-item label="所属上级" prop="p_id">
                        <el-input v-model="dataForm.p_id" auto-complete="off"></el-input>
          </el-form-item>-->
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
            <B>{{selectName}}菜单授权</B>
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
// import { Delete } from "../../../static/utils.js";
export default {
  name: "PubInterface_staff",
  components: {
    KtTable,
    KtButton,
    TableTreeColumn
  },
  data() {
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      size: "small",
      shopNameList: "",
      myFirst: "",
      havePassWord: true,
      filters: {
        Plateid: "",
        type: ""
      },
      parameter: {
        // WToken: "",
        bin_id: 1,
        role_id: this.myFirst,
        name: "",
        mobile: "",
        addtime: "",
        N: 1,
        Rows: 8
      },
      columns: [
        { prop: "name", label: "法人姓名", minWidth: 60 },
        { prop: "mobile", label: "员工手机", minWidth: 100 },
        { prop: "sm", label: "员工姓名", minWidth: 100 },
        { prop: "xb", label: "员工性别", minWidth: 80 },
        { prop: "nl", label: "年龄", minWidth: 80 },
        { prop: "sfz", label: "身份证号", minWidth: 160 },
        { prop: "kdtz", label: "开单通知", minWidth: 80, change: this.isKz },
        { prop: "yytz", label: "预约通知", minWidth: 80, change: this.isYy },
        { prop: "bz", label: "备注", minWidth: 180 }
      ],
      pageRequest: {
        // WToken: "",
        p_id: this.getUserInfo().bin_id == 1 ? "-1" : this.getUserInfo().mer_id,
        Keys: "",
        N: 1,
        Rows: 8
      },
      pageResult: {},
      selectName: "",
      onLoaidng: false,
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      addtime: "",
      dataFormRules: {
        name: [
          { required: true, message: "必须填写员工姓名", trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            trigger: "blur",
            validator: validPhone
          }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        bin_id: 2,
        u_id: "",
        role_id: this.myFirst,
        name: "",
        mobile: "",
        p_id: this.getUserInfo().bin_id == 1 ? "" : this.getUserInfo().mer_id,
        bz_id: "",
        sm: "",
        xb: "",
        nl: "",
        sfz: "",
        kdtz: "",
        yytz: "",
        bz: ""
      },
      selectRole: {},
      teamList: [],
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
  methods: {
    platetype(row, column) {
      if (row.Plateid == 1) {
        return "汽车服务";
      } else if (row.Plateid == 2) {
        return "移车码业务";
      }
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    // 获取分页数据
    findPage: function(data) {
      if (data == null) {
        // if (this.addtime !== "" && this.addtime !== null) {
        //   this.pageRequest.addtime =
        //     "'" + this.addtime[0] + "'_'" + this.addtime[1] + "'";
        // } else {
        //   this.pageRequest.addtime = "";
        // }
      }
      if (data != null) {
        this.pageRequest = Object.assign(this.pageRequest, data.pageRequest);
      }
      this.post("CarServer/Employee/QueryEmpList", this.pageRequest, res => {
        if (res.body.Status == 0) {
          this.pageResult = res.body.Data;
        } else if (res.body.Status == -1) {
          _this.$notify.error({
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
        this.onLoading = false;
        this.$refs.table.loading = false;
      });
      this.findTreeData();
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post("PubInterface/User/DelUser", { mer_id: row.mer_id }, res => {
          if (res.body.Status == 0) {
            this.$message({ message: "删除成功", type: "success" });
            this.pageRequest.N = 1;
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
    },
    resPassword(row) {
      this.$confirm("确认重置密码吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post(
          "PubInterface/User/ResetPwdAdmin",
          { mer_id: row.mer_id },
          res => {
            if (res.body.Status == 0) {
              this.$message({ message: "重置密码成功", type: "success" });
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
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        bin_id: 2,
        role_id: this.myFirst,
        name: "",
        mobile: "",
        p_id: this.getUserInfo().bin_id == 1 ? "" : this.getUserInfo().mer_id,
        bz_id: "",
        sm: "",
        xb: "",
        nl: "",
        sfz: "",
        kdtz: "",
        yytz: "",
        bz: ""
      };
    },
    isKz: function(val) {
      switch (val.kdtz || val.yytz) {
        case "1":
          return "关闭";
          break;
        case "2":
          return "打开";
          break;
        default:
          return "";
      }
    },
    isYy: function(val) {
      switch (val.yytz) {
        case "1":
          return "关闭";
          break;
        case "2":
          return "打开";
          break;
        default:
          return "";
      }
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.operation = false;
      Object.assign(this.dataForm, row);
      this.dataForm.mobile = parseInt(this.dataForm.mobile);
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if (this.dataForm.mer_id) {
              api = "CarServer/Employee/UpdateStore";
            } else {
              api = "CarServer/Employee/AddEmp";
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
    findTreeData: function() {
      this.menuLoading = true;
      var api;
      if (this.getUserInfo().bin_id == 1) {
        api = "PubInterface/UserMenu/QueryUserMenu";
      } else {
        api = "PubInterface/User/QueryUserMenuList";
      }
      this.post(
        api,
        { mer_id: this.getUserInfo().mer_id },
        res => {
          if (res.body.Status == 0) {
            if (this.getUserInfo().bin_id == 1) {
              this.menuData = res.body.Data[2][0];
            } else {
              this.menuData = res.body.Data[0];
            }
            this.loading = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: "请求错误",
              offset: 100
            });
            return false;
          }
        }
      );
      this.menuLoading = false;

      // })
    },
    // 角色选择改变监听
    handleRoleSelectChange(val) {
      if (val == null || val.val == null) {
        return;
      }
      this.selectStaff = val.val;
      this.selectName = this.selectStaff.name;
      this.post(
        "PubInterface/User/QueryUserMenuDetail",
        { mer_id: this.selectStaff.mer_id },
        res => {
          if (res.body.Status == 0) {
            this.currentRoleMenus = res.body.Data;
            console.log(this.currentRoleMenus)
            console.log(this.$refs.menuTree)
            this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
            this.loading = false;
          } else if (res.body.Status == 30) {
            this.$message({
              
              message: "该店铺暂无任何菜单权限",
              type: "warning"
            });
            this.currentRoleMenus = [];
            this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
          } else {
            this.$notify.error({
              title: "提示",
              message: "请选择菜单权限",
              offset: 100
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
        let parent_id = data.parent_id;
        this.$refs.menuTree.setChecked(parent_id, true, false);
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
      let mer_id = this.selectStaff.mer_id;
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
        "PubInterface/User/UpdateUserMenu",
        { mer_id: mer_id, MenuIDs: ids },
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
    getShopName() {
      this.post("CarServer/Store/QuerynameSelect", {}, res => {
        if (res.body.Status == 0) {
          this.shopNameList = res.body.Data;
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
    getShopFirst() {
      this.post("CarServer/Store/QueryRoleSelect", {}, res => {
        if (res.body.Status == 0) {
          var data = res.body.Data;
          for (var i = 0; i < data.length; i++) {
            if (data[i].sm == "员工") {
              this.myFirst = data[i].id;
            }
          }
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
    },
    teamAll(parameter) {
      this.post("CarServer/Team/QueryTeamList", parameter, res => {
        if (res.body.Status == 0) {
          this.teamList = res.body.Data.Rows;
        } else if (res.body.Status == -1) {
          _this.$notify.error({
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
    }
  },
  mounted() {
    this.getShopName();
    this.getShopFirst();
    if (this.getUserInfo().bin_id != 1) {
      this.teamAll({ p_id: this.getUserInfo().mer_id });
    }
  },
  computed: {
    p_id() {
      return this.dataForm.p_id;
    }
  },
  watch: {
    p_id(now, old) {
      this.teamAll({ p_id: now });
    }
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
  margin-top: 20px;
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
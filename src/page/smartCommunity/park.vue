
<template>
  <div>
    <el-row class="containt">
      <el-row>
        <el-form
          class="filterBlock"
          :inline="true"
          :gutter="20"
        >
          <el-row class="filterContent">
            <el-form-item label="停车场">
              <el-input
                v-model.trim="parameter.name"
                size="medium"
                clearable
                placeholder="请输入停车场"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="medium"
                type="primary"
                @click="filter"
              >
                筛选
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                size="medium"
                type="primary"
                @click="handleAdd"
              >
                新增
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="tableList"
            tooltip-effect="dark"
            stripe
            @current-change="handleRoleSelectChange"
          >
            <el-table-column
              v-for="column in columns"
              header-align="center"
              align="center"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :min-width="column.minWidth"
              :fixed="column.fixed"
              :key="column.prop"
              :type="column.type"
              :formatter="column.change"
              @handleCurrentChange="handleRoleSelectChange"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="280"
              fixed="right"
            >
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row.ID)">详情</el-button> -->
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.mer_id)"
                >删除</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="resPassword(scope.$index, scope.row.mer_id)"
                >重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="pageSize"
            layout="total,prev, pager, next, jumper"
            :total='totalCount'
            style="margin-top:15px;"
          >
          </el-pagination>
          <!-- </el-tab-pane> -->
          <!-- </el-tabs> -->
        </el-col>

        <!--新增编辑界面-->
        <el-dialog
          :title="operation?'新增':'编辑'"
          width="40%"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
        >
          <el-form
            :model="dataForm"
            label-width="120px"
            :rules="dataFormRules"
            ref="dataForm"
            label-position="right"
          >
            <el-form-item
              label="停车场名称"
              prop="park_name"
            >
              <el-input
                v-model="dataForm.park_name"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="社区名称"
              prop="park_name"
            >
              <el-input
                v-model="dataForm.sqmc"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="社区说明"
              prop="park_name"
            >
              <el-input
                v-model="dataForm.sqsm"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="]物业费金额（每平米的单价）"
              prop="park_name"
            >
              <el-input
                v-model="dataForm.wAmount"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label=" 法人姓名"
              prop="user_name"
              v-if="operation"
            >
              <el-input
                v-model="dataForm.user_name"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label=" 法人手机"
              prop="mobile"
              v-if="operation"
            >
              <el-input
                v-model="dataForm.mobile"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="选择省市县">
              <el-cascader
                size="large"
                :options="options"
                v-model="selectedOptions"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item
              label="详细地址"
              prop="add_detail"
            >
              <el-input
                v-model="dataForm.add_detail"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click.native="submitForm"
            >提交</el-button>
          </div>
        </el-dialog>
        <!--角色菜单，表格树内容栏-->
        <div class="menu-container">
          <div class="menu-header">
            <span><B>{{selectName}} 菜单授权</B></span>
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
          >
          </el-tree>
          <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
            <el-checkbox
              v-model="checkAll"
              @change="handleCheckAll"
            ><b>全选</b></el-checkbox>
          </div>
          <div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
            <!-- <kt-button label="重置" type="primary" @click="resetSelection" /> -->
            <!-- :loading="authLoading" -->
            <kt-button
              label="提交"
              type="primary"
              @click="submitAuthForm"
            />
          </div>
        </div>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import KtButton from "@/components/KtButton";
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
export default {
  name: "smartCommunity_park",
  components: {
    KtButton
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
      dialogImageUrl: "",
      baseImgPath: "http://192.168.0.201:8099/FS/",
      dialogVisible: false,
      options: regionDataPlus,
      selectedOptions: [],
      selectName: "",
      value: "",
      myFirst: "",
      activeTag: "first",
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      checkAll: false,
      dialogFormVisible: false,
      tableList: [],
      menuData: [],
      defaultProps: {
        children: "Children",
        label: "Name"
      },
      totalCount: 20,
      currentPage: 1,
      dialogTableVisible: false,
      dialogVisible: false, // 新增编辑界面是否显示
      dialogFormVisible: false,
      operation: false, // true:新增, false:编辑
      parameter: {
        WToken: this.getToken(),
        name:"",
        Keys: "",
        N: 1,
        Rows: 8
      },
      imageUrl: "",
      pageSize: 8,
      pageNum: "",
      allUser: "",
      nowList: "",
      dataFormRules: {
        mer_id: [
          {
            required: true,
            message: "必须选择法人，才能创建停车场",
            trigger: "change"
          }
        ],
        mobile: [
          {
            required: true,
            trigger: "blur",
            validator: validPhone
          }
        ],
        user_name: [
          {
            required: true,
            message: "必须输入法人",
            trigger: "blur"
          }
        ],
        park_name: [
          {
            required: true,
            message: "必须输入停车厂名称",
            trigger: "blur"
          }
        ]
      },
      dataForm: {
        WToken: this.getToken(),
        bin_id: 4,
        role_id: this.myFirst,
        user_name: "",
        park_name: "",
        mobile: "",
        province: "",
        city: "",
        county: "",
        add_detail: "",
        sqmc:'',
        sqsm:'',
        wAmount:''
      },
      columns: [
        { prop: "park_name", label: "停车场名称", minWidth: 150 },
        { prop: "user_name", label: "法人姓名", minWidth: 120 },
        { prop: "mobile", label: "法人手机号", minWidth: 120 },
        { prop: "province", label: "所在省", minWidth: 80 },
        { prop: "city", label: "所在市", minWidth: 80 },
        { prop: "county", label: "所在县(区)", minWidth: 100 },
        { prop: "add_detail", label: "详细地址", minWidth: 160 },
        // { prop: "debit_bank", label: "结算卡开户行", minWidth: 160 },
        // { prop: "debit_card", label: "结算卡号", minWidth: 120 },
        // { prop: "ss_bank_num", label: "联行号", minWidth: 120 },
        {
          prop: "addtime",
          label: "创建日期",
          minWidth: 180
        }
      ]
      // filtersData: [
      //   {
      //     type:'text', label:"姓名",model:this.parameter.Keys
      //   }
      // ]
    };
  },
  created() {
    this.getShopFirst();
  },
  mounted() {
    var _this = this;
    _this.parameter.Rows = _this.pageSize;
    _this.parameter.WToken = _this.token;
    _this.GetList(_this.parameter);
    _this.findTreeData();
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(tab, event) {
      //分页
      console.log(tab, event);
    },
    handleSizeChange(val) {
      this.parameter.Rows = val;
      this.GetList(this.parameter);
    },
    handleCurrentChange(val) {
      this.parameter.N = val;
      this.GetList(this.parameter);
    },
    GetList(parameter) {
      var _this = this;
      // if (this.addtime !== "" && this.addtime !== null) {
      //   this.parameter.addtime =
      //     "'" + this.addtime[0] + "'_'" + this.addtime[1] + "'";
      // } else {
      //   this.parameter.addtime = "";
      // }
      this.api(
        "NoSense/CommunityPark/QueryParkList",
        parameter,
        res => {
          this.tableList = res.Data.Rows;
          this.totalCount = parseInt(res.Data.Count);
        }
      );
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        bin_id: 4,
        role_id: this.myFirst,
        user_name: "",
        mobile: "",
        park_name: "",
        province: "",
        city: "",
        county: "",
        add_detail: ""
        // creater: "",
        // cus_license: "",
        // debit_bank: "",
        // debit_card: "",
        // ss_bank_num: ""
      };
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if (this.operation) {
              api = "http://192.168.0.86:81/NoSense/Park/AddPark";
            } else {
              api = "http://192.168.0.86:81/NoSense/Park/UpdatePark";
            }
            if (this.selectedOptions[0]) {
              this.dataForm.province = CodeToText[this.selectedOptions[0]];
            }
            if (this.selectedOptions[1]) {
              this.dataForm.city = CodeToText[this.selectedOptions[1]];
            }
            if (this.selectedOptions[2]) {
              this.dataForm.county = CodeToText[this.selectedOptions[2]];
            }

            let params = Object.assign({}, this.dataForm);
            this.api(api, params, res => {
              this.$message({ message: "操作成功", type: "success" });
              this.dialogVisible = false;
              this.$refs["dataForm"].resetFields();
              (this.parameter = {
                // WToken: ""
                Keys: "",
                N: 1,
                Rows: 8
              }),
                this.GetList(this.parameter);
            });
          });
        }
      });
    },
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.isAdd = false;
      this.dataForm = {
        mer_id: params.mer_id,
        user_name: params.user_name,
        mobile: params.mobile,
        park_name: params.park_name,
        province: params.province,
        city: params.city,
        county: params.county,
        add_detail: params.add_detail
      };
      if (params.province) {
        this.selectedOptions[0] = TextToCode[params.province].code;
      }
      if (params.city) {
        this.selectedOptions[1] = TextToCode[params.province][params.city].code;
      }
      if (params.county) {
        this.selectedOptions[2] =
          TextToCode[params.province][params.city][params.county].code;
      }
    },
    // 删除
    handleDelete(row) {
      console.log(row.mer_id);
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.Delete(
          "http://192.168.0.86:81/ b CommunityPark/DelCommunityPark",
          { mer_id: row },
          this.GetList
        );
      });
    },
    filter() {
      var _this = this;
      _this.GetList(_this.parameter);
    },
    resetting() {
      this.parameter = {};
      this.parameter.Rows = this.pageSize;
      this.parameter.WToken = this.token;
      this.GetList(this.parameter);
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    resPassword(row) {
      this.$confirm("确认重置密码吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post("PubInterface/User/ResetPwdAdmin", { mer_id: row }, res => {
          if (res.body.Status == 0) {
            this.$message({ message: "重置密码成功", type: "success" });
            this.parameter.N = 1;
            this.GetList(this.parameter);
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
    // 获取数据
    findTreeData: function() {
      this.menuLoading = true;
      var api;
      if (this.getUserInfo().bin_id == 1) {
        api = "PubInterface/UserMenu/QueryUserMenu";
      } else {
        api = "PubInterface/User/QueryUserMenuList";
      }
      this.api(api, { mer_id: this.getUserInfo().mer_id }, res => {
        if (this.getUserInfo().bin_id == 1) {
          this.menuData = this.tableTreeDdata = res.Data[4][0];
        } else {
          this.menuData = res.Data.Rows;
        }
      });
      this.menuLoading = false;

      // })
    },
    // 角色选择改变监听
    handleRoleSelectChange(val) {
      if (val == null) {
        return;
      }
      this.selectStaff = val;
      this.selectName = this.selectStaff.park_name;
      this.post(
        "PubInterface/User/QueryUserMenuDetail",
        { mer_id: this.selectStaff.mer_id },
        res => {
          if (res.body.Status == 0) {
            this.currentRoleMenus = res.body.Data;
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
              message: "该店铺暂无任何菜单权限",
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
      // if ("admin" == this.selectRole.Name) {
      //   this.$message({
      //     message: "超级管理员拥有所有菜单权限，不允许修改！",
      //     type: "error"
      //   });
      //   return;
      // }
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
    getShopFirst() {
      this.post("PubInterface/Role/QueryRoleList", { plate_id: 4 }, res => {
        if (res.body.Status == 0) {
          var data = res.body.Data.Rows;
          for (var i = 0; i < data.length; i++) {
            if (data[i].sm == "超管") {
              this.myFirst = data[i].id;
              this.myFirst = 22;
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
    }
  }
};
</script>
<style lang="less">
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
  // font-size: 20px;
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
.el-pagination {
  float: right;
}
.el-dialog__header {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<template>
  <div>
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-row>
        <el-form class="filterBlock" :inline="true" :gutter="20">
          <el-row class="filterContent">
            <el-form-item label="选择分销商" v-if="this.getUserInfo().bin_id == 1">
              <el-select placeholder="选择分销商" size="medium"  v-model="parameter.ID">
                <el-option label="总平台" value="-1"></el-option>
                <el-option label="picc" value="52"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="移车码编号">
              <el-input v-model.trim="parameter.CallCode" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="是否激活">
              <el-select v-model="parameter.IsActive" placeholder="是否激活" size="medium">
                <el-option label="全部" value="-1"></el-option>
                <el-option label="未激活" value="0"></el-option>
                <el-option label="已激活" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择运营商">
              <el-select v-model="parameter.service_provider" placeholder="选择运营商" size="medium">
                <el-option label="全部" value=""></el-option>
                <el-option label="中国移动" value="中国移动"></el-option>
                <el-option label="中国联通" value="中国联通"></el-option>
                <el-option label="中国电信" value="中国电信"></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="激活时间">
              <el-date-picker class="form-control" size="medium" type="daterange" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" arrow-control v-model="addtime" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item> -->
              <el-button size="medium" type="primary" @click="filter">
                筛选
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- <el-tabs v-model="activeTag" type="card" @tab-click="handleClick"> -->
          <el-table ref="multipleTable" border :data="tableList" tooltip-effect="dark" stripe style="width: 100%" size="medium" @selection-change="handleSelectionChange">
            <el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.change">
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="this.parameter.Rows" layout="total,prev, pager, next, jumper" :total='totalCount' style="margin-top:15px;">
          </el-pagination>
          <!-- </el-tab-pane> -->
          <!-- </el-tabs> -->
        </el-col>

      </el-row>
    </el-row>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb";
import { isvalidPhone } from "../../../static/validate";
export default {
  name: "piccPart_allScanned",
  components: {},
  data() {
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      selectedOptions: [],
      value: "",
      activeTag: "first",
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      addtime: "",
      tableList: [],
      totalCount: "",
      currentPage: 1,
      parameter: {
        WToken: "HVgwl2gnoT5OH1tplmVWAj154232903710",
        ID:'',
        BatchNum:'',
        Keys: "",
        Mobile: "",
        CallCode: "",
        ActiveTime: "",
        service_provider: "",
        AddTime: "",
        IsActive: "1",
        N: 1,
        Rows: 8
      },
      pageSize: 8,
      pageNum: "",
      nowList: "",
      dataForm: {
        bin_id: 1,
        role_id: 1,
        name: "",
        mobile: ""
      },
      columns: [
        { prop: "CallCode", label: "移车码编号", minWidth: 80 },
        {
          prop: "ActiveTime",
          label: "激活时间",
          minWidth: 80,
          change: this.formatterColumn
        },
        { prop: "Mobile", label: "手机号", minWidth: 60 },
        { prop: "CarNum", label: "车牌号", minWidth: 80 },
        { prop: "service_provider", label: "运营商", minWidth: 80 }
      ]
    };
  },
  mounted() {
    var _this = this;
    // _this.parameter.Rows = _this.pageSize;
    // _this.parameter.WToken = _this.token;
    if (this.getUserInfo().bin_id == 1) {
      this.parameter.ID = "-1";
    } else {
      THIS.parameter.ID = "52";
    }
    _this.GetList(_this.parameter);
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
    formatterColumn(row, column) {
      if (row.ActiveTime != "" && row.ActiveTime != null) {
        return row.ActiveTime;
      } else {
        return "暂未激活";
      }
    },
    GetList(parameter) {
      var _this = this;
      console.log(parameter);
      //   if (this.addtime !== "" && this.addtime !== null) {
      //     this.parameter.addtime =
      //       "'" + this.addtime[0] + "'_'" + this.addtime[1] + "'";
      //   } else {
      //     this.parameter.addtime = "";
      //   }
      this.post("QrMobile/MyCallCodeMng/QueryMyAllScanned", parameter, res => {
        if (res.body.Status == 0) {
          this.tableList = res.body.Data.Rows;
          this.totalCount = parseInt(res.body.Data.Count);
        } else if (res.body.Status == -1) {
          _this.$notify.error({
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
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if (this.dataForm.mer_id) {
              api = "User/UpdateUser";
            } else {
              api = "User/AddUser";
            }
            let params = Object.assign({}, this.dataForm);
            this.post(api, params, res => {
              if (res.body.Status == 0) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                (this.parameter = {
                  // WToken: "",
                  bin_id: 1,
                  role_id: 1,
                  name: "",
                  mobile: "",
                  addtime: "",
                  N: 1,
                  Rows: 8
                }),
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
        }
      });
    },
    filter() {
      var _this = this;
      console.log(_this.parameter);
      _this.GetList(_this.parameter);
    },
    resetting() {
      this.parameter = {};
      this.parameter.Rows = this.pageSize;
      this.parameter.WToken = this.token;
      this.GetList(this.parameter);
    }
  }
};
</script>
<style lang="less">
.containt {
  padding: 20px;
  padding-top: 0;
  // margin-top: 20px;
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
</style>
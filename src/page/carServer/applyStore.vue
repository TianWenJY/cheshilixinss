
<template>
  <div style="margin-top: 20px;">
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-row>
        <el-form
          class="filterBlock"
          :inline="true"
          :gutter="20"
        >
          <el-row class="filterContent">
            <el-form-item label="申请状态">
              <el-select
                v-model="parameter.status"
                placeholder="申请状态"
                size="medium"
              >
                <el-option
                  label="全部"
                  :value="-1"
                ></el-option>
                <el-option
                  label="待审核"
                  :value="0"
                ></el-option>
                <el-option
                  label="待电话沟通"
                  :value="1"
                ></el-option>
                <el-option
                  label="未通过"
                  :value="2"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="申请人姓名">
              <el-input v-model.trim="parameter.name" size="medium" clearable></el-input>
            </el-form-item> -->
            <el-form-item label="申请手机号">
              <el-input
                v-model.trim="parameter.mobile"
                size="medium"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="申请时间">
              <el-date-picker
                class="form-control"
                size="medium"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                arrow-control
                v-model="addtime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
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
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- <el-tabs v-model="activeTag" type="card" @tab-click="handleClick"> -->
          <el-table
            ref="multipleTable"
            border
            :data="tableList"
            tooltip-effect="dark"
            style="width: 100%"
            size="medium"
            @selection-change="handleSelectionChange"
          >

            <el-table-column
              prop="name"
              label="申请人姓名"
            >
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="申请手机号"
              width="130"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="审核状态"
              min-width="120px;"
              :formatter="formatterColumn"
            >
            </el-table-column>
            <el-table-column
              prop="province"
              label="省"
            >
            </el-table-column>
            <el-table-column
              prop="city"
              label="市"
            >
            </el-table-column>
            <el-table-column
              prop="county"
              label="县（区）"
            >
            </el-table-column>
            <el-table-column
              prop="sname"
              label="门店名称"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="门店地址"
            >
            </el-table-column>
            <el-table-column
              prop="addtime"
              label="申请时间"
              min-width="140px;"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleApply(scope.row.id,scope.row.status)"
                >审核</el-button>
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
        <el-dialog
          title="审核"
          width="40%"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
        >
          <el-form
            label-width="80px"
            :model="dataForm"
            :rules="dataFormRules"
            ref="dataForm"
          >
            <el-form-item
              label="审核状态"
              prop="status"
            >
              <el-select
                v-model="dataForm.status"
                placeholder="请选择审核状态"
              >
                <el-option
                  label="待电话沟通"
                  value="1"
                ></el-option>
                <el-option
                  label="未通过"
                  value="2"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              @click.native="dialogFormVisible = false"
              size="small"
            >取消</el-button>
            <el-button
              type="primary"
              @click.native="submitForm"
              size="small"
            >提交</el-button>
          </div>
        </el-dialog>
      </el-row>
    </el-row>
  </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb";
export default {
  name: "carServer_applystore",
  components: {
    // breadCrumb
  },
  data() {
    return {
      activeTag: "first",
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      dialogFormVisible: false,
      tableList: [],
      formLabelWidth: "120px",
      totalCount: 20,
      addtime: "",
      currentPage: 1,
      dialogTableVisible: false,
      dialogFormVisible: false,
      operation: false, // true:新增, false:编辑
      parameter: {
        WToken: "",
        id: "",
        status: -1,
        name: "",
        mobile: "",
        province: "",
        city: "",
        county: "",
        sname: "",
        address: "",
        addtime: "",
        N: "",
        Rows: ""
      },
      pageSize: 8,
      pageNum: "",
      nowList: "",
      dataFormRules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ]
      },
      dataForm: {
        id: "",
        status: ""
      }
    };
  },
  mounted() {
    var _this = this;
    _this.parameter.Rows = _this.pageSize;
    _this.parameter.WToken = _this.token;
    _this.GetList(_this.parameter);
  },
  methods: {
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
      switch (row.status) {
        case "0":
          return "待审核";
          break;
        case "1":
          return "待电话沟通";
          break;
        case "2":
          return "未通过";
          break;
        default:
          return "未知";
      }
    },
    GetList(parameter) {
      if (this.addtime !== "" && this.addtime !== null) {
        this.parameter.addtime =
          "'" + this.addtime[0] + "'_'" + this.addtime[1] + "'";
      } else {
        this.parameter.addtime = "";
      }
      this.post("CarServer/ApplyStore/ApplyStoreLists", parameter, res => {
        if (res.body.Status == 0) {
          this.tableList = res.body.Data.Rows;
          this.totalCount = parseInt(res.body.Data.Count);
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
          return false;
        }
      });
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            this.post(
              "CarServer/ApplyStore/UpdateStatus",
              this.dataForm,
              res => {
                if (res.body.Status == 0) {
                  this.$message({ message: "操作成功", type: "success" });
                  this.dialogFormVisible = false;
                  this.$refs["dataForm"].resetFields();
                  (this.parameter = {
                    WToken: "",
                    id: "",
                    status: -1,
                    name: "",
                    mobile: "",
                    province: "",
                    city: "",
                    county: "",
                    sname: "",
                    address: "",
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
              }
            );
          });
        }
      });
    },
    handleApply(row, status) {
      this.dialogFormVisible = true;
      this.dataForm.id = row;
      this.dataForm.status = status;
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
    padding: 25px 20px 3px 20px;
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
.filterBlock .el-form-item__label {
  top: 210px;
  color: rgba(0, 0, 0, 1);
  font-size: 16px;
  text-align: right;
  font-family: PingFangSC-Regular;
}
</style>

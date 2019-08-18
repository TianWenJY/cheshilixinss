<template>
  <div>
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-row>
        <el-form class="filterBlock" :inline="true" :gutter="20">
          <el-row class="filterContent">
            <el-form-item label="所属门店" v-if="this.getUserInfo().bin_id == 1">
              <el-select placeholder="选择所属门店" size="medium" v-model="parameter.p_id">
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(shop,index) in shopNameList"
                  :label='shop.name'
                  :value="shop.mer_id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目详细类型">
              <el-input v-model.trim="parameter.xmlx" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="车型">
              <el-input v-model.trim="parameter.cx" size="medium" clearable></el-input>
            </el-form-item>

            <!-- <el-form-item label="申请时间">
              <el-date-picker class="form-control" size="medium" type="daterange" range-separator="至" value-format="timestamp" arrow-control v-model="parameter.AddTime" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>-->
            <el-form-item>
              <el-button size="medium" type="primary" @click="filter">筛选</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="handleAdd">新增</el-button>
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
            stripe
            style="width: 100%"
            size="medium"
            @selection-change="handleSelectionChange"
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
            ></el-table-column>
            <el-table-column label="操作" width="320">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row.ID)">详情</el-button> -->
                <el-button size="mini" type="danger" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.parameter.N"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="this.parameter.Rows"
            layout="total,prev, pager, next, jumper"
            :total="totalCount"
            style="margin-top:15px;"
          ></el-pagination>
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
            <el-form-item label="所属门店" v-if="this.getUserInfo().bin_id == 1 && operation">
              <el-select placeholder="选择所属门店" size="medium" v-model="dataForm.p_id">
                <el-option
                  v-for="(shop,index) in shopNameList"
                  :label='shop.name'
                  :value="shop.mer_id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属大类型">
              <el-select placeholder="选择所属大类型" size="medium" v-model="dataForm.lx_id">
                <el-option
                  v-for="(serverType,index) in serverTypeProject"
                  :label="serverType.lx"
                  :value="serverType.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目详细类型" prop="name">
              <el-input v-model="dataForm.xmlx" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="车型" prop="name">
              <el-input v-model="dataForm.cx" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="座位数" prop="name">
              <el-input v-model="dataForm.zws" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="单价（元）" prop="name">
              <el-input v-model="dataForm.dj" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="工时" prop="name">
              <el-input v-model="dataForm.gs" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="服务内容简述">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="dataForm.sm"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="submitForm">提交</el-button>
          </div>
        </el-dialog>
      </el-row>
    </el-row>
  </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb";
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
export default {
  name: "carServer_serverList",
  components: {
    // breadCrumb
  },
  data() {
    return {
      dialogImageUrl: "",
      baseImgPath: this.url + "FS/",
      dialogVisible: false,
      options: regionDataPlus,
      selectedOptions: [],
      value: "",
      activeTag: "first",
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      dialogFormVisible: false,
      tableList: [],
      totalCount: 20,
      currentPage: 1,
      serverTypeProject: [],
      dialogTableVisible: false,
      dialogVisible: false, // 新增编辑界面是否显示
      dialogFormVisible: false,
      shopNameList: [],
      operation: false, // true:新增, false:编辑
      parameter: {
        WToken: this.getToken(),
        xmlx: "",
        p_id: this.getUserInfo().bin_id == 1 ? "-1" : this.getUserInfo().mer_id,
        cx: "",
        zws: "",
        gs: "",
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
            message: "必须选择店长，才能创建门店",
            trigger: "change"
          }
        ],
        Img: [
          {
            required: true,
            message: "必须提交营业执照",
            trigger: "change"
          }
        ]
      },
      dataForm: {
        WToken: this.getToken(),
        bzmc: "",
        bzsm: ""
      },
      columns: [
        { prop: "lx", label: "所属大类别", minWidth: 120 },
        { prop: "xmlx", label: "项目详细类型", minWidth: 120 },
        { prop: "cx", label: "车型", minWidth: 100 },
        { prop: "zws", label: "座位数", minWidth: 100 },
        { prop: "dj", label: "单价（元）", minWidth: 100 },
        { prop: "gs", label: "工时", minWidth: 100 },
        { prop: "sm", label: "服务说明", minWidth: 250 }
      ]
    };
  },
  mounted() {
    var _this = this;
    _this.parameter.Rows = _this.pageSize;
    _this.getPlate();
    _this.parameter.WToken = _this.token;
    _this.GetList(_this.parameter);
    this.getShopName();
    _this.getServerTypeList();
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
      this.post(
        "CarServer/ServerProject/QueryServerProjectList",
        parameter,
        res => {
          if (res.body.Status == 0) {
            this.tableList = res.body.Data.Rows;
            this.totalCount = parseInt(res.body.Data.Count);
          } else {
            this.$message({
              message: "操作失败, " + res.body.Data,
              type: "error"
            });
          }
        }
      );
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        lx_id: "",
        xmlx: "",
        cx: "",
        zws: "",
        dj: "",
        gs: "",
        sm: "",
        p_id: this.getUserInfo().bin_id == 1 ? "-1" : this.getUserInfo().mer_id
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
              api = "CarServer/ServerProject/AddProject";
            } else {
              api = "CarServer/ServerProject/UpdateProject";
            }
            let params = Object.assign({}, this.dataForm);

            this.post(api, params, res => {
              if (res.body.Status == 0) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                this.parameter = {
                  WToken: this.getToken(),
                  xmlx: "",
                  p_id:
                    this.getUserInfo().bin_id == 1
                      ? "-1"
                      : this.getUserInfo().mer_id,
                  cx: "",
                  zws: "",
                  gs: "",
                  N: 1,
                  Rows: 8
                };
                this.GetList(this.parameter);
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
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.isAdd = false;
      this.dataForm = {
        id: params.id,
        lx_id: params.lx_id,
        xmlx: params.xmlx,
        cx: params.cx,
        zws: params.zws,
        dj: params.dj,
        gs: params.gs,
        sm: params.sm,
        p_id: params.p_id
      };
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post("CarServer/ServerProject/DelProject", { id: row }, res => {
          if (res.body.Status == 0) {
            this.$message({ message: "删除成功", type: "success" });
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
    getPlate() {
      this.post("PubInterface/User/QueryUserSelect", {}, res => {
        if (res.body.Status == 0) {
          this.allUser = res.body.Data;
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
    getServerTypeList() {
      this.post(
        "CarServer/ServerProject/QueryServerProjectTypeList",
        {
          p_id:
            this.getUserInfo().bin_id == 1 ? "-1" : this.getUserInfo().mer_id
        },
        res => {
          if (res.body.Status == 0) {
            this.serverTypeProject = res.body.Data.Rows;
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
        }
      );
    },
    isType(row) {
      switch (row.type) {
        case "1":
          return "储值卡";
          break;
        case "2":
          return "套餐卡";
          break;
        default:
          return "";
          break;
      }
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
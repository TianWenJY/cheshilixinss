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
            <el-form-item label="结算方式">
              <el-select placeholder="选择结算方式" size="medium" v-model="parameter.jsfs">
                <el-option label="全部" value="-1"></el-option>
                <el-option label="现金" value="1"></el-option>
                <el-option label="扫码" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算状态">
              <el-select placeholder="选择结算状态" size="medium" v-model="parameter.jszt">
                <el-option label="全部" value="-1"></el-option>
                <el-option label="未完工" value="1"></el-option>
                <el-option label="已完工" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="完工状态">
              <el-select placeholder="选择完工状态" size="medium" v-model="parameter.wgzt">
                <el-option label="全部" value="-1"></el-option>
                <el-option label="现金" value="1"></el-option>
                <el-option label="扫码" value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="申请时间">
              <el-date-picker class="form-control" size="medium" type="daterange" range-separator="至" value-format="timestamp" arrow-control v-model="parameter.AddTime" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>-->
            <el-form-item>
              <el-button size="medium" type="primary" @click="filter">筛选</el-button>
            </el-form-item>
            <!-- <el-form-item>
                            <el-button size="medium" type="primary" @click="handleAdd">
                                新增
                            </el-button>
            </el-form-item>-->
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
            <el-table-column
              prop="Img"
              label="客户签字"
              min-width="120"
              header-align="center"
              align="center"
            >
              <!-- 图片的显示 -->
              <template slot-scope="scope">
                <img
                  v-if="scope.row.khqz"
                  :src="baseImgPath +scope.row.khqz"
                  min-width="70"
                  height="70"
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleServer(scope.row.id)">客户服务详情</el-button>
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
            :total="totalCount"
            style="margin-top:15px;"
          ></el-pagination>
          <!-- </el-tab-pane> -->
          <!-- </el-tabs> -->
        </el-col>

        <!--新增编辑界面-->
        <el-dialog
          title="客户服务详情"
          width="50%"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
        >
          <el-table :data="gridData">
            <el-table-column property="lx" label="项目类别"></el-table-column>
            <el-table-column property="smlx_id" label="姓名"></el-table-column>
            <el-table-column property="jg" label="价格(元)"></el-table-column>
            <el-table-column property="sl" label="数量"></el-table-column>
            <el-table-column property="zk" label="折扣"></el-table-column>
            <el-table-column property="zt" label="派工状态"></el-table-column>
            <el-table-column property="sg_id" label="施工人员ID"></el-table-column>
          </el-table>
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
  name: "carServer_customerOrder",
  components: {
    // breadCrumb
  },
  data() {
    return {
      dialogImageUrl: "",
      baseImgPath: this.url + "FS/",
      dialogVisible: false,
      baseImgPath: this.url + "FS/",
      carVisible: false,
      imgVisible: false,
      carList: [],
      options: regionDataPlus,
      selectedOptions: [],
      value: "",
      activeTag: "first",
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      gridData: [],
      dialogFormVisible: false,
      tableList: [],
      totalCount: 20,
      currentPage: 1,
      dialogTableVisible: false,
      dialogVisible: false, // 新增编辑界面是否显示
      dialogFormVisible: false,
      shopNameList: [],
      operation: false, // true:新增, false:编辑
      parameter: {
        WToken: this.getToken(),
        jsfs: "-1",
        p_id: this.getUserInfo().bin_id == 1 ? "-1" : this.getUserInfo().mer_id,
        jszt: "-1",
        wgzt: "-1",
        zt: "-1",
        lx: "-1",
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
        // { prop: "ddbh", label: "交易订单编号", minWidth: 100 },
        { prop: "jsfs", label: "结算方式 ", minWidth: 120, change: this.jsfs },
        { prop: "jszt", label: "结算状态 ", minWidth: 120, change: this.jszt },
        { prop: "wgzt", label: "完工状态", minWidth: 120, change: this.wgzt },
        { prop: "xfje", label: "消费金额(元)", minWidth: 120 },
        { prop: "jcsh", label: "预约交车时间", minWidth: 120 },
        { prop: "zt", label: "派工状态", minWidth: 100, change: this.zt },
        {
          prop: "addtime",
          label: "订单生成时间",
          minWidth: 120,
          change: this.zt
        }
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
  },
  methods: {
    jsfs(row) {
      switch (row.jsfs) {
        case "1":
          return "现金";
          break;
        case "2":
          return "扫码";
          break;
        default:
          return "";
          break;
      }
    },
    jszt(row) {
      switch (row.jszt) {
        case "1":
          return "待结算";
          break;
        case "2":
          return "已结算";
          break;
        default:
          return "";
          break;
      }
    },
    wgzt(row) {
      switch (row.wgzt) {
        case "1":
          return "未完工";
          break;
        case "2":
          return "已完工";
          break;
        default:
          return "";
          break;
      }
    },
    zt(row) {
      switch (row.zt) {
        case "1":
          return "未派工";
          break;
        case "2":
          return "施工中";
          break;
        case "3":
          return "施工完毕";
          break;
        default:
          return "";
          break;
      }
    },
    lx(row) {
      switch (row.lx) {
        case "1":
          return "普通项目";
          break;
        case "2":
          return "会员卡内项目";
          break;
        case "3":
          return "施工完毕";
          break;
        default:
          return "";
          break;
      }
    },
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
      this.post("CarServer/Customer/QueryMerOrderList", parameter, res => {
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
          this.$notify.error({
            title: "错误",
            message: "请输入正确的用户名密码",
            offset: 100
          });
          return false;
        }
      });
    },
    handleCarList(row) {
      this.carVisible = true;
      console.log(row);
      this.getCarList({ id: row.user_id });
    },
    handleUserImg(row) {
      this.imgVisible = true;
    },
    //车辆信息列表
    getCarList(id) {
      var _this = this;
      this.post("CarServer/Customer/QueryMerCarDetail", id, res => {
        if (res.body.Status == 0) {
          this.carList = res.body.Data;
          console.log(this.carList);
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
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        mer_id: "",
        type: "",
        name: "",
        amount: "",
        number: "",
        expiration_date: "",
        Img: ""
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
              api = "CarServer/Team/AddTeam";
            } else {
              api = "CarServer/Team/UpdateTeam";
            }
            let params = Object.assign({}, this.dataForm);

            this.post(api, params, res => {
              if (res.body.Status == 0) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                this.parameter = {
                  WToken: this.getToken(),
                  bzmc: "",
                  N: 1,
                  Rows: 8
                };
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
    handleServer: function(id) {
      this.dialogVisible = true;
      this.post(
        "CarServer/Customer/QueryMerOrderDetailList",
        { dd_id: id },
        res => {
          if (res.body.Status == 0) {
            this.gridData = res.body.Data.Rows;
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
        }
      );
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post("CarServer/Team/DelTeam", { id: row }, res => {
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
      _this.parameter.N = 1;
      _this.parameter.Rows = 1;
      _this.GetList(_this.parameter);
    },
    resetting() {
      this.parameter = {};
      this.parameter.Rows = this.pageSize;
      this.parameter.WToken = this.token;
      this.GetList(this.parameter);
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(
      //   "http://192.168.0.201:8099/FS/CarServer/CusLicense/C-FkaJNCrkRtMvEB.png"
      // );
    },
    handleBusinessAvatarScucess(res, file) {
      if (res.Status == 0) {
        this.dataForm.Img = res.Data;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isRightType) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isRightType && isLt2M;
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

.img {
  width: 200px;
  height: 200px;
  display: inline-block;
  margin-right: 20px;
}
</style>
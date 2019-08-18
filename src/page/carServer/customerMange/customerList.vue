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
                  :label="shop.name"
                  :value="shop.mer_id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model.trim="parameter.xm" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model.trim="parameter.sj" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="车牌号">
              <el-input v-model.trim="parameter.cp" size="medium" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="申请时间">
              <el-date-picker class="form-control" size="medium" type="daterange" range-separator="至" value-format="timestamp" arrow-control v-model="parameter.AddTime" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>-->
            <el-form-item>
              <el-button size="medium" type="primary" @click="filter">筛选</el-button>
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
            <el-table-column label="操作" width="250" fixed="right">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row.ID)">详情</el-button> -->
                <!-- <el-button size="mini" type="danger" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>-->
                <el-button size="mini" type="danger" @click="handleUserImg(scope.row)">客户图像</el-button>
                <el-button size="mini" type="danger" @click="handleCarList(scope.row)">客户车辆信息</el-button>
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
            <el-form-item label="卡种名称" prop="name">
              <el-input v-model="dataForm.bzmc" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="卡总金额(元)">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="dataForm.bzsm"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="submitForm">提交</el-button>
          </div>
        </el-dialog>

        <!--客户车辆信息界面-->
        <el-dialog
          title="客户车辆详情"
          width="50%"
          :visible.sync="carVisible"
          :close-on-click-modal="false"
        >
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="车牌">
              <span>{{ carList.cp }}</span>
            </el-form-item>
            <el-form-item label="车型">
              <span>{{ carList.cx }}</span>
            </el-form-item>
            <el-form-item label="持有人">
              <span>{{ carList.cyr }}</span>
            </el-form-item>
            <el-form-item label="本次保养">
              <span>{{ carList.bcby }}</span>
            </el-form-item>
            <el-form-item label="下次保养">
              <span>{{ carList.xcby }}</span>
            </el-form-item>
            <el-form-item label="行驶证">
              <span>{{ carList.xsz }}</span>
            </el-form-item>
            <el-form-item label="车架号">
              <span>{{ carList.cjh }}</span>
            </el-form-item>
            <el-form-item label="发动机型">
              <span>{{ carList.fdj }}</span>
            </el-form-item>
            <el-form-item label="购车时间">
              <span>{{ carList.gcsj }}</span>
            </el-form-item>
            <el-form-item label="保险公司">
              <span>{{ carList.bxgs }}</span>
            </el-form-item>
            <el-form-item label="保险到期">
              <span>{{ carList.bxdq }}</span>
            </el-form-item>
            <el-form-item label="排量">
              <span>{{ carList.pl }}</span>
            </el-form-item>
            <el-form-item label="车价">
              <span>{{ carList.cj }}万</span>
            </el-form-item>
            <el-form-item label="颜色">
              <span>{{ carList.ys }}</span>
            </el-form-item>
            <el-form-item label="发动机号">
              <span>{{ carList.fdjh }}</span>
            </el-form-item>
            <el-form-item label="厂牌型号">
              <span>{{ carList.cpxh }}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span>{{ carList.addtime }}</span>
            </el-form-item>
          </el-form>
          <el-col style="width: 95%;overflow:auto;display: flex;">
            <img :src="baseImgPath+ carList.tp1" alt class="img" v-if="carList.tp1">
            <img :src="baseImgPath+ carList.tp2" alt class="img" v-if="carList.tp2">
            <img :src="baseImgPath+ carList.tp3" alt class="img" v-if="carList.tp3">
            <img :src="baseImgPath+ carList.tp4" alt class="img" v-if="carList.tp4">
            <img :src="baseImgPath+ carList.tp5" alt class="img" v-if="carList.tp5">
            <img :src="baseImgPath+ carList.tp6" alt class="img" v-if="carList.tp6">
            <img :src="baseImgPath+ carList.tp7" alt class="img" v-if="carList.tp7">
            <img :src="baseImgPath+ carList.tp8" alt class="img" v-if="carList.tp8">
            <img :src="baseImgPath+ carList.tp9" alt class="img" v-if="carList.tp9">
            <img :src="baseImgPath+ carList.tp10" alt class="img" v-if="carList.tp10">
          </el-col>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="carVisible = false">关闭</el-button>
          </div>
        </el-dialog>

        <!--客户车辆信息界面-->
        <el-dialog
          title="客户图片详情"
          width="40%"
          :visible.sync="imgVisible"
          :close-on-click-modal="false"
        >
          <el-col style="width: 95%;overflow:auto; height: 250px;display: flex;">
            <img :src="baseImgPath+ carList.tp1" alt class="img" v-if="carList.zp1">
            <img :src="baseImgPath+ carList.tp2" alt class="img" v-if="carList.zp2">
            <img :src="baseImgPath+ carList.tp3" alt class="img" v-if="carList.zp3">
            <img :src="baseImgPath+ carList.tp4" alt class="img" v-if="carList.zp4">
            <img :src="baseImgPath+ carList.tp5" alt class="img" v-if="carList.zp5">
            <img :src="baseImgPath+ carList.tp6" alt class="img" v-if="carList.zp6">
            <img :src="baseImgPath+ carList.tp7" alt class="img" v-if="carList.zp7">
            <img :src="baseImgPath+ carList.tp8" alt class="img" v-if="carList.zp8">
            <img :src="baseImgPath+ carList.tp9" alt class="img" v-if="carList.zp9">
            <img :src="baseImgPath+ carList.tp10" alt class="img" v-if="carList.zp10">
          </el-col>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="imgVisible = false">关闭</el-button>
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
  name: "carServer_customerList",
  components: {
    // breadCrumb
  },
  data() {
    return {
      dialogImageUrl: "",
      baseImgPath: "http://192.168.0.86:81/FS/",
      dialogVisible: false,
      baseImgPath: "http://192.168.0.201:8099/FS/",
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
        xm: "",
        p_id: this.getUserInfo().bin_id == 1 ? "-1" : this.getUserInfo().mer_id,
        sj: "",
        cp: "",
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
        { prop: "xm", label: "姓名", minWidth: 120 },
        { prop: "sj", label: "手机号", minWidth: 120 },
        { prop: "cp", label: "车牌号", minWidth: 120 },
        { prop: "wx", label: "微信", minWidth: 120 },
        { prop: "jsz", label: "驾驶证", minWidth: 120 },
        { prop: "khly", label: "客户来源", minWidth: 100 },
        { prop: "khlx", label: "客户类型", minWidth: 100 },
        { prop: "xb", label: "性别", minWidth: 80 },
        { prop: "sr", label: "出生日期", minWidth: 120 },
        { prop: "sfz", label: "身份证", minWidth: 200 },
        { prop: "dz", label: "地址", minWidth: 200 },
        { prop: "debit_card", label: "储蓄卡数", minWidth: 150 },
        { prop: "meal_card", label: "套餐卡数", minWidth: 150 },
        { prop: "dw", label: "单位", minWidth: 200 },
        { prop: "bz", label: "备注", minWidth: 120 }
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
      this.post("CarServer/Customer/QueryMerList", parameter, res => {
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
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.isAdd = false;
      this.dataForm = {
        id: params.id,
        bzmc: params.bzmc,
        bzsm: params.bzsm
      };
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
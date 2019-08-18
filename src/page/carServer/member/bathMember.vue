<template>
    <div>
        <!-- <bread-crumb></bread-crumb> -->
        <el-row class="containt" :gutter="80">
            <el-col :span="11">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding: 24px;    border: 1px solid #ebebeb;border-radius: 3px;transition: .2s;">
                    <el-form-item label="所属门店" v-if="this.getUserInfo().bin_id == 1">
                        <el-select placeholder="选择所属门店" size="medium" v-model="dataForm.p_id">
                            <el-option v-for="(shop,index) in shopNameList"                   :label='shop.name'
                  :value="shop.mer_id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="卡类型">
                        <el-select placeholder="选择卡类型" size="medium" v-model="dataForm.card_type">
                            <el-option v-for="(card,index) in cardAllList" :label='card.name' :value="card.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生成批次">
                        <el-input-number v-model.number="dataForm.batch" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即生成</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <!-- <el-tabs v-model="activeTag" type="card" @tab-click="handleClick"> -->
                <el-table ref="multipleTable" border :data="tableList" tooltip-effect="dark" stripe style="width: 100%" size="medium" @selection-change="handleSelectionChange">
                    <el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.change">
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.parameter.N" :page-sizes="[10, 20, 30, 40,50]" :page-size="this.parameter.Rows" layout="total,prev, pager, next, jumper" :total='totalCount' style="margin-top:15px;">
                </el-pagination>
                <!-- </el-tab-pane> -->
                <!-- </el-tabs> -->
            </el-col>
        </el-row>
        </el-row>
    </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb";
export default {
  name: "carServer_bathMember",
  components: {
    // breadCrumb
  },
  data() {
    return {
      dialogImageUrl: "",
      baseImgPath: "http://192.168.0.86:81/FS/",
      dialogVisible: false,
      options: "",
      selectedOptions: [],
      value: "",
      activeTag: "first",
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      dialogFormVisible: false,
      tableList: [],
      cardAllList: [],
      totalCount: 20,
      currentPage: 1,
      parameter: {
        WToken: this.getToken(),
        type: "-1",
        name: "",
        expiration_date: "",
        N: 1,
        Rows: 8
      },
      imageUrl: "",
      cardList: "",
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
        ]
      },
      dataForm: {
        WToken: this.getToken(),
        mer_id: this.getUserInfo().mer_id,
        card_type:'',
        batch:''
      },
      columns: [
        { prop: "name", label: "会员卡ID ", minWidth: 80 },
        { prop: "amount", label: "会员卡号", minWidth: 80 }
      ],
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },
  mounted() {
    var _this = this;
    _this.parameter.Rows = _this.pageSize;
    _this.getPlate();
    _this.parameter.WToken = _this.token;
    _this.GetList(_this.parameter);
    _this.cardTypeList();
    _this.getShopName();
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
      this.post("CarServer/Card/QueryCardTypeList", parameter, res => {
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

    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
              api = "CarServer/Card/AddMemberCard";
            let params = Object.assign({}, this.dataForm);
            this.post(api, params, res => {
              if (res.body.Status == 0) {
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
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
    cardTypeList(parameter) {
      var _this = this;
      this.post("CarServer/Card/QueryCardTypeList", { type: -1 }, res => {
        if (res.body.Status == 0) {
          this.cardAllList = res.body.Data.Rows;
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
</style>
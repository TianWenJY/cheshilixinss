<template>
  <div>
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-row>
        <el-form class="filterBlock" :inline="true" :gutter="20">
          <el-row class="filterContent">
            <el-form-item label="所属门店" v-if="this.getUserInfo().bin_id == 1">
              <el-select placeholder="选择所属门店" size="medium" v-model="parameter.mer_id">
                <el-option label='全部' value="-1"></el-option>
                <el-option v-for="(shop,index) in shopNameList" :label='shop.name' :value="shop.mer_id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择卡类型">
              <el-select v-model="parameter.type" placeholder="角色类型" size="medium">
                <el-option value="-1" label="全部"></el-option>
                <el-option value="1" label="储值卡"></el-option>
                <el-option value="2" label="套餐卡"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="服务类型">
              <el-select v-model="parameter.type" placeholder="服务类型" size="medium">
                <el-option value="-1" label="全部" v-for=""></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="卡种名称">
              <el-input v-model.trim="parameter.name" size="medium" clearable></el-input>
            </el-form-item>

            <!-- <el-form-item label="申请时间">
              <el-date-picker class="form-control" size="medium" type="daterange" range-separator="至" value-format="timestamp" arrow-control v-model="parameter.AddTime" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item> -->

            <el-form-item>
              <el-button size="medium" type="primary" @click="filter">
                筛选
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="handleAdd">
                新增
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- <el-tabs v-model="activeTag" type="card" @tab-click="handleClick"> -->
          <el-table ref="multipleTable" border :data="tableList" tooltip-effect="dark" stripe style="width: 100%" size="medium" @selection-change="handleSelectionChange">
            <el-table-column v-for="(column,index) in columns" header-align="center" align="center" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="index" :type="column.type" :formatter="column.change">
            </el-table-column>
            <el-table-column prop="amount" label="开卡金额" width="100" v-if="parameter.type == 1" align="center">
            </el-table-column>
            <el-table-column prop="number" label="开卡赠送次数" width="120" v-if="parameter.type == 2" align="center">
            </el-table-column>
            <el-table-column prop="Img" label="图片" min-width="120" header-align="center" align="center">
              <!-- 图片的显示 -->
              <template slot-scope="scope">
                <img v-if="scope.row.Img" :src="baseImgPath +scope.row.Img" min-width="70" height="70" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row.ID)">详情</el-button> -->
                <el-button size="mini" type="danger" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.mer_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.parameter.N" :page-sizes="[10, 20, 30, 40,50]" :page-size="this.parameter.Rows" layout="total,prev, pager, next, jumper" :total='totalCount' style="margin-top:15px;">
          </el-pagination>
          <!-- </el-tab-pane> -->
          <!-- </el-tabs> -->
        </el-col>

        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
          <el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm" label-position="right">
            <el-form-item label="门店" prop="mer_id">
              <el-select placeholder="请选择门店" v-model="dataForm.mer_id">
                <el-option v-for="(shop,index) in shopNameList" :key="index" :label="shop.name" :value="shop.mer_id">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="选择类型" prop="type">
              <el-select placeholder="请选择类型" v-model="dataForm.type">
                <el-option value="1" label="储值卡"></el-option>
                <el-option value="2" label="套餐卡"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="卡种名称" prop="name">
              <el-input v-model="dataForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="有效日期" prop="name">
              <el-date-picker v-model="dataForm.expiration_date" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="卡总金额(元)" v-if="dataForm.type == 1">
              <el-input v-model="dataForm.amount" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="开卡赠送/总次数" v-if="dataForm.type == 2">
              <el-input-number v-model.number="dataForm.number" :min="0"></el-input-number>
            </el-form-item> -->
            <el-form-item label="会员卡图片" prop="Img">
              <el-upload class="avatar-uploader" :action="this.url + 'CarServer/Card/AddCardFile'" :show-file-list="false" name="Img" :on-success="handleBusinessAvatarScucess" :before-upload="beforeAvatarUpload">
                <img v-if="dataForm.Img" :src="baseImgPath + dataForm.Img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="类型服务项目" v-if="dataForm.type">
              <el-table ref="serverAllTable" :data="getServerList" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionValue">
                <el-table-column type="selection">
                </el-table-column width="60">
                <el-table-column label="服务项目" width="150">
                  <template slot-scope="scope">{{ scope.row.lx }}</template>
                </el-table-column>
                <el-table-column label="卡折扣(例:0.7为7折)" v-if="dataForm.type == 1">
                  <template slot-scope="scope">
                    <!-- <el-input v-model='scope.row.val' placeholder="请输入卡折扣"></el-input> -->
                    <el-input-number v-model="scope.row.val" :precision="2" :step="0.1" :max="1"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="开卡次数" v-if="dataForm.type == 2">
                  <template slot-scope="scope">
                    <!-- <el-input v-model='scope.row.val' placeholder="请输入开卡次数"></el-input> -->
                    <el-input-number v-model="scope.row.val" :min="1"></el-input-number>
                  </template>
                </el-table-column>
              </el-table>
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
import Vue from "vue";
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
export default {
  name: "carServer_memberType",
  components: {
    // breadCrumb
  },
  data() {
    return {
      dialogImageUrl: "",
      serverList: [{}],
      baseImgPath: this.url + "FS/",
      dialogVisible: false,
      options: regionDataPlus,
      selectTable: [],
      selectedOptions: [],
      serverList: [],
      value: "",
      activeTag: "first",
      getServerList: [],
      selectList: [],
      serverIndex: [],
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
        mer_id: "-1",
        type: "-1",
        name: "",
        expiration_date: "",
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
        // Img: [
        //   {
        //     required: true,
        //     message: "必须提交营业执照",
        //     trigger: "change"
        //   }
        // ]
      },
      dataForm: {
        WToken: this.getToken(),
        id: "",
        mer_id: "",
        type: "",
        name: "",
        number: "",
        expiration_date: "",
        Img: "",
        fuxm_id:[]
      },
      columns: [
        { prop: "StoreName", label: "所属门店", minWidth: 150 },
        { prop: "name", label: "卡种名称 ", minWidth: 120 },
        {
          prop: "type",
          label: "会员卡类型",
          minWidth: 80,
          change: this.isType
        },
        { prop: "expiration_date", label: "有效期(年)", minWidth: 160 },
        {
          prop: "addtime",
          label: "创建日期",
          minWidth: 160
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
    async GetList(parameter) {
      var _this = this;
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
        Img: "",
        fuxm_id:''
      };
      this.getServer();
    },
    // 表单提交
    submitForm() {
       this.dataForm.fuxm_id = [];
      for(var i=0; i<this.selectTable.length; i++) {
         this.dataForm.fuxm_id.push(
           {
             id:this.selectTable[i].id,
             val:this.selectTable[i].val 
             })
      }
      this.dataForm.fuxm_id  = JSON.stringify(this.dataForm.fuxm_id)
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if (this.operation) {
              api = "CarServer/Card/AddCardType";
            } else {
              api = "CarServer/Card/UpdateCardType";
            }
            this.post(api, this.dataForm, res => {
              if (res.body.Status == 0) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                this.parameter = {
                  // WToken: this.getToken(),
                  mer_id :'-1',
                  type: "-1",
                  name: "",
                  expiration_date: "",
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
    handleSelectionValue(val) {
      this.selectTable = val;
    },
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.isAdd = false;


      this.dataForm = Object.assign({},params);
      this.getServer().then((data) => {
        this.getMyServer(data);
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post("CarServer/Store/DelStore", { mer_id: row }, res => {
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
        }  else {
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
    },
    getServer() {
      this.serverIndex = [];
      this.getServerList = [];
      return new Promise((resolve, reject) => {
        this.post("CarServer/ServerProject/QueryProjectTypeSelect", {}, res => {
          if (res.body.Status == 0) {
            var serItem = res.body.Data;
            for (var i = 0; i < serItem.length; i++) {
             this.getServerList.push({id: serItem[i].id, lx:serItem[i].lx, val:''});
            }
            this.dataForm.fuxm_id = JSON.parse(this.dataForm.fuxm_id)
            if (this.getServerList.length > 0 && !this.operation && this.dataForm.fuxm_id.length>0) {
              for (var i = 0; i < this.getServerList.length; i++) {
                for (var j = 0; j < this.dataForm.fuxm_id.length; j++) {
                  if (this.getServerList[i].id == this.dataForm.fuxm_id[j].id) {
                    this.getServerList[i].val = this.dataForm.fuxm_id[j].val;
                    this.$refs.serverAllTable.toggleRowSelection(this.getServerList[i], true);
                  }
                }
              }
            }
            resolve(this.serverIndex);
          }else {
            this.$notify.error({
              title: "错误",
              message: "请求错误",
              offset: 100
            });
            return false;
          }
        });
      });
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
    getMyServer(row) {
      this.$nextTick(function() {
        row.forEach(row => {
          this.$refs.serverAllTable.toggleRowSelection(row, true);
        });
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
.myTbody {
  th {
    border: 1px solid #ebeef5;
  }
}
</style>
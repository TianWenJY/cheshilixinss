<template>
  <div>
    <el-row class="containt">
      <el-row>
        <el-form class="filterBlock" :inline="true" :gutter="20">
          <el-row class="filterContent">
            <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1">
              <el-select placeholder="选择所属社区" filterable size="medium" v-model="parameter.p_id">
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(commun,index) in Community"
                  :label="commun.sqmc"
                  :value="commun.u_id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="this.getUserInfo().bin_id == 1">
              <kt-button
                size="medium"
                type="primary"
                @click="filter"
                label="查询"
                :loading="onLoading"
              ></kt-button>
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
            border
            v-loading="loading"
            element-loading-text="拼命加载中"
          >
            <el-table-column label="认证照片" min-width="150">
              <template slot-scope="scope" v-if="scope.row.zp != null">
                <el-popover placement="right" width="200" trigger="hover">
                  <img :src="scope.row.zp" style="width: 100%;height: 100%;">
                  <el-button slot="reference" size="mini" v-if="scope.row.zp != null">查看照片</el-button>
                </el-popover>
              </template>
            </el-table-column>
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
              ref="table"
            ></el-table-column>
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
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import KtButton from "@/components/KtButton";
import { PhotoList } from "@/api/smart";
export default {
  name: "smartCommunity_faceRecognition",
  components: {
    KtButton
  },
  data() {
    var validPhone = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      tableList: [],
      totalCount: 20,
      onLoading: false,
      loading: false,
      currentPage: 1,
      parameter: {
        WToken: this.getToken(),
        p_id:
          this.getUserInfo().bin_id == 1
            ? "-1"
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        N: 1,
        Rows: 8
      },
      pageSize: 8,
      pageNum: "",
      myImg: "",
      allUser: "",
      nowList: "",
      Community: [],
      dataForm: {
        WToken: this.getToken(),
        bin_id: 4,
        role_id: "",
        user_name: "",
        park_name: "",
        mobile: "",
        province: "",
        city: "",
        county: "",
        add_detail: "",
        sqmc: "",
        sqsm: "",
        wAmount: ""
      },
      columns: [
        { prop: "xm", label: "姓名", minWidth: 120 },
        { prop: "xb", label: "性别", minWidth: 150 },
        { prop: "sj", label: "手机", minWidth: 180 },
        { prop: "gx", label: "认证状态", minWidth: 180, change: this.gx },
        { prop: "sq", label: "是否授权", minWidth: 180, change: this.sq }
      ]
    };
  },
  created() {},
  mounted() {
    var _this = this;
    _this.parameter.Rows = _this.pageSize;
    _this.parameter.WToken = _this.token;
    _this.GetList(_this.parameter);
    _this.getPark();
  },
  methods: {
    gx(row) {
      if (row.gx == 0) {
        return "未认证";
      } else if (row.gx == 1) {
        return "未认证房屋";
      } else if (row.gx == 2) {
        return "已认证";
      }
    },
    sq(row) {
      if (row.sq == 0) {
        return "未授权";
      } else if (row.sq == 1) {
        return "已授权";
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
    getPark: function() {
      this.api("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
        this.Community = res.Data;
      });
    },
    GetList(parameter) {
      this.onLoading = true;
      this.loading = true;
      PhotoList(parameter).then(res => {
        if (res.Status == 0) {
          this.onLoading = false;
          this.loading = false;
          this.tableList = res.Data.Rows;
          this.totalCount = parseInt(res.Data.Count);
        }
        this.onLoading = false;
        this.loading = false;
      });
    },
    // 删除
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
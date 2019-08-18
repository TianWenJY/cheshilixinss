<template>
  <div>
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-row>
        <el-form class="filterBlock" :inline="true" :gutter="20">
          <el-row class="filterContent">
            <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1">
              <el-select placeholder="选择所属社区" size="medium" v-model="parameter.mer_id">
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(shop,index) in shopNameList"
                  :label="shop.sqmc"
                  :value="shop.u_id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车牌号">
              <el-input
                v-model.trim="parameter.car_num"
                size="medium"
                placeholder="请输入车牌号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="filter" :loading="onLoading">筛选</el-button>
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
            v-loading="loading"
            element-loading-text="拼命加载中"
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
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { oprecordList } from "@/api/smart";
export default {
  name: "carServer_OPRecord",
  components: {
    // breadCrumb
  },
  computed: {},
  data() {
    return {
      addtime: "",
      activeTag: "first",
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      tableList: [],
      totalCount: 20,
      currentPage: 1,
      shopNameList: [],
      onLoading: false,
      loading:false,
      parameter: {
        WToken: this.getToken(),
        mer_id:
          this.getUserInfo().bin_id == 1
            ? "-1"
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        car_num: "",
        in_time: "",
        out_time: "",
        N: 1,
        Rows: 8
      },
      columns: [
        { prop: "sqmc", label: "所属社区", minWidth: 160 },
        { prop: "car_num", label: "车牌号", minWidth: 160 },
        { prop: "in_time", label: "进场时间", minWidth: 200 },
        // { prop: "in_id", label: "进场设备ID", minWidth: 120 },
        {
          prop: "out_time",
          label: "出场时间",
          minWidth: 200
        },
        // {
        //   prop: "out_id",
        //   label: "出场设备ID",
        //   minWidth: 100
        // },
        {
          prop: "sustain_time",
          label: "停车时长 ",
          minWidth: 160,
          change: this.during
        }
      ]
    };
  },
  mounted() {
    this.GetList(this.parameter);
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
    during(row, column) {
      if (row.sustain_time != null) {
        let theTime = parseInt(row.sustain_time), // 秒
          theTime1 = 0, // 分
          theTime2 = 0; // 小时
        if (theTime > 60) {
          theTime1 = parseInt(theTime / 60);
          theTime = parseInt(theTime % 60);
          if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
          }
        }
        var result = "" + parseInt(theTime) + "秒";
        if (theTime1 > 0) {
          result = "" + parseInt(theTime1) + "分" + result;
        }
        if (theTime2 > 0) {
          result = "" + parseInt(theTime2) + "小时" + result;
        }
        return result;
      } else {
        return;
      }
    },
    GetList(parameter) {
      this.onloading = true;
      this.loading = true;
      oprecordList(parameter).then(res => {
        if (res.Status == 0) {
          this.tableList = res.Data.Rows;
          this.totalCount = parseInt(res.Data.Count);
          this.onLoading = false;
          this.loading = false;
        }
      });
    },
    getShopName() {
      this.post("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
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
    filter() {
      var _this = this;
      _this.GetList(_this.parameter);
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

.el-table th {
  background: #fafafa;
}

.el-dialog__title {
  font-weight: 700;
}

.el-pagination {
  float: right;
}
</style>
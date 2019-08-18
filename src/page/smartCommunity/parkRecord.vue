<template>
  <div style="margin-top: 20px;">
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form :inline="true" :model="pageRequest" size="medium" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <community-list :pageRequest="pageRequest" :allPlate="allPlate"></community-list>
          <el-form-item label="车牌号" label-width="80px">
            <el-input
              v-model.trim="pageRequest.car_num"
              size="medium"
              placeholder="请输入车牌号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="订单状态" label-width="80px">
            <el-select placeholder="订单状态" size="medium" v-model="pageRequest.status">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="未付款" value="0"></el-option>
              <el-option label="已付款" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易类型" label-width="80px">
            <el-select placeholder="交易类型" size="medium" v-model="pageRequest.tool">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="现金" value="1"></el-option>
              <el-option label="微信" value="2"></el-option>
              <el-option label="支付宝" value="3"></el-option>
              <el-option label="无感支付" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扫码类型" label-width="80px">
            <el-select placeholder="交易类型" size="medium" v-model="pageRequest.tool_type">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="主扫" value="1"></el-option>
              <el-option label="被扫" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费时间" label-width="80px">
            <el-date-picker
              class="form-control"
              size="medium"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              v-model="addtime"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <kt-button
              label="查询"
              type="primary"
              :loading="onLoading"
              @click="findPage(null)"
              size="medium"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <!--表格内容栏-->
      <!-- @findPage="findPage" -->
      <kt-table
        :highlightCurrentRow="true"
        :stripe="false"
        @findPage="findPage"
        :data="tableList"
        :pageRequest="pageRequest"
        :columns="columns"
        :showBatchDelete="false"
        :showOperation="false"
        ref="table"
      ></kt-table>
    </el-row>
  </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
import CommunityList from "@/page/smartCommunity/communityList/communityList";
import { parkRecordList } from "@/api/smart";
export default {
  name: "smartCommunity_parkRecord",
  components: {
    KtTable,
    KtButton,
    CommunityList,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      shopNameList: [],
      onLoading: false,
      addtime: "",
      columns: [
        { prop: "sqmc", label: "所属社区", minWidth: 150 },
        { prop: "start_time", label: "入车时间", minWidth: 190 },
        { prop: "end_time", label: "出车时间", minWidth: 190 },
        {
          prop: "duration",
          label: "持续时间",
          minWidth: 150,
          change: this.during
        },
        {
          prop: "car_num",
          label: "车牌号",
          minWidth: 100
        },
        {
          prop: "account",
          label: "交易金额",
          minWidth: 100
        },
        {
          prop: "serial_no",
          label: "订单号",
          minWidth: 210
        },
        {
          prop: "tool",
          label: "交易类型",
          minWidth: 100,
          change: this.tool
        },
        {
          prop: "status",
          label: "交易状态 ",
          minWidth: 120,
          change: this.status
        },
        {
          prop: "operator_name",
          label: "收费人员",
          minWidth: 120
        },
        {
          prop: "tool_type",
          label: "扫码类型 ",
          minWidth: 120,
          change: this.toolType
        }
      ],
      allPlate:true,
      pageRequest: {
        mer_id:
          this.getUserInfo().bin_id == 1
            ? "-1"
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        tool: "-1",
        WToken: "",
        addtime: "",
        car_num: "",
        status: "-1",
        tool_type: "-1",
        N: 1,
        Rows: 8
      },
      optioners: [],
      tableList: {}
    };
  },
  mounted() {
    this.getShopName();
  },
  methods: {
    during(row, column) {
      if (row.duration != null) {
        let theTime = parseInt(row.duration), // 秒
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
      }
    },
    status(row) {
      if (row.status == 0) {
        return "未付款";
      } else if (row.status == 1) {
        return "已付款";
      }
    },
    tool(row) {
      if (row.tool == "1") {
        return "现金";
      } else if (row.tool == "2") {
        return "微信";
      } else if (row.tool == "3") {
        return "支付宝";
      } else if (row.tool == "4") {
        return "无感支付";
      }
    },
    toolType(row) {
      if (row.tool_type == "1") {
        return "主扫";
      } else if (row.tool_type == "2") {
        return "被扫";
      }
    },
    // 获取分页数据
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
        this.onLoading = true;
        this.$refs.table.loading = true;
      }
      if (this.addtime !== "" && this.addtime !== null) {
        this.pageRequest.addtime =
          "'" + this.addtime[0] + "'_'" + this.addtime[1] + "'";
      } else {
        this.pageRequest.addtime = "";
      }
      parkRecordList(this.pageRequest)
        .then(res => {
          if (res.Status == 0) {
            this.tableList = res.Data;
            this.onLoading = false;
            this.$refs.table.loading = false;
          }
        })
        .then(data != null ? data.callback : "");
    },
    getShopName() {
      this.post("NoSense/CommunityPark/QueryCommunityList", {}, res => {
        if (res.body.Status == 0) {
          this.shopNameList = res.body.Data.Rows;
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
    }
  }
};
</script>
<style scoped lang="less">
@import "../../assets/css/table.less";
</style>
<template>
  <div style="margin-top: 20px;">
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form :inline="true" :model="pageRequest" size="medium" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <community-list :pageRequest="pageRequest" :allPlate="isShowAll"></community-list>
          <el-form-item label="车牌号" label-width="80px">
            <el-input
              v-model.trim="pageRequest.car_num"
              size="medium"
              placeholder="请输入车牌号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="是否完成" label-width="80px">
            <el-select placeholder="选择是否完成" size="medium" v-model="pageRequest.is_used">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="完成" value="1"></el-option>
              <el-option label="未完成" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="车辆类型" label-width="80px">
            <el-select placeholder="选择车辆类型" size="medium" v-model="pageRequest.user_type">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="月租车" value="1"></el-option>
              <el-option label="临时车" value="2"></el-option>
              <el-option label="黑名单" value="3"></el-option>
              <el-option label="白名单" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="进出类型" label-width="80px">
            <el-select placeholder="选择进出场类型" size="medium" v-model="pageRequest.in_out">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="入场" value="0"></el-option>
              <el-option label="出场" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出入时间" label-width="80px">
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
              ref="search"
              @click="findPage(null)"
              size="medium"
              :loading="onLoading"
            />
          </el-form-item>
          <!-- <el-form-item>
            <kt-button label="导出" type="warning" @click="exports" size="medium"/>
          </el-form-item>-->
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
        ref="table"
        :columns="columns"
        :showBatchDelete="false"
        :showOperation="false"
        :showpayment="showpayment"
        :maxHeight="500"
        @payment="payment"
      ></kt-table>
      <pa-dio
        :payType="payType"
        ref="padio"
        :dataForm="dataForm"
        :size="size"
        :pageRequest="pageRequest"
        @findPage="findPage"
      ></pa-dio>
    </el-row>
  </div>
</template>

<script>
import { enterRecordList } from "@/api/smart";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
import PaDio from "@/components/PaDio";
import CommunityList from "@/page/smartCommunity/communityList/communityList";
export default {
  name: "smartCommunity_enterRecord",
  components: {
    KtTable,
    KtButton,
    PaDio,
    CommunityList,
    // breadCrumb,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      isShowAll:true,
      columns: [
        {
          prop: "sqmc",
          label: "所属社区",
          minWidth: 180
        },
        // {
        //   prop: "is_used",
        //   label: "是否完成",
        //   minWidth: 180,
        //   change: this.isUsed
        // },
        {
          prop: "happen_time",
          label: "出入场发生时间 ",
          minWidth: 240
        },
        {
          prop: "count_time",
          label: "计费时间 ",
          minWidth: 240
        },
        {
          prop: "car_num",
          label: "车牌号",
          minWidth: 150
        },
        {
          prop: "in_out",
          label: "设备进出类型",
          minWidth: 120,
          change: this.in_out
        },
        {
          prop: "user_type",
          label: "车辆类型",
          minWidth: 150,
          change: this.user_type
        },
        {
          prop: "car_color",
          label: "车牌颜色",
          minWidth: 120
        }
      ],
      pageRequest: {
        mer_id:
          this.getUserInfo().bin_id == 1
            ? "-1"
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        is_used: "-1",
        in_out: "-1",
        WToken: "",
        car_num: "",
        happen_time: "",
        car_color: "",
        user_type: "-1",
        N: 1,
        Rows: 8
      },

      payType: "",
      optioners: [],
      isFinish: false,
      addtime: "",
      tableList: {},
      onLoading: false,
      operation: false, // true:新增, false:编辑
      editLoading: false,
      dataForm: {},
      showpayment: true
    };
  },
  mounted() {
    var myHerf = location.href;
    if (myHerf.indexOf("csl.ycpicc.com") == -1) {
      this.showpayment = true;
    } else {
      this.showpayment = false;
    }
  },
  computed: {},
  methods: {
    // 获取分页数据
    in_out(row) {
      if (row.in_out == 1) {
        return "出场";
      } else if (row.in_out == 0) {
        return "入场";
      }
    },
    user_type(row) {
      if (row.user_type == 1) {
        return "月租车";
      } else if (row.user_type == 2) {
        return "临时车";
      } else if (row.user_type == 3) {
        return "黑名单";
      } else if (row.user_type == 4) {
        return "白名单";
      }
    },
    // exports() {
    //   location.href = "http://192.168.0.173/NoSense/CarManage/CarInOutList";
    // },
    isUsed(row) {
      if (row.is_used == 1) {
        return "完成";
      } else if (row.is_used == 0) {
        return "未完成";
      }
    },
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
        this.onLoading = true;
        this.$refs.table.loading = true;
        if (this.addtime !== "" && this.addtime !== null) {
          this.pageRequest.happen_time =
            "'" + this.addtime[0] + "'_'" + this.addtime[1] + "'";
        } else {
          this.pageRequest.happen_time = "";
        }
      }
      enterRecordList(this.pageRequest)
        .then(res => {
          if (res.Status == 0) {
            this.tableList = res.Data;
            this.onLoading = false;
            this.$refs.table.loading = false;
          }
        })
        .then(data != null ? data.callback : "");
    },
    // 显示编辑界面
    payment: function(row) {
      if (
        this.getUserInfo().default_pay == null ||
        this.getUserInfo().default_pay == "-1"
      ) {
        this.$confirm("暂未设置停车场收费方式，是否跳转设置？", "提示", {
          type: "warning"
        }).then(() => {
          this.$router.push({ path: "/smartCommunity/chargeWay" });
        });
      } else {
        this.$refs.padio.payType = this.getUserInfo().default_pay;
        this.$refs.padio.dialogVisible = true;
        this.$refs.padio.check =
          this.getUserInfo().Defaultopen == 2 ? true : false;
        this.$refs.padio.blue = this.getUserInfo().default_pay;
        this.operation = false;
        this.payCode = "";
        let params = {
          id: row.id,
          mer_id: row.mer_id,
          type: this.getUserInfo().default_pay,
          WToken: this.getToken()
        };
        this.dataForm = row;
        this.api(
          "NoSense/CarManage/QueryFeeData",
          params,
          res => {
            this.$refs.padio.feeData = res.Data;
          },
          res => {
            if (res.Status == 99) {
              this.$message({
                message: "缴费失败,登录失效，请重新登录",
                type: "error"
              });
              this.$router.push({ path: "/login" });
            }
          }
        );
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "../../assets/css/table.less";
</style>
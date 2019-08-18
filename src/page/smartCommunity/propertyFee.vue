<template>
  <div style="margin-top: 20px;">
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form
        :inline="true"
        :model="pageRequest"
        size="medium"
        class="filterBlock"
        :gutter="20"
      >
        <el-row class="filterContent">
          <el-form-item
            label="所属社区"
            v-if="this.getUserInfo().bin_id == 1"
          >
            <el-select
              placeholder="选择所属社区"
              size="medium"
              v-model="pageRequest.u_id"
            >
              <el-option
                label='全部'
                value=""
              ></el-option>
              <el-option
                v-for="(shop,index) in shopNameList"
                :label='shop.sqmc'
                :value="shop.mer_id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业主姓名">
            <el-input
              v-model.trim="pageRequest.yzxm"
              size="medium"
              placeholder="请输入业主姓名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="缴费状态">
            <el-select
              placeholder="选择缴费状态 "
              size="medium"
              v-model="pageRequest.status"
            >
              <el-option
                label='全部'
                value="-1"
              ></el-option>
              <el-option
                label='完成'
                value="1"
              ></el-option>
              <el-option
                label='未完成'
                value="0"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型">
            <el-select
              placeholder="选择车辆类型"
              size="medium"
              v-model="pageRequest.user_type"
            >
              <el-option
                label='全部'
                value="-1"
              ></el-option>
              <el-option
                label='月租车'
                value="1"
              ></el-option>
              <el-option
                label='临时车'
                value="2"
              ></el-option>
              <el-option
                label='黑名单'
                value="3"
              ></el-option>
              <el-option
                label='白名单'
                value="4"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="进出场类型">
            <el-select
              placeholder="选择进出场类型"
              size="medium"
              v-model="pageRequest.in_out"
            >
              <el-option
                label='全部'
                value="-1"
              ></el-option>
              <el-option
                label='入场'
                value="0"
              ></el-option>
              <el-option
                label='出场'
                value="1"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <kt-button
              label="查询"
              type="primary"
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
        :showpayment="showpayment"
        :havProperty="havProperty"
        :maxHeight="500"
        @payment="payment"
      >
      </kt-table>
      <pa-dio
        :feeData="feeData"
        :payType="payType"
        ref="padio"
        :beforeFree="beforeFree"
        :dataForm="dataForm"
        :pageRequest="pageRequest"
        @findPage="findPage"
      ></pa-dio>

    </el-row>
  </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
import PaDio from "@/components/PaDio";
export default {
  name: "smartCommunity_propertyFee",
  components: {
    KtTable,
    KtButton,
    PaDio,
    // breadCrumb,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      shopNameList: [],
      columns: [
        {
          prop: "sqmc",
          label: "所属社区",
          minWidth: 180
        },
        {
          prop: "yzxm",
          label: "业主姓名",
          minWidth: 180
        },
        {
          prop: "yzsj",
          label: "业主电话",
          minWidth: 180
        },
        { prop: "wyf_n", label: "物业费年份", minWidth: 120 },
        {
          prop: "wef_y",
          label: "物业费月份",
          minWidth: 180
        },
        {
          prop: "amount_payable",
          label: "应缴纳金额(元)",
          minWidth: 150
        },
        {
          prop: "amount_paid",
          label: "已缴纳费用",
          minWidth: 150
        },
        {
          prop: "status",
          label: "状态",
          minWidth: 180,
          change: this.status
        },
        {
          prop: "pay_type",
          label: "缴费类型",
          minWidth: 150,
          change: this.pay_type
        },
        {
          prop: "remarks",
          label: "状态",
          minWidth: 150
        },
        {
          prop: "lh",
          label: "楼号",
          minWidth: 180
        },
        {
          prop: "fwmj",
          label: "房屋面积",
          minWidth: 180
        },
        {
          prop: "fjh",
          label: "房间号",
          minWidth: 180
        }
      ],
      pageRequest: {
        u_id: this.getUserInfo().bin_id == 1 ? "" :this.getUserInfo().p_id== 0?this.getUserInfo().mer_id:this.getUserInfo().p_id,
        status: "-1",
        pay_type: "-1",
        WToken: "",
        yzxm: "",
        yzsj: "",
        N: 1,
        Rows: 8
      },
      payType: "",
      optioners: [],
      tableList: {},
      operation: false, // true:新增, false:编辑
      editLoading: false,
      dataForm: {},
      feeData: {},
      beforeFree: "",
      showpayment: true,
      havProperty: true
    };
  },
  mounted() {
    this.getShopName();
    var myHerf = location.href;
    if (myHerf.indexOf("csl.ycpicc.com") == -1) {
      this.showpayment = true;
    } else {
      this.showpayment = false;
    }
  },
  methods: {
    // 获取分页数据
    in_out(row) {
      if (row.in_out == 1) {
        return "出口设备";
      } else if (row.in_out == 0) {
        return "进入设备";
      }
    },
    pay_type(row) {
      if (row.pay_type == 1) {
        return "补缴纳";
      } else if (row.pay_type == 2) {
        return "预缴纳";
      } else if (row.pay_type == 0) {
        return "正常缴纳";
      }
    },
    status(row) {
      if (row.status == 1) {
        return "部分缴纳";
      } else if (row.status == 0) {
        return "未缴纳";
      } else if (row.status == 2) {
        return "已缴纳";
      }
    },
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
      }
      this.api(
        "NoSense/Property/QueryPropertyFeeList",
        this.pageRequest,
        res => {
          this.tableList = res.Data;
        }
      );
    },
    // 显示编辑界面
    payment: function(row, type) {
      this.$refs.padio.payType = type;
      this.$refs.padio.dialogVisible = true;
      this.operation = false;
      this.payCode = "";
      let params = Object.assign(this.dataForm, row);
      this.api("NoSense/CarManage/QueryFeeData", params, res => {
        this.feeData = res.Data;
        this.beforeFree = res.Data.Fee;
      });
    },
    getShopName() {
      this.post("NoSense/CommunityPark/QueryCommunityList", {}, res => {
        if (res.body.Status == 0) {
          this.shopNameList = res.body.Data.Rows;
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
    }
    // // 表单提交
    // submitForm() {
    //   return new Promise((resolve, reject) => {
    //     this.$confirm("确认缴费吗？", "提示", {}).then(() => {
    //       this.editLoading = true;
    //       let api;
    //       let params = this.dataForm;
    //       this.api("NoSense/CarManage/QueryFeeData", params, res => {
    //         resolve(res.Data);
    //       });
    //     });
    //   });
    // },
    // getMoney() {
    //   let params = this.dataForm;
    //   this.api("NoSense/CarManage/GetMoneyButton", params, res => {
    //     this.$message({ message: "操作成功", type: "success" });
    //     this.dialogVisible = false;
    //     this.findPage();
    //   });
    // },
    // async successMoney() {
    //   const Fee = await this.submitForm();
    //   if (Fee.Fee == this.beforeFree) {
    //     this.getMoney();
    //   } else {
    //     this.$message({ message: "该用户费用已过期，请重新刷新页面后缴费" });
    //   }
    // },
    // getMobilePay() {
    //   let params = {
    //     trade_type: "MICROPAY",
    //     notify_url: "http://api.cheshili.com.cn:8054/qlyh/dojob",
    //     auth_code: this.payCode,
    //     body: "停车管理费",
    //     reqType:'zhsq',
    //     out_trade_no: '1544490924000',
    //     total_fee: '1'
    //   };
    //   this.post("http://yt.ycpicc.com:8054/qlyh/wxOrder", params, res => {
    //     if (res.body.retCode == 0) {
    //       let retInfo = JSON.parse(res.body.retInfo);
    //       if (retInfo.return_msg == "OK") {
    //         if(retInfo.result_code == "SUCCESS") {
    //           alert('1')
    //           this.$message({ message: "操作成功", type: "success" });
    //           this.dialogVisible = false;
    //           this.payCode = '';
    //           this.findPage();
    //         }else if(retInfo.result_code == "FAIL") {
    //           this.$message({
    //           message: "提交业务失败",
    //           type: "error"
    //         });
    //         }
    //       } else {
    //         this.$message({
    //           message: "操作失败, " + retInfo.return_msg,
    //           type: "error"
    //         });
    //       }
    //     }
    //   });
    // },
    // async mobilePay() {
    //   const Fee = await this.submitForm();
    //   if (Fee.Fee == this.beforeFree) {
    //     this.getMobilePay();
    //   } else {
    //     this.$message({ message: "该用户费用已过期，请重新刷新页面后缴费" });
    //   }
    // }
  }
};
</script>
<style scoped  lang="less">
@import "../../assets/css/table.less";
</style>
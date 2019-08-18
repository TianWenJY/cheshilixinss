<template>
  <div class="statics">
    <div class="searchContainer">
      <span class="date"><span style="margin-left:3px;">日期</span> (默认当天)</span>
      <div class="block">
        <el-date-picker v-model="getTime" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期"
          value-format="yyyy-MM-dd" end-placeholder="结束日期" :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <el-button class="search" type="primary" size="medium" @click="myInfo">查询</el-button>
    </div>

    <el-table :data="tableData" border  style="width: 100%; margin-top: 50px;">
      <el-table-column prop="part" label="车辆信息">
      </el-table-column>
      <el-table-column prop="TempCar" label="临时车">
      </el-table-column>
      <el-table-column prop="MonRetCar" label="月租车">
      </el-table-column>
      <el-table-column prop="BlackCar" label="黑名单">
      </el-table-column>
      <el-table-column prop="WhiteCar" label="白名单">
      </el-table-column>
      <el-table-column prop="CarCount" label="合计车辆">
      </el-table-column>
    </el-table>
    <el-table :data="tableData2" border stripe style="width: 100%; margin-top: 50px;">
      <el-table-column prop="part" label="缴费信息">
      </el-table-column>
      <el-table-column prop="CashPay" label="现金">
      </el-table-column>
      <el-table-column prop="WeChatPay" label="微信">
      </el-table-column>
      <el-table-column prop="AliPay" label="支付宝">
      </el-table-column>
      <el-table-column prop="NonInPay" label="无感支付">
      </el-table-column>
      <el-table-column prop="PayAcount" label="合计金额">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        tableData: [
          {
            BlackCar: "",
            MonRetCar: "",
            TempCar: "",
            WhiteCar: "",
            CarCount: '',
            part:'车辆(辆)'
          }
        ],
        getTime: "",
        dataForm: {
          start_time: '',
          end_time: ''
        },
        value7: ["2018-09-26", "2018-10-26"],
        tableData2: [
          {
            part: "金额(元)",
            CashPay: "",
            WeChatPay: "",
            AliPay: "",
            NonInPay: "",
            PayAcount:""
          }
        ]
      };
    },
    created() {
      this.getStatistics(this.dataForm)
    },
    methods: {
      goCall() {
        this.$router.push({
          path: "/piccPart/statics"
        });
      },
      getStatistics(params) {
        let allCar;
        this.api("NoSense/Statistics/QueryUserTypeCount", params, res => {
          Object.assign(this.tableData[0],res.Data);
        })
        this.api("NoSense/Statistics/QueryPayTypeCount", params, res => {
          Object.assign(this.tableData2[0],res.Data);
        })
      },
      myInfo() {
        console.log(this.getTime)
        if (this.getTime !== null && this.getTime !== '') {
          this.dataForm.start_time = this.getTime[0];
          this.dataForm.end_time = this.getTime[1];
        }else {
          this.dataForm.start_time = '';
          this.dataForm.end_time = '';
        }
        this.getStatistics(this.dataForm);
      },
      // getNum(params) {
      //   this.post(
      //     "NoSense/Statistics/QueryUserTypeCount",
      //     this.params,
      //     res => {
      //       if (res.body.Status == 0) {
      //         this.allNum = res.body.Data;
      //       } else if (res.body.Status == -1) {
      //         _this.$notify.error({
      //           title: "登录失效",
      //           message: "将进入登录页面",
      //           offset: 100
      //         });
      //         this.$router.push("/login");
      //       } else {
      //         this.$notify.error({
      //           title: "错误",
      //           message: "请求错误",
      //           offset: 100
      //         });
      //         return false;
      //       }
      //     }
      //   );
      // }

    }
  };
</script>

<style lang="less" scoped>
  .statics {
    padding: 20px;
    box-sizing: border-box;

    .searchContainer {
      width: 100%;
      display: flex;
      align-items: center;
      background: #f2f2f2;
      border-radius: 7px;
      padding: 20px;
      box-sizing: border-box;

      .date {
        margin-right: 10px;
        span {
          font-weight: bold;
          font-size: 16px;
        }
      }

      .search {
        margin-left: 20px;
      }
    }
  }

  .partStatic {
    margin-top: 30px;
    margin-bottom: 30px;

    .text {
      text-align: center;
      font-size: 24px;

      span {
        font-size: 16px;
      }
    }
  }
</style>
<template>
  <div class="statics">
    <div class="searchContainer">
      <span class="date">分销商</span>
      <el-select
        placeholder="选择查看分销商"
        size="medium"
        v-if="this.getUserInfo().bin_id == 1"
        v-model="params.ID"
      >
        <el-option label="总平台" value="-1"></el-option>
        <el-option label="picc" value="52"></el-option>
      </el-select>
      <el-button class="search" type="primary" size="medium" @click="searchBusiness">查询</el-button>
    </div>
    <el-row class="partStatic" style="padding-bottom: 20px;">
      <el-col :span="6">
        <el-col :span="22" class="infoAll">
          <el-col class="infoName">
            <span>物业缴费</span>
            <a href>查看详情</a>
          </el-col>
          <h3 class="infoNum">490,190.16</h3>
          <el-col class="infoMoney">
            <el-col class="infoMoneyTitle">本年度已缴金额/元</el-col>
            <el-col>
              <el-progress :percentage="50" :text-inside="true" :show-text="false"></el-progress>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="22" class="infoAll">
          <el-col class="infoName">
            <span>物业缴费</span>
            <a href>查看详情</a>
          </el-col>
          <h3 class="infoNum">490,190.16</h3>
          <el-col class="infoMoney">
            <el-col class="infoMoneyTitle">本年度已缴金额/元</el-col>
            <el-col>
              <el-progress :percentage="50" :text-inside="true" :show-text="false"></el-progress>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="22" class="infoAll">
          <el-col class="infoName">
            <span>物业缴费</span>
            <a href>查看详情</a>
          </el-col>
          <h3 class="infoNum">490,190.16</h3>
          <el-col class="infoMoney">
            <el-col class="infoMoneyTitle">本年度已缴金额/元</el-col>
            <el-col>
              <el-progress :percentage="50" :text-inside="true" :show-text="false"></el-progress>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="22" class="infoAll">
          <el-col class="infoName">
            <span>物业缴费</span>
            <a href>查看详情</a>
          </el-col>
          <h3 class="infoNum">490,190.16</h3>
          <el-col class="infoMoney">
            <el-col class="infoMoneyTitle">本年度已缴金额/元</el-col>
            <el-col>
              <el-progress :percentage="50" :text-inside="true" :show-text="false"></el-progress>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11" class="map">
        <el-row class="mapTitle">
          <el-col>物业地图</el-col>
          <el-button type="primary">
            上传
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-row>
        <el-row></el-row>
      </el-col>
      <el-col :span="12">
        <el-col>
          <el-col></el-col>
          <el-col></el-col>
        </el-col>
        <el-col>
          <el-col></el-col>
          <el-col></el-col>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var echarts = require("echarts");
export default {
  name: "smartCommunity_staticsInfo",
  data() {
    return {
      allNum: "",
      params: {
        WToken: "HVgwl2gnoT5OH1tplmVWAj154232903710",
        ID: this.getUserInfo().mer_id
      },
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
      value7: ["2018-09-26", "2018-10-26"]
    };
  },
  mounted() {
    if (this.getUserInfo().bin_id == 1) {
      this.params.ID = "-1";
    } else {
      THIS.params.ID = "52";
    }
    this.getNum(this.params);
    var newUser = echarts.init(document.getElementById("main"));
    var activeUser = echarts.init(document.getElementById("main1"));
    // 绘制图表
    newUser.setOption({
      color: "#409EFF",
      title: {
        text: "激活移车码数量统计"
      },
      tooltip: {},
      xAxis: {
        data: [
          "9-26",
          "9-27",
          "9-28",
          "9-29",
          "9-30",
          "10-01",
          "10-02",
          "10-03",
          "10-04",
          "10-05",
          "10-06",
          "10-07",
          "10-08",
          "10-09",
          "10-10",
          "10-11",
          "10-12",
          "10-13",
          "10-14",
          "10-15",
          "10-16",
          "10-17",
          "10-18",
          "10-19",
          "10-20",
          "10-21",
          "10-22",
          "10-23",
          "10-24",
          "10-25",
          "10-26"
        ]
      },
      yAxis: {},
      series: [
        {
          name: "人数",
          type: "bar",
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [
                { offset: 0, color: "#79bafd" },
                { offset: 1, color: "#409EFF" }
              ])
            }
          },
          data: [
            12,
            20,
            36,
            10,
            9,
            33,
            20,
            36,
            10,
            9,
            23,
            20,
            56,
            10,
            9,
            33,
            120,
            36,
            60,
            9,
            33,
            20,
            46,
            10,
            9,
            33,
            20,
            36,
            10,
            9,
            33,
            32
          ]
        }
      ],
      dataZoom: [
        {
          show: true,
          start: 0,
          end: 30
        }
      ]
    });
    activeUser.setOption({
      color: "#409EFF",
      title: {
        text: "实时中间号统计"
      },
      tooltip: {},
      xAxis: {
        data: [
          "9-26",
          "9-27",
          "9-28",
          "9-29",
          "9-30",
          "10-01",
          "10-02",
          "10-03",
          "10-04",
          "10-05",
          "10-06",
          "10-07",
          "10-08",
          "10-09",
          "10-10",
          "10-11",
          "10-12",
          "10-13",
          "10-14",
          "10-15",
          "10-16",
          "10-17",
          "10-18",
          "10-19",
          "10-20",
          "10-21",
          "10-22",
          "10-23",
          "10-24",
          "10-25",
          "10-26"
        ]
      },
      yAxis: {},
      series: [
        {
          name: "人数",
          type: "bar",
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [
                { offset: 0, color: "#79bafd" },
                { offset: 1, color: "#409EFF" }
              ])
            }
          },
          data: [
            873,
            120,
            336,
            210,
            239,
            33,
            20,
            136,
            210,
            9,
            23,
            120,
            256,
            10,
            119,
            33,
            120,
            36,
            260,
            19,
            33,
            320,
            46,
            110,
            69,
            233,
            2120,
            36,
            10,
            59,
            333,
            232
          ]
        }
      ],
      dataZoom: [
        {
          show: true,
          start: 0,
          end: 30
        }
      ]
    });
  },
  methods: {
    getNum(params) {
      this.post(
        "QrMobile/MyCallCodeMng/QueryMyBatchCount",
        this.params,
        res => {
          if (res.body.Status == 0) {
            this.allNum = res.body.Data;
          } else if (res.body.Status == -1) {
            _this.$notify.error({
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
            return false;
          }
        }
      );
    },
    searchBusiness() {
      this.getNum(this.params);
    }
  }
};
</script>

<style lang="less" scoped>
.chlidPage {
  background: #212936;
}
.statics {
  padding: 0 20px;
  box-sizing: border-box;
  .searchContainer {
    width: 100%;
    display: flex;
    align-items: center;
    background: #f2f2f2;
    border-radius: 7px;
    padding: 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .date {
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
    }
    .search {
      margin-left: 20px;
    }
  }
  #main,
  #main1 {
    height: 300px;
    margin-bottom: 30px;
  }
  .infoAll {
    border-radius: 4px;
    background-color: #2b3648;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.03);
    padding: 18px;
    color: #afbdd1;
    .infoName {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      span {
        color: #8796b0;
      }
      a {
        color: #64b9fc;
      }
    }
    .infoNum {
      font-size: 30px;
      margin-top: 4px;
      margin-bottom: 21px;
      height: 42px;
      line-height: 42px;
    }
    .infoMoney {
      .infoMoneyTitle {
        margin-bottom: 8px;
      }
    }
  }
  .map {
    background: #2b3648;
    height: 702px;
  }
}
</style>

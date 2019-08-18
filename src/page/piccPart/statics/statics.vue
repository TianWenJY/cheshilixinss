<template>
    <div class="statics">
        <div class="searchContainer">
            <span class="date">分销商</span>
            <!-- <div class="block">
                <el-date-picker v-model="value7" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                </el-date-picker>
                <el-button class="search" type="primary">查询</el-button>
            </div> -->
            <el-select placeholder="选择查看分销商" size="medium" v-if="this.getUserInfo().bin_id == 1" v-model="params.ID">
                <el-option label="总平台" value="-1"></el-option>
                <el-option label="picc" value="52"></el-option>
            </el-select>
            <el-button class="search" type="primary" size="medium" @click="searchBusiness">查询</el-button>
        </div>
        <el-row class="partStatic" style="padding-bottom: 20px;">
            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18">
                        <div slot="header" class="clearfix">
                            <span>移车码总量</span>
                        </div>
                        <div class="text">
                            {{allNum.Sum}}
                            <span>张</span>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18">
                        <div slot="header" class="clearfix">
                            <span>未激活数量</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="goCall()">查看详情</el-button>
                        </div>
                        <div class="text">
                            {{allNum.DisCount}}
                            <span>张</span>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18">
                        <div slot="header" class="clearfix">
                            <span>已激活数量</span>
                            <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
                        </div>
                        <div class="text">
                            {{allNum.ActCount}}
                            <span>张</span>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18">
                        <div slot="header" class="clearfix">
                            <span>当日激活量</span>
                            <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
                        </div>
                        <div class="text">
                            {{allNum.ActCountDaily}}
                            <span>张</span>
                        </div>
                    </el-card>
                </el-col>
            </el-col>
        </el-row>
        <div id="main">

        </div>

        <div id="main1">

        </div>
        <div id="dashboard-line">

        </div>
    </div>
</template>

<script>
var echarts = require("echarts");
export default {
  data() {
    return {
      allNum: "",
      params: {
        WToken: "HVgwl2gnoT5OH1tplmVWAj154232903710",
        ID:this.getUserInfo().mer_id
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
    if(this.getUserInfo().bin_id == 1) {
        this.params.ID = '-1';
    }else {
      THIS.params.ID ='52';
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
    margin-bottom: 30px;
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
}
</style>


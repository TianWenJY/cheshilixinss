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
          <el-form-item label="车牌号">
            <el-input
              v-model.trim="pageRequest.CarNum"
              size="medium"
              placeholder="请输入车牌号"
              clearable
            ></el-input>
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
      >
      </kt-table>

    </el-row>
  </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
export default {
  name: "smartCommunity_myFeeList",
  components: {
    KtTable,
    KtButton,
    // breadCrumb,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      shopNameList: [],
      columns: [
        {
          prop: "CarNum",
          label: "车牌号",
          minWidth: 100
        },
        {
          prop: "Acount",
          label: "账户金额",
          minWidth: 100
        },
        {
          prop: "Optioner",
          label: "操作员 ",
          minWidth: 120
        },
        { prop: "StartTime", label: "进场时间", minWidth: 220 },
        { prop: "EndTime", label: "离开时间", minWidth: 220 },
        {
          prop: "Duration",
          label: "持续时间",
          minWidth: 120,
          change: this.during
        }
      ],
      pageRequest: {
        CarNum: "",
        N: 1,
        Rows: 8
      },
      optioners: [],
      tableList: ""
    };
  },
  mounted() {
    
  },
  methods: {
    during(row, column) {
      let theTime = parseInt(row.Duration), // 秒
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
    },
    // 获取分页数据
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
      }
      this.api("NoSense/My/QueryFeeByAdminList", this.pageRequest, res => {
        this.tableList = res.Data;
      });
    }
  }
};
</script>
<style scoped  lang="less">
@import "../../assets/css/table.less";
</style>
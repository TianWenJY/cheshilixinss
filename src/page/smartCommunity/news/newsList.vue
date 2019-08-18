<template>
  <div>
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-row>
        <el-form class="filterBlock" :inline="true" :gutter="20">
          <el-row class="filterContent">
            <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1">
              <el-select
                ref="getIp"
                filterable
                placeholder="选择所属社区"
                size="medium"
                v-model="parameter.p_id"
              >
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(park,index) in parkList"
                  :label="park.sqmc"
                  :value="park.u_id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select placeholder="选择发布状态" size="medium" v-model="parameter.status">
                <el-option label="全部" value="-1"></el-option>
                <el-option label="编辑中" value="0"></el-option>
                <el-option label="发布中" value="1"></el-option>
                <el-option label="停止发布" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消息类型">
              <el-select v-model="parameter.type" placeholder="选择消息类型">
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="item in noticeSelect"
                  :key="item.id"
                  :label="item.content"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="filter">筛选</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="handleAdd">新增</el-button>
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="文章标题" min-width="350">
              <template slot-scope="scope">
                <span slot="reference" style="margin-left: 10px" class="title">{{scope.row.content}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发布时间" min-width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.addtime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="消息类型" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.type | isType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150">
              <template slot-scope="scope">
                <el-tag>
                  <span style="margin-left: 10px">{{ scope.row.status |isState}}</span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row.ID)">详情</el-button> -->
                <el-button
                  v-if="scope.row.status != 1"
                  size="mini"
                  type="warning"
                  @click="handleSet(scope.row,1)"
                >发布</el-button>
                <el-button
                  v-if="scope.row.status == 1"
                  size="mini"
                  type="danger"
                  @click="handleSet(scope.row,2)"
                >停止</el-button>
                <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <kt-pagination :data="tableList" :parameter="parameter" :total="total"></kt-pagination> -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.parameter.N"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="this.parameter.Rows"
            layout="total,prev, pager, next, jumper"
            :total="this.totle"
            style="margin-top:15px;"
          ></el-pagination>
          <!-- <el-pagination :data="tableList" :parameter="parameter"><el-pagination> -->
          <!-- </el-tab-pane> -->
          <!-- </el-tabs> -->
          <!-- <el-dialog
            title="预览"
            width="414px"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
          >
            <div></div>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
              <el-button
                :size="size"
                type="primary"
                @click.native="submitForm"
              >提交</el-button>
            </div>
          </el-dialog>-->
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import $ from "jquery";
import KtButton from "@/components/KtButton";
import { NoticeType, NoticeDetle, NoticeStatus, NoticeList } from "@/api/smart";
export default {
  name: "smartCommunity_newsList",
  computed: {},
  data() {
    return {
      dialogFormVisible: false,
      tableList: [],
      dialogTableVisible: false,
      dialogVisible: false, // 新增编辑界面是否显示
      parkList: [],
      startNight: "",
      endNight: "",
      noticeSelect: [],
      totle: 0,
      initApi: "",
      addApi: "",
      operation: false, // true:新增, false:编辑
      shopNameList: [],
      isNight: "",
      parameter: {
        p_id:
          this.getUserInfo().bin_id == 1
            ? "-1"
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        WToken: "",
        addtime: "",
        status: "-1",
        type: "-1",
        N: 1,
        Rows: 8
      }
    };
  },
  filters: {
    isState(value) {
      if (value == "0") {
        return "编辑中";
      } else if (value == "1") {
        return "发布中";
      } else if (value == "2") {
        return "暂未发布";
      }
    },
    isType(value) {
      if (value == "1") {
        return "公告";
      } else if (value == "2") {
        return "建设";
      } else if (value == "3") {
        return "动态";
      } else if (value == "4") {
        return "组织";
      } else if (value == "5") {
        return "法制";
      } else if (value == "6") {
        return "生活";
      }
    }
  },
  mounted() {
    this.GetList(this.parameter);
    this.getPark();
    this.getNoticeType();
    // console.log(this.$store.dispatch('getcommunityList'));
  },
  computed: {
    getdata() {
      return this.$store.state.smart.communityList;
    }
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
    jsonParse: function(json) {
      return JSON.parse(json);
    },
    isPayName(value) {
      if (value == "1") {
        return "现金";
      } else if (value == "2") {
        return "微信";
      } else if (value == "3") {
        return "支付宝";
      } else if (value == "4") {
        return "无感支付";
      } else if (value == "5") {
        return "特殊支付";
      }
    },
    getInfo() {
      this.dialogVisible = true;
    },
    getNoticeType() {
      NoticeType({ b_id: 4 }).then(res => {
        if (res.Status == 0) {
          this.noticeSelect = res.Data;
        } else {
          this.tableList = { Count: "0", Rows: [] };
        }
      });
    },
    GetList(parame) {
      NoticeList(parame).then(res => {
        if (res.Status == 0) {
          this.tableList = res.Data.Rows;
          this.totle = parseInt(res.Data.Count);
        } else {
          this.tableList = [];
        }
      });
    },
    handleAdd() {
      this.$router.push({ path: "/smartCommunity/news" });
    },
    getPark: function() {
      this.api("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
        this.parkList = res.Data;
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        NoticeDetle({ id: row.id }).then(res => {
          if (res.Status == 0) {
            this.$message({ message: "删除成功", type: "success" });
            this.parameter.N = 1;
            this.GetList(this.parameter);
          } else {
          }
        });
      });
    },
    handleSet(row, isSet) {
      this.$confirm("确认要改变设置吗？", "提示", {
        type: "warning"
      }).then(() => {
        NoticeStatus({ id: row.id, status: isSet }).then(res => {
          if (res.Status == 0) {
            this.$message({ message: "设置成功", type: "success" });
            this.parameter.N = 1;
            this.GetList(this.parameter);
          } else {
          }
        });
      });
    },
    handleEdit(row) {
      this.$router.push({
        name: "smartCommunity_news",
        params: {
          id: row.id
        }
      });
    },
    filter() {
      this.parameter.N = 1;
      console.log(this.parameter);
      this.GetList(this.parameter);
    }
  }
};
</script>
<style scoped lang="less">
@import "../../../assets/css/table.less";
.title {
  color: #3399cc;
  // cursor: pointer;
}
.el-popover {
  height: 716px;
}
</style>
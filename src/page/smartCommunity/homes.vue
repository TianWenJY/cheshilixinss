<template>
  <div style="margin-top: 20px;">
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form :inline="true" :model="pageRequest" size="small" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1">
            <el-select placeholder="选择所属社区" filterable size="small" v-model="pageRequest.p_id">
              <el-option label="全部" value></el-option>
              <el-option
                v-for="(commun,index) in Community"
                :label="commun.sqmc"
                :value="commun.u_id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业主姓名">
            <el-input v-model.trim="pageRequest.yzxm" size="small" clearable placeholder="请输入业主姓名"></el-input>
          </el-form-item>
          <el-form-item label="业主手机号">
            <el-input
              v-model.trim="pageRequest.yzsj"
              size="small"
              clearable
              placeholder="请输入业主手机号"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button
              label="查询"
              type="primary"
              @click="findPage(null)"
              size="small"
              :loading="onLoading"
            />
          </el-form-item>
          <el-form-item>
            <kt-button label="新增" type="primary" @click="handleAdd" size="small"/>
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
        :showOperation="true"
        @handleEdit="handleEdit"
        :maxHeight="500"
        @handleDelete="handleDelete"
        ref="table"
      ></kt-table>

      <!--新增编辑界面-->
      <el-dialog
        :title="operation?'新增':'编辑'"
        width="40%"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
      >
        <el-form
          :model="dataForm"
          label-width="150px"
          :rules="dataFormRules"
          ref="dataForm"
          :size="size"
        >
          <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1">
            <el-select placeholder="选择所属所属社区" size="medium" filterable v-model="dataForm.p_id">
              <el-option
                v-for="(commun,index) in Community"
                :label="commun.sqmc"
                :value="commun.u_id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号">
            <el-input v-model="dataForm.lh" placeholder="请输入楼号"></el-input>
          </el-form-item>
          <el-form-item label="单元号">
            <el-input v-model="dataForm.dyh" placeholder="请输入单元号"></el-input>
          </el-form-item>
          <el-form-item label="房间号">
            <el-input v-model="dataForm.fjh" placeholder="请输入房间号"></el-input>
          </el-form-item>
          <el-form-item label="房屋面积">
            <el-input v-model="dataForm.fwmj" placeholder="请输入房屋面积"></el-input>
          </el-form-item>
          <el-form-item label="房改情况">
            <el-select v-model="dataForm.fgqk" placeholder="请选择房改情况 " size="medium">
              <el-option label="已房改" value="0"></el-option>
              <el-option label="未房改" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业主姓名">
            <el-input v-model="dataForm.yzxm" placeholder="请输入业主姓名"></el-input>
          </el-form-item>、
          <el-form-item label="业主身份证">
            <el-input v-model="dataForm.yzsfz" placeholder="请输入业主身份证"></el-input>
          </el-form-item>

          <el-form-item label="业主单位名称">
            <el-input v-model="dataForm.yzdw" placeholder="请输入业主单位名称"></el-input>
          </el-form-item>
          <el-form-item label="业主目前是否在职">
            <el-select v-model="dataForm.sfzz" placeholder="请选择业主目前是否在职 " size="medium">
              <el-option label="在职" value="0"></el-option>
              <el-option label="退休" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业主手机">
            <el-input v-model="dataForm.yzsj" placeholder="请输入业主手机"></el-input>
          </el-form-item>
          <el-form-item label="现居住人姓名">
            <el-input v-model="dataForm.jzrsm" placeholder="请输入现居住人姓名"></el-input>
          </el-form-item>
          <el-form-item label="现居住人手机">
            <el-input v-model="dataForm.jzrsj" placeholder="请输入现居住人手机"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm">提交</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { homeList } from "@/api/smart";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
export default {
  name: "smartCommunity_homes",
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
          prop: "sqmc",
          label: "所属社区",
          minWidth: 150
        },
        { prop: "lh", label: "楼号", minWidth: 120 },
        { prop: "dyh", label: "单元号", minWidth: 150 },
        {
          prop: "fjh",
          label: "房间号",
          minWidth: 150
        },
        // {
        //   prop: "fwmj",
        //   label: "房屋面积",
        //   minWidth: 180
        // },
        {
          prop: "fgqk",
          label: "房改情况",
          minWidth: 180
          //   change: this.in_out
        },
        {
          prop: "yzxm",
          label: "业主姓名",
          minWidth: 180
        },
        {
          prop: "yzsfz",
          label: "业主身份证",
          minWidth: 180
        },
        {
          prop: "yzdw",
          label: "业主单位名称",
          minWidth: 240
        },
        {
          prop: "sfzz",
          label: "业主目前是否在职",
          minWidth: 180,
          change: this.sfzz
        },
        {
          prop: "yzsj",
          label: "业主手机",
          minWidth: 180
        },
        {
          prop: "jzrsm",
          label: "现居住人姓名",
          minWidth: 180
        },
        {
          prop: "jzrsj",
          label: "现居住人手机",
          minWidth: 180
        },
        {
          prop: "AddTime",
          label: "添加时间 ",
          minWidth: 150
        }
      ],
      pageRequest: {
        p_id:
          this.getUserInfo().bin_id == 1
            ? ""
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        lh: "",
        dyh: "",
        fjh: "",
        fwmj: "",
        fgqk: "-1",
        yzxm: "",
        yzsfz: "",
        yzdw: "",
        sfzz: "-1",
        yzsj: "",
        jzrsm: "",
        WToken: "",
        jzrsj: "",
        N: 1,
        Rows: 8
      },
      optioners: [],
      tableList: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      onLoading: false,
      editLoading: false,
      Community: [],
      dataForm: {},
      // 新增编辑界面数据
      dataFormRules: {
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      }
    };
  },
  mounted() {
    // this.getOpreat();
    this.getPark();
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
    sfzz(row) {
      if (row.sfzz == 1) {
        return "退休";
      } else if (row.sfzz == 0) {
        return "在职";
      }
    },
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
        this.onLoading = true;
        this.$refs.table.loading = true;
      }
      homeList(this.pageRequest)
        .then(res => {
          if (res.Status == 0) {
            this.tableList = res.Data;
            this.onLoading = false;
            this.$refs.table.loading = false;
          }
        })
        .then(data != null ? data.callback : "");
    },
    getOpreat() {
      this.api("NoSense/Administrator/QueryAdminList", {}, res => {
        this.optioners = res.Data.Rows;
      });
    },
    // 删除
    handleDelete(row) {
      this.Delete("NoSense/Houses/DelHouses", { id: row.id }, this.findPage);
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        p_id:
          this.getUserInfo().bin_id == 1
            ? "-1"
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        lh: "",
        dyh: "",
        fjh: "",
        fwmj: "",
        fgqk: "",
        yzxm: "",
        yzsfz: "",
        yzdw: "",
        sfzz: "",
        yzsj: "",
        jzrsm: "",
        WToken: "",
        jzrsj: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.operation = false;
      Object.assign(this.dataForm, row);
    },
    getPark: function() {
      this.api("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
        this.Community = res.Data;
      });
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if (this.operation) {
              api = "NoSense/Houses/AddHouses";
            } else {
              api = "NoSense/Houses/UpdateHouses";
            }
            let params = this.dataForm;
            this.api(api, params, res => {
              this.$message({ message: "操作成功", type: "success" });
              this.dialogVisible = false;
              this.$refs["dataForm"].resetFields();
              this.findPage();
            });
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@import "../../assets/css/table.less";
</style>
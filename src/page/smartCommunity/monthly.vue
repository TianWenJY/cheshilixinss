<template>
  <div style="margin-top: 20px;">
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form :inline="true" :model="pageRequest" size="medium" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <community-list :pageRequest="pageRequest"></community-list>
          <el-form-item label="用户名称" label-width="80px">
            <el-input v-model.trim="pageRequest.name" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" v-if="this.getUserInfo().bin_id != 1">
            <el-input v-model.trim="pageRequest.mobile" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="车牌号" label-width="80px">
            <el-input v-model.trim="pageRequest.car_num" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否可用" label-width="80px">
            <el-select placeholder="选择是否可用" size="medium" v-model="pageRequest.enable">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="不可用" value="0"></el-option>
              <el-option label="可用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="findPage(null)" :loading="onLoading">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <kt-button label="新增" type="primary" @click="handleAdd" size="medium"/>
          </el-form-item>
          <el-form-item>
            <kt-button label="导出" type="warning" @click="exports" size="medium"/>
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
          <community-list :dataForm="dataForm"></community-list>
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="dataForm.mobile" placeholder="请输入手机号" prop="mobile"></el-input>
          </el-form-item>
          <el-form-item label="月租车到期时间">
            <el-date-picker
              v-model="dataForm.expiration_date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
              prop="date"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="车牌号" prop="car_num">
            <el-input v-model="dataForm.car_num" placeholder="请输入车牌号"></el-input>
          </el-form-item>
          <el-form-item label="请选择是否可用" prop="enable">
            <el-select v-model="dataForm.enable" placeholder="请选择是否可用" size="medium">
              <el-option label="不可用" value="0"></el-option>
              <el-option label="可用" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
          <!-- :loading="editLoading" -->
          <el-button :size="size" type="primary" @click.native="submitForm">提交</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { getList } from "@/api/smart";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
import communityList from "@/page/smartCommunity/communityList/communityList";
export default {
  name: "smartCommunity_monthly",
  components: {
    KtTable,
    KtButton,
    communityList,
    // breadCrumb,
    TableTreeColumn
  },
  data() {
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      size: "small",
      shopnameList: [],
      columns: [
        { prop: "name", label: "用户名称", minWidth: 150 },
        { prop: "mobile", label: "手机号", minWidth: 150 },
        {
          prop: "expiration_date",
          label: "月租车到期时间",
          minWidth: 180
        },
        {
          prop: "car_num",
          label: "车牌号",
          minWidth: 180
        },
        {
          prop: "enable",
          label: "是否可用",
          minWidth: 150,
          change: this.InOrOut
        }
      ],
      pageRequest: {
        mer_id:
          this.getUserInfo().bin_id == 1
            ? ""
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        name: "",
        mobile: "",
        car_num: "",
        enable: "0",
        N: 1,
        Rows: 8
      },
      shopNameList: "",
      onLoading: false,
      initApi: "",
      addApi: "",
      tableList: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataForm: {},
      // 新增编辑界面数据
      dataFormRules: {
        DeviceNum: [
          { required: true, message: "请输入设备唯一标识", trigger: "blur" }
        ],
        enable: [
          { required: true, message: "请选择是否可用", trigger: "change" }
        ],
        park: [{ required: true, message: "必须选择社区", trigger: "change" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        mobile: [{ required: true, trigger: "blur", validator: validPhone }],
        date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getPark();
  },
  methods: {
    // 获取分页数据
    InOrOut(row) {
      if (row.enable == 1) {
        return "可用";
      } else if (row.enable == 0) {
        return "禁用";
      }
    },
    exports() {
      location.href = this.url+"NoSense/Tenant/ExportTenantUser";
    },
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
        this.onLoading = true;
        this.$refs.table.loading = true;
      }
      let api = "NoSense/Tenant/QueryTenantUser";
      let params;
      let thisApi;
      if (location.href.indexOf("csl.ycpicc.com") != -1) {
        thisApi = "http://csl.ycpicc.com:8058/zhsq/socket/post.action";
        params = {
          u_id: this.pageRequest.mer_id,
          url: api,
          param:
            "name=" +
            this.pageRequest.name +
            "&WToken=" +
            this.pageRequest.WToken +
            "&mer_id=" +
            this.pageRequest.mer_id +
            "&mobile=" +
            this.pageRequest.mobile +
            "&car_num=" +
            this.pageRequest.car_num +
            "&enable=" +
            this.pageRequest.enable +
            "&N=" +
            this.pageRequest.N +
            "&Rows=" +
            this.pageRequest.Rows
        };
      } else {
        thisApi = api;
        params = this.pageRequest;
      }

      getList(thisApi, params)
        .then(res => {
          if (res.Status == 0) {
            this.tableList = res.Data;
          } else {
            this.tableList = { Count: "0", Rows: [] };
          }
          this.onLoading = false;
          this.$refs.table.loading = false;
        })
    },
    getPark: function() {
      this.api("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
        this.shopNameList = res.Data;
      });
    },
    // 删除
    handleDelete(row) {
      let api = "NoSense/Tenant/DelTenantUser";
      let params;
      let thisApi;
      if (location.href.indexOf("csl.ycpicc.com") != -1) {
        thisApi = "http://csl.ycpicc.com:8058/zhsq/socket/post.action";
        params = {
          u_id: row.mer_id,
          url: api,
          param: "id=" + row.id
        };
      } else {
        thisApi = api;
        params = { id: row.id };
      }
      this.Delete(thisApi, params, this.findPage);
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        mer_id:
          this.getUserInfo().bin_id == 1
            ? ""
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        id: "",
        name: "",
        mobile: "",
        expiration_date: "",
        car_num: "",
        enable: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.operation = false;
      Object.assign(this.dataForm, row);
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if (this.operation) {
              api = "NoSense/Tenant/AddTenantUser";
            } else {
              api = "NoSense/Tenant/EditTenantUser";
            }
            let params;
            let thisApi;
            if (location.href.indexOf("csl.ycpicc.com") != -1) {
              thisApi = "http://csl.ycpicc.com:8058/zhsq/socket/post.action";
              params = {
                u_id: this.dataForm.mer_id,
                url: api,
                param:
                  "id=" +
                  this.dataForm.id +
                  "&mer_id=" +
                  this.dataForm.mer_id +
                  "&name=" +
                  this.dataForm.name +
                  "&car_num=" +
                  this.dataForm.car_num +
                  "&mobile=" +
                  this.dataForm.mobile +
                  "&expiration_date=" +
                  this.dataForm.expiration_date +
                  "&enable=" +
                  this.dataForm.enable
              };
            } else {
              thisApi = api;
              params = this.dataForm;
            }
            this.api(
              thisApi,
              params,
              res => {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                this.findPage();
              },
              res => {
                if (res.retCode == "9") {
                  this.$message({
                    message: "请求错误 ， " + res.retMsg,
                    type: "error"
                  });
                }
              }
            );
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
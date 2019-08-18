<template>
  <div style="margin-top: 20px;">
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form :inline="true" :model="pageRequest" size="medium" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <community-list :pageRequest="pageRequest"></community-list>
          <el-form-item label="车牌号"  label-width="80px">
            <el-input
              v-model.trim="pageRequest.car_num"
              size="medium"
              placeholder="请输入车牌号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名称"  label-width="80px">
            <el-input v-model.trim="pageRequest.name" size="medium" placeholder="请输入用户名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" label-width="80px">
            <el-input
              v-model.trim="pageRequest.mobile"
              size="medium"
              placeholder="请输入手机号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button
              label="查询"
              type="primary"
              @click="findPage(null)"
              size="medium"
              :loading="onLoading"
            />
          </el-form-item>
          <el-form-item>
            <kt-button label="新增" type="primary" @click="handleAdd" size="medium"/>
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
        ref="table"
        @handleDelete="handleDelete"
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
          <el-form-item label="用户名称" prop="Name">
            <el-input v-model="dataForm.name" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="车牌号" prop="car_num">
            <el-input v-model="dataForm.car_num" placeholder="请输入车牌号"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="Mobile">
            <el-input v-model="dataForm.mobile" placeholder="请输入手机号"></el-input>
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
import CommunityList from "@/page/smartCommunity/communityList/communityList";
export default {
  name: "smartCommunity_blackList",
  components: {
    KtTable,
    KtButton,
    CommunityList,
    // breadCrumb,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      parkList: [],
      columns: [
        { prop: "name", label: "用户名称", minWidth: 120 },
        { prop: "car_num", label: "车牌号", minWidth: 150 },
        {
          prop: "mobile",
          label: "手机号",
          minWidth: 150
        },
        {
          prop: "addtime",
          label: "添加时间 ",
          minWidth: 150
        }
      ],
      pageRequest: {
        WToken: "",
        mer_id:
          this.getUserInfo().bin_id == 1
            ? ""
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        name: "",
        mobile: "",
        car_num: "",
        N: 1,
        Rows: 8
      },
      optioners: [],
      initApi: "",
      addApi: "",
      tableList: {},
      onLoading: false,
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataForm: {},
      // 新增编辑界面数据
      dataFormRules: {
        // car_num: [
        //   { required: true, message: "请输入车牌号", trigger: "blur" },
        //   {
        //     pattern: /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/,
        //     message: "请输入正确的车牌号"
        //   }
        // ]
      }
    };
  },
  mounted() {},
  methods: {
    InOrOut(row) {
      if (row.InOrOut == 1) {
        return "出口设备";
      } else if (row.InOrOut == 0) {
        return "进入设备";
      }
    },
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
        this.onLoading = true;
        this.$refs.table.loading = true;
      }
      let params;
      let thisApi;
      let api = "NoSense/BlackWhite/QueryBlackList";
      if (location.href.indexOf("csl.ycpicc.com") != -1) {
        thisApi = "http://csl.ycpicc.com:8058/zhsq/socket/post.action";
        params = {
          u_id: this.pageRequest.mer_id,
          url: api,
          param:
            "name=" +
            this.pageRequest.name +
            "&car_num=" +
            this.pageRequest.car_num +
            "&mobile=" +
            this.pageRequest.mobile +
            "&WToken=" +
            this.getToken() +
            "&mer_id=" +
            this.pageRequest.mer_id +
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
    // 删除
    handleDelete(row) {
      let api = "NoSense/BlackWhite/DelBlack";
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
        WToken: "",
        mer_id:
          this.getUserInfo().bin_id == 1
            ? ""
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        name: "",
        mobile: "",
        car_num: ""
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
              api = "NoSense/BlackWhite/AddBlack";
            } else {
              api = "NoSense/BlackWhite/EditBlack";
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
                  "&WToken=" +
                  this.getToken() +
                  "&mer_id=" +
                  this.dataForm.mer_id +
                  "&name=" +
                  this.dataForm.name +
                  "&car_num=" +
                  this.dataForm.car_num +
                  "&mobile=" +
                  this.dataForm.mobile
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
                    message: "操作失败 ， " + res.retMsg,
                    type: "error"
                  });
                } else {
                  this.$message({
                    message: "操作失败, " + res.Data,
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
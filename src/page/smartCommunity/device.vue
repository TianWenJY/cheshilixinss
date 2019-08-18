<template>
  <div style="margin-top: 20px;">
    <el-row class="containt">
      <el-form :inline="true" :model="pageRequest" size="medium" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <community-list :pageRequest="pageRequest"></community-list>
          <el-form-item label="设备唯一标识">
            <el-input
              v-model.trim="pageRequest.device_num"
              size="medium"
              placeholder="请输入设备唯一标识"
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
          <el-form-item label="设备唯一标识" prop="device_num">
            <el-input v-model="dataForm.device_num" placeholder="请输入设备唯一标识"></el-input>
          </el-form-item>
          <el-form-item label="设备所属通道" prop="channel">
            <el-input v-model="dataForm.channel" placeholder="请输入设备所属通道"></el-input>
          </el-form-item>
          <el-form-item label="设备进出类型" prop="in_out">
            <el-select v-model="dataForm.in_out" placeholder="请选择设备进出类型" size="medium">
              <el-option label="进入设备" value="0"></el-option>
              <el-option label="出口设备" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备IP地址">
            <el-input v-model="dataForm.ip_address" placeholder="请输入设备IP地址"></el-input>
          </el-form-item>
          <!--<el-form-item label="语音播报内容" prop="speak">
            <el-input v-model="dataForm.speak" placeholder="请输入设备语音播报内容"></el-input>
          </el-form-item>
          <el-form-item label="显示屏显示内容" prop="view">
            <el-input v-model="dataForm.view" placeholder="请输入设备显示屏显示内容"></el-input>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
          <el-button
            :size="size"
            type="primary"
            @click.native="submitForm"
            :loading="editLoading"
          >提交</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
import { deviceList, submit } from "@/api/smart";
import CommunityList from "@/page/smartCommunity/communityList/communityList";
export default {
  name: "smartCommunity_device",
  components: {
    KtTable,
    KtButton,
    CommunityList,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      initApi: "",
      addApi: "",
      columns: [
        { prop: "sqmc", label: "所属社区", minWidth: 150 },
        { prop: "device_num", label: "设备标识", minWidth: 120 },
        { prop: "channel", label: "设备所属通道", minWidth: 150 },
        {
          prop: "in_out",
          label: "设备进出类型",
          minWidth: 150,
          change: this.in_out
        },
        {
          prop: "ip_address",
          label: "设备IP",
          minWidth: 180
        },
//      {
//        prop: "speak",
//        label: "设备语音播报内容",
//        minWidth: 180
//      },
//      {
//        prop: "view",
//        label: "设备显示屏显示内容",
//        minWidth: 180
//      },
        {
          prop: "addtime",
          label: "添加时间 ",
          minWidth: 150
        }
      ],
      pageRequest: {
        in_out: "-1",
        device_num: "",
        WToken: "",
        channel: "",
        mer_id:
          this.getUserInfo().bin_id == 1
            ? ""
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        N: 1,
        Rows: 8
      },
      optioners: [],
      onLoading: false,
      parkList: [],
      tableList: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataForm: {},
      // 新增编辑界面数据
      dataFormRules: {
        device_num: [
          { required: true, message: "请输入设备唯一标识", trigger: "blur" }
        ],
        channel: [
          { required: true, message: "请输入设备所属通道", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }]
//      speak: [
//        { required: true, message: "请输入设备语音播报内容", trigger: "blur" }
//      ],
//      view: [
//        { required: true, message: "设备显示屏显示内容", trigger: "blur" }
//      ]
      }
    };
  },
  mounted() {},
  computed: {},
  methods: {
    // 获取分页数据
    in_out(row) {
      if (row.in_out == 1) {
        return "出口设备";
      } else if (row.in_out == 0) {
        return "进入设备";
      }
    },
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
        this.onLoading = true;
        this.$refs.table.loading = true;
      }
      let api;
      let params;
      1;
      if (location.href.indexOf("csl.ycpicc.com") != -1) {
        api = "http://csl.ycpicc.com:8058/zhsq/socket/post.action";
        params = {
          u_id: this.pageRequest.mer_id,
          url: "NoSense/Device/QueryDeviceList",
          param:
            "in_out=" +
            this.pageRequest.in_out +
            "&WToken=" +
            this.pageRequest.WToken +
            "&mer_id=" +
            this.pageRequest.mer_id +
            "&N=" +
            this.pageRequest.N +
            "&Rows=" +
            this.pageRequest.Rows
        };
      } else {
        api = "NoSense/Device/QueryDeviceList";
        params = this.pageRequest;
      }
      deviceList(api, params)
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
      let api = "NoSense/Device/DelDevice";
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
        device_num: "",
        mer_id:
          this.getUserInfo().bin_id == 1
            ? ""
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        channel: "",
        ip_address: "",
        in_out: "",
        speak: "",
        view: ""
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
            let thisApi;
            if (this.operation) {
              api = "NoSense/Device/AddDevice";
            } else {
              api = "NoSense/Device/EditDevice";
            }
            let params;
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
                  "&device_num=" +
                  this.dataForm.device_num +
                  "&channel=" +
                  this.dataForm.channel +
                  "&ip_address=" +
                  this.dataForm.ip_address +
                  "&in_out=" +
                  this.dataForm.in_out +
                  "&speak=" +
                  this.dataForm.speak +
                  "&view=" +
                  this.dataForm.view
              };
            } else {
              thisApi = api;
              params = this.dataForm;
            }
            submit(thisApi, params)
              .then(res => {
                this.editLoading = false;
                if (res.Status == 0) {
                  this.$message({ message: "操作成功", type: "success" });
                  this.dialogVisible = false;
                  this.$refs["dataForm"].resetFields();
                  this.findPage();
                } else {
                  this.$message({
                    message: "操作失败, " + res.Data,
                    type: "error"
                  });
                }
              })
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
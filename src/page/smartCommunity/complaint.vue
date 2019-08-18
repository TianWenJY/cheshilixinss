<template>
  <div style="margin-top: 20px;">
    <!--工具栏-->
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-form :inline="true" :model="pageRequest" size="medium" class="filterBlock" :gutter="20">
        <el-row class="filterContent">
          <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1" label-width="80px">
            <el-select placeholder="选择所属社区" filterable size="medium" v-model="pageRequest.u_id">
              <el-option label="全部" value="-1"></el-option>
              <el-option
                v-for="(commun,index) in Community"
                :label="commun.sqmc"
                :value="commun.u_id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报事类型" label-width="80px">
            <el-select placeholder="选择报事类型" size="medium" v-model="pageRequest.post_type">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="投诉" value="0"></el-option>
              <el-option label="报修" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理状态" label-width="80px">
            <el-select placeholder="选择处理状态" size="medium" v-model="pageRequest.status">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="未受理" value="0"></el-option>
              <el-option label="已派单" value="1"></el-option>
              <el-option label="已完成" value="2"></el-option>
              <el-option label="已评价" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号" label-width="80px">
            <el-input
              v-model.trim="pageRequest.buliding_no"
              size="medium"
              placeholder="请输入楼号"
              clearable
            ></el-input>
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
        @handleImg="handleImg"
        :noShow="true"
        :maxHeight="500"
        ref="table"
      ></kt-table>

      <!--新增编辑界面-->
      <el-dialog title="派单" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <el-form
          :model="dataForm"
          label-width="150px"
          :rules="dataFormRules"
          ref="dataForm"
          :size="size"
        >
          <el-form-item label="受理人员">
            <el-select placeholder="选择受理人员" size="medium" v-model="dataForm.receiver">
              <el-option
                v-for="(staff,index) in staff"
                :label="staff.name"
                :value="staff.mer_id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
          <!-- :loading="editLoading" -->
          <el-button :size="size" type="primary" @click.native="submitForm">提交</el-button>
        </div>
      </el-dialog>
      <!--客户车辆信息界面-->
      <div class="customerImg">
        <el-dialog
          title="投诉图片详情"
          width="40%"
          :visible.sync="imgVisible"
          :close-on-click-modal="false"
        >
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item,index) in picImg" :key="index">
              <img class="swiper-img" :src="item" style="width: 100%; height:300px">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <!-- <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>-->
          </swiper>
        </el-dialog>
      </div>
    </el-row>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import KtTable from "@/components/KtTable";
import { complaintList, complaintImg, complaintStaff } from "@/api/smart";
export default {
  name: "smartCommunity_complaint",
  components: {
    KtTable,
    KtButton,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      parkList: [],
      swiperOption: {
        pagination: ".swiper-pagination",
        paginationType: "fraction",
        nextButton: ".swiper-button-next", //前进按钮的css选择器或HTML元素。
        prevtButton: ".swiper-button-prev" //后退按钮的css选择器或HTML元素。
      },
      columns: [
        {
          prop: "sqmc",
          label: "所属社区",
          minWidth: 120
        },
        {
          prop: "post_type",
          label: "报事类型",
          minWidth: 120,
          change: this.postType
        },
        {
          prop: "post_category",
          label: "报事类别",
          minWidth: 150,
          change: this.category
        },
        {
          prop: "mobile",
          label: "联系电话",
          minWidth: 150
        },
        {
          prop: "buliding_no",
          label: "楼号",
          minWidth: 150
        },
        {
          prop: "unit_no",
          label: "单元号",
          minWidth: 150
        },
        {
          prop: "house_no",
          label: "房间号",
          minWidth: 150
        },
        {
          prop: "receiver_name",
          label: "受理人",
          minWidth: 150
        },
        {
          prop: "status",
          label: "维修状态",
          minWidth: 150,
          change: this.status
        },
        {
          prop: "executive_staff",
          label: "执行人员",
          minWidth: 150
        },
        {
          prop: "finish_time",
          label: "完成时间",
          minWidth: 150
        },
        {
          prop: "feedback",
          label: "评价内容",
          minWidth: 150
        },
        {
          prop: "reporter",
          label: "报事人",
          minWidth: 150
        },
        {
          prop: "executive_result",
          label: "维修结果",
          minWidth: 200
        },
        {
          prop: "addtime",
          label: "添加时间 ",
          minWidth: 150
        }
      ],
      pageRequest: {
        u_id:
          this.getUserInfo().bin_id == 1
            ? "-1"
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        post_type: "-1",
        post_category: "-1",
        buliding_no: "",
        unit_no: "",
        house_no: "",
        status: "-1",
        mobile: "",
        car_num: "",
        N: 1,
        Rows: 8
      },
      optioners: [],
      onLoading: false,
      picImg: "",
      Community: "",
      tableList: {},
      staff: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      imgVisible: false,
      editLoading: false,
      dataForm: {},
      // 新增编辑界面数据
      dataFormRules: {
        receiver: [
          { required: true, message: "请输入受理人员", trigger: "blur" }
        ]
      },
      dataForm: {
        id: "",
        status: "",
        receiver: ""
      }
    };
  },
  mounted() {
    this.getCommun();
  },
  methods: {
    // 获取分页数据
    postType(row) {
      if (row.post_type == 1) {
        return "报修";
      } else if (row.InOrOut == 0) {
        return "投诉";
      }
    },
    category(row) {
      if (row.post_category == 1) {
        return "户内报事";
      }
    },
    status(row) {
      if (row.status == 0) {
        return "未受理";
      }
      if (row.status == 1) {
        return "已派单";
      } else if (row.status == 2) {
        return "已完成";
      } else if (row.status == 3) {
        return "已评价";
      }
    },
    findPage: function(data) {
      if (data == null) {
        this.pageRequest.N = 1;
        this.onLoading = true;
        this.$refs.table.loading = true;
      }
      complaintList(this.pageRequest)
        .then(res => {
          if (res.Status == 0) {
            this.tableList = res.Data;
            this.onLoading = false;
            this.$refs.table.loading = false;
          }
        })
        .then(data != null ? data.callback : "");
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.dataForm.id = row.id;
      this.dataForm.status = row.status;
      this.dataForm.u_id = row.u_id;
      this.getStart(row.u_id);
    },
    handleImg: function(row) {
      complaintImg({ id: row.id }).then(res => {
        if (res.Status == 0) {
          this.picImg = res.Data.pic_url;
          if (this.picImg) {
            this.picImg = this.picImg.split(",");
            console.log(this.picImg);
            this.imgVisible = true;
          } else {
            this.$message({
              message: "该用户暂未上传图片",
              type: "warning"
            });
          }
        }
      });
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = this.dataForm;
            this.api("NoSense/Complaint/UpdateComplaint", params, res => {
              this.$message({ message: "操作成功", type: "success" });
              this.dialogVisible = false;
              this.dataForm.receiver = '';
              this.$refs["dataForm"].resetFields();
              this.findPage();
            });
          });
        }
      });
    },
    getCommun: function() {
      this.api("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
        this.Community = res.Data;
      });
    },
    getStart: function(uid) {
      complaintStaff({mer_id:uid})
        .then(res => {
          if (res.Status == 0) {
            this.staff = res.Data;
          }
        })
    }
  }
};
</script>
<style scoped lang="less">
@import "../../assets/css/table.less";
</style>
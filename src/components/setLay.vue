<template>
  <div>
      <el-dialog
        title="设置默认状态"
        width="30%"
        :visible.sync="flag"
        :close-on-click-modal="false"
      >


        <el-form
          :model="dataForm"
          label-width="150px"
          ref="dataForm"
          label-position="right"
        >
          <el-form-item
            label="是否自自动抬杆"
            prop="old_pwd"
          >
            <el-checkbox v-model="check"></el-checkbox>
          </el-form-item>
          <el-form-item
            label="请选择出口相机"
            prop="old_pwd"
          >
            <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item[1]"
                :value="item[0]">
                </el-option>
            </el-select>
          </el-form-item>
        </el-form>


        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            :size="size"
            @click.native="flag = false"
          >取消</el-button>
          <!-- :loading="editLoading" -->
          <el-button
            :size="size"
            type="primary"
            @click.native="submitForm"
          >提交</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: "setLay",
  props: {},
  data() {
    return {
      size: "small",
      flag: false,
      dataForm: {
          status: true
      },
      check: this.getUserInfo().Defaultopen==2?true:false,
      mer_id: this.getUserInfo().bin_id == 1 ? "" :this.getUserInfo().p_id== 0?this.getUserInfo().mer_id:this.getUserInfo().p_id,
      options: [],
      value: this.getUserInfo().DefaultDeviceNum==0?'':this.getUserInfo().DefaultDeviceNum
    };
  },
  methods: {
     obtainValue(value) {

          console.log(value)

      },
      submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.api("NoSense/Setting/AddDefDevNum", {
                mer_id: this.getUserInfo().mer_id,
                device_id: this.value,
                is_open: this.checkNum
            }, res => {
              this.$message({
                message: "设置成功",
                type: "success"
              });
              this.$refs["dataForm"].resetFields();
              this.flag = false;
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    findPage: function(data) {
      this.api("NoSense/Setting/QueryDevNumSelect", {}, res => {
          if(res.Status==0){
              this.options = res.Data;
              this.options.unshift([0, '请选择']);
          }else{
              alert('请求相机失败');
          }
      },res => {
          this.options = { Count: "0", Rows: [] };
        });
    }
  },
  computed: {
      checkNum() {
          return this.check?2:1
      }
  },
  mounted() {
  }
};
</script>

<style scoped>

</style>
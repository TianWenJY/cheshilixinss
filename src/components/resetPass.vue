<template>
  <div>
      <el-dialog
        title="修改密码"
        width="30%"
        :visible.sync="setPassWord"
        :close-on-click-modal="false"
      >
        <el-form
          :model="dataForm"
          label-width="150px"
          :rules="dataFormRules"
          ref="dataForm"
          label-position="right"
        >
          <el-form-item
            label="旧密码"
            prop="old_pwd"
          >
            <el-input
              v-model="dataForm.old_pwd"
              placeholder="请输入旧密码"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="new_pwd"
          >
            <el-input
              v-model="dataForm.new_pwd"
              placeholder="请输入新密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认新密码"
            prop="checkPass"
          >
            <el-input
              v-model="dataForm.checkPass"
              autocomplete="off"
              placeholder="请再次输入新密码确认"
            ></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            :size="size"
            @click.native="setPassWord = false"
          >取消</el-button>
          <!-- :loading="editLoading" -->
          <el-button
            :size="size"
            type="primary"
            @click.native="submitForm"
          >提交</el-button>
          <el-button
            :size="size"
            @click="resetForm('dataSubmit')"
          >重置</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: "resetPass",
  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.dataForm.checkPass !== "") {
          this.$refs.dataForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.dataForm.new_pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      size: "small",
      setPassWord: false,
      dataFormRules: {
        old_pwd: [
          { required: true, message: "必须输入旧密码", trigger: "blur" }
        ],
        new_pwd: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      },
      dataForm: {
        mer_id: this.getUserInfo().mer_id,
        old_pwd: "",
        new_pwd: "",
        checkPass: ""
      },
      new_pwd: ""
    };
  },
  methods: {
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.api("PubInterface/User/UpdateUserPwd", this.dataForm, res => {
              this.$message({
                message: "恭喜你,修改密码成功，将在下次登录时生效",
                type: "success"
              });
              this.$refs["dataForm"].resetFields();
              this.setPassWord = false;
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(dataSubmit) {
      this.$refs["dataForm"].resetFields();
    }
  },
  mounted() {}
};
</script>

<style scoped>

</style>
<template>
  <div class="login">
    <section>
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
        <el-row class="formTop">
          <el-col :span="12">
            <div class="grid-content bg-purple-dark">账户密码登录</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-dark">短信快捷登录</div>
          </el-col>
        </el-row>
        <el-form-item prop="user" style="margin-left: 0;">
          <el-input type="password" v-model="ruleForm2.user" auto-complete="off" placeholder="手机号/用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row class="formTop">
            <el-col :span="24">
              <el-button style="width: 100%;" type="primary" @click="submitForm('ruleForm2')">登录</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
  export default {
    name: "smartCommunity_login",
    data() {
      var validateUser = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入用户名"));
        } else {
          if (this.ruleForm2.user !== "") {
            //              this.$refs.ruleForm2.validateField('user');
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (this.ruleForm2.checkPass !== "") {
            //              this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      return {
        ruleForm2: {
          pass: "",
          user: ""
        },
        rules2: {
          pass: [{ validator: validatePass, trigger: "blur" }],
          user: [{ validator: validateUser, trigger: "blur" }]
        }
      };
    },
    methods: {
      async submitForm(formName) {
        console.log(this.$refs[formName]);
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const res = await this.login();
            console.log(res);
          }
        });
      },
      login() {
        this.$http
          .post(
            this.url + "Login/LG",
            {
              AdminName: this.ruleForm2.user,
              Password: this.ruleForm2.pass,
              BigPlatform: 21,
              Mobile: 13256219787
            },
            { emulateJSON: true }
          )
          .then(
            function (result) {
              if (result.body.Status == 0) {
                this.setToken(result.body.Data.WToken);
                this.$message({
                  type: "success",
                  message: "登录成功"
                });
                this.$router.push("index");
              } else {
                this.$notify.error({
                  title: "错误",
                  message: "请输入正确的用户名密码",
                  offset: 100
                });
                return false;
              }
            },
            function (result) {
              alert(result);
            }
          );
      }
    }
  };
</script>

<style lang="less">
  .login {
    overflow: hidden;
    width: 100%;
    height: 100%;
    // background-image: url(../assets/images/login/bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;

    section {
      width: 100%;
      position: absolute;
      top: 120px;
      text-align: center;
      -webkit-transition: height 0.4s, top 0.4s;
      transition: height 0.4s, top 0.4s;

      .demo-ruleForm {
        height: 300px;
        width: 400px;
        padding: 30px 60px 0 60px;
        box-sizing: border-box;
        position: absolute;
        border-radius: 5px;
        background: #fff;
        top: 0;
        right: 20%;
        padding-top: 40px;
        -webkit-transition: height 0.4s, width 0.4s, padding-top 0.4s;
        transition: height 0.4s, width 0.4s, padding-top 0.4s;

        .formTop {
          margin-bottom: 25px;
        }
      }
    }
  }
</style>
<template>
  <div>
    <!--缴费界面-->
    <el-dialog
      title="缴费"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-row :gutter="20" class="styleRow" v-if="this.blue == '2' || this.blue == '3'">
        <el-col :span="8">
          <div class="grid-content bg-purple myText">支付授权码:</div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="payCode" placeholder="扫码枪扫码授权码"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="styleRow">
        <el-col :span="8">
          <div class="grid-content bg-purple myText">是否自自动抬杆:</div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple" style="font-weight: bold;
  font-size: 18px;">
            <el-checkbox v-model="check"></el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="styleRow">
        <el-col :span="8">
          <div class="grid-content bg-purple myText">是否特殊支付:</div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple" style="font-weight: bold;
  font-size: 18px;">
            <el-checkbox v-model="special"></el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="styleRow" v-if="special">
        <el-col :span="8">
          <div class="grid-content bg-purple myText">名称</div>
        </el-col>
        <el-col :span="12">
          <el-select
            placeholder="选择名称"
            size="medium"
            v-model="dataForm.name"
            class="grid-content bg-purple"
            style="font-weight: bold;
  font-size: 18px;"
          >
            <!-- <el-option label="请选择" value=""></el-option> -->
            <el-option :label="item.name" :value="item.id" v-for="item in itemList" :key="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="styleRow">
        <el-col :span="8">
          <div class="grid-content bg-purple right myText">车牌号:</div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple textFont">{{feeData.car_num}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="styleRow">
        <el-col :span="8">
          <div class="grid-content bg-purple myText">入场时间:</div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple textFont">{{feeData.happen_time}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="styleRow">
        <el-col :span="8">
          <div class="grid-content bg-purple myText">计费时间:</div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple textFont textFont">{{feeData.count_time}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style>
        <el-col :span="8">
          <div class="grid-content bg-purple myText">停车时长:</div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple textFont">{{feeData.Time|time}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="styleRow">
        <el-col :span="8">
          <div class="grid-content bg-purple myText">停车费用(元):</div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple textFont">{{feeData.Fee}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="styleRow"  v-if="!special">
        <el-col :span="8">
          <div class="grid-content bg-purple myText">支付方式:</div>
        </el-col>
        <el-col :span="12">
          <el-button
            :span="3"
            v-for="(item,index) in settingName"
            :key="index"
            :size="size"
            type="success"
            :class="blue==item.type?'yes':''"
            plain
            @click.native="getFeeData(item.type)"
          >{{item.name}}</el-button>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="handleClose">取消</el-button>
        <el-button :size="size" type="primary" @click.native="surePay" :loading="succLoading">确认缴费</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { secondTurnTime } from "@/utils/global";
import {
  feeData,
  GetMoneyButton,
  ScanCodePay,
  specialSelect
} from "@/api/smart";
export default {
  name: "PaDio",
  props: {
    // feeData: Object,
    beforeFree: "",
    dataForm: Object,
    pageRequest: Object,
    size: String
  },
  computed: {},
  filters: {
    time(value) {
      if (value != "" && value != undefined) {
        return secondTurnTime(value);
      } else {
        return "";
      }
    }
  },
  data() {
    return {
      mobileInofo: "",
      isActive: true,
      succLoading: false,
      payCode: "",
      itemList: "",
      settingName: [
        { type: "1", name: "现金" },
        { type: "2", name: "微信" },
        { type: "3", name: "支付宝" }
      ],
      payType: "",
      feeData: {},
      check: this.getUserInfo().Defaultopen == 2 ? true : false,
      dialogVisible: false, // 新增编辑界面是否显示
      blue: this.getUserInfo().default_pay,
      special: false
    };
  },
  watch: {
    newName(curVal, oldVal) {
      console.log(curVal)
      if(curVal) {
        this.getFeeData(5);
      }
    },
    special(val) {
      if (val == false) {
        this.dataForm.name = "";
      }
    },
    dialogVisible(val) {
       if(val === false) {
          this.special = false
       }
      }
  },
  methods: {
    goToMobile(tool) {
      this.payType = "2";
    },
    async successMoney() {
      const Fee = await this.submitForm();
      this.getMoney();
    },
    handleClose(done) {
      this.dialogVisible = false;
      if (this.$route.path == "/smartCommunity/enterRecord") {
        this.$emit("findPage");
      }
    },
    // 表单提交
    submitForm() {
      return new Promise((resolve, reject) => {
//      this.$confirm("确认缴费吗？", "提示", {}).then(() => {
          this.succLoading = true;
          let api;
          let params = {
            id: this.dataForm.id,
            mer_id:
              this.getUserInfo().p_id == 0
                ? this.getUserInfo().mer_id
                : this.getUserInfo().p_id,
            type: this.payType,
            set_id: this.dataForm.name,
            WToken: this.getToken()
          };
          feeData(params).then(res => {
            if (res.Status == 0) {
              resolve(res.Data);
            } else if (res.Status == 99) {
              this.$message({
                message: "缴费失败,登录失效，请重新登录",
                type: "error"
              });
              this.$router.push({ path: "/login" });
            } else {
              this.$message({
                message: "缴费失败" + res.Data,
                type: "error"
              });
            }
            this.succLoading = false;
          });
//      });
      });
    },
    getList() {
      specialSelect({
        mer_id:
          this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id
      }).then(res => {
        if (res.Status == 0) {
          this.itemList = res.Data;
        }
      });
    },
    getFeeData(tool) {
      this.blue = tool;
      this.payType = tool;
      feeData({
        id: this.dataForm.id,
        mer_id:
          this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        type: tool,
        set_id: this.dataForm.name,
        WToken: this.getToken()
      }).then(res => {
        if (res.Status == 0) {
          this.feeData = res.Data;
          this.mobileInofo = res.Data;
        } else if (res.Status == 99) {
          this.$message({
            message: "缴费失败,登录失效，请重新登录",
            type: "error"
          });
          this.$router.push({ path: "/login" });
        } else {
          this.$message({
            message: res.Data,
            type: "error"
          });
        }
      });
    }, //点击缴费
    surePay() {
      if (this.payType == 1 || this.payType == 5) {
        this.successMoney();
      } else if (this.payType == 2 || this.payType == 3) {
        this.mobilePay();
      }else {
        this.$message({
          message: "操作失败,未选择支付方式",
          type: "error"
        });
      }
    },
    getMoney() {
      let params = {
        id: this.dataForm.id,
        mer_id:
          this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        type: this.payType,
        is_open: this.checkNum,
        set_id: this.dataForm.name,
        WToken: this.getToken()
      };
      GetMoneyButton(params).then(res => {
        if (res.Status == 0) {
          this.$message({ message: "缴费成功", type: "success" });
          this.$emit("findPage");
          this.dialogVisible = false;
        } else if (res.Status == 99) {
          this.$message({
            message: "缴费失败,登录失效，请重新登录",
            type: "error"
          });
          this.$router.push({ path: "/login" });
        } else {
          this.$message({
            message: "缴费失败" + res.Data,
            type: "error"
          });
        }
        this.succLoading = false;
      });
    },
    isPaySao() {
      return new Promise((resolve, reject) => {
        let params = {
          id: this.dataForm.id,
          mer_id:
            this.getUserInfo().p_id == 0
              ? this.getUserInfo().mer_id
              : this.getUserInfo().p_id,
          type: this.payType,
          is_open: this.checkNum,
          WToken: this.getToken()
        };
        GetMoneyButton(params).then(res => {
          if (res.Status == 0) {
            resolve(res);
          } else if (res.Status == 99) {
            this.$message({
              message: "缴费失败,登录失效，请重新登录",
              type: "error"
            });
            this.$router.push({ path: "/login" });
          } else {
            this.$message({
              message: "缴费失败" + res.Data,
              type: "error"
            });
          }
          this.succLoading = false;
        });
      });
    },
    getMobilePay() {
      let params = {
        id: this.dataForm.id,
        p_id: this.mobileInofo.mer_id,
        u_id:
          this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        order_type: "0",
        trade_type: "MICROPAY",
        job_id: this.mobileInofo.car_num,
        auth_code: this.payCode,
        pay_type:
          this.payType == 2 ? "WECHATPAY" : this.payType == 3 ? "ALIPAY" : "",
        out_trade_no: "1544600326000345",
        total_fee: this.mobileInofo.Fee,
        is_open: this.checkNum,
        WToken: this.getToken()
      };
      ScanCodePay(params).then(res => {
        if (res.Status == 0) {
          if (res.Data == "Succ") {
            this.$message({ message: "缴费成功", type: "success" });
            this.dialogVisible = false;
            this.special = false;
            this.succLoading = false;
            this.$emit("findPage");
          } else {
            if (
              res.Data.retCode == "9" &&
              res.Data.retMsg == "系统异常"
            ) {
              this.$message({
                message: "支付失败，请用户刷新付款码后,重新收款",
                type: "error"
              });
            } else {
              this.$message({
                message: "操作失败, " + res.body.Data.err_code_des,
                type: "error"
              });
            }
          }
        } else if (res.Status == -4) {
          this.$message({
            message: "操作失败,必须填写支付授权码",
            type: "error"
          });
        } else if (res.Status == 99) {
          this.$message({
            message: "缴费失败,登录失效，请重新登录",
            type: "error"
          });
          this.$router.push({ path: "/login" });
        } else {
          this.$message({
            message: "操作失败, " + res.Data,
            type: "error"
          });
        }
        this.payCode = "";
        this.succLoading = false;
      });
    },
    async mobilePay() {
      this.mobileInofo = await this.submitForm();
      const succ = await this.isPaySao();
      if (succ.Data == "Succ") {
        this.getMobilePay();
      } else {
        this.$message({ message: "生成订单失败" });
      }
      this.succLoading = false;
    }
  },
  mounted() {
    this.getList();
  },
  computed: {
    checkNum() {
      return this.check ? 2 : 1;
    },
    newName() {
      return this.dataForm.name;
    }
  }
};
</script>

<style scoped>
.yes {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.styleRow {
  height: 40px;
  line-height: 40px;
}

.myText {
  text-align: right;
}

.textFont {
  font-weight: bold;
  font-size: 18px;
}
</style>
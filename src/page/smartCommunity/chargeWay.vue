<template>
  <div>
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt">
      <el-row>
        <el-form class="filterBlock" :inline="true" :gutter="20">
          <el-row class="filterContent"> 
            <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1">
              <el-select ref="getIp" filterable placeholder="选择所属社区" size="medium" v-model="parameter.mer_id">
                <el-option v-for="(park,index) in parkList" :label='park.sqmc' :value="park.u_id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否可用">
              <el-select placeholder="选择是否可用" size="medium" v-model="parameter.enable">
                <el-option label='全部' value="-1"></el-option>
                <el-option label='不可用' value="0"></el-option>
                <el-option label='可用' value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="filter">
                筛选
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="handleAdd">
                新增
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- <el-tabs v-model="activeTag" type="card" @tab-click="handleClick"> -->
          <el-table ref="multipleTable" border :data="tableList" tooltip-effect="dark" stripe style="width: 100%" size="medium"
            @selection-change="handleSelectionChange">
            <el-table-column label="收费方式" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.type | isPayType}}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="白天停车价格(元)" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ jsonParse(scope.row.data).DayFee }}</span>
              </template>
            </el-table-column>
            <el-table-column label="收费间隔(分)" width="120">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ jsonParse(scope.row.data).Space }}</span>
              </template>
            </el-table-column>
            <el-table-column label="免费时长(分)" width="120">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ jsonParse(scope.row.data).FreeTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否开启夜间收费" width="160">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ jsonParse(scope.row.data).NightStatus == 0?"关闭":"开启"}}</span>
              </template>
            </el-table-column>
            <el-table-column label="夜间计费模式" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ jsonParse(scope.row.data).NightFeeModel == 1?"整段收费":"阶梯收费"}}</span>
              </template>
            </el-table-column>
            <el-table-column label="夜间开启时间" width="240">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ jsonParse(scope.row.data).NightDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="夜间整段停车(元/夜)" width="170">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ jsonParse(scope.row.data).NightFee}}</span>
              </template>
            </el-table-column>
            <el-table-column label="夜间阶梯停车(元/小时)" width="170">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ jsonParse(scope.row.data).NightFeeHour}}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否启用" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.enable == 1?"可用":"不可用" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="260">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row.ID)">详情</el-button> -->
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                <el-button v-if="scope.row.is_default != 1" size="mini" type="warning" @click="handleSet(scope.row,1)">设为默认</el-button>
                <el-button v-if="scope.row.is_default == 1" size="mini" type="danger" @click="handleSet(scope.row,2)">取消默认</el-button>
              </template>
            </el-table-column>

          </el-table>
          <!-- <kt-pagination :data="tableList" :parameter="parameter" :total="total"></kt-pagination> -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.parameter.N"
            :page-sizes="[10, 20, 30, 40,50]" :page-size="this.parameter.Rows" layout="total,prev, pager, next, jumper"
            :total='this.totle' style="margin-top:15px;">
          </el-pagination>
          <!-- <el-pagination :data="tableList" :parameter="parameter"><el-pagination> -->

          <!-- </el-tab-pane> -->
          <!-- </el-tabs> -->
        </el-col>

        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
          <el-form :model="dataForm" label-width="160px" :rules="dataFormRules" ref="dataForm" label-position="right">
            <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1">
              <el-select ref="getIp" placeholder="选择所属社区" id="getEditAdd" size="medium" v-model="dataForm.mer_id">
                <el-option v-for="(park,index) in parkList" :label='park.sqmc' :value="park.u_id" :key="index"
                  :data-Ip="park.wxNotify"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-select placeholder="选择支付方式" size="medium" v-model="dataForm.type">
                <el-option label='现金' value="1"></el-option>
                <el-option label='微信' value="2"></el-option>
                <el-option label='支付宝' value="3"></el-option>
                <el-option label='无感支付' value="4"></el-option>
                <el-option label='特殊收费' value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称"  v-if='this.dataForm.type == 5'>
              <el-input v-model="dataForm.name" placeholder="请输入特殊收费的名称" style="width:64%;"></el-input>
            </el-form-item>
            <el-form-item label="白天收费价格(元)">
              <el-input-number v-model="dataForm.DayFee" editable="false" :min="0" label="白天收费单位(元)"></el-input-number>
            </el-form-item>
            <el-form-item label="收费间隔(分)">
              <el-input-number v-model="dataForm.Space" :min="0" editable="false" label="收费单价单位时长，若计费单位为1小时，请输入60"></el-input-number>
            </el-form-item>
            <el-form-item label="免费时长(分)">
              <el-input-number v-model="dataForm.FreeTime" :min="0" label="免费时长(分)"></el-input-number>
            </el-form-item>
            <el-form-item label="夜间收费模式状态">
              <el-switch v-model="dataForm.NightStatus" active-color="#13ce66" active-value="1" inactive-value="0"
                active-text="开启" inactive-text="关闭"></el-switch>
            </el-form-item>
            <el-form-item label="夜间时段">
              <el-time-select v-model="startNight" value-format="HH:mm:ss"   :picker-options="{
                start: '12:00',
                step: '00:60',
                end: '24:00'
              }"  placeholder="夜间开始时间点">
              </el-time-select>
              至
              <el-time-select v-model="endNight" value-format="HH:mm:ss" :picker-options="{
                start: '0:00',
                step: '00:60',
                end: '12:00'
              }"
              placeholder="夜间结束时间点">
              </el-time-select>
            </el-form-item>
            <el-form-item label="夜间收费模式">
              <el-radio v-model="dataForm.NightFeeMode" label="1">整段收费</el-radio>
              <el-radio v-model="dataForm.NightFeeMode" label="2">阶梯收费</el-radio>
            </el-form-item>
            <el-form-item label="整段收费(元)" v-if="dataForm.NightFeeMode == 1">
              <el-input-number v-model="dataForm.NightFee" :min="0" label="夜间整段收费价格(元/夜)"></el-input-number>
            </el-form-item>
            <el-form-item label="阶梯收费(元/小时)"  v-if="dataForm.NightFeeMode == 2">
              <el-input-number v-model="dataForm.NightFeeHour" :min="0" label="白天收费单位(元)"></el-input-number>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="dataForm.enable" active-color="#13ce66" active-value="1" inactive-value="0"
                active-text="启用" inactive-text="禁用"></el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="submitForm">提交</el-button>
          </div>
        </el-dialog>

      </el-row>
    </el-row>
  </div>
</template>
<script>
  import $ from "jquery";
  import KtButton from "@/components/KtButton";
  export default {
    name: "smartCommunity_chargeWay",
    computed:{
    },
    data() {
      return {
        dialogFormVisible: false,
        tableList: [],
        dialogTableVisible: false,
        dialogVisible: false, // 新增编辑界面是否显示
        parkList: [],
        startNight: "",
        endNight: "",
        totle: 0,
        initApi: "",
        addApi: "",
        operation: false, // true:新增, false:编辑
        shopNameList: [],
        isNight:'',
        parameter: {
          mer_id:
            this.getUserInfo().bin_id == 1
              ? ""
              : this.getUserInfo().p_id == 0
                ? this.getUserInfo().mer_id
                : this.getUserInfo().p_id,
          WToken: "",
          addtime: "",
          enable: "-1",
          N: 1,
          Rows: 8
        },
        dataFormRules: {
          mer_id: [
            {
              required: true,
              message: "必须选择店长，才能创建门店",
              trigger: "change"
            }
          ]
        },
        dataForm: {
          WToken: "",
          enable: "",
          name: '',
          type: "",
          mer_id:
            this.getUserInfo().bin_id == 1
              ? ""
              : this.getUserInfo().p_id == 0
                ? this.getUserInfo().mer_id
                : this.getUserInfo().p_id,
          Space: "",
          DayFee: "",
          FreeTime: "",
          NightStatus: 0,
          NightFeeMode: '',
          NightDate: "",
          NightFee: ""
        }
      };
    },
    filters: {
      isPayType(value) {
        if (value == "1") {
          return "现金";
        } else if (value == "2") {
          return "微信";
        } else if (value == "3") {
          return "支付宝";
        } else if (value == '4') {
          return '无感支付';
        } else if (value == '5') {
          return '特殊支付';
        }
      }
    },
    mounted() {
      this.GetList(this.parameter);
      this.getPark();
      // console.log(this.$store.dispatch('getcommunityList'));
    },
    computed: {
      getdata () {
        return this.$store.state.smart.communityList
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
      jsonParse: function (json) {
        return JSON.parse(json);
      },
      isPayName(value) {
        if (value == "1") {
          return "现金";
        } else if (value == "2") {
          return "微信";
        } else if (value == "3") {
          return "支付宝";
        } else if (value == '4') {
          return '无感支付';
        } else if (value == '5') {
          return '特殊支付';
        }
      },
      GetList(parame) {
        let api = "NoSense/Setting/GetSetting";
        let params;
        let thisApi;
        if (location.href.indexOf("csl.ycpicc.com") != -1) {
          thisApi = "http://csl.ycpicc.com:8058/zhsq/socket/post.action";
          params = {
            u_id: this.parameter.mer_id,
            url: api,
            param:
              "WToken=" +
              this.getToken() +
              "&mer_id=" +
              this.parameter.mer_id +
              "&enable=" +
              this.parameter.enable +
              "&N=" +
              this.parameter.N +
              "&Rows=" +
              this.parameter.Rows
          };
        } else {
          thisApi = api;
          params = this.parameter;
        }

        this.api(
          thisApi,
          params,
          res => {
            this.tableList = res.Data.Rows;
            this.totle = parseInt(res.Data.Count);
          },
          res => {
            this.tableList = [];
          }
        );
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true;
        this.operation = true;
        this.dataForm = {
          WToken: "",
          enable: "",
          type: "",
          mer_id:
            this.getUserInfo().bin_id == 1
              ? ""
              : this.getUserInfo().p_id == 0
                ? this.getUserInfo().mer_id
                : this.getUserInfo().p_id,
          Space: "",
          DayFee: "",
          name: '',
          FreeTime: "",
          NightStatus: 0,
          NightFeeMode: '',
          NightFeeHour:'',
          NightDate: "",
          NightFee: ""
        };
      },
      getPark: function () {
        this.api("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
          this.parkList = res.Data;
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
                api = "NoSense/Setting/AddSetting";
              } else {
                api = "NoSense/Setting/EditSetting";
              }
              this.dataForm.NightDate = this.startNight + "-" + this.endNight;
              this.dataForm.data = JSON.stringify(this.dataForm.data);
              let thisParams = {
                WToken: "",
                id: this.dataForm.id,
                mer_id: this.dataForm.mer_id,
                type: this.dataForm.type,
                data: JSON.stringify({
                  Space: this.dataForm.Space,
                  DayFee: this.dataForm.DayFee,
                  FreeTime: this.dataForm.FreeTime,
                  NightStatus: this.dataForm.NightStatus,
                  NightFeeModel: this.dataForm.NightFeeModel,
                  NightFeeHour: this.dataForm.NightFeeHour,
                  NightDate: this.dataForm.NightDate,
                  NightFee:this.dataForm.NightFee
                }),
                name: this.dataForm.name,
                enable: this.dataForm.enable
              };

              let params;
              let thisApi;
              console.log(thisParams.enable)
              if (location.href.indexOf("csl.ycpicc.com") != -1) {
                thisApi = "http://csl.ycpicc.com:8058/zhsq/socket/post.action";
                params = {
                  u_id: this.dataForm.mer_id,
                  url: api,
                  param:
                    "id=" +
                    thisParams.id +
                    "&mer_id=" +
                    thisParams.mer_id +
                    "&type=" +
                    thisParams.type +
                    "&data=" +
                    thisParams.data +
                    "&name=" +
                    thisParams.name +
                    "&enable=" +
                    thisParams.enable
                };
              } else {
                thisApi = api;
                params = thisParams;
              }
              this.api(
                thisApi,
                params,
                res => {
                  this.$message({ message: "操作成功", type: "success" });
                  this.dialogVisible = false;
                  this.$refs["dataForm"].resetFields();
                  this.GetList(this.parameter);
                },
                res => {
                  if (res.retCode == "9") {
                    this.$message({
                      message: "" + res.retMsg,
                      type: "error"
                    });
                  }
                }
              );
            });
          }
        });
      },
      handleEdit: function (params) {
        this.dialogVisible = true;
        this.operation = false;
        this.isAdd = false;
        if (typeof params.data == "string") {
          params.data = JSON.parse(params.data);
        }
        this.dataForm = {
          id: params.id,
          enable: params.enable,
          mer_id: params.mer_id,
          name: params.name,
          type: params.type,
          Space: params.data.Space,
          DayFee: params.data.DayFee,
          FreeTime: params.data.FreeTime,
          NightStatus: params.data.NightStatus,
          NightFeeMode: params.data.NightFeeMode,
          NightFeeHour: params.data.NightFeeHour,
          NightDate: params.data.NightDate,
          NightFee: params.data.NightFee
        };
        this.startNight = this.dataForm.NightDate.split("-")[0];
        this.endNight = this.dataForm.NightDate.split("-")[1];
      },
      // 删除
      handleDelete(row) {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          let api = "NoSense/Setting/DelSetting";
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
          this.api(thisApi, params, res => {
            this.$message({ message: "删除成功", type: "success" });
            this.parameter.N = 1;
            this.GetList(this.parameter);
          });
        });
      },
      handleSet(row, isSet) {
        this.$confirm("确认要改变设置吗？", "提示", {
          type: "warning"
        }).then(() => {
          let api = "NoSense/Setting/UpdateDefault";
          let params;
          let thisApi;
          if (location.href.indexOf("csl.ycpicc.com") != -1) {
            thisApi = "http://csl.ycpicc.com:8058/zhsq/socket/post.action";
            params = {
              u_id: row.mer_id,
              url: api,
              param: "id=" + row.id + "&is_default=" + isSet + "&mer_id=" + row.mer_id
            };
          } else {
            thisApi = api;
            params = { id: row.id, is_default: isSet, mer_id: row.mer_id };
          }
          this.api(thisApi, params, res => {
            this.$message({ message: "设置成功", type: "success" });
            this.parameter.N = 1;
            this.GetList(this.parameter);
          });
        });
      },
      filter() {
        this.parameter.N = 1;
        this.GetList(this.parameter);
      }
    }
  };
</script>
<style scoped lang="less">
  @import "../../assets/css/table.less";
</style>
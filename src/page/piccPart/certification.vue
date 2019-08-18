<template>
  <div>
     <bread-crumb></bread-crumb> 
     <el-row class="containt">
      <el-row>
      <el-col class="filterBlock">
          <el-col class="filterHeader">
            <i class="el-icon-search" style="color: #2D4FA7; font-size: 24px; margin-right: 2px;"></i> 筛选
          </el-col>
          <el-row class="filterContent"   :gutter="20">
            <el-col class="filterInput"  :span="4">
              <el-col class="filterText">查询关键字</el-col>
              <el-input type="text" class="form-control" placeholder="请输入关键字" v-model.trim="parameter.keys" clearable></el-input>
            </el-col>
            <el-col  class="filterInput" :span="4">
              <el-col class="filterText">手机号</el-col>
              <el-input type="text" class="form-control" placeholder="请输入手机号"  v-model.trim="parameter.Mobile" clearable>
              </el-input>
            </el-col>
            <el-col class="filterInput" :span="4" >
              <el-col class="filterText">时间选择</el-col>
              <el-time-picker
                class="form-control"
                size=""
                arrow-control
                v-model="parameter.Date"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                  }"
                placeholder="任意时间点">
              </el-time-picker>
            </el-col>
            <el-col style="margin-top: 10px;">

              <el-button class="btn btn-info  fr" @click="resetting">
                <span class="glyphicon glyphicon-filter">重置</span>
              </el-button>

              <el-button class="btn btn-info filterFirst  fr"
              @click="filter">
                <span class="glyphicon glyphicon-filter">筛选</span>
              </el-button>
            </el-col>
          </el-row>
      </el-col>
    </el-row>
    <el-row>
       <el-col :span="24">
         <el-tabs v-model="activeTag" type="card" @tab-click="handleClick">
               <el-table
             ref="multipleTable" border
             :data="deviceList"
             tooltip-effect="dark"
             style="width: 100%"
             @selection-change="handleSelectionChange">
             <el-table-column
               type="selection"
               >
             </el-table-column>
             <el-table-column
                 prop="AcctID"
                 label="账户号"
                 >
               </el-table-column>
             <el-table-column
                 prop="AcctName"
                 label="账户名"
                 >
               </el-table-column>
               <el-table-column
                   prop="OutCusID"
                   label="卡类型"
                   >
                 </el-table-column>
               <el-table-column
                   prop="CusID"
                   label="商户号"
                   >
                 </el-table-column>
                <el-table-column
                   prop="CusName"
                   label="法人姓名"
                   >
                </el-table-column>

                <el-table-column
                   prop="SettFee"
                   label="提现手续费（%）"
                   >
                </el-table-column>
           </el-table>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40,50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total='totalCount' style="margin-top:15px;">
              </el-pagination>
         </el-tab-pane>
         </el-tabs>
       </el-col>
    </el-row>
     </el-row>
  </div>
</template>

<script>
    import breadCrumb from '@/components/breadCrumb'
    export default {
      name: "piccPart_comsumeDetail",
      components: {
        breadCrumb
      },
      data() {
        return {
          activeTag: 'first',
          token: this.getToken(),
          Count:'',
          WToken:this.token,
          value3:'',
          selectTable:{},
          dialogFormVisible:false,
          deviceList: [],
          formLabelWidth:'120px',
          totalCount:20,
          currentPage: 1,
          parameter : {
            WToken: this.getToken(),
            Keys: '',
            OutCusID:'',
            CusName: '',
            Legal: '',
            StoreID: -2,
            AcctTp: '',
            Mobile: '',
            IDNO: '',
            N: 1,
            Rows: 10
          },
          pageSize: 10,
          pageNum:''
        }
      },
      mounted(){
        var _this = this;
            _this.parameter.Rows = _this.pageSize;
            _this.parameter.WToken = _this.token;
            _this.GetDevice(_this.parameter);
      },
      methods: {
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleClick(tab, event) { //分页
          console.log(tab, event);
        },
        handleSizeChange(val) {
          this.pageSize = val;
          this.GetDevice({
            WToken:this.token,
            N:this.pageNum,
            Rows:this.pageSize
          });
        },
        handleCurrentChange(val) {
          this.pageNum = val;
          this.GetDevice({
            WToken:this.token,
            N:this.pageNum,
            Rows:this.pageSize
          });
        },
        GetDevice(parameter) {
          var _this = this;
          this.post(
            'TlPay/QueryTlUserList',
            parameter
           ,
           (res) => {
             if(res.body.Status == 0) {
              _this.totalCount = parseInt(res.body.Data.Count);
              _this.deviceList = res.body.Data.Rows;
            }else if(res.body.Status == -1){
              this.$notify.error({
                title: '登录失效',
                message: '将进入登录页面',
                offset: 100
              });
              this.$router.push('/login');
            }else {
              this.$notify.error({
                title: '错误',
                message: '请输入正确的用户名密码',
                offset: 100
              });
              return false;
            }
           }
          )
        },
        handleEdit(index, row) {
          this.selectTable = row;
          this.dialogFormVisible = true;
        },
        upDateEngine(id) {
          this.$http.post(
            this.url+'AdminQrMobileMng/QueryFirstDispenseInfoList',
          {
                 WToken:this.token,
                 N:1,
                 Rows:10,
                 Keys:'',
                 Date:'',
                 Mobile:''
         }
            ,{emulateJSON:true}
          ).then(function(result){
            if(result.body.Status == 0) {
              this.$message({
                type: 'success',
                message: '更新当前设备成功'
              });
              this.GetDevice();
            }else if(result.body.Status == -1){
              this.$notify.error({
                title: '登录失效',
                message: '将进入登录页面',
                offset: 100
              });
            }else {
              this.$notify.error({
                title: '错误',
                message: '更新失败',
                offset: 100
              });
              return false;
            }
          }, function(result){
            alert(result);
          });
        },
        addDateEngine() {
          this.$router.push({ path: 'addEngine'})
        },
        filter() {
          var _this = this;
              _this.GetDevice(_this.parameter);
        },
        resetting() {
          this.parameter = {};
          this.parameter.Rows = this.pageSize;
          this.parameter.WToken = this.token;
          this.GetDevice(this.parameter);
        }
      }
    }
</script>
<style lang="less">
.containt {
  padding: 20px;
  padding-top: 0;
}
  .filterBlock {
    margin-bottom: 20px;
    border: 2px solid #eee;
    box-sizing: border-box;
    .filterHeader {
      background-color: #FCFCFC;
      padding: 0 14px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #EBEBEB;
      font-size: 16px;
    }
    .filterContent {
      padding: 8px 16px 16px 16px;
      .filterInput {
        //box-shadow: 0 0 1.5px #eee;
        .filterText {
          margin-bottom: 6px;
        }
      }
      .filterFirst {
        margin-right: 15px;
      }
    }
  }
  .breadStyle {
    height: 50px;
  }
  .tableTop {
    height: 40px;
    line-height: 40px;
    font-size:0;
    :last-child {
      border-right: 2px solid #eee;
    }
  }
  .table {
    padding: 32px;
    border: 2px solid #eee;
    border-top: 0;
    box-shadow: 0 0 1.5px #eee;
    .el-table__header-wrapper {
      /*border-top: 1px solid #ebeef5;*/
    }
  }
  .el-tabs__header {
     margin: 0;
  }
  .el-tabs__item {
    width: 150px;
    text-align: center;
    font-size: 20px;
  }
  .el-tabs__item.is-active {
    border-top: 2px solid #2D4FA7;
  }
  .el-tabs--card>.el-tabs__header {
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 0 1.5px #eee;
  }
  .el-table th {
    background: #FAFAFA;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
     width: 100%;
  }
  .el-dialog__title {
    font-weight: 700;
  }

</style>
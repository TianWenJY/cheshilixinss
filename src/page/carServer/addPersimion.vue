
<template>
	<div>
		<!-- <bread-crumb></bread-crumb> -->
		<el-row class="containt">
			<el-row>
				<el-form class="filterBlock" :inline="true" :gutter="20">
					<el-row class="filterContent">
						<el-form-item label="板块ID">
							<el-select v-model="parameter.Status" placeholder="申请状态" size="medium">
								<el-option label="汽车服务" :value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="权限路径/父权限">
							<el-input v-model.trim="parameter.Keys" size="medium" clearable placeholder="请输入权限路径/父权限"></el-input>
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
					<el-table ref="multipleTable" border :data="tableList" tooltip-effect="dark" stripe style="width: 100%" size="medium" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="40"></el-table-column>
						<el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.change">
						</el-table-column>
						<el-table-column label="操作" width="420">
							<template slot-scope="scope">
								<el-button size="mini" type="danger" @click="handleEdit(scope.row)">编辑</el-button>
								<el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
							</template>
						</el-table-column>

					</el-table>
					<div class="toolbar" style="padding:10px;">
						<el-button size="mini" type="danger" @click="handleBatchDelete()">批量删除</el-button>
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageSize" layout="total,prev, pager, next, jumper" :total='totalCount' style="margin-top:15px;">
						</el-pagination>
					</div>
				</el-col>

				<!--新增编辑界面-->
				<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
					<el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm" label-position="right">
						<el-form-item label="ID" prop="id" v-if="false">
							<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label="所属板块" prop="PlateID">
							<el-select v-model="dataForm.PlateID" placeholder="请选择所属板块">
								<!-- <el-option :key="item.value" :label="item.label" :value="item.value"> -->
								<el-option label="汽车服务" :value="1">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label=" 权限路径" prop="BasePath">
							<el-input v-model="dataForm.BasePath" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label=" 父权限" prop="Path">
							<el-input v-model="dataForm.Path" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label=" 权限描述">
							<el-input type="textarea" :rows="2" placeholder="请输入描述内容" v-model="dataForm.Description" auto-complete="off"></el-input>
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
// import breadCrumb from "@/components/breadCrumb";
import KtButton from "@/components/KtButton";
export default {
  name: "carServer_addPersimion",
  components: {
    // breadCrumb
  },
  data() {
    return {
      activeTag: "first",
      token: this.getToken(),
      Count: "",
      WToken: this.token,
      dialogFormVisible: false,
      tableList: [],
      totalCount: 20,
      currentPage: 1,
      dialogTableVisible: false,
      dialogVisible: false, // 新增编辑界面是否显示
      dialogFormVisible: false,
      operation: false, // true:新增, false:编辑
      selections: [], // 列表选中列
      parameter: {
        // WToken: "",
        PlateID: 1,
        BasePath: "",
        Path: "",
        Description: "",
        Keys: "",
        N: "",
        Rows: ""
      },
      pageSize: 8,
      pageNum: "",
      nowList: "",
      dataFormRules: {
        ID: [
          { required: true, message: "请选择要修改板块", trigger: "change" }
        ],
        BasePath: [
          { required: true, message: "权限路径不能为空", trigger: "blur" }
        ],
        Path: [{ required: true, message: "父权限不能为空", trigger: "blur" }]
      },
      dataForm: {
        PlateID: 1,
        BasePath: "",
        Path: "",
        Description: ""
      },
      filters: {
        PlateID: 1,
        BasePath: "",
        Path: "",
        Description: ""
      },
      columns: [
        { prop: "ID", label: "权限ID", minWidth: 20 },
        { prop: "BasePath", label: "权限路径", minWidth: 60 },
        { prop: "Path", label: "父权限", minWidth: 120 },
        { prop: "Description", label: "权限描述", minWidth: 40 }
      ]
    };
  },
  mounted() {
    var _this = this;
    _this.parameter.Rows = _this.pageSize;
    _this.parameter.WToken = _this.token;
    this.GetList(this.parameter);
  },
  methods: {
    handleSelectionChange(val) {
      this.selections = val;
      console.log(this.selections);
    },
    handleClick(tab, event) {
      //分页
      console.log(tab, event);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.parameter.N = this.pageNum;
      this.parameter.Rows = this.pageSize;
      this.GetList(this.parameter);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.parameter.N = this.pageNum;
      this.parameter.Rows = this.pageSize;
      this.GetList(this.parameter);
    },
    // 获取数据
    GetList: function(params) {
      this.loading = true;
      if (
        parseInt(this.totalCount) / this.parameter.Rows == 1 &&
        parseInt(this.totalCount) - parseInt(this.parameter.Rows) > 0
      ) {
        this.parameter.N--;
      }
      this.post("Auth/QueryAuthList", params, res => {
        if (res.body.Status == 0) {
          this.tableList = res.body.Data.Rows;
          this.totalCount = parseInt(res.body.Data.Count);
          this.loading = false;
        } else if (res.body.Status == -1) {
          this.$notify.error({
            title: "登录失效",
            message: "将进入登录页面",
            offset: 100
          });
          this.$router.push("/login");
        } else {
          this.$notify.error({
            title: "错误",
            message: "请求错误",
            offset: 100
          });
          return false;
        }
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        PlateID: 1,
        BasePath: "",
        Path: "",
        Description: ""
      };
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if (this.dataForm.ID) {
              api = "Auth/UpdateAuth";
            } else {
              api = "Auth/AddAuth";
            }
            let params = Object.assign({}, this.dataForm);
            this.post(api, params, res => {
              if (res.body.Status == 0) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                this.GetList(this.parameter);
                // this.totalCount = parseInt(res.body.Data.Count);
                // this.tableTreeDdata = res.body.Data[0];
              } else if (res.body.Status == -1) {
                this.$notify.error({
                  title: "登录失效",
                  message: "将进入登录页面",
                  offset: 100
                });
                this.$router.push("/login");
              } else {
                this.$message({
                  message: "操作失败, " + res.body.Data,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    handleEdit: function(params) {
      console.log(params);
      this.dialogVisible = true;
      this.operation = false;
      // console.log(params.row)
      this.dataForm = Object.assign(this.dataForm, params);
    },
    filter() {
      var _this = this;
      _this.GetList(_this.parameter);
    },
    resetting() {
      this.parameter = {};
      this.parameter.Rows = this.pageSize;
      this.parameter.WToken = this.token;
      this.GetList(this.parameter);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post("Auth/DelAuth", { ID: row.ID }, res => {
          if (res.body.Status == 0) {
            this.$message({ message: "删除成功", type: "success" });
            // if((parseInt(this.totalCount)-1)/this.parameter.Rows == 1 && (parseInt(this.totalCount) - parseInt(this.parameter.Rows) > 0)) {
            // 	this.parameter.N--;
            // }
            this.parameter.N = 1;
            this.GetList(this.parameter);
          } else if (res.body.Status == -1) {
            this.$notify.error({
              title: "登录失效",
              message: "将进入登录页面",
              offset: 100
            });
            this.$router.push("/login");
          } else {
            this.$message({
              message: "操作失败, " + res.body.Data,
              type: "error"
            });
          }
        });
      });
    },
    // 批量删除
    handleBatchDelete: function() {
      let ids = this.selections.map(item => item.ID).toString();
      console.log(ids);
      this.$confirm("确认批量删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post("Auth/DelListAuth", { IDs: ids }, res => {
          if (res.body.Status == 0) {
            this.$message({ message: "删除成功", type: "success" });
            // if((parseInt(this.totalCount)-this.selections.length)/this.parameter.Rows == 1 && (parseInt(this.totalCount) - parseInt(this.parameter.Rows) > 0)) {
            // 	this.parameter.N--;
            // }
            this.parameter.N = 1;
            this.GetList(this.parameter);
          } else if (res.body.Status == -1) {
            this.$notify.error({
              title: "登录失效",
              message: "将进入登录页面",
              offset: 100
            });
            this.$router.push("/login");
          } else {
            this.$message({
              message: "操作失败, " + res.body.Data,
              type: "error"
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="less">
.containt {
  padding: 20px;
  padding-top: 0;
}
.filterBlock {
  margin-bottom: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  .filterHeader {
    background-color: #fcfcfc;
    padding: 0 14px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebebeb;
    font-size: 16px;
  }
  .filterContent {
    padding: 25px 16px 16px 16px;
    background-color: #f2f2f2;
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
  font-size: 0;
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
}
.el-tabs__item.is-active {
  border-top: 2px solid #2d4fa7;
}
.el-tabs--card > .el-tabs__header {
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 0 1.5px #eee;
}
.el-table th {
  background: #fafafa;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-dialog__title {
  font-weight: 700;
}
.el-pagination {
  float: right;
}
.el-dialog__header {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
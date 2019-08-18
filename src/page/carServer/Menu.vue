<template>
  <div>
    <!-- <bread-crumb></bread-crumb> -->
    <el-row class="containt" style="margin-top:20px;">
      <el-col :span="24">
        <el-form class="filterBlock" :inline="true" :gutter="20">
          <el-row class="filterContent">
            <el-form-item label="菜单名称">
              <el-input placeholder="菜单名称" v-model.trim="filters.name"></el-input>
            </el-form-item>
            <el-form-item>
              <kt-button label="查询" type="primary" @click="findTreeData()" size="medium"/>
            </el-form-item>
            <el-form-item>
              <kt-button label="新增" type="primary" @click="handleAdd"  size="medium"/>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
      <!-- <el-tabs v-model="activeTag" type="card" @tab-click="handleClick"> -->
      <el-table :data="tableTreeDdata"  size="medium" style="width: 100%;" v-loading="loading" element-loading-text="拼命加载中" tooltip-effect="dark">
        <el-table-column prop="id" header-align="center" align="center" width="100" label="id">
        </el-table-column>
        <table-tree-column prop="name" header-align="left" treeKey="id" width="200" label="名称">
        </table-tree-column>
        <el-table-column header-align="center" align="center" label="图标" width="100">
          <template slot-scope="scope">
            <i :class="scope.row.icon || ''"></i>
          </template>
        </el-table-column>
        <el-table-column prop="type" header-align="center" align="center" label="类型" width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 1" size="small">目录</el-tag>
            <el-tag v-else-if="scope.row.type == 2" size="small" type="success">菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parent_name" header-align="center" align="center" width="200" label="上级菜单">
        </el-table-column>
        <el-table-column prop="url" header-align="center" align="center" :show-overflow-tooltip="true" label="菜单url">
        </el-table-column>
        </el-table-column>
        <el-table-column prop="level" header-align="center" align="center" :show-overflow-tooltip="true" label="菜单等级">
        </el-table-column>
        <!-- <el-table-column prop="perms" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="授权标识">
        </el-table-column>
        <el-table-column prop="orderNum" header-align="center" align="center" label="排序">
        </el-table-column> -->
        <el-table-column fixed="right" header-align="center" align="center" width="300" label="操作">
          <template slot-scope="scope">
            <kt-button label="修改" @click="handleEdit(scope.row)" />
            <kt-button label="删除" type="danger" @click="handleDelete(scope.row)" />
            <!-- <kt-button label="权限设置" type="danger" @click="authorization(scope.row.id,scope.row.name)" /> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增修改界面 -->
      <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()" label-width="80px" :size="size" style="text-align:left;">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="dataForm.type">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">菜单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单" prop="parent_name">
            <popup-tree-input :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parent_name==''?'顶级菜单':dataForm.parent_name" :nodeKey="''+dataForm.parent_id" :currentChangeHandle="handleTreeSelectChange">
            </popup-tree-input>
          </el-form-item>
          <el-form-item v-if="dataForm.type === 2" label="菜单路由" prop="url">
            <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
          </el-form-item>
          <!-- <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="orderNum">
              <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序编号"></el-input-number>
            </el-form-item> -->
          <el-form-item v-if="dataForm.type == 1" label="菜单图标" prop="icon">
            <el-input placeholder="菜单图标" v-model="dataForm.icon"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :size="size" @click="dialogVisible = false">取消</el-button>
          <el-button :size="size" type="primary" @click="submitForm()">确定</el-button>
        </span>
      </el-dialog>
      <!-- </el-tabs> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb";
import KtButton from "@/components/KtButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
export default {
  name: "carServer_menu",
  components: {
    TableTreeColumn,
    KtButton,
    PopupTreeInput
  },
  data() {
    return {
      size: "small",
      tableTreeDdata: [],
      loading: false,
      dialogVisible: false,
      menutypeList: ["目录", "菜单"],
      dataForm: {
        plate_id: 2,
        type: 1,
        name: "",
        parent_id: 0,
        parent_name: "",
        url: "",
        type: "",
        icon: ""
      },
      filters: {
        plate_id:2,
        name: ""
      },
      dataRule: {
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        parent_id: [
          { required: true, message: "上级菜单不能为空", trigger: "change" }
        ]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "name",
        children: "Children"
      }
    };
  },
  mounted() {
    this.findTreeData();
  },
  methods: {
    // 获取数据
    findTreeData: function(params) {
      this.loading = true;
      params = this.filters;
      this.post("PubInterface/Menu/QueryMenuList", params, res => {
        if (res.body.Status == 0) {
          this.tableTreeDdata = res.body.Data[0];
          this.popupTreeData = this.getParentMenuTree(this.tableTreeDdata);
          console.log(this.popupTreeData)
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
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        parent_id: 0,
        name: "顶级菜单",
        Children: tableTreeDdata
      };
      return [parent];
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.dataForm = {
        plate_id: 2,
        type: 1,
        name: "",
        parent_id: 0,
        parent_name: "",
        url: "",
        icon: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.dataForm = {
        id:row.id,
        plate_id: 2,
        type: row.type,
        name: row.name,
        parent_id: row.parent_id,
        parent_name: row.parent_name,
        url: row.url,
        icon: row.icon
      }
      this.dataForm.type = parseInt(this.dataForm.type);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.post(
          "PubInterface/Menu/DelMenu",
          { id: row.id, plate_id: row.plate_id},
          res => {
            if (res.body.Status == 0) {
              this.$message({ message: "删除成功", type: "success" });
              this.findTreeData();
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
          }
        );
      });
    },
    // 获取删除的包含子菜单的id列表
    getDeleteids(ids, row) {
      ids.push({ id: row.id });
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteids(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parent_id = data.id;
      this.dataForm.parent_name = data.name;
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let api;
            if(this.dataForm.id) {
              api ='PubInterface/Menu/UpdateMenu';
            }else {
              api ='PubInterface/Menu/AddMenu';
            }
            let params = Object.assign({}, this.dataForm);
            this.post(api, params, res => {
              if (res.body.Status == 0) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                this.findTreeData();
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
    authorization(id, name) {
      this.$router.push({
        name: "menuPersimion",
        params: {
          id: id,
          name: name
        }
      });
    }
  }
};
</script>

<style scoped lang="less" >
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.containt {
  padding: 20px;
  padding-top: 0;
  .toolbar {
    padding-top: 10px;
    padding-left: 15px;
  }
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
    padding: 25px 20px 3px 20px;
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
  font-size: 20px;
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
.el-form-item__label {
  top: 210px;
  color: rgba(0, 0, 0, 1);
  font-size: 16px;
  text-align: right;
  font-family: PingFangSC-Regular;
}
</style>
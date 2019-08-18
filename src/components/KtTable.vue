<template>
  <div>
    <!--表格栏-->
    <el-table
      :data="data.Rows"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="selectionChange"
      @current-change="handleCurrentChange"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :border="border"
      :stripe="stripe"
      :show-overflow-tooltip="showOverflowTooltip"
      :max-height="maxHeight"
      size="small"
      :align="align"
      style="width:100%;"
    >
      <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column>
      <el-table-column
        v-for="column in columns"
        header-align="center"
        align="center"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :formatter="column.change"
        :fixed="column.fixed"
        :key="column.prop"
        :type="column.type"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
        v-if="showpayment"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <kt-button
            label="缴费"
            :size="size"
            v-if="scope.row.in_out==0 && scope.row.is_used ==0 && scope.row.user_type==2"
            @click="payment(scope.row,1)"
          />
          <!-- <kt-button
            label="扫码缴费"
            v-if="scope.row.in_out==0 && scope.row.is_used ==0"
            :size="size"
            @click="payment(scope.row,2)"
          />-->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300"
        fixed="right"
        v-if="showOperation"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <kt-button
            label="编辑"
            v-if="!noShow && scope.row.mer_id != 1"
            @click="handleEdit(scope.$index, scope.row)"
          />
          <kt-button
            label="删除"
            type="danger"
            v-if="!noShow && scope.row.mer_id != 1"
            @click="handleDelete(scope.$index, scope.row)"
          />
          <kt-button
            label="重置密码"
            type="danger"
            @click="resPassword(scope.row)"
            v-if="havePassWord && scope.row.mer_id != 1"
          />
          <kt-button label="派工" v-if="noShow" @click="handleEdit(scope.$index, scope.row)"/>
          <kt-button label="报修图片" v-if="noShow" @click="handleImg(scope.$index, scope.row)"/>
          <kt-button
            label="缴费"
            type="danger"
            @click="payment(scope.row)"
            v-if="havepayment"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <kt-button
        label="批量删除"
        :size="size"
        type="danger"
        @click="handleBatchDelete()"
        :disabled="this.selections.length===0"
        style="float:left;"
        v-if="showBatchDelete & showOperation"
      />
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="refreshPageRequest"
        :current-page="pageRequest.N"
        :page-size="pageRequest.Rows"
        :total="parseInt(data.Count)"
        style="float:right;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import KtButton from "./KtButton";
export default {
  name: "KtTable",
  components: {
    KtButton
  },
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String, // 编辑权限标识
    permsDelete: String, // 删除权限标识
    noShow: Boolean,
    havepayment: {
      type: Boolean,
      default: false
    },
    size: {
      // 尺寸样式
      type: String,
      default: "small"
    },
    align: {
      // 文本对齐方式
      type: String,
      default: "left"
    },
    maxHeight: {
      // 表格最大高度
      type: Number,
      default: 400
    },
    showOperation: {
      // 是否显示操作组件
      type: Boolean,
      default: true
    },
    showpayment: {
      // 是否显示操作组件
      type: Boolean,
      default: false
    },
    havePassWord: {
      // 是否显示操作组件
      type: Boolean,
      default: false
    },
    border: {
      // 是否显示边框
      type: Boolean,
      default: true
    },
    stripe: {
      // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      // // 是否高亮当前行
      type: Boolean,
      default: false
    },
    showOverflowTooltip: {
      // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: {
      // 是否显示操作组件
      type: Boolean,
      default: true
    },
    pageRequest: Object
  },
  data() {
    return {
      selections: [], // 列表选中列,
      loading: false // 加载标识
    };
  },
  methods: {
    // 分页查询
    findPage: function() {
      this.loading = true;
      let callback = res => {
        this.loading = false;
      };
      this.$emit("findPage", {
        pageRequest: this.pageRequest,
        callback: callback
      });
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    // 选择切换
    handleCurrentChange: function(val) {
      // console.log(val)
      this.$emit("handleCurrentChange", { val: val });
    },
    // 换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.N = pageNum;
      this.findPage();
    },
    // 编辑
    handleEdit: function(index, row) {
      this.$emit("handleEdit", row);
    },
        // 图片
    handleImg: function(index, row) {
      this.$emit("handleImg", row);
    },
    // 删除
    handleDelete: function(index, row) {
      this.$emit("handleDelete", row);
    },
    // 重置密码
    resPassword: function(row) {
      this.$emit("resPassword", row);
    },
    payment: function(row, type) {
      this.$emit("payment", row, type);
    },
    // 批量删除
    // handleBatchDelete: function () {
    // 	let ids = this.selections.map(item => item.id).toString()
    // 	this.delete(ids)
    // },
    // 删除操作
    delete: function(id) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          // let params = []
          // let idArray = (ids+'').split(',')
          // for(var i=0; i<idArray.length; i++) {
          // 	params.push({'id':idArray[i]})
          // }
          // this.loading = true;
          let callback = res => {
            if (res.code == 200) {
              this.$message({ message: "删除成功", type: "success" });
              this.findPage();
            } else {
              this.$message({ message: "操作失败, " + res.msg, type: "error" });
            }
            // this.loading = false;
          };
          // this.$emit('handleDelete', {params:params, callback:callback})
          this.tpost("roleList", { ID: id }, res => {
            // console.log(res.body)
            if (res.body.Status == 0) {
              this.menuData = res.body.Data;
              // console.log(this.pageResult.Rows)
              _this.totalCount = parseInt(res.body.Data.Count);
              _this.deviceList = res.body.Data.Rows;
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
                message: "请输入正确的用户名密码",
                offset: 100
              });
              return false;
            }
          });

          this.post(
            "Role/DelRole",
            { ID: row.ID, ParentID: row.ParentID },
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
        })
        .catch(() => {});
    }
  },
  mounted() {
    // console.log(this.loading);
    this.refreshPageRequest(1);
  }
};
</script>

<style scoped>
</style>
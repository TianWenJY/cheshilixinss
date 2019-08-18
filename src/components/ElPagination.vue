
<template>
  <div>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="this.parameter.N"
                   :page-sizes="[10, 20, 30, 40,50]"
                   :page-size="this.parameter.Rows"
                   layout="total,prev, pager, next, jumper"
                   :total='this.totle'
                   style="margin-top:15px;">
  </div>
</template>

<script>
export default {
  name: "ElPagination",

  props: {
    parameter: Object,
    data: Array // 表格分页数据
    // total: Number // 表格分页数据
  },
  data () {
    return {
      pageSizes: [10, 20, 30, 40, 50]
    };
  },
  methods: {
    handleChange (value) {
      console.log(value);
    },
    handleClick (tab, event) {
      //分页
      console.log(tab, event);
    },
    handleSizeChange (val) {
      this.parameter.Rows = val;
      //   this.GetList(this.parameter);
    },
    handleCurrentChange (val) {
      //   this.parameter.N = val;
      //   this.$emit("GetList", { parameter: this.parameter });
    }
  },
  created () { }
};
</script>

<style scoped>
</style>
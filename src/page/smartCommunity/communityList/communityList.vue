<template>
  <div style="display: inline-block">
    <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1 && pageRequest" label-width="80px">
      <el-select
        placeholder="选择所属社区"
        filterable
        size="medium"
        v-model="pageRequest.mer_id"
      >
        <el-option v-if="allPlate" label="全部" value="-1"></el-option>
        <el-option
          v-for="(communit,index) in communityList"
          :label="communit.sqmc"
          :value="communit.u_id"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1 && dataForm">
      <el-select
        placeholder="选择所属社区"
        v-if="dataForm"
        filterable
        size="medium"
        v-model="dataForm.mer_id"
      >
        <el-option
          v-for="(communit,index) in communityList"
          :label="communit.sqmc"
          :value="communit.u_id"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "communityList",
  props: {
    pageRequest: {},
    dataForm: {},
    allPlate: false
  },
  data() {
    return {
      communityList: []
    };
  },
  mounted() {
    if (this.getUserInfo().bin_id == 1) {
      this.getCommunity();
      console.log(this.allPlate);
    }
  },
  methods: {
    getCommunity() {
      this.api("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
        this.communityList = res.Data;
      });
    }
  }
};
</script>
<style scoped lang="less">
</style>
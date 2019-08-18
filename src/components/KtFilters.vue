<template>
      <el-row>
        <el-form class="filterBlock" :inline="true" :gutter="20" >
          <el-row class="filterContent">
            <!-- <el-form-item label="申请状态">
              <el-select v-model="parameter.Status" placeholder="申请状态" size="medium">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="待审核" :value="0"></el-option>
                <el-option label="待电话沟通" :value="1"></el-option>
                <el-option label="未通过" :value="2"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item v-for="data in pageRequest" :label="data.label">
              <el-input v-model.trim="data.model" size="medium" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="申请手机号">
              <el-input v-model.trim="parameter.Mobile" size="medium" clearable></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="省">
                    <select class="form-control" v-model="condition.ProvinceID" @change="provinceChange">
                        <option value="">全部</option>
                        <template v-for="(p, index) in province">
                            <option :value="p.ID" v-text="p.Name" :data-index="index"></option>
                        </template>
                    </select>
                </el-form-item>
                <el-form-item label="市">
                    <select class="form-control" v-model="condition.CityID" @change="cityChange">
                        <option value="">全部</option>
                        <template v-for="(c, index) in city">
                            <option :value="c.ID" v-text="c.Name" :data-index="index"></option>
                        </template>
                    </select>
                </el-form-item>
                <el-form-item label="区">
                    <select class="form-control" v-model="condition.CountyID">
                        <option value="">全部</option>
                        <template v-for="c in county">
                            <option :value="c.ID" v-text="c.Name"></option>
                        </template>
                    </select>
                </el-form-item> -->
            <!-- <el-form-item label="申请时间">
              <el-date-picker class="form-control" size="medium" type="daterange" range-separator="至" value-format="timestamp" arrow-control v-model="parameter.AddTime" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item> -->
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
</template>

<script>
// import { hasPermission } from '@/permission/index.js'
export default {
  name: 'KtButton',
  props: {
    label: {  // 按钮显示文本
      type: String,
      default: 'Button'
    },
    size: {  // 按钮尺寸
      type: String,
      default: 'mini'
    },
    type: {  // 按钮类型
      type: String,
      default: null
    },
    loading: {  // 按钮加载标识
      type: Boolean,
      default: false
    },
    disabled: {  // 按钮是否禁用
      type: Boolean,
      default: false
    },
    perms: {  // 按钮权限标识，外部使用者传入
      type: String,
      default: null
    },
    pageRequest: Array
  },
  data() {
    return {
    }
  },
  methods: {
            handleAdd(){},
            filter(){}
  },
  mounted() {
      console.log(this.pageRequest)

  }
}
</script>

<style scoped>

</style>
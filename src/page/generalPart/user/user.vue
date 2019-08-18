<template>
    <div class="user">
        <div class="searchContainer">
            <span class="label">手机号</span>
            <div class="block">
                <el-input placeholder="请输入内容"></el-input>
            </div>

            <span class="label">用户昵称</span>
            <div class="block">
                <el-input placeholder="请输入内容"></el-input>
            </div>

            <span class="label">用户角色</span>
            <div class="block">
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <el-button class="search" type="primary">查询</el-button>
        </div>

         <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%">
            <el-table-column
            prop="NickName"
            label="昵称">
            </el-table-column>
            <el-table-column
            prop="RealName"
            label="姓名">
            </el-table-column>
            <el-table-column
            prop="Mobile"
            label="手机号">
            </el-table-column>
            <el-table-column
            prop="Name"
            label="角色">
            </el-table-column>
            <el-table-column
            label="操作"
            width="180">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini">编辑</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import $$ from "@/fifter/fifter.js";
export default {
    data() {
        return {
            options: [
                {
                    value: "1",
                    label: "管理员"
                },
                {
                    value: "2",
                    label: "普通员工"
                }],
            value: "管理员",
            tableData:[]
        };
    },
    created(){
        let _this = this;
        $$.post("Crm/QueryBusPersonList",{},function(txt){
            if(txt.Status == 0){
                _this.tableData = txt.Data.Rows;
            }
        })
    },
    deactivated () {
        this.$destroy(true)
    }
};
</script>

<style lang="less" scoped>
.user {
    padding: 20px;
    box-sizing: border-box;
    .searchContainer {
        width: 100%;
        display: flex;
        align-items: center;
        background: #f2f2f2;
        border-radius: 7px;
        padding: 20px;
        box-sizing: border-box;
        margin-bottom: 30px;
        .label {
            font-size: 16px;
            font-weight: bold;
            margin-right: 10px;
        }
        .block {
            margin-right: 20px;
        }
        .search {
            margin-left: 20px;
        }
    }
}
</style>

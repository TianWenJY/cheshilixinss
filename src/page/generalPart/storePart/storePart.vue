<template>
    <div class="statics">
        <div class="searchContainer">
            <span class="date">选择门店</span>
            <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>

            <span class="date1">日期</span>
            <el-date-picker
            v-model="date"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions1">
            </el-date-picker>
            <el-button class="search" type="primary">查询</el-button>
        </div>
        <el-row class="partStatic">
            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18" >
                        <div slot="header" class="clearfix" >
                            <span>实收金额</span>
                        </div>
                        <div class="text">
                            100
                            <span>元</span>
                            <p>昨日：510</p>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18" >
                        <div slot="header" class="clearfix" >
                            <span>会员车辆</span>
                        </div>
                        <div class="text">
                            10
                            <span>辆</span>
                            <p>昨日：12</p>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18" >
                        <div slot="header" class="clearfix" >
                            <span>散客车辆</span>
                        </div>
                        <div class="text">
                            12
                            <span>辆</span>
                            <p>昨日：28</p>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18" >
                        <div slot="header" class="clearfix" >
                            <span>总到店车辆</span>
                        </div>
                        <div class="text">
                            36
                            <span>辆</span>
                            <p>昨日：40</p>
                        </div>
                    </el-card>
                </el-col>
            </el-col>
        </el-row>

        <el-row class="listStatic">
            <el-col :span="8">
                <el-col :span="20">
                
                </el-col>
            </el-col>
            <el-col :span="16">
                <el-col :span="24">

                </el-col>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options: [{
                    value: '-1',
                    label: '所有门店'
                    }, {
                    value: '1',
                    label: '门店1'
                    }, {
                    value: '2',
                    label: '门店2'
                    }, {
                    value: '3',
                    label: '门店3'
                    }, {
                    value: '4',
                    label: '门店4'
                    }],
                value: '-1',
                date: '2018-10-26',
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    }]
                },
            }
        }
    }
</script>

<style lang="less" scoped>
    .statics{
        padding: 20px;
        box-sizing: border-box;
        .searchContainer{
            width: 100%;
            display: flex;
            align-items: center;
            background: #f2f2f2;
            border-radius: 7px;
            padding: 20px;
            box-sizing: border-box;
            .date,.date1{
                font-size: 16px;
                font-weight: bold;
                margin-right: 10px;
            }
            .date1{
                margin-left:30px;
            }
            .search{
                margin-left: 20px;
            }
        }
        .partStatic{
            margin-top: 30px;
            margin-bottom: 30px;
            .text{
                text-align: center;
                font-size: 24px;
                span{
                    font-size: 16px;
                }
                p{
                    font-size: 14px;
                    margin-top: 5px;
                }
            }
        }
        .listStatic{

        }
    }

</style>



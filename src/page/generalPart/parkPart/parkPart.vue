<template>
    <div class="statics">
        <div class="searchContainer">
            <span class="date">统计日期类型</span>
            <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button class="search" type="primary">查询</el-button>
        </div>

        <div id="parkMain">

        </div>
    </div>
</template>

<script>
    var echarts = require('echarts');
    export default {
        data() {
            return {
                options: [{
                    value: '1',
                    label: '周'
                    }, {
                    value: '2',
                    label: '月'
                    }, {
                    value: '3',
                    label: '季度'
                    }, {
                    value: '4',
                    label: '小时'
                    }],
                value: '1'
            }
        },
        mounted(){
            var newUser = echarts.init(document.getElementById('parkMain'));
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['进入停车场', '离开停车场', '停车时长', '停车交费']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ["10-19","10-20","10-21","10-22","10-23","10-24","10-25"],
                    splitNumber: 5
                }],
                yAxis: {
                    type: 'value',
                },
                series: [{
                        name: '进入停车场',
                        type: 'bar',
                        barWidth: "12%",
                        data: [190,200,232,190,210,278,184]
                    },
                    {
                        name: '离开停车场',
                        type: 'bar',
                        barWidth: "12%",
                        data: [210,240,332,290,110,178,284]
                    },
                    {
                        name: '停车时长',
                        type: 'bar',
                        barWidth: "12%",
                        data: [800,940,632,990,1100,978,884]
                    },
                    {
                        name: '停车交费',
                        type: 'bar',
                        barWidth: "12%",
                        data: [80,140,332,490,200,478,184]
                    },
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
            };
            newUser.setOption(option);
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
            .date{
                font-size: 16px;
                font-weight: bold;
                margin-right: 10px;
            }
            .search{
                margin-left: 20px;
            }
        }

        #parkMain{
            height: 500px;
            margin-top: 50px;
        }
    }

</style>



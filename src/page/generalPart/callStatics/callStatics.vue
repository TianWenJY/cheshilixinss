<template>
    <div class="statics">
        <div class="searchContainer">
            <span class="date">日期</span>
            <div class="block">
                <el-date-picker
                v-model="value7"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
                </el-date-picker>
                <el-button class="search" type="primary">查询</el-button>
            </div>
        </div>
        <div id="main">

        </div>

        <div id="main1">

        </div>
        <div id="main1">

        </div>
    </div>
</template>

<script>
    var echarts = require('echarts');
    export default {
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value7: ["2018-09-26", "2018-10-26"],
            };
        },
        mounted(){
            var newUser = echarts.init(document.getElementById('main'));
            var activeUser = echarts.init(document.getElementById('main1'));
            // 绘制图表
            newUser.setOption({
                color:"#409EFF",
                title: {
                    text: '汽车服务板块新增用户'
                },
                tooltip: {},
                xAxis: {
                    data: ['9-26', '9-27', '9-28','9-29','9-30','10-01','10-02','10-03','10-04','10-05','10-06','10-07','10-08','10-09','10-10','10-11','10-12','10-13','10-14','10-15','10-16','10-17','10-18','10-19','10-20','10-21','10-22','10-23','10-24','10-25','10-26']
                },
                yAxis: {},
                series: [{
                    name: '人数',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: [5, 5, 0, 0],
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 1, 0, [
                                    { offset: 0, color: '#79bafd' },
                                    { offset: 1, color: '#409EFF' }
                                ])

                        }
                    },
                    data: [12, 20, 36, 10, 9, 33, 20, 36, 10, 9, 23, 20, 56, 10, 9, 33, 120, 36, 60, 9, 33, 20, 46, 10, 9, 33, 20, 36, 10, 9, 33,32]
                }],
                dataZoom: [
                    {
                        show: true,
                        start: 0,
                        end: 30
                    }
                ],
            });
            activeUser.setOption({
                color:"#409EFF",
                title: {
                    text: '汽车服务板块活跃用户'
                },
                tooltip: {},
                xAxis: {
                    data: ['9-26', '9-27', '9-28','9-29','9-30','10-01','10-02','10-03','10-04','10-05','10-06','10-07','10-08','10-09','10-10','10-11','10-12','10-13','10-14','10-15','10-16','10-17','10-18','10-19','10-20','10-21','10-22','10-23','10-24','10-25','10-26']
                },
                yAxis: {},
                series: [{
                    name: '人数',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: [5, 5, 0, 0],
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 1, 0, [
                                    { offset: 0, color: '#79bafd' },
                                    { offset: 1, color: '#409EFF' }
                                ])

                        }
                    },
                    data: [873, 120, 336, 210, 239, 33, 20, 136, 210, 9, 23, 120, 256, 10, 119, 33, 120, 36, 260, 19, 33, 320, 46, 110, 69, 233, 2120, 36, 10, 59, 333,232]
                }],
                dataZoom: [
                    {
                        show: true,
                        start: 0,
                        end: 30
                    }
                ],
            });
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
            margin-bottom: 30px;
            .date{
                font-size: 16px;
                font-weight: bold;
                margin-right: 10px;
            }
            .search{
                margin-left: 20px;
            }
        }
        #main,#main1{
            height: 300px;
            margin-bottom: 30px;
        }
    }
</style>



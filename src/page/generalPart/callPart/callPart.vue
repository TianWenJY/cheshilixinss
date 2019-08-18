<template>
    <div class="callPart">
        <el-row class="partStatic">
            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18" >
                        <div slot="header" class="clearfix" >
                            <span>二维码总量</span>
                        </div>
                        <div class="text">
                            20081
                            <span>张</span>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18" >
                        <div slot="header" class="clearfix" >
                            <span>未激活数量</span>
                            <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
                        </div>
                        <div class="text">
                            10000
                            <span>张</span>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18" >
                        <div slot="header" class="clearfix" >
                            <span>激活数量</span>
                            <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
                        </div>
                        <div class="text">
                            10080
                            <span>张</span>
                        </div>
                    </el-card>
                </el-col>
            </el-col>

            <el-col :span="6">
                <el-col :span="20">
                    <el-card class="box-card" :span="18" >
                        <div slot="header" class="clearfix" >
                            <span>当日激活</span>
                            <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
                        </div>
                        <div class="text">
                            80
                            <span>张</span>
                        </div>
                    </el-card>
                </el-col>
            </el-col>
        </el-row>
        <div id="main">

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
            };
        },
        mounted(){
            var newUser = echarts.init(document.getElementById('main'));
            var activeUser = echarts.init(document.getElementById('main1'));
            // 绘制图表
            newUser.setOption({
                color:"#409EFF",
                title: {
                    text: '移车码激活情况'
                },
                tooltip: {},
                xAxis: {
                    data: ['9-26', '9-27', '9-28','9-29','9-30','10-01','10-02','10-03','10-04','10-05','10-06','10-07','10-08','10-09','10-10','10-11','10-12','10-13','10-14','10-15','10-16','10-17','10-18','10-19','10-20','10-21','10-22','10-23','10-24','10-25','10-26']
                },
                yAxis: {},
                series: [{
                    name: '张',
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
                    text: '实时中间号统计'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    }
                },
                xAxis: [
                {
                    type: 'category',
                    data: ['9-26', '9-27', '9-28','9-29','9-30','10-01','10-02','10-03','10-04','10-05','10-06','10-07','10-08','10-09','10-10','10-11','10-12','10-13','10-14','10-15','10-16','10-17','10-18','10-19','10-20','10-21','10-22','10-23','10-24','10-25','10-26'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
                ],
                yAxis:{
                    type:'value'
                },
                series:[{
                    name:'实时在用中间号统计',
                    smooth:true,  //这个是把线变成曲线
                    type:'line',
                    data:[4,5,3,2,2,4,5,0,2,1,1,5,3,3,1,4,5,3,1,1,4,7,3,10,1,4,1,2,2,1]
                }],
                animationEasing: 'elasticOut',
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

<style lang="less">
    .callPart{
        padding:20px;
        .text{
            text-align: center;
            font-size: 24px;
            span{
                font-size: 16px;
            }
        }
        #main,#main1{
            height: 300px;
            margin-top: 30px;
        }
    }
</style>


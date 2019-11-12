<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb> 
         <!-- 卡片视图 -->
        <el-card>
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="main" style="width: 800px;height:600px;"></div>
        </el-card>
    </div>
</template>
<script>
// <!-- 引入 ECharts 文件 -->
import echarts from 'echarts';
export default {
    data(){
        return{        
            //需要跟请求的折线图数据合并的options
            options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
            
        }
    },
    created(){

    },
    methods: {

    },
    // DOM渲染完毕
    async mounted(){
         // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        
        const {data : res} = await this.$http.get('reports/type/1');

        if(res.meta.status !== 200){
            return this.$message.error('获取数据失败,请刷新或稍后再访问!');
        }
        
        // 指定图表的配置项和数据
        // 需要将res.data和options合并
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(Object.assign(this.options,res.data));
    }
    
}
</script>

<style lang="less" scoped>
    .el-card {
        margin-top : 20px;
    }
</style>
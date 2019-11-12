<template>
    <div>
         <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb> 
         <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" >
                    <el-button  slot="append" icon="el-icon-search"></el-button>
                </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表 -->
            <el-table
                :data="orderList"
                style="width: 100%" border stripe>
                <el-table-column type="index" > </el-table-column>
                <el-table-column label="订单编号" prop="order_number" > </el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="100px"> </el-table-column>
                <el-table-column label="是否付款" width="100px" >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status === 1" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
                <el-table-column label="下单时间" >
                     <!-- 作用域插槽 调用全局过滤器 -->
                    <template slot-scope="scope">
                       {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  > 
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="showOrderBox"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location" circle @click="showProgressBOx"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!--  展示订单修改地址的对话框  -->
        <el-dialog
            title="修改订单地址"
            :visible.sync="showOrderBoxDialogVisible"
            width="50%"
            :before-close="handleOrderClose">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" >
                <el-form-item label="省市区/县" prop="address1">
                   <el-cascader
                       :options="cityData"
                       v-model="addressForm.address1">
                   </el-cascader>
                </el-form-item> 
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog> 
        <!--  展示订单订单地址的对话框  -->
        <el-dialog
            title="物流进度"
            :visible.sync="showOrderLocationDialogVisible"
            :before-close="handleProgressClose">
            <!-- 时间线 -->
              <el-timeline :reverse="true">
                <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata.js'; 
export default {
    data(){
        return {
            queryInfo: {
                query : '',
                pagenum: 1,
                pagesize : 10
            },
            total : 0,
            orderList: [],
            // 展示订单修改地址的对话框
            showOrderBoxDialogVisible: false,
            // 展示订单订单地址的对话框
            showOrderLocationDialogVisible : false,
            addressForm: {
                address1 : [],
                address2 : ''
            },
            addressFormRules: {
                address1 : [
                    {required: true, message:'请选择 省市区/县', trigger: 'blur'}
                ],
                address2 : [
                    {required: true, message:'请填写详细地址', trigger: 'blur'}
                ]
            },
            // cityData: cityData,
            cityData,
            // 物流信息
            progressInfo: [],


        }
    },
    created(){
        this.getOrderList();
    },
    methods: {  
        // 获取所有订单列表
        async getOrderList(){
            const {data : res} = await this.$http.get('orders', {
                params : this.queryInfo
            })

            if(res.meta.status !== 200){
                return this.$message.error('获取订单列表失败!请稍后重试.');
            }
            window.console.log(res);
            this.total = res.data.total;
            this.orderList = res.data.goods;
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getOrderList();
        },
        // 展示订单修改地址的对话框
        showOrderBox(){
            this.showOrderBoxDialogVisible = true;
        },
        handleOrderClose(){
            this.$refs.addressFormRef.resetFields();
            this.showOrderBoxDialogVisible = false;
        },
        handleProgressClose(){
            this.showOrderLocationDialogVisible = false;
        },
        // 展示物流进度对话框
        async showProgressBOx(){
            const {data : res } = await this.$http.get('/kuaidi/1106975712662');
            window.console.log(res);
            this.showOrderLocationDialogVisible = true;
            if(res.meta.status !== 200) {
                return this.$message.error('暂时无法查询,请稍后重试!');
            }
            this.progressInfo = res.data;
            window.console.log(res)
        }

    },
    computed : {
        
    }
    
}
</script>
<style lang="less" scoped>
     .el-card {
        margin-top : 20px;
    }

</style>
<template>
    <div>
         <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb> 
         <!-- 卡片视图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList" >
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>     
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>           
            </el-row> 

            <!-- 数据  table -->
            <el-table :data="goodList" border stripe="">
                <!-- 索引列 -->
                <el-table-column type="index">  </el-table-column>
                <el-table-column label="商品名称" prop="goods_name">  </el-table-column>
                <el-table-column label="价格" width="100px" prop="goods_price">  </el-table-column>
                <el-table-column label="重量" width="100px" prop="goods_weight">  </el-table-column>
                <el-table-column label="添加时间" prop="add_time" width="160px">
                     <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                       {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" circle></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange"  :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize"  layout="total, sizes, prev, pager, next, jumper" :total="total" background>

            </el-pagination>
        </el-card>
    </div>
</template>

<script>
window.console.log('进入list');
export default {
    data(){
        return {
            // 查询参数对象
            queryInfo : {
                query : '', // 查询参数
                pagenum : 1,    // 当前页码
                pagesize : 10 // 每页显示条数
            },
            // 商品列表
            goodList: [],
            // 商品总数
            total : 0,
        }

    },
    methods: {
        // 根据分页获取对应的商品列表
        async getGoodsList(){
            const {data : res} = await this.$http.get('goods', {params : this.queryInfo});
            window.console.log(res);
            if(res.meta.status !== 200) return;
            this.$message.success('获取商品列表数据成功');
            this.goodList = res.data.goods;
            this.total = res.data.total;

        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();

        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },
        async removeById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除请求!')
            }
            const {data : res} =  await this.$http.delete(`goods/${id}`);
            if(res.meta.status !== 200) {
                return this.$message.error('删除失败!');
            }
            this.$message.success('删除成功!');
            // 刷新数据
            this.getGoodsList();
        },
        // 跳转到添加页面
        goAddPage(){
            this.$router.push('/goods/add');

        }

    },
    // 钩子函数
    created() {
         this.getGoodsList()
    }
    
}
</script>

<style lang="less" scoped>
    .el-card{
        margin-top: 20px;
        .el-table {
            margin-top: 10px;
        }
    }
</style>
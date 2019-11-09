<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>     

         <!-- 卡片视图 -->
        <el-card>  
            <el-row :gutter="10">
                <!-- 按钮 -->
                <el-col :span="6">
                    <el-button type="primary" @click="showAddCateDialog()">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 展示分类列表 -->
            <!-- 表格 -->
            <!-- 
                selection-type 是否为多选类型表格
                expand-type  是否为展开行类型表格（为 True 时，需要添加名称为 '$expand' 的作用域插槽, 它可以获取到 row, rowIndex)
                show-index 是否显示数据索引 
                index-text 数据索引名称
                show-row-hover 鼠标悬停时，是否高亮当前行
             -->
            <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false" class="treeTable">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <div>
                        <i class="el-icon-circle-check font_i_size" v-if="scope.row.cat_deleted === false"
                        style="color : lightgreen"></i>
                        <i class="el-icon-circle-close font_i_size" style="color : yellow"  v-else></i>
                    </div>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <div >
                        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                        <el-tag size="mini" type="warning" v-else>三级</el-tag>
                    </div>
                </template>
                <!-- 操作 -->
                <template slot="opt">
                    <div  >
                        <el-button type="primary" size="mini" icon="el-icon-edit" round>编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" round>删除</el-button>
                    </div>
                </template>
            </tree-table>
            <!-- 分页 
                handleSizeChange($event)
                handleSizeChange 
            -->
            <el-pagination  @size-change="handleSizeChange($event)" @current-change="handleCurrentChange($event)"  :current-page="queryInfo.pagenum"  :page-sizes="[2, 5, 10, 20]"  :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">

            </el-pagination>
        </el-card>  
        <!-- 添加分类的对话框 -->
        <el-dialog  title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed" >
            <!-- 添加分类的表单 
                prop : 验证规则
             -->
           <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" >
                    <!-- 
                        expandTrigger: 'hover' 鼠标悬停显示子菜单
                        :options  指定数据源
                        :props : 用来指定配置对象
                         v-model 必须指定一个数组
                     -->
                    <el-cascader :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChange" clearable>  
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate()" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            queryInfo : {
                //  值：1，2，3 分别表示显示一层二层三层分类列表 【可选参数】如果不传递，则默认获取所有级别的分类
                type :  3,
                //  当前页码值  【可选参数】如果不传递，则默认获取所有分类
                pagenum : 1,
                //  每页显示多少条数据 【可选参数】如果不传递，则默认获取所有分类
                pagesize : 5
            },
            //  商品分类的数据列表，默认为空
            catelist : [],
            // 总数据条数
            total : 0,
            // 控制添加分类对话框的隐藏
            addCateDialogVisible : false, 
            // 为table指定列的定义
            columns: [
            {
                label: '分类名称',
                prop: 'cat_name',
            },{
                label : '是否有效',
                // 表示自定义模板列
                type: 'template',
                template : 'isok'
            },{
                label : '排序',
                // 表示自定义模板列
                type: 'template',
                template : 'order'
            },{
                label : '操作',
                // 表示自定义模板列
                type: 'template',
                template : 'opt'
            }],
            //  添加分类的属性
            addCateForm : {
                cat_pid : 0 , // 父级分类的id
                cat_name : '',  // 分类的名称
                cat_level : 0   // 分类的级别
            },
            // 添加分类表单的验证规则
            addCateFormRules : {
                cat_name : [
                    {required: true, message:'请输入添加分类的名称', trigger: 'blur'},
                    {require: true, min: 3, max: 10, message: '分类名称长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            },
            // 父级分类数据
            parentCateList: [],
            cascaderProps: {
                expandTrigger: 'hover', //触发时机 hover 
                value: 'cat_id',  //选择项的id值 唯一标识
                label: 'cat_name',  // 用户看到的字段
                children: 'children', // 父子关联的字段
                checkStrictly: true // 不严格遵循父子结构
            },
           /*  cascaderProps : {
                value : 'cat_pid',
                label : 'cat_name',
                children : 'children'
            }, */
            // 选中的父级分类的id数组
            selectedKeys: [],
        }
    } ,
    created() {
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList(){
            // window.console.log(this.$http.get('categories', {params : this.querfInfo}));
            // 添加 await 结构返回的数据，返回数据的类型是一个promise对象
            const { data : res } = await this.$http.get('categories', {params : this.queryInfo});
            // window.console.log(res.data);
            if(res.meta.status !== 200) {
                return this.$message.error('获取数据失败！请稍后重试');
            }
            // window.console.log(res);
            //  把数值列表赋值给catelist
            this.catelist = res.data.result;
            this.total = res.data.total;
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            // window.console.log(newSize);
            this.getCateList();
        },
        // 监听pagenum改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            // window.console.log(newPage);
            this.getCateList();
        },
        // 点击按钮 显示添加分类的对话框
        showAddCateDialog() {
            this.getParentCateList();
            this.addCateDialogVisible = true;
        },
        // 获取父级分类的数据列表
        async getParentCateList(){
            const {data : res} = await this.$http.get('categories', {params : {type : 2} });
            // window.console.log(res.data);
            if(res.meta.status !== 200) {
                return this.$message.error("获取父级分类数据失败,请稍后重试");
            }
            this.parentCateList = res.data;
            window.console.log("res.data");
            window.console.log(this.parentCateList);
        },
        // 选择项变化发生触发
        parentCateChange(){
            // window.console.log(this.selectedKeys);
            /* 
                如果selectedkeys数组中的length大于0 证明选中了
            */
            if(this.selectedKeys.length > 0) {
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    this.addCateForm.cat_level = this.selectedKeys.length;
                    return
            }else {
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            }
        },
        // 点击按钮 添加新的分类
        addCate(){
            // window.console.log(this.addCateForm);
            //  获取到表单内容 发送http请求  添加分类
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const { data : res } = await this.$http.post('categories', this.addCateForm)

                if(res.meta.status !== 201){
                    return this.$message.error("添加分类失败!");
                }

                this.$message.success('添加分类成功!');
                // 添加成功 刷新数据列表
                this.getCateList();
                // 将对话框设置为不可见
                this.addCateDialogVisible = false;
            })

        },
        addCateDialogClosed(){
            // 清空表单
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = [];
            this.addCateForm.cat_level = 0;
            this.addCateForm.cat_pid = 0;

        }
    },
}
</script>

<style lang="less" scoped>
    .treeTable {
        margin-top: 20px;
    }
    .font_i_size {
        font-size: 26px;
    }
    .el-cascader {
        width: 100%;   
    }
</style>
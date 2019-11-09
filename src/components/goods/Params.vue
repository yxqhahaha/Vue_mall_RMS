<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb> 
         <!-- 卡片视图 -->
        <el-card>
            <!-- 提示 -->
            <el-alert
                :closable="false"
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon>
            </el-alert>

            <!-- 选择商品分类 -->
            <el-cascader expand-trigger="hover"
                :options="catelist"
                v-model="selectedCateKeys"
                @change="handleChange"
                :props="cateProps">
            </el-cascader>

            <!-- 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible">添加参数</el-button>
                    <el-table :data="manyTableData" style="width: 100%" border stripe>
                        <!-- 展开行 -->
                        <!-- <el-table-column type="expand"  > </el-table-column> -->
                        
                        <!-- 动态参数表格 -->
                        <el-table-column prop="prop" label="label" width="width">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="iput-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="iput-new-tag"  size="mini" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"> </el-table-column>
                        <el-table-column label="参数名称" prop="attr_name" ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                 <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>    
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态参数的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisiable=true">静态属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                 <!-- 循环西安然tag标签 -->
                                 <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="iput-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="iput-new-tag"  size="mini" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                         <!-- 索引列 -->
                        <el-table-column type="index"> </el-table-column>
                        <el-table-column label="参数名称" prop="attr_name" ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                 <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>    
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
            
        <!-- 添加参数的对话框 -->
        <el-dialog :title="'添加' + titleText " :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 添加参数的对话框 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="addDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="addParams">确定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
        <el-dialog :title="'修改' + titleText " :visible.sync="editDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 添加参数的对话框 -->
            <el-form ref="editFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="editDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="editParams">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 商品分类列表
            catelist : [],
            // 级联选择框的配置对象
            cateProps : {
                value : 'cat_id',
                label : 'cat_name',
                children : 'children',
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys : [],
            // 被激活的页签的名称
            activeName: 'many',
            // 动态参数数据
            manyTableData: [],
            // 静态属性的数据
            onlyTableData: [],
            // 控制添加对话框的显示与隐藏
            addDialogVisible : false,
            // 控制修改对话框的显示与隐藏
            editDialogVisible : false,
            // 添加参数的表单数据对象
            addForm: {
                attr_name : ''
            },
            // 修改参数的表单数据对象
            editForm: {
               
            },
            // 添加表单的验证规则对象
            addFormRules: {
                attr_name: [
                    {required: true, message:'请输入参数名称', trigger: 'blur'}
                ]
            },
            // 修改表单的验证规则对象
            editFormRules: {
                attr_name: [
                    {required: true, message:'请输入参数名称', trigger: 'blur'}
                ]
            },
        }
    },
    created(){
        this.getCateList();
    },
    methods: {
        async getCateList(){
            // 获取所有商品分类列表
            const { data : res} = await this.$http.get('categories')
            window.console.log(res);
            if(res.meta.status !== 200) {
                return this.$message.error("获取数据失败!");
            }
            this.catelist = res.data;
            
        },
        // 级联选择器发生变化会触发这个函数
        handleChange(){
            this.getParamsData();
        },
        handleTabClick(){
            // 页签点击事件的处理函数
             window.console.log(this.activeName);
             this.getParamsData();
        }, 
        // 获取参数列表的数据
        async getParamsData(){
            //  证明选中的是三级分类
            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = [];
                this.manyTableData = []
                this.onlyTableData = []
                return 
            }
            // 证明选中的是三级分类
            window.console.log(this.selectedCateKeys);
            // 根据选择分类的id和当前所处的面板,获取对应的参数${}
            const { data : res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params : {
                    sel : this.activeName
                }
            })
            window.console.log(res.meta.status)
            window.console.log(res.data)
            if(res.meta.status !== 200) {
                return this.$message.error("获取参数列表失败!");
            }

            res.data.forEach(item => {
                window.console.log(item);
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                // 控制文本的显示与隐藏
                item.inputVisible = false;
                // 文本框中输入的值
                item.inputValue = '';
            })

            window.console.log(res.data);
            if(this.activeName === 'many'){
                this.manyTableData = res.data.attr_vals;
            }else{
                this.onlyTableData = res.data.attr_vals;
            }
        },
        //  监听对话框的关闭事件
         addDialogClosed(){
             this.$refs.addFormRef.resetFields();
         },
         // 点击按钮 添加参数
         addParams(){
             this.$refs.addFormRef.validate(async valid => {
                 if(!valid) return;
                 const {data : res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                     attr_name : this.addForm.attr_name,
                     attr_sel : this.activeName
                 });

                 if(res.neta.status !== 201){
                     return this.$message.error('添加参数失败');
                 }

                 this.$message.success("添加参数成功");
                 this.addDialogVisible = false;
                 this.getParamsData();
             })
         },
        //  点击按钮,展示修改的对话框
        async showEditDialog(attrId){
            // 查询当前参数的信息
            const {data : res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
                params: {attr_sel : this.activeName}
            })

            if(res.meta.status !== 200 ){
                return this.$message.error('获取参数信息失败!');
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 重置修改的表单
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        // 点击按钮修改参数信息
        editParams(){
            this.$$refs.editFormRef.validate(async valid => {
                if(!valid) return;
                const {data : res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                {
                    attr_name : this.editForm.attrForm.attr_name,
                    attr_sel : this.activeName
                })
                if(res.meta.status !== 200){
                    return this.$message.error("修改参数失败!");
                }

                this.$message.success("修改参数成功");
                this.getParamsData();
                this.editDialogVisible = false;
            })
        },
        // 根据id删除对应的参数项
        async removeParams(attrId){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该参数, 是否继续?',
                '提示',
                {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err => err);

            // 用户取消了删除操作
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除!')
            }
            // 删除的业务逻辑
            const { data: res } = await this.$http.delete(
                `categories/${this.cateId}/attributes/${attrId}`
            )

            if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败！')
            }

            this.$message.success('删除参数成功！')
            this.getParamsData()
        },
        // 文本框失去焦点,或按下了enter都会触发
        async handleInputConfirm(row){
             if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return  
            }
            // 如果没有return，则证明输入的内容，需要做后续处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            // 需要发起请求，保存这次操作
            this.saveAttrVals(row);
        },
        // 将对attr_vals的操作,保存到数据库
        async saveAttrVals(row){
            // 需要发起请求，保存这次操作
            const {data : res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name : row.attr_name,
                attr_sel : row.attr_sel,
                attr_vals : row.attr_vals.join(' ') 
            });

            if(res.meta.status !== 200) {
                return this.message.error('修改参数项失败!')
            }
            this.$message.success('修改参数项成功!');
        },
        // 点击按钮,展示文本输入框
        showInput(row){
            row.inputVisible = true;
            // 让文本框自动活的焦点
            // $nextTick 方法的作用,就是当页面上元素被重新渲染之后,才会指定回调函数中的代码
            this.$nextTick(()    => {
                this.$refs.saveTagInput.$refs.input.focus();
            })
        },
        // 删除对应的参数可选项
        handleClose(i, row){
            row.attr_vals.splice(i, 1);
            this.saveAttrVals(row);
        }
    },
    computed : {
        // 如果按钮需要被禁用,则返回true, 否则返回false
        isBtnDisabled(){
            if(this.selectedCateKeys.length !== 3){
                return true;
            }
            return false;
        },
        cateId(){
            if(this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2];
            }
            return null;
        },
        // 动态计算标题的文本
        titleText() {   
            if (this.activeName === 'many') {
                return '动态参数';
            }
            return '静态属性';
        }
    }
}
</script>
<style lang="less" scoped>
    .el-card {
        margin-top : 20px;
    }

</style>
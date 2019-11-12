<template>
    <div class="pageBody">
         <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb> 
         <!-- 卡片视图 -->
        <el-card>
            <!-- 提示消息 -->
             <el-alert
                title="添加商品信息"
                center
                type="info"
                show-icon :closable="false" >
            </el-alert>
            <!-- 进度条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息" ></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step> 
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- table栏 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                           <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格">
                           <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量">
                           <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量">
                           <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                           <el-cascader
                                v-model="addForm.goods_cat"
                                :options="catelist"
                                :props="{ 
                                    expandTrigger: 'hover',
                                    value : 'cat_id',
                                    label : 'cat_name',
                                    children : 'children'
                                }"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- //在参数信息，商品属性面板中添加循环生成结构的代码 -->
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单item项 -->
                        <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTableData">
                            <!-- 使用数组渲染复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="val" v-for="(val,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!-- 循环生成静态属性 -->
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 
                            商品图片上传
                            action:指定图片上传api接口
                            :on-preview ： 当点击图片时会触发该事件进行预览操作,处理图片预览
                            :on-remove : 当用户点击图片右上角的X号时触发执行
                            :on-success：当用户点击上传图片并成功上传时触发
                            list-type ：设置预览图片的方式
                            :headers ：设置上传图片的请求头 
                        -->
                        <el-upload
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :on-success="handleSuccess"
                            :headers="headerObj">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                         <!-- bidirectional data binding（双向数据绑定） -->
                        <quill-editor v-model="addForm.goods_introduce" >
                        </quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" class="btnAdd" @click="btnAddGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 预览图片对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" class="previewImg" />
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 激活的步骤
            activeIndex : '0',
            addForm : {
                goods_name : '',
                goods_price : 0,
                goods_weight : 0,
                goods_number : 0,
                // 商品所属的分类数组
                goods_cat : [],
                //上传图片数组
                pics: [],
                // 商品详情描述 可以为空
                goods_introduce: '', 
                attrs : [],    

            },
            addFormRules : {
                goods_name : [
                    {required: true, message:'请输入商品名称', trigger: 'blur'},
                    {require: true, min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                goods_price : [
                    {required: true, message:'请输入商品价格', trigger: 'blur'},
                ],
                goods_weight : [
                    {required: true, message:'请输入商品重量', trigger: 'blur'},
                ],
                goods_number : [
                    {required: true, message:'请输入商品数量', trigger: 'blur'},
                ],
                goods_cat : [
                    {required: true, message:'请选择商品分类', trigger: 'blur'},
                ],
            },
            addFormRef : {

            },
            // 商品分类数据
            catelist : [],
            // 选择的商品分类
            selectedCateKeys: [],
            // 动态参数列表数据
            manyTableData : [],
            // 静态属性列表
            onlyTableData: [],
            // 图片上传地址
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload', 
            //图片上传组件的headers请求头对象
            headerObj: { Authorization: window.sessionStorage.getItem('token') },
            //保存预览图片的url地址
            previewPath: '',
            //控制预览图片对话框的显示和隐藏
            previewVisible:false
        }
    },
    created(){
        this.getCateList();

    },
    methods : {
        async getCateList(){
            const {data : res} = await this.$http.get('categories');
            window.console.log(res);
            if(res.meta.status !== 200) {
                return this.$message.error('获取数据失败,请重试');
            }
            this.catelist = res.data;
            // window.console.log(this.catelist);
            this.$message.success('获取分类列表成功!');
        },
        // 级联选择器发生变化会触发
        handleChange(){
            window.console.log(this.addForm.goods_cat);
            // 只允许选中三级分类
            if(this.addForm.goods_cat.length !== 3){
                // 将数组内容清空
                this.addForm.goods_cat = [];
            }
        },
        // 禁止页签切换
        beforeTabLeave(activeName, oldActiveName){
            // activeName 即将进入的标签页, oldActiveName 即将离开的标签页
            window.console.log(activeName, oldActiveName);
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                 this.$message.error('请先选择商品分类');
                 return false;
            }
        },
        async tabClicked(){
            window.console.log(this.activeIndex);
            if(this.activeIndex === '1'){
                // window.console.log('动态参数面板');
                const {data : res}  = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params : {sel : 'many'}
                });
                if(res.meta.status !== 200){
                    return this.$message.error('获取动态参数列表失败!');
                }
            window.console.log('获取动态参数列表成功!');
            //将attr_vals字符串转换为数组
            res.data.forEach(item => {
                item.attr_vals =  item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
            })

            this.manyTableData = res.data;
            // window.console.log(res.data);
            }else if (this.activeIndex === '2') {
                //发送请求获取静态属性
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                { 
                    params: { sel: 'only' } 
                })
                window.console.log("静态属性列表");
                window.console.log( res.data);
                if (res.meta.status !== 200) {
                    return this.$message.error('获取静态属性列表失败');
                }

                this.onlyTableData = res.data;
            }
        },
        handlePreview(file) {
            //当用户点击图片进行预览时执行，处理图片预览
            //形参file就是用户预览的那个文件
            this.previewPath = file.response.data.url;
            //显示预览图片对话框
            this.previewVisible = true;
        },
        handleRemove(file) {
            //当用户点击X号删除时执行
            //形参file就是用户点击删除的文件
            //获取用户点击删除的那个图片的临时路径
            const filePath = file.response.data.tmp_path;
            //使用findIndex来查找符合条件的索引
            const index = this.addForm.pics.findIndex(item => item.pic === filePath);
            //移除索引对应的图片
            this.addForm.pics.splice(index, 1);
        },
        handleSuccess(response) {
            //当上传成功时触发执行
            //形参response就是上传成功之后服务器返回的结果
            //将服务器返回的临时路径保存到addForm表单的pics数组中
            this.addForm.pics.push({ pic: response.data.tmp_path });
        },
        // 点击添加商品按钮触发添加商品事件
        async btnAddGoods(){
            // window.console.log(this.addForm); 
            this.$refs.addFormRef.validate(async valid => {
                if(!valid){
                    return this.$message.error('请填写必要的表单项!');
                }
                // 添加商品的业务逻辑
                // this.addForm.goods_cat需要的是一个以 , 隔开的字符串
                // this.addForm.goods_cat = this.addForm.goods_cat.join(','); // error
                // 拼接之前 深拷贝
                // lodash cloneDeep(obj) 这里不使用lodash实现深拷贝
                const form = JSON.parse(JSON.stringify(this.addForm));
                // window.console.log(form);
                // window.console.log(form instanceof Object);
                // window.console.log(this.addForm);
                form.goods_cat = form.goods_cat.join(',');
                window.console.log(this.manyTableData)
                window.console.log(this.onlyTableData)
                // 处理动态参数
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id : item.attr_id,
                        attr_value : item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo);
                })
                // 处理静态属性
                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        attr_id : item.attr_id,
                        attr_value : item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo);
                })
                form.attrs = this.addForm.attrs;
                window.console.log(form);
                // 发起添加商品请求  
                // 商品的名称必须是唯一的
                const {data : res} = await this.$http.post('goods', form);

                if(res.meta.status !== 201){
                    return this.$message.error('添加商品失败!')
                }
                
                this.$message.success('添加成功!');
                this.$router.push('/goods')

            })
        }
    },
    computed : {
        cateId(){
            if(this.addForm.goods_cat.length === 3){
                return  this.addForm.goods_cat[2];
            }
            return null;
        }
    }
    
}
</script>
<style lang="less" >  
.pageBody {
     height: 100%;
     .el-card{
        height: 1000px;
        margin-top: 20px;
        .el-checkbox {
            margin: 3px;
        }
    }
    .previewImg {
        width: 100%;
    }
    .btnAdd {
        font-size: 20px;
        margin: 35px 10px;
    }
}
 
</style>
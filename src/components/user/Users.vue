<template>
<div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        <!-- 搜索与添加区域 -->
        <el-row :gutter="10">
            <el-col :span="8">
                <!-- 搜索功能 -->
                <el-input placeholder="请输入内容" @clear="getUserList" clearable v-model="queryInfo.query" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                <!-- 点击按钮弹出对话框 -->
                <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%" @close="addDialogClosed()">
                    <!-- 添加用户表单 -->
                    <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px" >
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="addUserForm.username" ></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addUserForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addUserForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile">
                            <el-input v-model="addUserForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addUser" >确 定</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>
        <el-table :data="userlist" stripe style="width: 100%">
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="username" label="姓名" width="130"> </el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="mobile" label="电话"> </el-table-column>
            <el-table-column prop="role_name" label="角色"> </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <!-- {{scope.row}} -->
                    <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope"> 
                    <el-tooltip :enterable="false" effect="dark" content="编辑用户" placement="top-start">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip :enterable="false" effect="dark" content="删除用户" placement="top-start">
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById()"></el-button>
                    </el-tooltip>
                    <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top-start">
                        <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total,sizes, prev, pager, next,jumper" :total="total">

        </el-pagination>
    </el-card>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>


</div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
            // 合法的邮箱
            return cb()
        }

        cb(new Error('请输入合法的邮箱'))
        }

        // 验证手机号的规则
        var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if (regMobile.test(value)) {
            return cb()
        }

            cb(new Error('请输入合法的手机号'))
        }
        return {
            //    获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 2,
            },
            userlist: [],
            // 总条数
            total: 0,
            // 控制对话框显示
            dialogVisible: false,
            // 添加用户的表单数据
            addUserForm : {
                username : '',
                password : '',
                email : '',
                mobile : ''
            },
              // 查询到用户信息对象
            editForm : {
                username : '',
                email : '',
                mobile : ''
            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible :false,
            // 修改表单的验证规则对象
            editFormRules: {
                email: [
                { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                { required: true, message: '请输入用户手机', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
                ]
            },

            // 添加表单的验证规则对象
            addUserFormRules :{
                username :[
                    // required: true : 必填, message:'请输入用户名', trigger: 'blur' : 触发验证的条件
                    {required: true, message:'请输入用户名', trigger: 'blur'},
                    {require: true, min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password :[
                    {required: true, message:'请输入密码', trigger: 'blur'},
                    {require: true, min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' }
                ],
                email :[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                     { validator: checkEmail, trigger: 'blur' }
                ],
                mobile :[
                    {required: true, message:'请输入手机号码', trigger: 'blur'},
                    { validator: checkMobile, trigger: 'blur' }
                ],

            }
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const {
                data: res
            } = await this.$http.get('users', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败');
            }
            this.userlist = res.data.users;
            this.total = res.data.total;
            // window.console.log('获取管理员列表');
            // window.console.log(res);
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            // window.console.log('newSize' + newSize);
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        // 监听页码值该变的事件
        handleCurrentChange(newPage) {
            // window.console.log('newPage' + newPage);
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },
        // 监听switch开关的状态
        async userStateChange(userinfo) {
            // window.console.log(userinfo);
            // window.console.log(await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`));
            // 返回一个promise对象
            const {
                data: res
            } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
            if (res.meta.status != 200) {
                userinfo.mg_state = !userinfo.mg_state;
                return this.$message.error("更新用户状态失败！");
            }
            return this.$message.success('更新用户状态成功！');
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(() => {
                    done();
                })
                .catch(() => {});
        },
        // 关闭对话框事件
        addDialogClosed(){
            this.$refs.addUserFormRef.resetFields();
        },
        // 添加用户
        addUser(){
            this.$refs.addUserFormRef.validate( async valid => {
                if(!valid) return;
                // 发起添加用户请求
                const {data : res} = await this.$http.post('users', this.addUserForm);
                if(res.meta.status != 201){
                    return this.$message.error('添加用户失败!');
                }
                this.$message.success('添加用户成功!');
                // 隐藏添加用户的对话框
                this.addDialogVisible = false;
                // 重新获取用户列表数据 -- 相当于刷新
                this.getUserList();
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id){
            window.console.log(id);
            // 解构
            // const {data : res } = await this.$http.get('users/' + id);
            const { data: res } = await this.$http.get('users/' + id)
            if(res.meta.status !== 200){
                return this.$message.error('查询用户失败');
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        editDialogClosed(){
             this.$refs.editFormRef.resetFields();
        },
        // 修改用户信息并提交
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return;
                // 发起修改用户请求
                const {data : res} = await this.$http.put('users/' + this.editForm.id, {
                    email : this.editForm.email,
                    mobile : this.editForm.mobile
                })

                if(res.meta.status != 200){
                    return this.$message.error('更新用户信息失败');
                }

                // 关闭对话框
                this.editDialogVisible = false;
                // 刷新数据列表
                this.getUserList();
                // 提示修改成功
                this.$message.success('更新用户信息成功');
            })
        },
        // 根据Id删除对应的用户信息
        async removeUserById(id) {
            window.console.log(id)
            // 弹框询问用户是否删除数据
           /*  const confirmResult = await this.$confirm(
                '此操作将永久删除该用户, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err) */

         /*    // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消了删除，则返回值为字符串 cancel
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }

            const { data: res } = await this.$http.delete('users/' + id)

            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败！')
            }

            this.$message.success('删除用户成功！')
            this.getUserList() */
            },

        }
}
</script>

<style lang="less" scoped>
.box-card {
    margin-top: 20px;
    height: 100%;

    .el-dialog {
        border: 1px;
        border-radius: 20px;
    }

}

.el-table-column {
    width: 20px;
}
</style>

<template>
    <div class="login_container">
        <!-- 登录组件 -->
       <div class="login_box">
            <!-- logo -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- login box -->
            <el-form :model="loginForm" ref="loginFormRef" label-width="80px" :rules="loginFormRules" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="login_btn">
                    <el-button type="primary" @click="login()">登录</el-button>
                    <el-button type="info" @click="resetForm()" plain >重置</el-button>
                </el-form-item>
             </el-form>
       </div>
    </div>
</template>

<script>
    window.console.log('login');

    export default {
        data() {
            return {
                // 登录表单数据绑定
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                // 验证规则  required 必填选项
                loginFormRules : {
                     username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                     password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            // 表单重置 resetFields() 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
            resetForm() {
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                this.$refs.loginFormRef.validate(async valid => {
                    if(!valid){
                        window.console.log("提示: 请检查用户名或密码");
                        // 不发送请求
                        return;
                    }
                    const {data:res} = await this.$http.post('/login', this.loginForm);
                    if(res.meta.status !== 200) {
                        return this.$message.error('登录失败!')
                    }
                    this.$message.success("登录成功!");
                    // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
                    //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                    //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                    window.sessionStorage.setItem('token',res.data.token);
                    // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                    this.$router.push('./home')
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b;
    }

    .login_box {
        position: absolute;
        /* 让盒子居中 */
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 15px;
        // 登录框上的logo
        .avatar_box {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px;
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            box-shadow: 0 0 10px #ddd;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #ddd;
            }
        }
        // 输入框
        .login_form {
            position: relative;
            bottom: 0;
            width: 100%;
            margin-top: 90px;
            margin-left: -40px; 
            padding: 0 20px;
            box-sizing: border-box;
        }


        // username

        // password
        //  按钮
        .login_btn {
            margin-left: 70px;
        }
    }


</style>
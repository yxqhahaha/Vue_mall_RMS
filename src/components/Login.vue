<template>
    <div class="login_container">
        <!-- 登录组件 -->
       <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
       </div>
    </div>
</template>

<script>
    alert('login ');

    export default {
        name: "Login"
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
    }


</style>
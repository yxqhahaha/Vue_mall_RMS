<template>
    <el-container class="home_container">
        <!--    页面头部    -->
        <el-header class="header">
            <img src="../assets/img/sun.jpg">
            <span>欢迎使用智商后台管理系统</span>
            <el-button type="danger" class="logoutright" @click="logout()" round>退出</el-button>
        </el-header>
        <!--    页面主体    -->
        <el-container class="home_container">
            <!--    侧边栏     -->
            <el-aside width="200px" >

                <el-menu  default-active="2" class="el-menu-vertical-demo level2_menu"   background-color="#545c64" text-color="#fff"  active-text-color="#ffd04b">
                    <el-submenu index="1" >
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">导航二</span>
                    </el-menu-item>
                    <el-menu-item index="3" >
                        <i class="el-icon-document"></i>
                        <span slot="title">导航三</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">导航四</span>
                    </el-menu-item>
                    <el-submenu index="5" >
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航五</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                </el-menu>
            </el-aside>
        </el-container>
    </el-container>
</template>

<script>
    window.console.log('home');
    export default {
        methods: {
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            }
        }
    }
</script>

<style lang="less" scoped>
    .home_container {
        height: 100%;
        .header {
            padding: 8px 20px;
            background-color: #2b4b6b;
            text-align: center;
            img {
                float: left;
                width: 50px;
                box-shadow: 2px 2px 0 0 #969896;
                border-radius: 50%;
            }
            .el-avatar {
                float: left;
                height: 100%;
            }
            span {
                height: 40px;
                line-height: 40px;
                font-size: 23px;
                color: #fff;
            }
            .logoutright {
                float: right;
                /*position: absolute;*/
                right: 20px;
            }
        }
        .el-aside {
            background-color: #666666;


        }
    }

</style>
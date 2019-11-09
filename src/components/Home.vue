<template>
    <el-container class="home_container">
        <!--    页面头部    -->
        <el-header class="header">
            <img src="../assets/img/sun.jpg">
            <span>欢迎使用天地通用商城后台管理系统</span>
            <el-button type="danger" class="logoutright" @click="logout()" round>退出</el-button>
        </el-header>
        <!--    页面主体    -->
        <el-container class="home_container">
            <!--    侧边栏     -->
            <el-aside unique-opened="true" :width="isCollapse ? '54px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>

                <el-menu  default-active="activePath" :router="true" class="el-menu-vertical-demo level2_menu" :collapse="isCollapse" :collapse-transition="false" background-color="#545c64" text-color="#fff"  active-text-color="#409eff">
                    <!--    一级菜单    -->
                    <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单模板 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]" class="icon_menu"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'./' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>

                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    window.console.log('home');
    export default {
        data() {
            return {
                // 左侧菜单数据
                menulist: [],
                iconsObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                // 是否折叠
                isCollapse: false,
                // 被激活的链接地址
                activePath: ''
            }
        },
        created() {
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            // 获取所有的菜单
            async getMenuList() {
                const { data: res } = await this.$http.get('menus');
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.menulist = res.data;
                // window.console.log(res)
            },
            // 点击按钮，切换菜单的折叠与展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            // 保存链接的激活状态
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath);
                this.activePath = activePath
            }
        }
    }
</script>

<style lang="less" scoped>
    .home_container {
        height: 100%;
        .header {
            padding: 8px 20px;
            background-color: #383D41;
            text-align: center;
            img {
                margin-top: -8px;
                float: left;
                width: 60px;
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
            background-color: #545C64;
            .el-menu {
                border-right: none;
            }
            .toggle-button {
                background-color: #4a5064;
                font-size: 14px;
                line-height: 24px;
                color: #fff;
                text-align: center;
                letter-spacing: 0.2em;
                cursor: pointer;
            }
            .icon_menu {
                font-size: 14px;
            }
        }
    }

</style>
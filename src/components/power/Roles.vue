<template>
    <div>
         <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
              <el-col >
                  <el-button type="primary">添加角色</el-button>
              </el-col>
            </el-row>

            <!-- 角色列表 -->
            <el-table :data="rolelist" border stripe="">
                <!-- 扩展 -->
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                          <el-col :span="5">
                              <el-tag type="success">{{item1.authName}}</el-tag>
                          </el-col>
                          <!-- 渲染二级和三级权限 -->
                          <el-col :span="19">
                              <!-- 通过for 循环 嵌套 渲染二级权限 -->
                              <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id"> 
                                  <el-col :span="6">
                                      <el-tag type="success" @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                      <i class="el-icon-creat-right"></i>
                                  </el-col>
                                  <el-col :span="18">
                                      <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                  </el-col>
                              </el-row>
                          </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <!-- 操作 -->
                <template slot-scope="scope"> 
                    <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                    <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        
                </template>
            </el-table-column>

            </el-table>
        </el-card>
    </div>

</template>

<script>
export default {
    data() {
        return {
             // 所有角色列表数据
            rolelist: [],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            // 所有权限的数据
            rightslist: [],
            // 树形控件的属性绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中的节点Id值数组
            defKeys: [],
            // 当前即将分配权限的角色id
            roleId: ''    
        }
    },
    created() {
        this.getRolesList();
    },
    methods: {
        // 获取所有角色的列表
        async getRolesList(){
            const {data : res} = await this.$http.get('roles');
            if(res.meta.status !== 200){
                return  this.$message.error('获取角色列表失败!');
            }

            this.rolelist = res.data;
            // window.console.log(this.rolelist);
        },
        // 根据Id删除对应的权限
        async removeRightById(role, rightId){
            window.console.log(role);
            // 弹框提示用户是否执行删除操作
            const confirmResult = await this.$confirm('此操作将永久删除该用户,是否继续操作?', '提示', {
                confirmButtonText : '确定',
                cancelButtonText : '取消',
                type : 'warning'
            }).catch(err => err)

            if(confirmResult !== 'confirm'){
                return this.$message.info('取消了删除!');
            }

            const { data : res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

            if(res.meta.status !== 200){
                return  this.$message.error('删除权限失败!')
            }
            role.children = res.data;
        },
        // 展示分配权限对话框
        async showSetRightDialog(role){
            this.roleId = role.id;
            // 获取所有权限的数据
            const { data : res} = await this.$http.get('rights/tree');

            if(res.meta.status != 200){
                return this.$message.error('获取权限数据失败!');
            }

            // 把获取到的权限数据保存到data中
            this.rightslist = res.data;
            window.console.log(this.rightslist);

            // 递归获取三级节点的Id
            this.getLeafKeys(role, this.defKeys);
            this.setRightDialogVisible = true;
        },
        // 通过递归的方式,获取角色下所有三级权限的id,并保存到defkeys数组中
        getLeafKeys(node, arr){
            // 如果当前node节点不包含children属性,则是三级节点
            if(!node.children){
                return arr.push(node.id);
            }
            node.children.forEach(item => this.getLeafKeys(item,arr));
        },
        // 点击为角色分配权限


    },
}
</script>
<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
    .bdtop {
        border-top: 1px solid #eee;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }

</style>
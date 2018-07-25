<template>
<div class="dashboard">
    <el-row>
        <Header/>
    </el-row>
    <el-row>
        <el-col :span="2">
            <el-menu default-active="1"
                     class="el-menu-vertical-demo"
                     :collapse="isNavCollapse"
                     :router="true">

                <i class="el-icon-menu navToggle" @click="isNavCollapse = !isNavCollapse"></i>

                <el-menu-item index="/dashboard/categories">
                    <i class="el-icon-tickets"></i>
                    <span slot="title">Категории</span>
                </el-menu-item>

                <el-menu-item index="/dashboard/users">
                    <i class="el-icon-service"></i>
                    <span slot="title">Пользователи</span>
                </el-menu-item>

                <el-menu-item index="/dashboard/books">
                    <i class="el-icon-goods"></i>
                    <span slot="title">Книги</span>
                </el-menu-item>

                <el-menu-item index="/dashboard/authors">
                    <i class="el-icon-edit-outline"></i>
                    <span slot="title">Авторы</span>
                </el-menu-item>
            </el-menu>
        </el-col>

        <el-col :span="22">
            <router-view />
        </el-col>

    </el-row>
</div>
</template>

<script>
    import Header from '../components/Header.vue'

    export default {
        name: "Dashboard",
        data() {
            return {
                isNavCollapse: true,
            };
        },
        components: {
            Header
        }
    }
</script>

<style lang="scss" scoped>
    .navToggle {
        display: block;
        width: 36px;
        margin: 24px auto;
        font-size: 36px;
        color: #909399;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        cursor: pointer;
    }
</style>
<template>
    <div class="dashboard">
        <Header/>
        <div class="content">
            <el-menu background-color="#e6e6e6"
                     :collapse="isNavCollapse"
                     router>
                <div class="el-menu__toggle" @click="isNavCollapse = !isNavCollapse"></div>

                <el-menu-item index="/categories/all">
                    <i class="el-icon-tickets" ></i>
                    <span slot="title">Категории</span>
                </el-menu-item>

                <el-menu-item index="/users/all">
                    <i class="el-icon-service"></i>
                    <span slot="title">Пользователи</span>
                </el-menu-item>

                <el-menu-item index="/books/all">
                    <i class="el-icon-goods"></i>
                    <span slot="title">Книги</span>
                </el-menu-item>

                <el-menu-item index="/authors/all">
                    <i class="el-icon-edit-outline"></i>
                    <span slot="title">Авторы</span>
                </el-menu-item>
            </el-menu>

            <div class="main">
                <router-view/>
            </div>
        </div>
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

<style lang="scss">
    .content {
        display: flex;
        flex-flow: row nowrap;
    }

    .main {
        position: relative;
        top: 72px;
        padding: 24px;
        flex: 0 1 100%;
        border-left: 1px solid #bbb;
    }

    .el-tooltip__popper {
        opacity: .75;
    }

    .el-menu {
        position: fixed;
        top: 72px;
        left: 0;
        min-height: calc(100vh - 72px);

        &__toggle {
            display: block;
            width: 32px;
            height: 32px;
            margin: 17px;
            background: url(../assets/img/nemu-toggle.svg) center/100% no-repeat;
            cursor: pointer;
            transform: rotate(-45deg);
            opacity: .3;

            &:hover {
                opacity: .5;
            }
        }

        &:not(.el-menu--collapse) {
            .el-menu__toggle {
                transform: rotate(0);
            }
        }
    }
</style>
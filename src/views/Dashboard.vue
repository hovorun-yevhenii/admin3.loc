<template>
    <div class="dashboard">
        <Header/>
        <div class="content">
            <el-menu background-color="#e6e6e6"
                     :collapse="isNavCollapse"
                     collapse-transition
                     router>
                <div class="el-menu__toggle" @click="isNavCollapse = !isNavCollapse"></div>

                <el-menu-item index="/categories/all">
                    <i class="fa fa-list"></i>

                    <span slot="title">Категории</span>
                </el-menu-item>

                <el-menu-item index="/users">
                    <i class="fa fa-users"></i>
                    <span slot="title">Пользователи</span>
                </el-menu-item>

                <el-menu-item index="/books/all">
                    <i class="fa fa-book"></i>
                    <span slot="title">Книги</span>
                </el-menu-item>

                <el-menu-item index="/authors/all">
                    <i class="fa fa-pen-nib"></i>
                    <span slot="title">Авторы</span>
                </el-menu-item>
            </el-menu>

            <div class="main">
                <router-view />
                <transition>
                    <div class="loader" v-if="isLoading">
                        <img src="../assets/img/loader.svg">
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/Header.vue'
    import {mapGetters} from 'vuex'

    export default {
        name: "Dashboard",
        data() {
            return {
                isNavCollapse: true,
            };
        },
        computed: {
            ...mapGetters([
                'isLoading',
            ])
        },
        components: {
            Header
        }
    }
</script>

<style lang="scss">
    .fa {
        width: 40px;
        margin: 0 12px 0 -5px;
        font-size: 26px;
        text-align: center;
        transition: .1s;
    }

    .loader {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        opacity: .9;
        background-color: #fff;
        transition: .15s;
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity .5s;
    }

    .v-enter,
    .v-leave-to {
        opacity: 0;
    }

    .main {
        position: absolute;
        top: 72px;
        left: 65px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        min-width: calc(100% - 65px);
        padding: 24px;
        box-sizing: border-box;
        transition: left .2s, width .2s;
    }

    .el-menu {
        position: fixed !important;
        top: 72px;
        bottom: 0;
        left: 0;
        z-index: 9;
        border-right: 1px solid #bbb !important;

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
            width: 200px;

            & ~ .main {
                left: 200px;
                min-width: calc(100% - 200px);
            }

            .el-menu__toggle {
                transform: rotate(0);
            }
        }
    }
</style>
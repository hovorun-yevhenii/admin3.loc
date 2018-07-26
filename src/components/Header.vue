<template>
    <div class="header">
        <router-link to="/categories/all" class="logo">
            <div class="logo__image"></div>
            <p class="logo__name">BOOKS</p>
        </router-link>

        <el-dropdown trigger="click" class="drop-down">
            <div class="el-dropdown-link">
                <p class="drop-down__name">библиотекарь Семён</p>
                    <div class="drop-down__avatar-wrapper">
                        <img class="drop-down__avatar" src="../assets/img/default-avatar.svg" alt="avatar">
                    </div>
                <i class="el-icon-arrow-down"></i>
            </div>

            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                    <router-link to="/users/:id/edit">Профиль</router-link>
                </el-dropdown-item>
                <el-dropdown-item divided>
                    <router-link to="/">Выйти</router-link>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    export default {
        name: "Header",
    }
</script>

<style lang="scss" scoped>
    .header {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        box-sizing: border-box;
        padding: 12px;
        border-bottom: 1px solid #bbb;
        background-color: #e6e6e6;

        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;

            &__image {
                width: 48px;
                height: 48px;
                background: url(../assets/img/logo.svg) center/100% no-repeat;
            }

            &__name {
                padding: 0 30px;
                font: 36px fantasy;
                color: #aaa;
            }
        }

        .el-dropdown-link {
            display: flex;
            flex-flow: row nowrap;
            cursor: pointer;
        }

        .drop-down {
            background-color: #e6e6e6;
            
            &__name {
                display: flex;
                align-items: center;
                padding: 12px;
                color: #606266;
            }
            &__avatar-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 48px;
                height: 48px;
            }

            &__avatar {
                max-height: 100%;
                max-width: 100%;
            }
        }

        .el-icon-arrow-down {
            display: flex;
            align-items: center;
            padding: 6px;
        }
    }
</style>
<template>
    <div class="header">
        <router-link to="/categories/all" class="logo">
            <div class="logo__image"></div>
            <p class="logo__name">BOOKS</p>
        </router-link>

        <div class="updated-books">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link"> Updated Books
                  <el-badge class="mark" :value="2"/>
                  <i class="el-icon-arrow-down"></i>
              </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item class="badger-item">
                        <span>6th Aug 18 Ewaldino Marks added book "Refined Soft Tuna"</span>
                    </el-dropdown-item>
                    <el-dropdown-item class="badger-item">
                        <span>4th Aug 18 Rafael Rice deleted book "Incredible Metal Car"</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <el-dropdown trigger="click" class="drop-down">
            <div class="el-dropdown-link">
                <p class="drop-down__name">{{getCurrentUser.role}} {{getCurrentUser.name}}</p>
                <div class="drop-down__avatar-wrapper">
                    <img class="drop-down__avatar" :src="getCurrentUser.avatar" alt="avatar">
                </div>
                <i class="el-icon-arrow-down"></i>
            </div>

            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                    <router-link :to="{name: 'editUser', params: { id: getCurrentUser.id, user: getCurrentUser }}">
                        Profile
                    </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                    <p @click="logOut">Log out</p>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "Header",
        computed: {
            ...mapGetters([
                'getCurrentUser',
            ]),
        },
        methods: {
            logOut() {
                this.$store.dispatch('logout').then(() => this.$router.push({path: '/login'}))
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-dropdown-menu__item span {
        border-bottom: 1px solid #ccc;
    }
    
    .header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        display: flex;flex-flow: row nowrap;
        justify-content: flex-end;
        width: 100%;
        box-sizing: border-box;
        padding: 12px;
        border-bottom: 1px solid #bbb;
        background-color: #e6e6e6;

        .updated-books {
            margin-right: 48px;
            display: flex;
            align-items: center;

            .el-dropdown-link {
                position: relative;
                width: 120px;
                display: flex;
                justify-content: space-between;

                &:focus {
                    outline: none !important;
                }
            }

            .mark {
                position: absolute;
                top: -24px;
                right: -24px;
            }

            .badger-item span{
                border-bottom: 10px solid red;
            }
        }

        .logo {
            position: absolute;
            left: 10px;
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
            align-items: center;
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
                border-radius: 30% 10%;
            }
        }
    }
</style>
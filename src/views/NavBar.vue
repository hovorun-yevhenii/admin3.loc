<template>
    <div class="menu" :class="{ 'menu--collapsed': isCollapse }">
        <el-radio-group v-model="isCollapse" class="menu__toggle">
            <el-radio-button :label="false" v-if="isCollapse">x</el-radio-button>
            <el-radio-button :label="true" v-else>+</el-radio-button>
        </el-radio-group>

        <router-link to="/categories" class="menu__item">
            <i class="fa fa-list"></i>
            <span v-if="isCollapse">Categories</span>
        </router-link>

        <router-link to="/users" class="menu__item"
                     v-if="getCurrentUser.role === 'Senior Librarian'">
            <i class="fa fa-users"></i>
            <span v-if="isCollapse">Users</span>
        </router-link>

        <router-link to="/books" class="menu__item">
            <i class="fa fa-book"></i>
            <span v-if="isCollapse">Books</span>
        </router-link>

        <router-link to="/authors" class="menu__item">
            <i class="fa fa-pen-nib"></i>
            <span v-if="isCollapse">Authors</span>
        </router-link>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'NavBar',
        data() {
            return {
                isCollapse: false,
            };
        },
        computed: {
            ...mapGetters([
                'getCurrentUser',
            ]),
        },
    };
</script>

<style lang="scss">
    .menu {
        position: fixed;
        left: 0;
        top: 72px;
        z-index: 9;
        width: 170px;
        height: calc(100% - 72px);
        box-sizing: border-box;
        padding: 8px 12px;
        border-right: 1px solid #bbb;
        background-color: #e6e6e6;
        transition: .6s -.3s;

        &__toggle {
            margin-bottom: 24px;
            span {
                border: none;
                background-color: transparent;
                font-size: 24px;
            }
        }

        &__item {
            display: flex;
            align-items: center;
            padding: 12px 0;

            .fa {
                width: 40px;
                margin-left: 6px;
                color: #909399;
                font-size: 28px;
                text-align: center;
                transition: .1s;
            }

            span {
                padding-left: 12px;
            }
        }

        & ~ .main {
            left: 170px;
            min-width: calc(100% - 170px);
        }

        &:not(.menu--collapsed) {
            width: 73px;

            & ~ .main {
                left: 73px;
                min-width: calc(100% - 73px);
            }
        }
    }

    .router-link-active {
        color: #409EFF;

        .fa {
            color: #409EFF;
        }
    }
</style>

<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import {Notification} from 'element-ui'
    import {mapGetters} from 'vuex'

    export default {
        computed: {
            ...mapGetters(['getNetworkError']),
        },
        watch: {
            getNetworkError() {
                Notification.error({
                    title: 'Network error',
                })
            },
        }
    }
</script>

<style lang="scss">
    $fa-css-prefix: el-icon-fa;
    $fa-font-path: "~@/../node_modules/font-awesome/fonts";
    @import './assets/css/reset.css';
    @import '../node_modules/font-awesome/scss/font-awesome.scss';

    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        src: url('./assets/fonts/Roboto-Regular.ttf');
    }

    #app {
        font-family: 'Roboto', sans-serif;
    }

    a {
        color: #606266;
        text-decoration: none;
    }

    [class^="el-icon-fa"], [class*=" el-icon-fa"] {
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome !important;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .el-breadcrumb {
        position: absolute;
        left: 0;
        top: 0;
        padding: 24px;
        opacity: .65;
        transition: .2s;

        &:hover {
            opacity: 1;
        }
    }
</style>

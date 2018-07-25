<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    import Dashboard from './views/Dashboard.vue'
    import Login from './views/LoginForm.vue'

    export default {
        data() {
            return {
                isNavCollapse: true,
            };
        },
        components: {
            Dashboard,
            Login
        }
    }
</script>

<style lang="scss" scoped>
    @import './assets/css/reset.css';
</style>

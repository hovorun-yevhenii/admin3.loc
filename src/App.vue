<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isNavCollapse: true,
            };
        }
    }
</script>

<style lang="scss">
    @import './assets/css/reset.css';

    #app {
        font-family: sans-serif;
    }
</style>

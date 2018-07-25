<template>
    <div class="header">
        <router-link to="/">
            <i class="el-icon-picture icon"></i>
        </router-link>

        <router-link to="/profile">
            <i class="el-icon-question icon"></i>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        border-bottom: 1px solid #e6e6e6;
    }

    .icon {
        font-size: 48px;
        color: #777;
        cursor: pointer;
    }
</style>
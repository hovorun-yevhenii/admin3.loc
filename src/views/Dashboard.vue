<template>
    <div class="dashboard">
        <Header/>
        <div class="content">
            <NavBar/>
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
    import Header from './Header';
    import NavBar from './NavBar';
    import { mapGetters } from 'vuex';

    export default {
        name: 'Dashboard',
        components: { Header, NavBar },
        computed: {
            ...mapGetters([
                'isLoading',
                'getCurrentUser',
            ]),
        },
    };
</script>

<style lang="scss">
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
</style>

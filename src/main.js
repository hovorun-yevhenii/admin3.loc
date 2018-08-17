import Vue from 'vue';
import App from './App';
import { sync } from 'vuex-router-sync';
import router from './router';
import store from './store/store';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import constants from './assets/constants';

Vue.use(ElementUI, { locale });
sync(store, router);

Vue.config.productionTip = false;
Vue.prototype.$constants = constants;

router.beforeEach((to, from, next) => {
    if (to.name === 'editUser' && +to.params.id !== store.state.user.currentUser.id) {
        if (store.state.user.currentUser.role === 'Senior Librarian') {
            next();
        } else next('/');

        return;
    }

    if (to.meta.seniorOnly && store.state.user.currentUser.role !== 'Senior Librarian') {
        next('/');
        return;
    }

    next();
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');


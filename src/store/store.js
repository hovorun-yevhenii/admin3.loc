import VuexPersistence from 'vuex-persist'

import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import book from './modules/book'
import author from './modules/author'
import category from './modules/category'

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    reducer: state => ({
        user: {
            currentUser: state.user.currentUser
        }
    }),
});

export default new Vuex.Store({
    modules: {
        user,
        book,
        author,
        category,
    },

    plugins: [vuexLocal.plugin],

    getters: {
        stateQuery: state => state.route.query,
    },

    state: {},
    mutations: {},
    actions: {},
})

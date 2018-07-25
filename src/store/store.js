import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import book from './modules/book'
import author from './modules/author'
import category from './modules/category'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        book,
        author,
        category
    },

    state: {},
    mutations: {},
    actions: {}
})

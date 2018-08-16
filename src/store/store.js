import VuexPersistence from 'vuex-persist';

import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import book from './modules/book';
import author from './modules/author';
import category from './modules/category';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    reducer: state => ({
        user: {
            currentUser: state.user.currentUser,
        },
        category: {
            categoriesList: state.category.categoriesList,
        },
        book: {
            updatedBooks: state.book.updatedBooks,
        },
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
        routePath: state => state.route.path,
        stateQuery: state => state.route.query,
        categoriesList: state => state.category.categoriesList,
        notifications: state => state.book.updatedBooks,
    },

    state: {},
    mutations: {},
    actions: {},
});

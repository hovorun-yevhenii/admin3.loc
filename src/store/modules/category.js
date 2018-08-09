import axios from 'axios';

export default {
    state: {
        categoriesList: null,
        categoriesTotalCount: null,
        networkError: null,
        isLoading: false,
    },

    getters: {
        getCategories: state => state.categoriesList,
        categoriesTotalCount: state => state.categoriesTotalCount,
        categoriesHaveNextPage: state => state.categoriesTotalCount > 10
    },

    mutations: {
        /* FETCH CATEGORIES */
        FETCH_CATEGORIES_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_CATEGORIES_SUCCESS(state, data) {
            state.categoriesList = data.categoriesList;
            state.categoriesTotalCount = data.total;
            state.isLoading = false;
        },
        FETCH_CATEGORIES_ERROR(state, error) {
            state.networkError = error;
            state.isLoading = false;
        },
        /* ADD */
        FETCH_ADD_CATEGORY_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_ADD_CATEGORY_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_ADD_CATEGORY_ERROR(state, error) {
            state.networkError = error;
            state.isLoading = false;
        },
        /* DEL */
        FETCH_DEL_CATEGORY_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_DEL_CATEGORY_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_DEL_CATEGORY_ERROR(state, error) {
            state.networkError = error;
            state.isLoading = false;
        },
        /* UPDATE */
        FETCH_UPDATE_CATEGORY_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_UPDATE_CATEGORY_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_UPDATE_CATEGORY_ERROR(state, error) {
            state.networkError = error;
            state.isLoading = false;
        },
    },

    actions: {
        async fetchCategories({ commit }, url) {
            try {
                commit('FETCH_CATEGORIES_REQUEST');

                const response = await axios.get(url);

                commit('FETCH_CATEGORIES_SUCCESS', {
                    categoriesList: response.data,
                    total: response.headers['x-total-count']
                });

            } catch (error) {
                commit('FETCH_CATEGORIES_ERROR', error.message)
            }
        },

        async addCategory({ commit }, category) {
            try {
                commit('FETCH_ADD_CATEGORY_REQUEST');

                const response = await axios.post(`http://localhost:3000/categories`, category);

                commit('FETCH_ADD_CATEGORY_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_ADD_CATEGORY_ERROR', error.message)
            }
        },

        async deleteCategory({ commit }, id) {
            try {
                commit('FETCH_DEL_CATEGORY_REQUEST');

                const response = await axios.delete(`http://localhost:3000/categories/${id}`);

                commit('FETCH_DEL_CATEGORY_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_DEL_CATEGORY_ERROR', error.message)
            }
        },

        async updateCategory({commit}, category) {
            try {
                commit('FETCH_UPDATE_CATEGORY_REQUEST');

                const response = await axios.put(`http://localhost:3000/books/${category.id}`, category);

                commit('FETCH_UPDATE_CATEGORY_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_UPDATE_CATEGORY_ERROR', error.message)
            }
        },
    },
}
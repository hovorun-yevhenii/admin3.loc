import axios from '../myAxios';

export default {
    state: {
        authorsList: null,
        authorsTotalCount: null,
        isLoading: false,
        networkError: null,
        tableLimit: 10,
    },

    getters: {
        getAuthors: state => state.authorsList,
        getAuthorsTotalCount: state => state.authorsTotalCount,
        authorsHaveNextPage: state => state.authorsTotalCount > 10,
    },

    mutations: {
        /* FETCH AUTHORS */
        FETCH_AUTHORS_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_AUTHORS_SUCCESS(state, data) {
            state.authorsList = data.authorsList;
            state.authorsTotalCount = data.total;
            state.isLoading = false;
        },
        FETCH_AUTHORS_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* ADD */
        FETCH_ADD_AUTHOR_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_ADD_AUTHOR_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_ADD_AUTHOR_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* DEL */
        FETCH_DEL_AUTHOR_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_DEL_AUTHOR_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_DEL_AUTHOR_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* UPDATE */
        FETCH_UPDATE_AUTHOR_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_UPDATE_AUTHOR_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_UPDATE_AUTHOR_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* GET BY ID */
        FETCH_AUTHOR_BY_ID_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_AUTHOR_BY_ID_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_AUTHOR_BY_ID_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
    },

    actions: {
        async fetchAuthors({ commit }, url) {
            try {
                commit('FETCH_AUTHORS_REQUEST');

                const response = await axios.get(url);

                commit('FETCH_AUTHORS_SUCCESS', {
                    authorsList: response.data,
                    total: response.headers['x-total-count'],
                });
            } catch (error) {
                commit('FETCH_AUTHORS_ERROR', error.message);
            }
        },

        async addAuthor({ commit }, author) {
            try {
                commit('FETCH_ADD_AUTHOR_REQUEST');

                const response = await axios.post('/authors', author);

                commit('FETCH_ADD_AUTHOR_SUCCESS');

                return response;
            } catch (error) {
                commit('FETCH_ADD_AUTHOR_ERROR', error.message);
                return false;
            }
        },

        async deleteAuthor({ commit }, id) {
            try {
                commit('FETCH_DEL_AUTHOR_REQUEST');

                const response = await axios.delete(`/authors/${id}`);

                commit('FETCH_DEL_AUTHOR_SUCCESS');

                return response;
            } catch (error) {
                commit('FETCH_DEL_AUTHOR_ERROR', error.message);
                return false;
            }
        },

        async updateAuthor({ commit }, author) {
            try {
                commit('FETCH_UPDATE_AUTHOR_REQUEST');

                const response = await axios.put(`/authors/${author.id}`, author);

                commit('FETCH_UPDATE_AUTHOR_SUCCESS');

                return response;
            } catch (error) {
                commit('FETCH_UPDATE_AUTHOR_ERROR', error.message);
                return false;
            }
        },
        async fetchAuthorById({ commit }, id) {
            try {
                commit('FETCH_AUTHOR_BY_ID_REQUEST');

                const response = await axios.get(`/authors/${id}`);

                commit('FETCH_AUTHOR_BY_ID_SUCCESS');

                return response;
            } catch (error) {
                commit('FETCH_AUTHOR_BY_ID_ERROR', error.message);
                return false;
            }
        },
    },
};

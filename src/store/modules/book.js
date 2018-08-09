import axios from 'axios';

export default {
    state: {
        booksList: null,
        booksTotalCount: null,
        isLoading: false,
        networkError: null,
        tableLimit: 10,
    },

    getters: {
        getBooks: state => state.booksList,
        getBooksTotalCount: state => state.booksTotalCount,
        booksHaveNextPage: state => state.booksTotalCount > 10,
    },

    mutations: {
        /* FETCH BOOKS */
        FETCH_BOOKS_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_BOOKS_SUCCESS(state, data) {
            state.booksList = data.booksList;
            state.booksTotalCount = data.total;
        },
        FETCH_BOOKS_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* ADD */
        FETCH_ADD_BOOK_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_ADD_BOOK_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_ADD_BOOK_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* DEL */
        FETCH_DEL_BOOK_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_DEL_BOOK_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_DEL_BOOK_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* UPDATE */
        FETCH_UPDATE_BOOK_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_UPDATE_BOOK_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_UPDATE_BOOK_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* GET BY ID */
        FETCH_BOOK_BY_ID_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_BOOK_BY_ID_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_BOOK_BY_ID_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
    },

    actions: {
        async fetchBooks({ commit }, url) {
            try {
                commit('FETCH_BOOKS_REQUEST');

                const response = await axios.get(url);

                commit('FETCH_BOOKS_SUCCESS', {
                    booksList: response.data,
                    total: response.headers['x-total-count']
                });

            } catch (error) {
                commit('FETCH_BOOKS_ERROR', error.message)
            }
        },

        async addBook({commit}, book) {
            try {
                commit('FETCH_ADD_BOOK_REQUEST');

                const response = await axios.post(`http://localhost:3000/books`, book);

                commit('FETCH_ADD_BOOK_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_ADD_BOOK_ERROR', error.message)
            }
        },

        async deleteBook({commit}, id) {
            try {
                commit('FETCH_DEL_BOOK_REQUEST');

                const response = await axios.delete(`http://localhost:3000/books/${id}`);

                commit('FETCH_DEL_BOOK_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_DEL_BOOK_ERROR', error.message)
            }
        },

        async updateBook({commit}, book) {
            try {
                commit('FETCH_UPDATE_BOOK_REQUEST');

                const response = await axios.put(`http://localhost:3000/books/${book.id}`, book);

                commit('FETCH_UPDATE_BOOK_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_UPDATE_BOOK_ERROR', error.message)
            }
        },
        async fetchBookById({commit}, id) {
            try {
                commit('FETCH_BOOK_BY_ID_REQUEST');

                const response = await axios.get(`http://localhost:3000/books/${id}`);

                commit('FETCH_BOOK_BY_ID_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_BOOK_BY_ID_ERROR', error.message)
            }
        },
    },
}
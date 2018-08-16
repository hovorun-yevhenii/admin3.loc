import axios from '../myAxios';
import moment from 'moment';

export default {
    state: {
        booksList: null,
        booksTotalCount: null,
        isLoading: false,
        networkError: null,
        tableLimit: 10,
        updatedBooks: {
            users: [],
            notes: [],
        },
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
        FETCH_ADD_BOOK_SUCCESS(state, event) {
            console.log(`${event.user} ${event.action} book "${event.book}" at ${event.time}`);

            state.updatedBooks.notes.push({
                message: `${event.user} ${event.action} book "${event.book}" at ${event.time}`,
                time: moment().toISOString(),
            });

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
        FETCH_DEL_BOOK_SUCCESS(state, event) {
            console.log(`${event.user} ${event.action} book "${event.book}" at ${event.time}`);

            state.updatedBooks.notes.push({
                message: `${event.user} ${event.action} book "${event.book}" at ${event.time}`,
                time: moment().toISOString(),
            });

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
        FETCH_UPDATE_BOOK_SUCCESS(state, event) {
            state.updatedBooks.notes.push({
                message: `${event.user} ${event.action} book "${event.book}" at ${event.time}`,
                time: moment().toISOString(),
            });

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
        RESET_BADGE(state, user) {
            state.updatedBooks.users[user] = moment().toISOString();
        },
        /* MULTI DEL */
        FETCH_MULTI_DEL_BOOK_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_MULTI_DEL_BOOK_SUCCESS(state, event) {
            const message = [
                `${event.user} deleted `,
                `${event.amount} book${event.amount > 1 ? 's' : ''} `,
                `at ${event.time}`,
            ].join('');

            state.updatedBooks.notes.push({
                message,
                time: moment().toISOString(),
            });

            state.isLoading = false;
        },
        FETCH_MULTI_DEL_BOOK_ERROR(state, error) {
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
                    total: response.headers['x-total-count'],
                });
            } catch (error) {
                commit('FETCH_BOOKS_ERROR', error.message);
            }
        },

        async addBook({ commit, rootState }, book) {
            try {
                commit('FETCH_ADD_BOOK_REQUEST');

                const response = await axios.post('/books', book);
                const user = rootState.user.currentUser;

                commit('FETCH_ADD_BOOK_SUCCESS', {
                    user: `${user.name} ${user.surname}`,
                    time: moment().format('MMMM Do YYYY'),
                    action: 'added',
                    book: book.name,
                });

                return response;
            } catch (error) {
                commit('FETCH_ADD_BOOK_ERROR', error.message);
                return false;
            }
        },

        async deleteBook({ commit, rootState }, book) {
            try {
                commit('FETCH_DEL_BOOK_REQUEST');

                const response = await axios.delete(`/books/${book.id}`);
                const user = rootState.user.currentUser;

                commit('FETCH_DEL_BOOK_SUCCESS', {
                    user: `${user.name} ${user.surname}`,
                    time: moment().format('MMMM Do YYYY'),
                    action: 'deleted',
                    book: book.name,
                });

                return response;
            } catch (error) {
                commit('FETCH_DEL_BOOK_ERROR', error.message);
                return false;
            }
        },

        async updateBook({ commit, rootState }, book) {
            try {
                commit('FETCH_UPDATE_BOOK_REQUEST');

                const response = await axios.put(`/books/${book.id}`, book);
                const user = rootState.user.currentUser;

                commit('FETCH_UPDATE_BOOK_SUCCESS', {
                    user: `${user.name} ${user.surname}`,
                    time: moment().format('MMMM Do YYYY'),
                    action: 'updated',
                    book: book.name,
                });

                return response;
            } catch (error) {
                console.dir(error);
                commit('FETCH_UPDATE_BOOK_ERROR', error.message);
                return false;
            }
        },

        async fetchBookById({ commit }, id) {
            try {
                commit('FETCH_BOOK_BY_ID_REQUEST');

                const response = await axios.get(`/books/${id}`);

                commit('FETCH_BOOK_BY_ID_SUCCESS');

                return response;
            } catch (error) {
                commit('FETCH_BOOK_BY_ID_ERROR', error.message);
                return false;
            }
        },

        resetBadge({ commit }, user) {
            commit('RESET_BADGE', user);
        },

        async multiBooksDel({ commit, rootState }, books) {
            try {
                commit('FETCH_MULTI_DEL_BOOK_REQUEST');

                const promises = [];

                books.forEach((book) => {
                    promises.push(axios.delete(`/books/${book.id}`));
                });

                await axios.all(promises);

                const user = rootState.user.currentUser;

                commit('FETCH_MULTI_DEL_BOOK_SUCCESS', {
                    user: `${user.name} ${user.surname}`,
                    time: moment().format('MMMM Do YYYY'),
                    amount: books.length,
                });

                return true;
            } catch (error) {
                commit('FETCH_MULTI_DEL_BOOK_ERROR', error.message);
                return false;
            }
        },
    },
};

import axios from 'axios';

export default {
    state: {
        currentUser: null,
        usersList: null,
        usersTotalCount: null,
        isLoading: false,
        networkError: null,
        tableLimit: 10,
    },

    getters: {
        getCurrentUser: state => state.currentUser,
        getUsers: state => state.usersList,
        getUsersTotalCount: state => state.usersTotalCount,
        usersHaveNextPage: state => state.usersTotalCount > 10,
        getNetworkError: state => state.networkError,
        isLoading: state => state.isLoading
    },

    mutations: {
        /* LOGIN */
        FETCH_LOGIN_REQUEST(state) {
            state.isLoading = true;
        },
        LOGIN_SUCCESS(state, user) {
            state.currentUser = user;
            state.isLoading = false;
        },
        FETCH_LOGIN_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        LOGOUT(state) {
            state.currentUser = null;
        },
        /* USERS */
        FETCH_USERS_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_USERS_SUCCESS(state, data) {
            state.usersList = data.usersList;
            state.usersTotalCount = data.total;
            state.isLoading = false;
        },
        FETCH_USERS_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* ADD */
        FETCH_ADD_USER_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_ADD_USER_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_ADD_USER_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* DEL */
        FETCH_DEL_USER_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_DEL_USER_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_DEL_USER_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* UPDATE */
        FETCH_UPDATE_USER_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_UPDATE_USER_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_UPDATE_USER_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* GET BY ID */
        FETCH_USER_BY_ID_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_USER_BY_ID_SUCCESS(state) {
            state.isLoading = false;
        },
        FETCH_USER_BY_ID_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        },
        /* TOGGLE BUN */
        FETCH_BUN_USER_REQUEST(state) {
            state.isLoading = true;
        },
        FETCH_BUN_USER_SUCCESS(state, serverUser) {
            state.usersList.forEach((stateUser, index) => {
                if (stateUser.id === serverUser.id) state.usersList[index] = serverUser;
            });

            state.isLoading = false;
        },
        FETCH_BUN_USER_ERROR(state, error) {
            state.isLoading = false;
            state.networkError = error;
        }
    },

    actions: {
        async login({ commit }, data) {
            try {
                commit('FETCH_LOGIN_REQUEST');

                const response = await axios.get(`http://localhost:3000/users?email=${data.email}`),
                    user = response.data[0];

                if (user && user.password === data.password) {
                    commit('LOGIN_SUCCESS', user);
                    return true;
                } else if (user && user.password !== data.password) {
                    console.log('Wrong password')
                } else {
                    console.log('User not found')
                }

            } catch (error) {
                commit('FETCH_LOGIN_ERROR', error)
            }
        },

        logout({commit}) {
            commit('LOGOUT');
        },

        async fetchUsers({ commit }, url) {
            try {
                commit('FETCH_USERS_REQUEST');

                const response = await axios.get(url);

                commit('FETCH_USERS_SUCCESS', {
                    usersList: response.data,
                    total: response.headers['x-total-count']
                });

            } catch (error) {
                commit('FETCH_USERS_ERROR', error.message)
            }
        },

        async addUser({commit}, user) {
            try {
                commit('FETCH_ADD_USER_REQUEST');

                const response = await axios.post(`http://localhost:3000/users`, user);

                commit('FETCH_ADD_USER_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_ADD_USER_ERROR', error.message)
            }
        },

        async deleteUser({commit}, id) {
            try {
                commit('FETCH_DEL_USER_REQUEST');

                const response = await axios.delete(`http://localhost:3000/users/${id}`);

                commit('FETCH_DEL_USER_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_DEL_USER_ERROR', error.message)
            }
        },

        async updateUser({commit}, user) {
            try {
                commit('FETCH_UPDATE_USER_REQUEST');

                const response = await axios.put(`http://localhost:3000/users/${user.id}`, user);

                commit('FETCH_UPDATE_USER_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_UPDATE_USER_ERROR', error.message)
            }
        },

        async fetchUserById({commit}, id) {
            try {
                commit('FETCH_USER_BY_ID_REQUEST');

                const response = await axios.get(`http://localhost:3000/users/${id}`);

                commit('FETCH_USER_BY_ID_SUCCESS');

                return response;

            } catch (error) {
                commit('FETCH_USER_BY_ID_ERROR', error.message)
            }
        },

        async toggleUsersBunState({commit}, user) {
            try {
                commit('FETCH_BUN_USER_REQUEST');

                user.blacklisted = !user.blacklisted;

                const response = await axios.put(`http://localhost:3000/users/${user.id}`, user);

                commit('FETCH_BUN_USER_SUCCESS', response.data);

                return response;

            } catch (error) {
                commit('FETCH_BUN_USER_ERROR', error.message)
            }
        },
    },
}
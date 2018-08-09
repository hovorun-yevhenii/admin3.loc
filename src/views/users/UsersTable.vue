<template>
    <div class="user-table">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users' }">Users</el-breadcrumb-item>
            <el-breadcrumb-item>All</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="controls">
            <div>
                <el-input class="input-filter"
                          placeholder="Name"
                          @input="handleSearch"
                          v-model="dataQuery.name_like"
                          clearable>
                </el-input>
                <el-input class="input-filter"
                          placeholder="Surname"
                          @input="handleSearch"
                          v-model="dataQuery.surname_like"
                          clearable>
                </el-input>
                <el-date-picker placeholder="Date of registration"
                                class="input-filter"
                                @input="handleSearch"
                                value-format="yyyy-MM-dd"
                                v-model="dataQuery.created_at_like"
                                type="date"
                                clearable>
                </el-date-picker>
            </div>
            <div>
                <router-link :to="{ name: 'addUser' }">
                    <el-button class="create-user" type="info" plain>Create user</el-button>
                </router-link>
            </div>
        </div>

        <el-table v-show="getUsers && getUsers.length"
                  v-if="!isLoading"
                  :data="getUsers"
                  ref="table"
                  @sort-change="handleSort">

            <el-table-column label="ID" width="45">
                <template slot-scope="scope"><span>{{ scope.row.id }}</span></template>
            </el-table-column>

            <el-table-column label="Name" sortable="custom" prop="name" width="130">
                <template slot-scope="scope"><span>{{ scope.row.name }}</span></template>
            </el-table-column>

            <el-table-column label="Surname" sortable="custom" prop="surname" width="130">
                <template slot-scope="scope"><span>{{ scope.row.surname }}</span></template>
            </el-table-column>

            <el-table-column label="Role" width="150">
                <template slot-scope="scope">
                    <span :style="getRoleColor(scope.row.role)">{{ scope.row.role }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Avatar" width="70">
                <template slot-scope="scope">
                    <span class="avatar-wrapper"><img class="avatar" :src="scope.row.avatar" alt="avatar"></span>
                </template>
            </el-table-column>

            <el-table-column label="E-mail" width="250">
                <template slot-scope="scope"><span>{{ scope.row.email }}</span></template>
            </el-table-column>

            <el-table-column label="Phone" width="170">
                <template slot-scope="scope"><span>{{ scope.row.phone }}</span></template>
            </el-table-column>

            <el-table-column label="Registered at" sortable="custom" prop="created_at" width="200">
                <template slot-scope="scope"><span>{{ getTimeFormat(scope.row.created_at) }}</span></template>
            </el-table-column>

            <el-table-column label="Last visit" width="100">
                <template slot-scope="scope"><span>hz</span></template>
            </el-table-column>

            <el-table-column label="Actions" width="180" ref="actions">
                <template slot-scope="scope">
                    <el-tooltip :content="'Edit ' + scope.row.name + '\'s data'">
                        <el-button type="primary"
                                   icon="el-icon-edit"
                                   size="mini"
                                   @click="handleEdit(scope.row.id)"/>
                    </el-tooltip>
                    <el-tooltip :content="'Delete ' + scope.row.name + '\'s account'">
                        <el-button type="danger"
                                   icon="el-icon-delete"
                                   size="mini"
                                   @click="handleDelete(scope.row.id, scope.row.name)"/>
                    </el-tooltip>
                    <el-tooltip :content="(scope.row.blacklisted ? 'Restore ' : 'Bun ') + scope.row.name">
                        <el-button :type="scope.row.blacklisted ? 'default' : 'warning'"
                                   :icon="`el-icon-circle-${scope.row.blacklisted ? 'plus' : 'close'}-outline`"
                                   size="mini"
                                   @click="handleBun(scope.row)"/>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column type="selection" width="50"></el-table-column>
        </el-table>

        <div v-if="!getUsers || !getUsers.length" class="nothing-found">
            <p>Nothing found</p>
            <el-button type="default" @click="discardQueries">Discard queries</el-button>
        </div>

        <el-pagination
                v-if="usersHaveNextPage"
                class="pagination"
                background
                layout="prev, pager, next"
                @current-change="handlePagination"
                :current-page="Number(dataQuery._page)"
                :total="Number(getUsersTotalCount)">
        </el-pagination>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {MessageBox} from 'element-ui'
    import {Notification} from 'element-ui'
    import {debounce} from 'underscore'
    import {mapObject} from 'underscore'
    import {clone} from 'underscore'
    import moment from 'moment/src/moment';

    export default {
        name: "UserTable",
        data() {
            return {
                dataQuery: {
                    _sort: '',
                    _order: '',
                    _page: 1,
                    name_like: '',
                    surname_like: '',
                    created_at_like: ''
                }
            }
        },

        computed: {
            ...mapGetters([
                'getUsers',
                'getUsersTotalCount',
                'usersHaveNextPage',
                'stateQuery',
                'isLoading',
            ])
        },

        watch: {
            stateQuery() {
                this.applyRouterQuery();
                this.fetchUsers();
            },
        },

        methods: {
            applyRouterQuery() {
                this.dataQuery._sort = this.stateQuery._sort || '';
                this.dataQuery._order = this.stateQuery._order || '';
                this.dataQuery._page = this.stateQuery._page || 1;
                this.dataQuery.name_like = this.stateQuery.name_like || '';
                this.dataQuery.surname_like = this.stateQuery.surname_like || '';
                this.dataQuery.created_at_like = this.stateQuery.created_at_like || '';
            },

            pushToRouter() {
                this.$router.push({query: this.dataQuery});
            },

            fetchUsers() {
                let url = [
                    `http://localhost:3000/users?`,
                    `_page=${this.dataQuery._page}`,
                    `&_sort=${this.dataQuery._sort}`,
                    `&_order=${this.dataQuery._order}`,
                    `&name_like=${this.dataQuery.name_like}`,
                    `&surname_like=${this.dataQuery.surname_like}`,
                    `&created_at_like=${this.dataQuery.created_at_like}`
                ].join('');

                this.$store.dispatch('fetchUsers', url)
                    .then(() => this.sortTable());
            },

            handleSearch: debounce(function() {
                this.dataQuery._page = 1;
                this.pushToRouter();
            }, 500),

            handleSort(event) {
                if (!event.column) {
                    this.dataQuery._sort = '';
                    this.dataQuery._order = '';
                } else {
                    this.dataQuery._sort = event.prop;
                    this.dataQuery._order = event.column.order === 'ascending' ? 'asc' : 'desc';
                }

                if (this.dataQuery._order !== this.stateQuery._order ||
                    this.dataQuery._sort  !== this.stateQuery._sort)
                {
                    this.dataQuery._page = 1;
                    this.pushToRouter();
                }
            },

            sortTable() {
                this.$refs.table.clearSort();

                this.$refs.table.sort(
                    this.dataQuery._sort,
                    this.dataQuery._order === 'asc' ? 'ascending' : 'descending'
                );
            },

            handlePagination(newPage) {
                this.dataQuery._page = newPage;
                this.pushToRouter();
            },

            discardQueries() {
                this.dataQuery = mapObject(this.dataQuery, () => '');
                this.dataQuery._page = 1;

                this.pushToRouter();
            },

            handleEdit(id) {
                this.$router.push({ name: 'editUser', params: { id } });
            },

            handleDelete(id, name) {
                MessageBox.confirm(
                    `This will permanently delete ${name}'s account. Continue?`,
                    'Warning',
                    {confirmButtonText: 'OK', cancelButtonText: 'Cancel'})
                    .then(() => this.$store.dispatch('deleteUser', id))
                    .then(() => {
                        if (this.getUsers.length === 1) {
                            this.discardQueries()
                        } else {
                            this.fetchUsers();
                        }
                    })
                    .catch(() => false)
            },

            handleBun(user) {
                this.$store.dispatch('toggleUsersBunState', clone(user))
                .then(result => {
                    if (result) {
                        Notification.info({
                            title: `${user.name} is ${user.blacklisted ? '' : 'not'} blacklisted now`,
                        })
                    }
                });

                console.log(this.$refs.table)
            },

            getRoleColor(role) {
                let color;

                switch (role) {
                    case 'Librarian':
                        color = 'green';
                        break;
                    case 'Senior Librarian':
                        color = 'crimson';
                        break;
                    default:
                        color = 'inherit';
                }

                return `color: ${color}`;
            },

            getTimeFormat(iso) {
                return moment(iso).format('Do MMM YY')
            }
        },

        created() {
            this.applyRouterQuery();
            this.fetchUsers();
        }
    }
</script>

<style lang="scss">
    .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .input-filter {
        max-width: 200px;
        margin: 48px 12px;
    }

    .avatar-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
    }

    .avatar {
        max-height: 100%;
        max-width: 100%;
        border-radius: 30% 10%;
    }

    .el-pagination.pagination {
        display: flex;
        justify-content: center;
        padding: 32px ;
    }

    .nothing-found {
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        padding: 60px;

        & > * {
            margin: 24px;
        }
    }

</style>
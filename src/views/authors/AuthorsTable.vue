<template>
    <div class="authors-table">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/authors/all' }">Authors</el-breadcrumb-item>
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
                          placeholder="Country"
                          @input="handleSearch"
                          v-model="dataQuery.country_like"
                          clearable>
                </el-input>
            </div>
            <div>
                <router-link :to="{ name: 'addAuthor' }">
                    <el-button class="create-author" type="info" plain>Create author</el-button>
                </router-link>
            </div>
        </div>

        <el-table v-show="getAuthors && getAuthors.length"
                  :data="getAuthors"
                  ref="table"
                  @sort-change="handleSort"
                  @selection-change="handleSelection">

            <el-table-column label="ID" width="45">
                <template slot-scope="scope"><span>{{ scope.row.id }}</span></template>
            </el-table-column>

            <el-table-column label="Name" sortable="custom" prop="name" width="200">
                <template slot-scope="scope">
                    <span style="font-weight: bold">{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Born at" sortable="custom" prop="born_at" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.born_at }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Died at" sortable="custom" prop="died_at" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.died_at }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Country" prop="country" width="200">
                <template slot-scope="scope"><span>{{ scope.row.country }}</span></template>
            </el-table-column>

            <el-table-column label="Actions" width="120">
                <template slot-scope="scope">
                    <el-tooltip content="Edit author">
                        <el-button type="primary"
                                   icon="el-icon-edit"
                                   size="mini"
                                   @click="handleEdit(scope.row.id)"/>
                    </el-tooltip>
                    <el-tooltip content="Delete author">
                        <el-button type="danger"
                                   icon="el-icon-delete"
                                   size="mini"
                                   @click="handleDelete(scope.row.id)"/>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column type="selection" width="50"></el-table-column>
        </el-table>


        <div v-if="!getAuthors || !getAuthors.length" class="nothing-found">
            <p>Nothing found</p>
            <el-button type="default" @click="discardQueries">Discard queries</el-button>
        </div>

        <el-pagination
                v-if="authorsHaveNextPage"
                class="pagination"
                background
                layout="prev, pager, next"
                @current-change="handlePagination"
                :current-page="Number(dataQuery._page)"
                :total="Number(getAuthorsTotalCount)">
        </el-pagination>
    </div>
</template>

<script>
    import { debounce, mapObject } from 'underscore';
    import { mapGetters } from 'vuex';
    import { MessageBox } from 'element-ui';

    export default {
        name: 'AuthorsTable',
        data() {
            return {
                dataQuery: {
                    _sort: '',
                    _order: '',
                    _page: 1,
                    name_like: '',
                    country_like: '',
                },
            };
        },

        computed: {
            ...mapGetters([
                'getAuthors',
                'getAuthorsTotalCount',
                'authorsHaveNextPage',
                'stateQuery',
                'getCurrentUser',
            ]),
        },

        watch: {
            stateQuery() {
                this.applyRouterQuery();
                this.fetchAuthors();
            },
        },

        methods: {
            handleSelection(rows) {
                console.log(rows);
            },
// eslint-disable-next-line
            handleSearch: debounce(function () {
                this.dataQuery._page = 1;
                this.pushToRouter();
            }, 500),

            pushToRouter() {
                this.$router.push({ query: this.dataQuery });
            },

            applyRouterQuery() {
                this.dataQuery._sort = this.stateQuery._sort || '';
                this.dataQuery._order = this.stateQuery._order || '';
                this.dataQuery._page = this.stateQuery._page || 1;
                this.dataQuery.name_like = this.stateQuery.name_like || '';
                this.dataQuery.country_like = this.stateQuery.country_like || '';
            },

            sortTable() {
                this.$refs.table.clearSort();

                this.$refs.table.sort(
                    this.dataQuery._sort,
                    this.dataQuery._order === 'asc' ? this.$constants.SORT_ASCENDING : this.$constants.SORT_DESCENDING,
                );
            },

            fetchAuthors() {
                const url = [
                    `/authors?_page=${this.dataQuery._page}`,
                    `&_sort=${this.dataQuery._sort}`,
                    `&_order=${this.dataQuery._order}`,
                    `&name_like=${this.dataQuery.name_like}`,
                    `&country_like=${this.dataQuery.country_like}`,
                ].join('');

                this.$store.dispatch('fetchAuthors', url)
                    .then(() => this.sortTable());
            },

            handleSort(event) {
                if (!event.column) {
                    this.dataQuery._sort = '';
                    this.dataQuery._order = '';
                } else {
                    this.dataQuery._sort = event.prop;
                    this.dataQuery._order = event.column.order === this.$constants.SORT_ASCENDING ? 'asc' : 'desc';
                }

                if (this.dataQuery._order !== this.stateQuery._order ||
                    this.dataQuery._sort !== this.stateQuery._sort) {
                    this.dataQuery._page = 1;
                    this.pushToRouter();
                }
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
                this.$router.push({ name: 'editAuthor', params: { id } });
            },

            handleDelete(id) {
                MessageBox.confirm('This will permanently delete this author. Continue?')
                    .then(() => this.$store.dispatch('deleteAuthor', id))
                    .then(() => {
                        if (this.getAuthors.length === 1) {
                            this.discardQueries();
                        } else {
                            this.fetchAuthors();
                        }
                    })
                    .catch(() => false);
            },
        },

        created() {
            this.applyRouterQuery();
            this.fetchAuthors();
        },
    };
</script>

<style scoped>
    .pagination {
        display: flex;
        justify-content: center;
        padding: 32px;
    }
</style>

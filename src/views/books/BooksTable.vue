<template>
    <div class="books-table">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/books/all' }">Books</el-breadcrumb-item>
            <el-breadcrumb-item>All</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="controls">
            <div>
                <el-input class="input-filter"
                          placeholder="Author ID"
                          @input="handleSearch"
                          v-model="dataQuery.author_like"
                          clearable>
                </el-input>
                <el-input class="input-filter"
                          placeholder="Category ID"
                          @input="handleSearch"
                          v-model="dataQuery.category_like"
                          clearable>
                </el-input>
            </div>
            <div>
                <router-link :to="{ name: 'addBook' }">
                    <el-button class="create-book" type="info" plain>Create book</el-button>
                </router-link>
            </div>
        </div>

        <div class="multi-actions" v-if="tableSelection.length">
            <el-button type="danger" plain @click="handleMultiAction('multiBooksDel')">
                Delete selected books</el-button>
        </div>

        <el-table v-show="getBooks && getBooks.length"
                  :data="getBooks"
                  ref="table"
                  @sort-change="handleSort"
                  @selection-change="handleSelection">

            <el-table-column label="ID" width="45">
                <template slot-scope="scope"><span>{{ scope.row.id }}</span></template>
            </el-table-column>

            <el-table-column label="Name" sortable="custom" prop="name" width="250">
                <template slot-scope="scope">
                    <span style="font-weight: bold">{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Author" sortable="custom" prop="author" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.author }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Category" sortable="custom" prop="category" width="120">
                <template slot-scope="scope">
                    <span>{{ getCategoryById(scope.row.category) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Pages" sortable="custom" prop="pages" width="100">
                <template slot-scope="scope"><span>{{ scope.row.pages }}</span></template>
            </el-table-column>

            <el-table-column label="Cover" width="70">
                <template slot-scope="scope">
                    <span class="cover-wrapper">
                        <img class="cover" :src="scope.row.image" alt="cover">
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="Owner" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.owner ? `User ${scope.row.owner}` : 'Library'}}</span>
                </template>
            </el-table-column>

            <el-table-column label="Description" width="600">
                <template slot-scope="scope">
                    <span style="font-size: .75rem">{{ scope.row.description }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Written at" sortable="custom" prop="created_at" width="130">
                <template slot-scope="scope">
                    <span>{{ scope.row.created_at }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Actions" width="120">
                <template slot-scope="scope">
                    <el-tooltip content="Edit book">
                        <el-button type="primary"
                                   icon="el-icon-edit"
                                   size="mini"
                                   @click="handleEdit(scope.row.id)"/>
                    </el-tooltip>
                    <el-tooltip content="Delete book">
                        <el-button type="danger"
                                   icon="el-icon-delete"
                                   size="mini"
                                   @click="handleDelete(scope.row)"/>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column type="selection" width="50"></el-table-column>
        </el-table>

        <div class="multi-actions" v-if="tableSelection.length">
            <el-button type="danger" plain @click="handleMultiAction('multiBooksDel')">
                Delete selected books</el-button>
        </div>

        <div v-if="!getBooks || !getBooks.length" class="nothing-found">
            <p>Nothing found</p>
            <el-button type="default" @click="discardQueries">Discard queries</el-button>
        </div>

        <el-pagination
                v-if="booksHaveNextPage"
                class="pagination"
                background
                layout="prev, pager, next"
                @current-change="handlePagination"
                :current-page="Number(dataQuery._page)"
                :total="Number(getBooksTotalCount)">
        </el-pagination>
    </div>
</template>

<script>
    import { debounce, mapObject } from 'underscore';
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import { MessageBox } from 'element-ui';

    export default {
        name: 'BooksTable',
        data() {
            return {
                dataQuery: {
                    _sort: '',
                    _order: '',
                    _page: 1,
                    author_like: '',
                    category_like: '',
                },
                tableSelection: [],
            };
        },

        computed: {
            ...mapGetters([
                'getBooks',
                'getBooksTotalCount',
                'booksHaveNextPage',
                'stateQuery',
                'categoriesList',
                'getCurrentUser',
            ]),
        },

        watch: {
            stateQuery() {
                this.applyRouterQuery();
                this.fetchBooks();
            },
        },

        methods: {
            handleSelection(rows) {
                this.tableSelection = rows;
            },

            handleMultiAction(action) {
                MessageBox.confirm('Are you sure?')
                    .then(() => {
                        const booksForServer = this.tableSelection.slice(0);

                        this.$store.dispatch(action, booksForServer)
                            .then(() => {
                                if (this.getBooks.length === 1) {
                                    this.discardQueries();
                                } else {
                                    this.fetchBooks();
                                }

                                this.tableSelection = [];
                            });
                    })
                    .catch(() => false);
            },

            getCategoryById(id) {
                const category = this.categoriesList.find(item => item.id === id);

                return category ? category.name : '-';
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
                this.dataQuery.author_like = this.stateQuery.author_like || '';
                this.dataQuery.category_like = this.stateQuery.category_like || '';
            },

            sortTable() {
                this.$refs.table.clearSort();

                this.$refs.table.sort(
                    this.dataQuery._sort,
                    this.dataQuery._order === 'asc' ? this.$constants.SORT_ASCENDING : this.$constants.SORT_DESCENDING,
                );
            },

            fetchBooks() {
                const url = [
                    `/books?_page=${this.dataQuery._page}`,
                    `&_sort=${this.dataQuery._sort}`,
                    `&_order=${this.dataQuery._order}`,
                    `&author_like=${this.dataQuery.author_like}`,
                    `&category_like=${this.dataQuery.category_like}`,
                ].join('');

                this.$store.dispatch('fetchBooks', url)
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
                this.$router.push({ name: 'editBook', params: { id } });
            },

            handleDelete(book) {
                MessageBox.confirm('This will permanently delete this book. Continue?')
                    .then(() => this.$store.dispatch('deleteBook', book))
                    .then(() => {
                        if (this.getBooks.length === 1) {
                            this.discardQueries();
                        } else {
                            this.fetchBooks();
                        }
                    })
                    .catch(() => false);
            },

            getTimeFormat(iso) {
                return moment(iso).format(this.$constants.DATE_DEF_FORMAT);
            },
        },

        created() {
            this.applyRouterQuery();
            this.fetchBooks();
        },
    };
</script>

<style lang="scss" scoped>
    .multi-actions {
        display: flex;
        justify-content: flex-end;
    }

    .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .input-filter {
        max-width: 200px;
        margin: 48px 12px;
    }

    .cover {
        max-height: 100%;
        max-width: 100%;
        border-radius: 30% 10%;
    }

    .el-pagination {
        display: flex;
        justify-content: center;
        padding: 32px;
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

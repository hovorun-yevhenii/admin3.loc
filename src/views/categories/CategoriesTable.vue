<template>
    <div class="categories-table">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/' }">Categories</el-breadcrumb-item>
            <el-breadcrumb-item>All</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="controls">
            <el-input class="input-filter"
                      placeholder="Name"
                      @input="handleSearch"
                      v-model="dataQuery.name_like"
                      clearable></el-input>
            <div>
                <el-button type="info" plain @click="handleEdit()">Create category</el-button>
            </div>
        </div>

        <el-table v-show="false" v-if="getCategories && getCategories.length" :data="getCategories">

            <el-table-column
                    label="ID"
                    width="45">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="Name"
                    prop="name"
                    width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="Books"
                    prop="amount"
                    width="70">
                <template slot-scope="scope">
                    <span>{{ Math.ceil(Math.random() * 100)}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="Actions"
                    width="120">
                <template slot-scope="scope">
                    <el-tooltip :content="'Edit ' + scope.row.name + ' category'">
                        <el-button type="primary"
                                   icon="el-icon-edit"
                                   size="mini"
                                   @click="handleEdit(scope.row)"/>
                    </el-tooltip>
                    <el-tooltip :content="'Delete ' + scope.row.name + ' category'">
                        <el-button type="danger"
                                   icon="el-icon-delete"
                                   size="mini"
                                   @click="handleDelete(scope.row.id, scope.row.name)"/>
                    </el-tooltip>
                </template>
            </el-table-column>

        </el-table>

        <div v-if="!getCategories || !getCategories.length" class="nothing-found">
            <p>Nothing found</p>
            <router-link to="/categories/all">
                <el-button type="default">Discard queries</el-button>
            </router-link>
        </div>

        <el-pagination
                v-if="categoriesHaveNextPage"
                class="pagination"
                background
                layout="prev, pager, next"
                @current-change="handlePagination"
                :current-page="Number(dataQuery._page)"
                :total="Number(categoriesTotalCount)">
        </el-pagination>

        {{ getCategories }}
        <!-- @node-click="handleNodeClick" -->
        <el-tree :data="getCategories" :props="treeProps"></el-tree>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {MessageBox} from 'element-ui'
    import {Notification} from 'element-ui'
    import {debounce} from 'underscore'

    export default {
        name: "CategoriesTable",
        data() {
            return {
                dataQuery: {
                    _page: '',
                    name_like: ''
                },
                treeProps: {
                    label: 'name',
                },
            }
        },

        computed: {
            ...mapGetters([
                'getCategories',
                'categoriesTotalCount',
                'categoriesHaveNextPage',
                'stateQuery'
            ]),
        },

        watch: {
            stateQuery() {
                this.applyRouterQuery();
                this.fetchCategories();
            },
        },

        methods: {
            disabledTree(data, node) {
                return data.parent_id
            },

            applyRouterQuery() {
                this.dataQuery._page = this.stateQuery._page || '';
                this.dataQuery.name_like = this.stateQuery.name_like || '';
            },

            pushToRouter() {
                this.$router.push({query: this.dataQuery});
            },

            fetchCategories() {
                let url = [
                    `http://localhost:3000/categories?`,
                    `_page=${this.dataQuery._page}`,
                    `&name_like=${this.dataQuery.name_like}`,
                ].join('');

                this.$store.dispatch('fetchCategories', url)
            },

            handleSearch: debounce(function () {
                this.dataQuery._page = 1;
                this.pushToRouter();
            }, 500),

            handleEdit(category = {}) {
                const editMode = typeof category.id !== 'undefined',
                    inputValue = editMode ? category.name : '',
                    restMethod = editMode ? 'updateCategory' : 'addCategory';

                MessageBox.prompt(`Please, input new category title`,
                    `${editMode ? 'Update category' : 'Add category'}`, {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        inputPattern: /.{3,}/,
                        inputValue,
                        inputErrorMessage: '3 characters minimum'
                    })
                    .then(input => {
                        category.name = input.value;

                        this.$store.dispatch(restMethod, category)
                            .then(result => {
                                if (result) {
                                    Notification.info({title: `Category has been ${editMode ? 'updated' : 'added'}`})
                                }
                            });
                    })
                    .catch(() => false);
            },

            handleDelete(id, name) {
                MessageBox.confirm(`This will permanently delete ${name} category. Continue?`, 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel'
                }).then(() => {
                    this.$store.dispatch('deleteCategory', id)
                        .then(result => {
                            if (result) {
                                Notification.info({title: 'Category has been deleted'})
                            } else {
                                Notification.error({title: 'Something went wrong'})
                            }
                        });

                    this.$router.push({path: '/'});
                }).catch(() => {
                    return false
                });
            },

            handlePagination(newPage) {
                this.dataQuery._page = newPage;
                this.pushToRouter();
            },
        },
        created() {
            this.applyRouterQuery();
            this.fetchCategories();
        }
    }
</script>

<style lang="scss" scoped>
    .categories-table {
        padding-top: 60px;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-bottom: 60px;

        & > * {
            margin: 0;
        }
    }

    .pagination {
        display: flex;
        justify-content: center;
        max-width: 200px;
        margin: 0 auto;
        padding-top: 32px;
    }

    .nothing-found {
        display: flex;
        flex-flow: column wrap;
        align-items: center;

        & > * {
            margin: 24px;
        }
    }
</style>
<template>
    <div class="categories-table">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/' }">Categories</el-breadcrumb-item>
            <el-breadcrumb-item>All</el-breadcrumb-item>
        </el-breadcrumb>

        <el-tree :data="treeData"
                 node-key="id"
                 :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
            <span>
                 <el-tooltip content="Edit category">
                    <el-button type="primary"
                               icon="el-icon-edit"
                               size="mini"
                               plain
                               @click="handleEdit(data)"/>
                 </el-tooltip>
                <el-tooltip content="Delete category">
                    <el-button type="danger"
                               icon="el-icon-delete"
                               size="mini"
                               plain
                               @click="handleDelete(data)"/>
                </el-tooltip>
                <el-tooltip v-if="!data.parent_id" content="Add subcategory">
                    <el-button type="warning"
                               icon="el-icon-circle-plus-outline"
                               size="mini"
                               plain
                               @click="handleAdd(data)"/>
                </el-tooltip>
            </span>
          </span>
        </el-tree>

        <div v-if="!getCategories || !getCategories.length" class="nothing-found">
            <p>Nothing found</p>
            <router-link to="/categories/all">
                <el-button type="default">Discard queries</el-button>
            </router-link>
        </div>

        <div class="controls">
            <el-button type="info" plain @click="handleAdd">Create category</el-button>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { MessageBox, Notification } from 'element-ui';

    export default {
        name: 'CategoriesTable',
        data() {
            return {
                dataQuery: {
                    _page: '',
                    name_like: '',
                },
                treeProps: {
                    label: 'name',
                },
                treeData: [],
            };
        },

        computed: {
            ...mapGetters([
                'getCategories',
                'categoriesTotalCount',
                'categoriesHaveNextPage',
                'stateQuery',
                'getCurrentUser',
            ]),
        },

        watch: {
            stateQuery() {
                this.fetchCategories();
            },
        },

        methods: {
            snapshotCategories() {
                this.treeData = [];

                this.getCategories.forEach((category) => {
                    if (!category.parent_id) {
                        Object.assign(category, { children: [] });
                        this.treeData.push(category);
                    }
                });

                this.treeData.forEach((category) => {
                    this.getCategories.forEach((nestedCategory) => {
                        if (nestedCategory.parent_id === category.id) {
                            category.children.push(nestedCategory);
                        }
                    });
                });
            },

            fetchCategories() {
                this.$store.dispatch('fetchCategories', '/categories')
                    .then(() => this.snapshotCategories());
            },

            handleEdit(category = {}) {
                MessageBox.prompt(
                    'Please, enter new category title',
                    'Update category', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        inputPattern: /.{3,}/,
                        inputValue: category.name,
                        inputErrorMessage: '3 characters minimum',
                    },
                )
                    .then((input) => {
                        const updatedCategory = Object.assign(
                            category,
                            { name: input.value },
                        );

                        this.$store.dispatch('updateCategory', updatedCategory)
                            .then((result) => {
                                if (result) {
                                    Notification.info({ title: 'Category has been updated' });
                                }
                            });
                    })
                    .catch(() => false);
            },

            handleDelete(category) {
                MessageBox.confirm('This will permanently delete this category. Continue?')
                    .then(() => {
                    this.$store.dispatch('deleteCategory', category.id)
                        .then((result) => {
                            if (result) {
                                Notification.info({ title: 'Category has been deleted' });
                                this.snapshotCategories();
                            } else {
                                Notification.error({ title: 'Something went wrong' });
                            }
                        });
                }).catch(() => false);
            },

            handleAdd(parentCategory) {
                MessageBox.prompt(
                    'Please, enter new category title',
                    'Create category', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        inputPattern: /.{3,}/,
                        inputErrorMessage: '3 characters minimum',
                    },
                )
                    .then((input) => {
                        this.$store.dispatch('addCategory', {
                            parent_id: parentCategory.id || null,
                            name: input.value,
                        })
                            .then((result) => {
                                if (result) {
                                    Notification.info({ title: 'Category has been created' });
                                    this.fetchCategories();
                                } else {
                                    Notification.error({ title: 'Something went wrong' });
                                }
                            });
                    })
                    .catch(() => false);
            },
        },
        created() {
            this.fetchCategories();
        },
    };
</script>

<style lang="scss">
    .custom-tree-node {
        min-width: 400px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .categories-table {
        padding-top: 60px;
    }

    .el-tree-node {
        padding: 10px;
    }

    .el-tree-node__label {
        padding: 15px 45px;
        font-weight: bold;
        background-color: #F2F6FC;
        width: 100%;

        &:focus {
            outline: none;
        }
    }

    .el-tree-node__children .el-tree-node__label {
        font-weight: lighter;
        padding: 10px;
        background-color: transparent;
    }

    .el-tree-node__children .el-tree-node {
        padding: 5px 15px;

        &:before {
            content: '-';
            position: relative;
            top: 20px;
            left: 25px;
        }
    }

    .controls {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-top: 60px;

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

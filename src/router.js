import Vue from 'vue'
import Router from 'vue-router'
import store from './store/store'

import LoginForm from './views/LoginForm.vue'
import Dashboard from './views/Dashboard.vue'
import NotFound from './views/NotFound.vue'

import Categories from './views/categories/Categories.vue'
import CategoriesTable from './views/categories/CategoriesTable.vue'
import CreateCategory from './views/categories/CreateCategory.vue'

import Books from './views/books/Books.vue'
import BooksTable from './views/books/BooksTable.vue'
import CreateBook from './views/books/CreateBook.vue'

import Authors from './views/authors/Authors.vue'
import AuthorsTable from './views/authors/AuthorsTable.vue'
import CreateAuthor from './views/authors/CreateAuthor.vue'

import Users from './views/users/Users.vue'
import UsersTable from './views/users/UsersTable.vue'
import CreateUser from './views/users/CreateUser.vue'
import EditUser from './views/users/EditUser.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [

        {
            path: '/login',
            name: 'login',
            component: LoginForm,
            beforeEnter: (to, from, next) => {
                if(store.state.auth) {
                    next('/')
                } else {
                    next()
                }
            },
        },
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard,
            meta: { auth: true },
            redirect: '/categories/all',
            children: [
                {
                    path: 'categories',
                    name: 'categories',
                    component: Categories,
                    children: [
                        {
                            path: 'all',
                            component: CategoriesTable,
                        },
                        {
                            path: 'add',
                            component: CreateCategory,
                        },
                        {
                            path: 'edit',
                            component: CreateCategory,
                        },
                    ],
                },
                {
                    path: 'users/:id?',
                    name: 'users',
                    component: Users,
                    children: [
                        {
                            path: 'all',
                            component: UsersTable,
                        },
                        {
                            path: 'add',
                            component: CreateUser,
                        },
                        {
                            path: 'edit',
                            component: EditUser,
                        },
                    ],
                },
                {
                    path: 'books',
                    name: 'books',
                    component: Books,
                    children: [
                        {
                            path: 'all',
                            component: BooksTable,
                        },
                        {
                            path: 'add',
                            component: CreateBook,
                        },
                        {
                            path: 'edit',
                            component: CreateBook,
                        },
                    ],
                },
                {
                    path: 'authors',
                    name: 'authors',
                    component: Authors,
                    children: [
                        {
                            path: 'all',
                            component: AuthorsTable,
                        },
                        {
                            path: 'add',
                            component: CreateAuthor,
                        },
                        {
                            path: 'edit',
                            component: CreateAuthor,
                        },
                    ],
                },
            ]
        },
        {
            path: '*',
            redirect: '/404',
        },
        {
            path: '/404',
            name: 'NotFound',
            component: NotFound,
        },
    ]
})

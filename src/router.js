import Vue from 'vue'
import Router from 'vue-router'
import store from './store/store'

import LoginForm from './views/LoginForm.vue'
import Dashboard from './views/Dashboard.vue'
import NotFound from './views/NotFound.vue'

import Categories from './views/categories/Categories.vue'
import CategoriesTable from './views/categories/CategoriesTable.vue'

import Books from './views/books/Books.vue'
import BooksTable from './views/books/BooksTable.vue'
import BookForm from './views/books/BookForm.vue'

import Authors from './views/authors/Authors.vue'
import AuthorsTable from './views/authors/AuthorsTable.vue'
import AuthorForm from './views/authors/AuthorForm.vue'

import Users from './views/users/Users.vue'
import UsersTable from './views/users/UsersTable.vue'
import UserForm from './views/users/UserForm.vue'

Vue.use(Router);

// json-server --watch db.json --port 3000 --delay 1000

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginForm,
            beforeEnter: (to, from, next) => {
                if (store.state.user.currentUser) {
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
            redirect: '/categories/all',
            beforeEnter: (to, from, next) => {
                if (store.state.user.currentUser) {
                    next()
                } else {
                    next('/login')
                }
            },
            children: [
                {
                    path: 'categories',
                    name: 'categories',
                    component: Categories,
                    redirect: '/categories/all',
                    children: [
                        {
                            path: 'all',
                            component: CategoriesTable,
                        }
                    ],
                },
                {
                    path: 'users',
                    name: 'users',
                    component: Users,
                    redirect: '/users/all',
                    children: [
                        {
                            path: 'all/',
                            name: 'usersList',
                            component: UsersTable,
                        },
                        {
                            path: 'add',
                            name: 'addUser',
                            component: UserForm
                        },
                        {
                            path: ':id/edit',
                            name: 'editUser',
                            component: UserForm
                        },
                    ],
                },
                {
                    path: 'books',
                    name: 'books',
                    component: Books,
                    redirect: '/books/all',
                    children: [
                        {
                            path: 'all',
                            name: 'booksTable',
                            component: BooksTable,
                        },
                        {
                            path: 'add',
                            name: 'addBook',
                            component: BookForm,
                        },
                        {
                            path: ':id/edit',
                            name: 'editBook',
                            component: BookForm,
                        },
                    ],
                },
                {
                    path: 'authors',
                    name: 'authors',
                    component: Authors,
                    redirect: '/authors/all',
                    children: [
                        {
                            path: 'all',
                            name: 'authorsTable',
                            component: AuthorsTable,
                        },
                        {
                            path: 'add',
                            name: 'addAuthor',
                            component: AuthorForm,
                        },
                        {
                            path: ':id/edit',
                            name: 'editAuthor',
                            component: AuthorForm,
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

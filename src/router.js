import Vue from 'vue';
import Router from 'vue-router';
import store from './store/store';

import LoginForm from './views/LoginForm';
import Dashboard from './views/Dashboard';
import NotFound from './views/NotFound';

import Categories from './views/categories/Categories';
import CategoriesTable from './views/categories/CategoriesTable';

import Books from './views/books/Books';
import BooksTable from './views/books/BooksTable';
import BookForm from './views/books/BookForm';

import Authors from './views/authors/Authors';
import AuthorsTable from './views/authors/AuthorsTable';
import AuthorForm from './views/authors/AuthorForm';

import Users from './views/users/Users';
import UsersTable from './views/users/UsersTable';
import UserForm from './views/users/UserForm';

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
                    next('/');
                } else {
                    next();
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
                    next();
                } else {
                    next('/login');
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
                            name: 'categoriesList',
                            component: CategoriesTable,
                        },
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
                            meta: {
                                seniorOnly: true,
                            },
                        },
                        {
                            path: 'add',
                            name: 'addUser',
                            component: UserForm,
                            meta: {
                                seniorOnly: true,
                            },
                        },
                        {
                            path: ':id/edit',
                            name: 'editUser',
                            component: UserForm,
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
            ],
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
    ],
});

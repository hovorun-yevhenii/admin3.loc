import Vue from 'vue'
import Router from 'vue-router'

import LoginForm from './views/LoginForm.vue'
import Dashboard from './views/Dashboard.vue'
import NotFound from './views/NotFound.vue'

import Categories from './views/Categories.vue'
import Users from './views/Users.vue'
import Books from './views/Books.vue'
import Authors from './views/Authors.vue'
import Profile from './views/Profile.vue'


Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'login',
            component: LoginForm,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            children: [
                {
                    path: 'categories',
                    name: 'categories',
                    component: Categories,
                },
                {
                    path: 'users',
                    name: 'users',
                    component: Users,
                },
                {
                    path: 'books',
                    name: 'books',
                    component: Books,
                },
                {
                    path: 'authors',
                    name: 'authors',
                    component: Authors,
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: Profile,
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

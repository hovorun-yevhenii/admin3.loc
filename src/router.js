import Vue from 'vue'
import Router from 'vue-router'
import Categories from './views/Categories.vue'
import Users from './views/Users.vue'
import Books from './views/Books.vue'
import Authors from './views/Authors.vue'
import Profile from './views/Profile.vue'
import Login from './views/Login.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/categories',
        },
        {
            path: '/categories',
            name: 'categories',
            component: Categories,
        },
        {
            path: '/users',
            name: 'users',
            component: Users,
        },
        {
            path: '/books',
            name: 'books',
            component: Books,
        },
        {
            path: '/authors',
            name: 'authors',
            component: Authors,
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
    ]
})

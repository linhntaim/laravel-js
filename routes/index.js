import {AboutController} from '../app/http/controllers/about-controller.js'

export const routes = [
    {
        path: '/',
        method: 'get',
        name: 'root',
        middlewares: [],
        controller: function () {

        },
    },
    {
        path: '/about',
        method: 'get',
        name: 'about',
        middlewares: [],
        controller: [AboutController, 'about'],
    },
    {
        path: '/blog',
        name: 'blog.',
        middlewares: [],
        children: [
            {
                path: '/',
                method: 'get',
                name: 'root',
                middlewares: [],
                controller: function () {

                },
            },
            {
                path: '/article/:id',
                method: 'get',
                name: 'article',
                middlewares: [],
                controller: function () {

                },
            },
        ],
    },
]

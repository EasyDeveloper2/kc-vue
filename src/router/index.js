import VueRouter from 'vue-router'
import Vue from 'vue';

Vue.use(VueRouter)
const router = new VueRouter({
    mode:'history',
    routes:[
        {
            name:'首页',
            path:'/',
            component:()=>import('../pages/index/index.vue')
        }
    ]
})

export default router
import Vue from 'vue';
import router from './router/index';
import App from './App.vue';


var app = new Vue({
    router:router,
    render: h => h(App)
})

app.$mount('#app')
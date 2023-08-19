import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import jQuery from 'jquery'
window.$ = window.jQuery = jQuery

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

app.mount('#app')

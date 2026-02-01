// import './assets/main.css'

// const bootstrap = require('bootstrap')

import './scss/custom.scss'
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

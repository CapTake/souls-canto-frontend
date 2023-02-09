import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import store from './store'
// import router from './router'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

const app = createApp(App)
app.use(Toast, { hideProgressBar: true })
  .use(FloatingVue)
  .use(store)
  .mount('#app')

import Vue from 'vue'
import App from './Home.vue'
import rawDisplayer from "./components/raw-displayer.vue";
import "bootstrap/dist/css/bootstrap.min.css";

require("bootstrap");

Vue.config.productionTip = false
Vue.component("rawDisplayer", rawDisplayer);

new Vue({
  render: h => h(App)
}).$mount('#app')

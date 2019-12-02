import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios/dist/axios'
import DomainList from './components/DomainList.vue'
import DomainView from './components/DomainView.vue'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  routes: [
    { path: "/domains", component: DomainList },
    { path: "/", redirect: "/domains" },
    { path: "/domains/:domain", 
      component: DomainView, 
      props: true },
  ]
})

const store = new Vuex.Store({

  state: {
    items: {
      prefix: [],
      sufix: [],
    },
    domains: [],
  },

  mutations: {
    addItem(state, payload) {
      const {item, newItem} = payload
      state.items[item.type].push(newItem)
    },
    deleteItem(state, payload) {
      const {item } = payload
      state.items[item.type].splice(state.items[item.type].indexOf(item), 1)
    },
    setItems (state, payload) {
      const {type, items } = payload
      state.items[type] = items
    },
    setDomains(state, payload) {
      const {domains} = payload
      state.domains = domains
    }

  },

  actions: {
    async addItem(context, payload) {
      const item = payload
      axios({
        url: "http://localhost:4010",
        method: "POST",
        data: {
          query: `
            mutation ($item: ItemInput) {
              newItem: saveItem(item: $item) {
                id type description
              }
            }
          `,
          variables: { item }
        }
      })
      //.then(() => {this.getItems("prefix")}) //OU
      .then(res => {   //Actualiza a pagina 
        const query = res.data
        const newItem = query.data.newItem
        context.commit("addItem", {item, newItem})
        context.dispatch("generateDomains")
      })    
  
    },
    async deleteItem(context, payload) {
      const item = payload
      axios({
        url: "http://localhost:4010",
        method: "POST",
        data: {
          query: `
            mutation ($id: Int) {
            deleted: deleteItem(id: $id)
            }
          `,
          variables: {
            id: item.id
          }
        }
      }).then(() => {
        context.commit("deleteItem", {item})
        context.dispatch("generateDomains")
      })
    },

    async getItems(context, payload) {
      const type = payload
      return axios({
        url: "http://localhost:4010",
        method: "POST",
        data: {
          query: `
            query ($type: String) {
              items: items(type: $type) {id type description} 
            }
          `,
          variables: {
            type
          }
        }
      })
      .then(res => {
        const query = res.data
        context.commit("setItems", {type, items: query.data.items} )
    
      }).catch((err) => {
        console.log(err)
      });
    },

    async generateDomains(context) {
      axios({
        url: "http://localhost:4010",
        method: "POST",
        data: {
          query: `
            mutation{
              domains: generateDomains {name checkout available}
            }
          `
        }
      }).then((res) => {
        const query = res.data
        context.commit("setDomains", {domains: query.data.domains})
      });
    },
  }
})

  //Quando temos várias chamadda assincronas
  Promise.all([
    store.dispatch("getItems", "prefix"),
    store.dispatch("getItems", "sufix")
  ]).then(() => {
    //Só após o retorno das 2 chamadas anteriores passa para aqui
    store.dispatch("generateDomains")
  })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

import Vue  from 'vue'

const globalComponents = require.context('.', false, /^\.\/[^/]+\.vue/)
globalComponents.keys().forEach(item => {
  const component = globalComponents(item).default
  Vue.component(component.name, component) 
})

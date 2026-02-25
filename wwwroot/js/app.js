      const { createApp } = Vue
      const { createVuetify } = Vuetify
    //   const { ar, en } = require('vuetify/locale')
      const vuetify = createVuetify({
            locale: {
                locale: 'en',       // Current locale
                fallback: 'en',
            }
        })
    // const vuetify = createVuetify()
      const app = createApp({template, setup})
      app.use(vuetify).mount('#app')

      const { createApp } = Vue
      const { createVuetify } = Vuetify
      const vuetify = createVuetify({
            locale: {
                locale: 'ar',       // Current locale
                fallback: 'en',
                rtl: {
                    ar: true,        // Set 'ar' to use RTL
                }
            }
        })
      const app = createApp({template, setup})
      app.use(vuetify).mount('#app')

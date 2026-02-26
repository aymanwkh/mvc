const { createApp } = Vue
const { createVuetify } = Vuetify
const vuetify = createVuetify({
  locale: {
    locale: 'ar',       // Current locale
    fallback: 'en',
  }
})
const app = createApp({template, setup})
app.config.warnHandler = (msg, instance, trace) => {
  if (msg.includes('Vuetify: Translation key')) return;
  console.warn(msg, instance, trace); // Log everything else
};
app.use(vuetify).mount('#app')

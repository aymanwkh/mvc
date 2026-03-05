const app = Vue.createApp({template, setup})
app.config.warnHandler = (msg, instance, trace) => {
  if (msg.includes('Vuetify: Translation key')) return;
  console.warn(msg, instance, trace); // Log everything else
};
const vuetify = Vuetify.createVuetify({
  locale: {
    locale: 'ar',       // Current locale
    fallback: 'en',
  },
  components: { ...Vuetify.components, VDateInput: Vuetify.components.VDateInput }
})
app.use(vuetify).mount('#app')

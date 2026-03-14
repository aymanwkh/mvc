const { ref, onMounted, watch } = Vue
const setup = () => {
  const pages = ref([])
  const filteredPages = ref([])
  const showSearch = ref(false)
  const search = ref('')
  const clickme = (page) => {
    if (page.Path) window.location.href = page.Path
    else filteredPages.value = pages.value.filter(e => e.Parent_id == page.Id)
  }
  onMounted(async () => {
      const response = await fetch('/home/getPages')
      const data = await response.json()
      pages.value = data.map(e => {
                                    if (e.Path) return {...e, icon: 'mdi-gesture-tap-button'}
                                    else return {...e, icon: 'mdi-folder'}
                                  })
      filteredPages.value = pages.value.filter(e => !e.Parent_id)
  })
  watch(search, (val) => {
    if (val == '') filteredPages.value = pages.value
    else filteredPages.value = pages.value.filter(e => e.Name.includes(val))
  })
  return {
    pages, showSearch, clickme, filteredPages, search
  }
}
const template = /*html*/`
  <v-card
    class="mx-auto"
    max-width="600"
  >
    <v-toolbar color="secondary">
      <v-btn icon="mdi-menu" variant="text"></v-btn>

      <v-toolbar-title>My files</v-toolbar-title>

      <v-btn v-if="!showSearch" icon="mdi-magnify" variant="text" @click="showSearch = true"></v-btn>
      <v-text-field v-if="showSearch"
      density="compact"
      placeholder="Search"
      prepend-inner-icon="mdi-magnify"
      variant="solo"
      width="200"
      flat
      hide-details
      single-line
      v-model="search"
      ></v-text-field>
      <v-btn icon="mdi-view-module" variant="text"></v-btn>
    </v-toolbar>

    <v-list lines="two">

      <v-list-item
        v-for="(page, i) in filteredPages"
        :key="i"
        :title="page.Name"
        @click="clickme(page)"
      >
        <template v-slot:prepend>
          <v-avatar :color="page.Path ? 'blue' : 'grey-lighten-1'">
            <v-icon color="white">{{page.icon}}</v-icon>
          </v-avatar>
        </template>

      </v-list-item>

      <v-divider color="red" opacity=".7" thickness="3" gradient></v-divider>
      <v-list-subheader inset>Files</v-list-subheader>

      <v-list-item
        v-for="file in files"
        :key="file.title"
        :subtitle="file.subtitle"
        :title="file.title"
      >
        <template v-slot:prepend>
          <v-avatar :color="file.color">
            <v-icon color="white">{{ file.icon }}</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn
            color="grey-lighten-1"
            icon="mdi-information"
            variant="text"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
`
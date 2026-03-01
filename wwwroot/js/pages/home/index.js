const { ref, watch } = Vue
const setup = () => {
    const itemsPerPage = ref(5)
    const selected = ref()
    const headers = ref([
    {
      title: 'ID',
      align: 'center',
      sortable: false,
      key: 'Id',
    },
    { title: 'Name', key: 'Name', align: 'start' },
    { title: 'Price', key: 'Price', align: 'end' },
  ])
  const search = ref('')
  const serverItems = ref([])
  const loading = ref(true)
  const totalItems = ref(0)
  const drawer = ref(false)
  async function loadItems ({ page, itemsPerPage, sortBy }) {
    loading.value = true
    const params = {
      page,
      itemsPerPage
    };
    const queryString = new URLSearchParams(params).toString();
    const apiEndpoint = '/home/getData';
    const urlWithParams = `${apiEndpoint}?${queryString}`;
    const response = await fetch(urlWithParams)
    const data = await response.json()
    serverItems.value = data.result
    totalItems.value = data.total
    loading.value = false
  }
  function goDetails() {
    console.log('value = ', selected.value[0])
    window.location.href = '/home/details/' + selected.value[0]
  }
  watch(selected, (newVal) => {
    if (newVal[0]) drawer.value = true
    else drawer.value = false
  })
  return {
    itemsPerPage, headers, search, serverItems, loading, totalItems, loadItems, selected, 
    drawer, goDetails
  }
}
const template = /*html*/`
<v-layout>
<v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="Id"
    show-select
    select-strategy="single"
    @update:options="loadItems"
    v-model="selected"
></v-data-table-server>
<v-navigation-drawer
        v-model="drawer"
        temporary
        location="left"
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
          title="John Leider"
        ></v-list-item>

        <v-divider></v-divider>

        <v-btn block @click="goDetails">Block Button1</v-btn>
        <v-btn block>Block Button2</v-btn>
        <v-btn block>Block Button3</v-btn>
      </v-navigation-drawer>
</v-layout>
`
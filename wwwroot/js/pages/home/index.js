const { ref } = Vue
const setup = () => {
    const itemsPerPage = ref(5)
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
  async function loadItems ({ page, itemsPerPage, sortBy }) {
    loading.value = true
    const params = {
      page,
      itemsPerPage
    };
    const queryString = new URLSearchParams(params).toString();
    const apiEndpoint = '/home/getData';
    const urlWithParams = `${apiEndpoint}?${queryString}`;
    console.log('url = ', urlWithParams)
    const response = await fetch('/home/getData?page=1')
    const data = await response.json()
    serverItems.value = data
    totalItems.value = data.length
    loading.value = false
  }
  return {
    itemsPerPage, headers, search, serverItems, loading, totalItems, loadItems
  }
}
const template = /*html*/`
<v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="loadItems"
  ></v-data-table-server>
`
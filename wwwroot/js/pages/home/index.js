const { ref } = Vue
const setup = () => {
    const itemsPerPage = ref(5)
    const headers = ref([
    {
      title: 'ID',
      align: 'center',
      sortable: false,
      key: 'id',
    },
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Price', key: 'price', align: 'end' },
  ])
  const search = ref('')
  const serverItems = ref([])
  const loading = ref(true)
  const totalItems = ref(0)
  function loadItems ({ page, itemsPerPage, sortBy }) {
    loading.value = true
    const apiUrl = '/account/login';
    fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
      serverItems.value = items
      totalItems.value = total
      loading.value = false
    })
  }
  return {
    itemsPerPage, headers, search, serverItems, loading, totalItems
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
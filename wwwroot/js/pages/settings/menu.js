const { ref, onMounted, watch, computed } = Vue
const setup = () => {
  const pages = ref([])
  const active = ref([])
  const items = ref([
    {
      id: 1,
      title: 'Applications :',
      children: [
        { id: 2, title: 'Calendar : app' },
        { id: 3, title: 'Chrome : app' },
        { id: 4, title: 'Webstorm : app' },
      ],
    },
    {
      id: 5,
      title: 'Documents :',
      children: [
        {
          id: 6,
          title: 'vuetify :',
          children: [
            {
              id: 7,
              title: 'src :',
              children: [
                { id: 8, title: 'index : ts' },
                { id: 9, title: 'bootstrap : ts' },
              ],
            },
          ],
        },
        {
          id: 10,
          title: 'material2 :',
          children: [
            {
              id: 11,
              title: 'src :',
              children: [
                { id: 12, title: 'v-btn : ts' },
                { id: 13, title: 'v-card : ts' },
                { id: 14, title: 'v-window : ts' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 15,
      title: 'Downloads :',
      children: [
        { id: 16, title: 'October : pdf' },
        { id: 17, title: 'November : pdf' },
        { id: 18, title: 'Tutorial : html' },
      ],
    },
    {
      id: 19,
      title: 'Videos :',
      children: [
        {
          id: 20,
          title: 'Tutorials :',
          children: [
            { id: 21, title: 'Basic layouts : mp4' },
            { id: 22, title: 'Advanced techniques : mp4' },
            { id: 23, title: 'All about app : dir' },
          ],
        },
        { id: 24, title: 'Intro : mov' },
        { id: 25, title: 'Conference introduction : avi' },
      ],
    },
  ])
  function convertToHierarchy(arr) {
    // 1. Create a map of all items, adding a 'children' array to each.
    const nodeMap = arr.reduce((acc, item) => {
        acc[item.Id] = { ...item, children: [] };
        return acc;
    }, {}); //
    const tree = [];

    // 2. Iterate through the items again to build the hierarchy.
    arr.forEach(item => {
        if (item.Parent_id === null) {
            // If it's a root node, add it to the main tree array.
            tree.push(nodeMap[item.Id]);
        } else {
            // If it has a parent, find the parent in the map and push the current item 
            // (which is referenced in nodeMap) into the parent's children array.
            const parent = nodeMap[item.Parent_id];
            if (parent) {
                parent.children.push(nodeMap[item.Id]);
            }
        }
    });

    return tree;
}

const selected = computed(() => {
    if (!active.value.length) return undefined

    const id = active.value[0]

    return id
  })
function add() {

}
    onMounted(async () => {
      const response = await fetch('/home/getTree')
      const data = await response.json()
      pages.value = convertToHierarchy(data);

      // pages.value = data.map(e => {
      //                               if (e.Path) return {...e, icon: 'mdi-gesture-tap-button'}
      //                               else return {...e, icon: 'mdi-folder'}
      //                             })
      // filteredPages.value = pages.value.filter(e => !e.Parent_id)
  })
  return {
    items, pages, active, selected, add
  }
}

const template = /*html*/`
<v-card>
    <v-toolbar
      color="surface-light"
      density="compact"
      title="Local hotspots"
      flat
    >
            <v-btn
            v-show="selected"
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add a Book"
            border
            @click="add"
          ></v-btn>

  </v-toolbar>
    <v-treeview
      v-model:activated="active"
      :items="pages"
      item-value="Id"
      item-title="Name"
      activatable
    >
    </v-treeview>
</v-card>
`
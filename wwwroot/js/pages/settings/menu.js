const { ref, onMounted, watch, computed } = Vue
const setup = () => {
  const pages = ref([])
  const active = ref([])
  const isEditing = ref(false)
  const dialog = ref(false)
  const subtitle = ref('')
  const title = ref('')
  const formModel = ref({})
  watch(isEditing, (newVal) => {
    subtitle.value = `${newVal ? 'Update' : 'Create'} your favorite book`
    title.value = `${newVal ? 'Edit' : 'Add'} a Book`
  })
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
function edit() {
  isEditing.value = true
  dialog.value = true
  formModel.value = pages.value.find(e => e.Id == selected.value)
}
function addSub() {
  isEditing.value = false
  dialog.value = true
  formModel.value = {
    Parent_id: selected,
    Name: '',
    Path: ''
  }
}
function addPeer() {
  isEditing.value = false
  dialog.value = true
  const current = pages.value.find(e => e.Id == selected.value)
  formModel.value = {
    Parent_id: current.Parent_id,
    Name: '',
    Path: ''
  }
}
  const save = async () => {
    const apiUrl = '/home/addPage'; // Replace with a valid API endpoint
    console.log('form == ', formModel.value)
    const response = await fetch(apiUrl, {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Indicate the content type
      },
      body: JSON.stringify(formModel.value), // Convert the data to a JSON string
    })
    console.log('response == ', response)
    if (response.ok) {
      dialog.value = false 
      const response = await fetch('/home/getPages')
      const data = await response.json()
      pages.value = convertToHierarchy(data);
    }
  }
    onMounted(async () => {
      const response = await fetch('/home/getPages')
      const data = await response.json()
      pages.value = convertToHierarchy(data);

      // pages.value = data.map(e => {
      //                               if (e.Path) return {...e, icon: 'mdi-gesture-tap-button'}
      //                               else return {...e, icon: 'mdi-folder'}
      //                             })
      // filteredPages.value = pages.value.filter(e => !e.Parent_id)
  })
  return {
    pages, active, selected, isEditing, subtitle, title, formModel, save, dialog, addPeer, addSub, edit
  }
}

const template = /*html*/`
<v-container>
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
        text="اضافة مثيل"
        border
        @click="addPeer"
      ></v-btn>
      <v-btn
        v-show="selected"
        class="me-2"
        prepend-icon="mdi-plus"
        rounded="lg"
        text="اضافة تابع"
        border
        @click="addSub"
      ></v-btn>
      <v-btn
        v-show="selected"
        class="mx-2"
        prepend-icon="mdi-pencil"
        rounded="lg"
        text="تعديل"
        border
        @click="edit"
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
<v-dialog v-model="dialog" max-width="500">
    <v-card
      :subtitle
      :title
    >
      <template v-slot:text>
        <v-row>
          <v-text-field v-model="formModel.Name" label="Name"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field v-model="formModel.Path" label="Path"></v-text-field>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>
<v-spacer></v-spacer>

        <v-btn text="Save" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
`
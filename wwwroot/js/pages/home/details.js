const { ref, onMounted, reactive } = Vue
const setup = () => {
    const fullPath = window.location.href
    const lastSlashIndex = fullPath.lastIndexOf('/')
    const id = ref(fullPath.substring(lastSlashIndex + 1))
    onMounted(async () => {
        const response = await fetch('/home/getDetails/' + id.value)
        const data = await response.json()
        console.log('data =', data)
    })
    
    const isFormValid = ref(false)
    const formData = reactive({
        name: '',
        birthDate: null,
        photo: null,
        nationality: null,
        gender: null,
        joinDate: null,
        telephone: '',
        address: '',
        notes: ''
    })
    
    const submit = () => {
        console.log('Form Data:', formData)
    }
    return {submit, formData, isFormValid}
}
const template = /*html*/`
<v-container>
    <v-form v-model="isFormValid" ref="form">
      <v-row>
        <!-- Name -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.name"
            label="Full Name"
            :rules="[v => !!v || 'Name is required']"
            required
          ></v-text-field>
        </v-col>

        <!-- Birth Date -->
        <v-col cols="12" md="6">
          <v-date-input
            v-model="formData.birthDate"
            label="Birth Date"
            prepend-icon="mdi-calendar"
          ></v-date-input>
        </v-col>

        <!-- Photo -->
        <v-col cols="12" md="6">
          <v-file-input
            v-model="formData.photo"
            label="Upload Photo"
            accept="image/*"
            prepend-icon="mdi-camera"
          ></v-file-input>
        </v-col>

        <!-- Nationality -->
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.nationality"
            :items="['American', 'British', 'Canadian', 'Other']"
            label="Nationality"
          ></v-select>
        </v-col>

        <!-- Gender -->
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.gender"
            :items="['Male', 'Female', 'Non-binary', 'Prefer not to say']"
            label="Gender"
          ></v-select>
        </v-col>

        <!-- Join Date -->
        <v-col cols="12" md="6">
          <v-date-input
            v-model="formData.joinDate"
            label="Join Date"
          ></v-date-input>
        </v-col>

        <!-- Telephone -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.telephone"
            label="Telephone"
            type="tel"
          ></v-text-field>
        </v-col>

        <!-- Address -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.address"
            label="Address"
          ></v-text-field>
        </v-col>

        <!-- Notes -->
        <v-col cols="12">
          <v-textarea
            v-model="formData.notes"
            label="Notes"
            rows="3"
          ></v-textarea>
        </v-col>

        <v-col cols="12">
          <v-btn :disabled="!isFormValid" color="primary" @click="submit">
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  `
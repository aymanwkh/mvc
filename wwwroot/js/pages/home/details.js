const { ref, onMounted } = Vue
const setup = () => {
    const fullPath = window.location.href
    const lastSlashIndex = fullPath.lastIndexOf('/')
    const id = ref(fullPath.substring(lastSlashIndex + 1))
    console.log('id = ', id.value)
    onMounted(async () => {
    console.log('before mount id = ', id.value)
        const response = await fetch('/home/getDetails/' + id.value)
        const data = await response.json()
        console.log('data =', data)
    })
    return {id}
}
const template = /*html*/`
<v-layout>
<span>Message: {{ id }}</span></v-layout>
`
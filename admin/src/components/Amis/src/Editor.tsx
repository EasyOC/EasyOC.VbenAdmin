import { Editor } from 'amis-editor'
import ReactDOM from 'react-dom'
import { ref, onMounted } from 'vue'

const props = ref<any>({})

onMounted(() => {
  ReactDOM.render(() => <Editor {...props.value} />)
})

<template lang="pug">
  div
    editor(v-model="html" @change="change" height="800px" :id="editorId")
    njs-button(@click="switchLang") {{$t('切换语言')}}
    div(v-html="html")
</template>
<script>
import editor from '@/components/c-editor/index'
export default {
  name: 'editor-demo',
  components: {
    editor
  },
  data () {
    return {
      html: '',
      editorId: 'tinymce' + new Date().getTime() // tinymce.get('ID')
    }
  },
  methods: {
    change (e, editor) {
      // console.log('e', e)
      // console.log('editor', editor)
    },
    switchLang () {
      console.log(window.tinymce.get(this.editorId))
    }
  }
}
</script>

<style scoped>

</style>

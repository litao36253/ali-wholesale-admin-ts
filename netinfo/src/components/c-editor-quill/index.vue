<template>
  <div class="quill-editor" v-loading="loading" :element-loading-text="$t('正在载入图片。。。')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" >
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>
import _Quill from 'quill'
import defaultOptions from './options'
// import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-module'
// _Quill.register('modules/imageDrop', ImageDrop)
// _Quill.register('modules/imageResize', ImageResize)
const Quill = window.Quill || _Quill

export default {
  name: 'quill-editor',
  mixins: [defaultOptions],
  data () {
    return {
      realOptions: {},
      realContent: '',
      loading: false
    }
  },
  props: {
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  mounted () {
    this.initialize()
  },
  beforeDestroy () {
    this.quill = null
    delete this.quill
  },
  methods: {
    // 初始化
    initialize () {
      if (this.$el) {
        // 富文本配置
        this.realOptions = { ...this.defaultOptions, ...this.options }
        // 创建富文本框实例并挂载到DOM
        this.quill = new Quill(this.$refs.editor, this.realOptions)
        this.quill.enable(false)
        // 绑定内容
        if (this.value) {
          this.quill.pasteHTML(this.value)
        }
        // 是否禁用
        if (!this.disabled) {
          this.quill.enable(true)
        }
        // 获得焦点和失去焦点事件
        this.quill.on('selection-change', range => {
          if (!range) {
            this.$emit('blur', this.quill)
          } else {
            this.$emit('focus', this.quill)
          }
        })
        // 富文本内容由变化
        this.quill.on('editor-change', (delta, oldDelta, source) => {
          let html = this.$refs.editor.children[0].innerHTML
          const quill = this.quill
          const text = this.quill.getText()
          if (html === '<p><br></p>') html = ''
          this.realContent = html
          this.$emit('input', this.realContent)
          this.$emit('change', { html, text, quill })
        })
        // 富文本渲染完成
        this.$emit('ready', this.quill)

        this.quill.keyboard.addBinding({
          // key: 'v',
          // shortKey: true,
          // handler: function (range, context) {
          //   console.log(arguments)
          //   this.quill.insertEmbed(10, 'text', '/images/cloud.png')
          // }
        })
      }
    }
  },
  watch: {
    // 内容改变
    value (newVal) {
      if (this.quill) {
        if (newVal && newVal !== this.realContent) {
          this.realContent = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    // 是否禁用
    disabled (newVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    }
  }
}
</script>

<style scoped>
  @import '~quill/dist/quill.core.css';
  @import '~quill/dist/quill.snow.css';
  @import '~quill/dist/quill.bubble.css';
  @import '~highlight.js/styles/monokai-sublime.css';
</style>

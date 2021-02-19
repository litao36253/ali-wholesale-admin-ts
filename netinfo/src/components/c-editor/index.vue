<template>
  <Editor
      v-model="tinymceHtml"
      :init="realInit"
      :disabled="disabled"
      :id="realId"
      :initialValue="initialValue"
      :inline="inline"
      :tag-name="tagName"
      :plugins="plugins"
      :toolbar="toolbar"
      v-if="reload"
      @onActivate="onActivate"
      @onAddUndo="onAddUndo"
      @onBeforeAddUndo="onBeforeAddUndo"
      @onBeforeExecCommand="onBeforeExecCommand"
      @onBeforeGetContent="onBeforeGetContent"
      @onBeforeRenderUI="onBeforeRenderUI"
      @onBeforeSetContent="onBeforeSetContent"
      @onBeforePaste="onBeforePaste"
      @onBlur="onBlur"
      @onChange="onChange"
      @onClearUndos="onClearUndos"
      @onClick="onClick"
      @onContextMenu="onContextMenu"
      @onCopy="onCopy"
      @onCut="onCut"
      @onDblclick="onDblclick"
      @onDeactivate="onDeactivate"
      @onDirty="onDirty"
      @onDrag="onDrag"
      @onDragDrop="onDragDrop"
      @onDragEnd="onDragEnd"
      @onDragGesture="onDragGesture"
      @onDragOver="onDragOver"
      @onDrop="onDrop"
      @onExecCommand="onExecCommand"
      @onFocus="onFocus"
      @onFocusIn="onFocusIn"
      @onFocusOut="onFocusOut"
      @onGetContent="onGetContent"
      @onHide="onHide"
      @onInit="onInit"
      @onKeyDown="onKeyDown"
      @onKeyPress="onKeyPress"
      @onKeyUp="onKeyUp"
      @onLoadContent="onLoadContent"
      @onMouseDown="onMouseDown"
      @onMouseEnter="onMouseEnter"
      @onMouseLeave="onMouseLeave"
      @onMouseMove="onMouseMove"
      @onMouseOut="onMouseOut"
      @onMouseOver="onMouseOver"
      @onMouseUp="onMouseUp"
      @onNodeChange="onNodeChange"
      @onObjectResizeStart="onObjectResizeStart"
      @onObjectResized="onObjectResized"
      @onObjectSelected="onObjectSelected"
      @onPaste="onPaste"
      @onPostProcess="onPostProcess"
      @onPostRender="onPostRender"
      @onPreProcess="onPreProcess"
      @onProgressState="onProgressState"
      @onRedo="onRedo"
      @onRemove="onRemove"
      @onReset="onReset"
      @onSaveContent="onSaveContent"
      @onSelectionChange="onSelectionChange"
      @onSetAttrib="onSetAttrib"
      @onSetContent="onSetContent"
      @onShow="onShow"
      @onSubmit="onSubmit"
      @onUndo="onUndo"
      @onVisualAid="onVisualAid"
  ></Editor>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
/* import 'tinymce/plugins/image'// 插入上传图片插件
  import 'tinymce/plugins/media'// 插入视频插件
  import 'tinymce/plugins/table'// 插入表格插件
  import 'tinymce/plugins/link' // 超链接插件
  import 'tinymce/plugins/code' // 代码块插件
  import 'tinymce/plugins/lists'// 列表插件
  import 'tinymce/plugins/contextmenu' // 右键菜单插件
  import 'tinymce/plugins/wordcount' // 字数统计插件
  import 'tinymce/plugins/colorpicker' // 选择颜色插件
  import 'tinymce/plugins/textcolor' // 文本颜色插件
  import 'tinymce/plugins/fullscreen' // 全屏 */
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
// import 'tinymce/plugins/autosave'
// import 'tinymce/plugins/bbcode'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'
// import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/legacyoutput'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
// import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
// import 'tinymce/plugins/quickbars'
// import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/tabfocus'
// import 'tinymce/plugins/spellchecker' // 拼写检查
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/textpattern'
// import 'tinymce/plugins/toc'
// import 'tinymce/plugins/visualblocks'
// import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
// import 'tinymce/plugins/emoticons'
// import 'tinymce/plugins/bdmap'
// import 'tinymce/plugins/indent2em'
import { mapState } from 'vuex'
// 获取接口根路径
import { API as configApi } from '@/conf/'
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

export default {
  name: 'editor',
  props: {
    value: String,
    disabled: Boolean, // 您可以将编辑器动态设置为“禁用”只读模式或进入正常的可编辑模式。
    id: String, // 编辑器的id，以便稍后使用tinymce.get('ID')的方法获取实例，默认为自动生成的uuid。
    init: { // 发送到tinymce.init用于初始化编辑器的方法的对象。
      type: Object,
      default () {
        return {}
      }
    },
    initialValue: String, // 初始化编辑器的初始值（不会双向绑定）
    inline: Boolean, // 设置编辑器应该内联的简写，与init中的<tinymce-editor inline></tinymce-editor>设置相同{inline: true}。
    tagName: String, // 仅在编辑器内联时使用，决定初始化编辑器的元素，默认为div。
    plugins: String, // 设置要使用的插件的简写，与init中的<tinymce-editor plugins="foo bar"></tinymce-editor>设置相同{plugins: 'foo bar'}。
    modelEvents: String, // 更改要触发v模型事件的事件，默认为'change keyup'。
    toolbar: String // toolbar：设置要显示的工具栏项的简写，与init中的<tinymce-editor toolbar="foo bar"></tinymce-editor>设置相同{toolbar: 'foo bar'}
  },
  components: {
    Editor
  },
  data () {
    return {
      nowId: 'tinymce' + new Date().getTime(),
      reload: true // 用于控制重新加载组件
    }
  },
  mounted () {
    tinymce.init({})
    tinymce.get(this.realId).on('input change', function (event, editor) {
      console.log(event)
      console.log(editor)
    })
  },
  computed: {
    ...mapState({
      lang: state => state.common.language
    }),
    tinymceHtml: { // 输入的内容
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    realInit () { // 初始化配置
      return {
        language_url: this.lang === 'en_US' ? undefined : `/tinymce/langs/${this.lang || 'zh_CN'}.js`, // 导入语言文件
        // language_url: '/tinymce/langs/zh_CN.js', // 导入语言文件
        language: this.lang === 'en_US' ? undefined : (this.lang || 'zh_CN'), // 语言设置
        // language: 'zh_CN', // 语言设置
        disabled: false, // 禁用
        skin_url: '/tinymce/skins/ui/oxide', // 主题样式
        menubar: false, // 隐藏最上方menu菜单
        // toolbar: true,//false禁用工具栏（隐藏工具栏）
        min_height: 340,
        browser_spellcheck: true, // 拼写检查
        branding: false, // 去水印
        statusbar: false, // 隐藏编辑器底部的状态栏
        elementpath: false, // 禁用下角的当前标签路径
        paste_data_images: true, // 允许粘贴图像
        importcss_append: true, // 样式兼容
        image_advtab: true,
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
        // plugins: 'image imagetools',
        plugins: 'print preview searchreplace autolink directionality fullscreen image link media template code codesample table charmap hr pagebreak anchor insertdatetime advlist lists wordcount imagetools textpattern help paste autoresize colorpicker contextmenu importcss legacyoutput noneditable tabfocus textcolor',
        // toolbar: ['newdocument undo redo | formatselect visualaid|cut copy paste selectall| bold italic underline strikethrough |codeformat blockformats| superscript subscript  | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent |  removeformat ', 'code  bullist numlist | lists image media table link |fullscreen help toc fullpage restoredraft nonbreaking insertdatetime visualchars visualblocks searchreplace spellchecker pagebreak anchor charmap  pastetext print preview hr'],
        toolbar: 'fullscreen preview print code wordcount searchreplace | undo redo | bold italic forecolor backcolor underline strikethrough | link table image media anchor codesample template | alignleft aligncenter alignright alignjustify outdent indent | cut copy paste pastetext  | formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | charmap hr pagebreak insertdatetime | help',
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif',
        // 为内容模板插件提供预置模板
        templates: [
          { title: '模板1', description: '介绍文字1', content: '模板内容' },
          { title: '模板2', description: '介绍文字2', content: '<div class="mceTmpl"><span class="cdate">CDATE</span>，<span class="mdate">MDATE</span>，我的内容</div>' }
        ],
        //
        template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
        images_upload_handler: (blobInfo, succFun, failFun) => { // 重写图片上传的逻辑！！！！！！！！！！！！！！！！！！！！！！！！ http://tinymce.ax-z.cn/general/upload-images.php
          let uploadUrl = BASE_PATH['UCC']
          uploadUrl += '/njdf_upload?DIR=editor'
          var xhr, formData
          // var file = blobInfo.blob()// 转化为易于理解的file对象
          xhr = new XMLHttpRequest()
          xhr.withCredentials = false
          xhr.open('POST', uploadUrl)
          xhr.onload = function () {
            var json
            if (xhr.status !== 200) {
              failFun('HTTP Error: ' + xhr.status)
              return
            }
            json = JSON.parse(xhr.responseText)
            if (!json || json[0].flag !== 'true') {
              failFun('Invalid JSON: ' + xhr.responseText)
              return
            }
            succFun(json[0].data[0].FILEVIEWURL)
          }
          formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename())// 此处与源文档不一样
          xhr.send(formData)
          // succFun('data:image/jpeg;base64,' + blobInfo.base64())
        },
        placeholder: this.$t('写点什么吧！'),
        ...this.init
      }
    },
    realId () { // 富文本编辑器的id
      return this.id || this.nowId
    }
  },
  methods: {
    onActivate (event, editor) {
      this.$emit('activate', event, editor)
    },
    onAddUndo (event, editor) {
      this.$emit('addUndo', event, editor)
    },
    onBeforeAddUndo (event, editor) {
      this.$emit('beforeAddUndo', event, editor)
    },
    onBeforeExecCommand (event, editor) {
      this.$emit('beforeExecCommand', event, editor)
    },
    onBeforeGetContent (event, editor) {
      this.$emit('beforeGetContent', event, editor)
    },
    onBeforeRenderUI (event, editor) {
      this.$emit('beforeRenderUI', event, editor)
    },
    onBeforeSetContent (event, editor) {
      this.$emit('beforeSetContent', event, editor)
    },
    onBeforePaste (event, editor) {
      this.$emit('beforePaste', event, editor)
    },
    onBlur (event, editor) {
      this.$emit('blur', event, editor)
    },
    onChange (event, editor) {
      this.$emit('change', event, editor)
    },
    onClearUndos (event, editor) {
      this.$emit('clearUndos', event, editor)
    },
    onClick (event, editor) {
      this.$emit('click', event, editor)
    },
    onContextMenu (event, editor) {
      this.$emit('contextMenu', event, editor)
    },
    onCopy (event, editor) {
      this.$emit('copy', event, editor)
    },
    onCut (event, editor) {
      this.$emit('cut', event, editor)
    },
    onDblclick (event, editor) {
      this.$emit('dblclick', event, editor)
    },
    onDeactivate (event, editor) {
      this.$emit('deactivate', event, editor)
    },
    onDirty (event, editor) {
      this.$emit('dirty', event, editor)
    },
    onDrag (event, editor) {
      this.$emit('drag', event, editor)
    },
    onDragDrop (event, editor) {
      this.$emit('dragDrop', event, editor)
    },
    onDragEnd (event, editor) {
      this.$emit('dragEnd', event, editor)
    },
    onDragGesture (event, editor) {
      this.$emit('dragGesture', event, editor)
    },
    onDragOver (event, editor) {
      this.$emit('dragOver', event, editor)
    },
    onDrop (event, editor) {
      this.$emit('drop', event, editor)
    },
    onExecCommand (event, editor) {
      this.$emit('execCommand', event, editor)
    },
    onFocus (event, editor) {
      this.$emit('focus', event, editor)
    },
    onFocusIn (event, editor) {
      this.$emit('focusIn', event, editor)
    },
    onFocusOut (event, editor) {
      this.$emit('focusOut', event, editor)
    },
    onGetContent (event, editor) {
      this.$emit('getContent', event, editor)
    },
    onHide (event, editor) {
      this.$emit('hide', event, editor)
    },
    onInit (event, editor) {
      this.$emit('init', event, editor)
    },
    onKeyDown (event, editor) {
      this.$emit('keyDown', event, editor)
    },
    onKeyPress (event, editor) {
      this.$emit('keyPress', event, editor)
    },
    onKeyUp (event, editor) {
      this.$emit('keyUp', event, editor)
    },
    onLoadContent (event, editor) {
      this.$emit('loadContent', event, editor)
    },
    onMouseDown (event, editor) {
      this.$emit('mouseDown', event, editor)
    },
    onMouseEnter (event, editor) {
      this.$emit('mouseEnter', event, editor)
    },
    onMouseLeave (event, editor) {
      this.$emit('mouseLeave', event, editor)
    },
    onMouseMove (event, editor) {
      this.$emit('mouseMove', event, editor)
    },
    onMouseOut (event, editor) {
      this.$emit('mouseOut', event, editor)
    },
    onMouseOver (event, editor) {
      this.$emit('mouseOver', event, editor)
    },
    onMouseUp (event, editor) {
      this.$emit('mouseUp', event, editor)
    },
    onNodeChange (event, editor) {
      this.$emit('nodeChange', event, editor)
    },
    onObjectResizeStart (event, editor) {
      this.$emit('objectResizeStart', event, editor)
    },
    onObjectResized (event, editor) {
      this.$emit('objectResized', event, editor)
    },
    onObjectSelected (event, editor) {
      this.$emit('objectSelected', event, editor)
    },
    onPaste (event, editor) {
      this.$emit('paste', event, editor)
    },
    onPostProcess (event, editor) {
      this.$emit('postProcess', event, editor)
    },
    onPostRender (event, editor) {
      this.$emit('postRender', event, editor)
    },
    onPreProcess (event, editor) {
      this.$emit('preProcess', event, editor)
    },
    onProgressState (event, editor) {
      this.$emit('progressState', event, editor)
    },
    onRedo (event, editor) {
      this.$emit('redo', event, editor)
    },
    onRemove (event, editor) {
      this.$emit('remove', event, editor)
    },
    onReset (event, editor) {
      this.$emit('reset', event, editor)
    },
    onSaveContent (event, editor) {
      this.$emit('saveContent', event, editor)
    },
    onSelectionChange (event, editor) {
      this.$emit('selectionChange', event, editor)
    },
    onSetAttrib (event, editor) {
      this.$emit('setAttrib', event, editor)
    },
    onSetContent (event, editor) {
      this.$emit('setContent', event, editor)
    },
    onShow (event, editor) {
      this.$emit('show', event, editor)
    },
    onSubmit (event, editor) {
      this.$emit('submit', event, editor)
    },
    onUndo (event, editor) {
      this.$emit('undo', event, editor)
    },
    onVisualAid (event, editor) {
      this.$emit('visualAid', event, editor)
    }
  },
  watch: {
    lang (val) {
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    }
  }
}
// 所有支持的事件
// onActivate
// onAddUndo
// onBeforeAddUndo
// onBeforeExecCommand
// onBeforeGetContent
// onBeforeRenderUI
// onBeforeSetContent
// onBeforePaste
// onBlur
// onChange
// onClearUndos
// onClick
// onContextMenu
// onCopy
// onCut
// onDblclick
// onDeactivate
// onDirty
// onDrag
// onDragDrop
// onDragEnd
// onDragGesture
// onDragOver
// onDrop
// onExecCommand
// onFocus
// onFocusIn
// onFocusOut
// onGetContent
// onHide
// onInit
// onKeyDown
// onKeyPress
// onKeyUp
// onLoadContent
// onMouseDown
// onMouseEnter
// onMouseLeave
// onMouseMove
// onMouseOut
// onMouseOver
// onMouseUp
// onNodeChange
// onObjectResizeStart
// onObjectResized
// onObjectSelected
// onPaste
// onPostProcess
// onPostRender
// onPreProcess
// onProgressState
// onRedo
// onRemove
// onReset
// onSaveContent
// onSelectionChange
// onSetAttrib
// onSetContent
// onShow
// onSubmit
// onUndo
// onVisualAid
</script>

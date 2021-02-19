import hljs from 'highlight.js'
hljs.configure({ // optionally configure hljs
  languages: ['javascript', 'ruby', 'python']
})
export default {
  computed: {
    defaultOptions () {
      let vm = this
      return {
        theme: 'snow',
        boundary: document.body,
        modules: {
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          },
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
            handlers: {
              // 重写插入图片逻辑
              image: function (range, context) {
                let fileInput = this.container.querySelector('input.ql-image')
                let quill = this.quill
                if (fileInput == null) {
                  fileInput = document.createElement('input')
                  fileInput.setAttribute('type', 'file')
                  fileInput.setAttribute('accept', 'image/*')
                  fileInput.classList.add('ql-image')
                  fileInput.addEventListener('change', function () {
                    if (fileInput.files != null && fileInput.files[0] != null) {
                      var formData = new FormData()
                      formData.append('file', fileInput.files[0])
                      // 将图片上传到自己的服务器！！！！！！！！！！！！！！！！！！！
                      /* $.ajax({
                        url: '/news/upload',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                          var data = eval('(' + data + ')')
                          var range = quill.getSelection()
                          quill.insertEmbed(range.index, 'image', '<?php echo $url?>' + data.data)
                        }
                      }) */
                      vm.loading = true
                      setTimeout(() => {
                        quill.insertEmbed(range.index_bak, 'image', 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2603513838,795541811&fm=26&gp=0.jpg')
                        vm.loading = false
                      }, 1000)
                    }
                  })
                  this.container.appendChild(fileInput)
                }
                fileInput.click()
              }
            }
          },
          imageDrop: true
        },
        placeholder: window.app.$t('写点什么吧！'),
        readOnly: false
      }
    }
  }
}

'use strict'

import encrypt from '@/utils/encrypt'
export default {
  data () {
    return {
      exportDialogVisible: false, // 导出弹框的可见性
      exportFormData: { // 导出表单绑定的数据
        fileName: '', // 导出文件的标题
        exportColumns: '' // 要导出的列集合
      },
      exportRules: { // 导出表单的校验规则
        fileName: { required: true, message: this.$t('请填写导出的文件名，长度为 1 到 30'), min: 1, max: 30 },
        exportColumns: { required: true, message: this.$t('请勾选要导出的列') }
      }
    }
  },
  methods: {
    handleExport () {
      this.refresh((result) => { // 导出之前要先进行一次数据刷新
        if (result.code === '0') { // 刷新成功
          this.exportFormData.exportColumns = this.showColumns
          this.exportFormData.fileName = this.title
          this.exportDialogVisible = true
        }
      })
    },
    exportExcel () {
      this.$refs.exportForm.validate((result) => {
        if (result) {
          let data = {
            'reqStr': {
              'req': [{
                ...this.req[0],
                'page': 1,
                'rows': 10,
                'pageoffset': 1,
                'pagecount': 1000000,
                'menuId': '1303',
                'totalRow': '' + this.total
              }]
            },
            'columns': this.exportFormData.exportColumns.split(','),
            'configInfo': {
              'pageInfo': {
                'pageNum': 1,
                'totalRowNum': 100000,
                'totalPageNum': 1000,
                'pageSize': -1,
                'startRowNum': 0,
                'endRowNum': -1
              },
              'reportConfig': {
                'page': {
                  'PageSize': 'A4',
                  'direction': 'vertical',
                  'width': 0,
                  'height': 0,
                  'align': 'left',
                  'leftMargin': 1.27,
                  'rightMargin': 1.27,
                  'topMargin': 0.5,
                  'bottomMargin': 1.27
                },
                'fonts': {
                  'header': {
                    'printable': true,
                    'font': '宋体',
                    'size': 8,
                    'bold': true,
                    'italic': false
                  },
                  'footer': {
                    'printable': true,
                    'font': '宋体 ',
                    'size': 8,
                    'bold': true,
                    'italic': false
                  },
                  'title': {
                    'printable': true,
                    'font': '宋体',
                    'size': 12,
                    'bold': true,
                    'italic': false
                  },
                  'subtitle': {
                    'printable': true,
                    'font': '宋体',
                    'size': 8,
                    'bold': false,
                    'italic': false
                  },
                  'datatitle': {
                    'printable': true,
                    'font': '宋体',
                    'size': 8,
                    'bold': false,
                    'italic': false
                  },
                  'data': {
                    'printable': true,
                    'font': '宋体',
                    'size': 8,
                    'bold': false,
                    'italic': false
                  }
                }
              },
              'searchParam': {},
              'userName': '王勇',
              'orgName': ''
            },
            'Datas': '',
            'exportType': 'xls',
            'isPrint': false,
            'implType': '',
            'title': '导出',
            'fileName': this.exportFormData.fileName,
            'langCode': 'zh_CN'
          }
          console.log('daochu')
          let dataStr = "<?xml version='1.0' encoding='UTF-8'?><requests>" + JSON.stringify(data) + '</requests>'
          let encryptStr = encrypt(dataStr)
          var oReq = new XMLHttpRequest()
          oReq.open('POST', 'http://localhost:8916/ucc_server/njdf_export', true)
          // 设置POST请求的请求头
          oReq.setRequestHeader('Content-Type'
            , 'application/x-www-form-urlencoded;charset=UTF-8')
          oReq.responseType = 'blob'

          if (data.exportType === 'xls') {
            data.exportType = 'xlsx'
          }

          oReq.onload = function (oEvent) {
            if (this.status === 200) {
              var content = oReq.response
              if (oReq.getResponseHeader('ERROR-CODE')) {
                try {
                  alert(eval("'" + oReq.getResponseHeader('ERROR-MSG') + "'"))
                } catch (e) {
                  alert(oReq.getResponseHeader('ERROR-MSG'))
                }
                return
              }
              var elink = document.createElement('a')
              elink.download = data.fileName + '.' + data.exportType
              elink.style.display = 'none'
              var blob = new Blob([content])
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              document.body.removeChild(elink)
            }
          }
          oReq.send('export=' + encryptStr)
        }
      })
    }
  }
}

<template lang="pug">
  .wrap
    .box-body(style="display: flex;")
      .menu
        .menu-title {{ $t('设置分类') }}
        .menu-con
          njs-anchor(show-ink container="#sys-setting-wrap" :affix="false" :bounds="200" v-if="paramList.length")
            njs-anchorLink(v-for="param in params" :key="`#sys-setting-${param.type}`" :href="`#sys-setting-${param.type}`" :title="param.typeName" v-if="param.params.length")
              njs-anchorLink(v-for="item in param.params" :key="`#sys-setting-${item.PARAM_CODE}`" :href="`#sys-setting-${item.PARAM_CODE}`" :title="item.PARAM_NAME")
      .form-wrap
        .from-title {{ $t('系统设置') }}
        njs-form(:model="formData" ref="settingForm" label-position="top").form
          #sys-setting-wrap(style="height: 100%; overflow-y: auto;")
            .settingpart(v-for="param in params" v-if="param.params.length" :key="`sys-setting-${param.type}`")
              .settingtitle(:id="`sys-setting-${param.type}`") {{ param.typeName }}
              .settingitem(v-for="item in param.params" :id="`sys-setting-${item.PARAM_CODE}`"  :key="`sys-setting-${item.PARAM_CODE}`")
                njs-form-item(:label="item.PARAM_NAME" :prop="item.PARAM_CODE" :rules="rule")
                  njs-input(v-if="item.ASS_TYPE === '1'" size="small" v-model="formData[item.PARAM_CODE]" @blur="commitChangeParam(formData[item.PARAM_CODE], item.PARAM_CODE, item)")
                  njs-radio-group(v-if="item.ASS_TYPE === '2'" v-model="formData[item.PARAM_CODE]" @change="commitChangeParam(formData[item.PARAM_CODE], item.PARAM_CODE, item)" :dict="item.DICT_CODE")
                  njs-combobox(v-if="item.ASS_TYPE === '3'" size="small" v-model="formData[item.PARAM_CODE]" @change="commitChangeParam(formData[item.PARAM_CODE], item.PARAM_CODE, item)" :dict="item.DICT_CODE" :clearable="false")
                .setting-item-des(v-if="item.PARAM_DESC") {{ $t('说明：') + item.PARAM_DESC }}
</template>

<script>
export default {
  name: 'system.setting',
  data () {
    return {
      paramList: [], // 可设置的系统参数集合
      formData: {},
      rule: [
        { required: true, message: this.$t('请录入参数值'), trigger: 'change' },
        {
          validator: (rule, value, callback) => {
            if (value) {
              let dict = this.$store.getters.getDict(this.paramList.find(param => {
                return param.PARAM_CODE === rule.field
              }).DICT_CODE)
              if (dict.some((item) => {
                return item.DICT_ITEM === value
              })) {
                callback()
              } else {
                let dictItems = ''
                dict.forEach((item, index) => {
                  if (index === 0) {
                    dictItems += item.DICT_ITEM
                  } else {
                    dictItems += `,${item.DICT_ITEM}`
                  }
                })
                callback(new Error(this.$t('只能输入下列值之一：') + dictItems))
              }
            } else {
              callback()
            }
          },
          trigger: 'change' }
      ]
    }
  },
  methods: {
    commitChangeParam (val, field, sysParam) {
      this.$refs.settingForm.validateField(field, (result) => {
        if (!result) {
          if (val === sysParam.PARAM_VAL) {
            return
          }
          console.log('commit' + field, val)
          this.$ajaxRequest([{
            service: 'P0103303',
            PARAM_CODE: field,
            PARAM_VAL: val,
            mask: true
          }]).then(result => {
            if (result.code) {
              this.$message({
                type: 'success',
                message: this.$t('设置成功！')
              })
              sysParam.PARAM_VAL = val
            }
          })
        }
      })
    }
  },
  created () {
    this.$ajaxRequest([{
      page: 1,
      pagecount: 1000,
      pageoffset: 1,
      rows: 1,
      LSE_ID: this.$store.getters.g_user.LSE_ID || '',
      service: 'P0103401'
    }]).then((result) => {
      if (result.code === '0') {
        this.paramList = result.data.filter((item) => { // 开放给租户的系统参数
          // return true
          return item.IS_OPEN_USER === '1'
        })
        console.log('setting paramList', this.paramList)
        this.paramList.forEach(item => {
          this.$set(this.formData, item.PARAM_CODE, item.PARAM_VAL)
        })
      }
    })
  },
  computed: {
    params () {
      let allType = this.$store.getters.getDict('PARAM_TYPE')
      let params = allType.map((item) => {
        return {
          type: item.DICT_ITEM,
          typeName: item.DICT_ITEM_NAME,
          params: []
        }
      })
      this.paramList.forEach((item) => {
        let typeParams = params.find((type) => {
          return type.type === item.PARAM_TYPE
        })
        typeParams && typeParams.params.push(item)
      })
      return params
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl";
</style>

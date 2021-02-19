<template lang="pug">
  ElForm(
    ref="elForm"
    :model="model"
    :rules="rules"
    :labelPosition="labelPosition"
    :labelWidth="labelWidth"
    :labelSuffix="labelSuffix"
    :inline="inline"
    :inlineMessage="inlineMessage"
    :statusIcon="statusIcon"
    :showMessage="showMessage"
    :size="size"
    :disabled="disabled"
    :validateOnRuleChange="validateOnRuleChange"
    :hideRequiredAsterisk="hideRequiredAsterisk"
    @validate="validateEvent"
  )
    slot
    njs-form-item(v-if="service && (showSubmit || showReset)")
      njs-button(v-if="showSubmit" type='primary', @click="submit") {{submitText||$t('提交')}}
      njs-button(v-if="showReset" @click="resetFields") {{resetText||$t('重置')}}
      slot(name="button")
</template>

<script>
import ElForm from 'element-ui/packages/form/src/form'
export default {
  name: 'njs-form',
  components: {
    ElForm
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: Object,
    labelPosition: String,
    labelWidth: {
      type: String,
      default: 'auto'
    },
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    service: String, // 接口号
    showSubmit: {
      type: Boolean,
      default: true
    }, // 是否隐藏默认生成的提交按钮
    showReset: {
      type: Boolean,
      default: true
    }, // 是否隐藏默认生成的重置按钮
    submitText: String, // 默认生成的提交按钮的描述文字
    resetText: String // 默认生成的重置按钮的描述文字
  },
  computed: {
    req () {
      let reqObj = JSON.parse(JSON.stringify(this.model))
      return [{
        service: this.service,
        ...reqObj
      }]
    }
  },
  methods: {
    resetFields () {
      this.$refs.elForm.resetFields()
    },
    clearValidate (props = []) {
      this.$refs.elForm.clearValidate(props)
    },
    validate (callback) {
      this.$refs.elForm.validate(callback)
    },
    validateField (props, cb) {
      this.$refs.elForm.validateField(props, cb)
    },
    validateEvent (param1, param2, param3) {
      this.$emit('validate', param1, param2, param3)
    },
    // 默认的提交方法
    async submit (params) {
      if (this.service) {
        let valid
        try {
          valid = await this.$refs.elForm.validate()
        } catch (e) {
        }
        if (valid) {
          let submitBeforeCallback
          let req = JSON.parse(JSON.stringify(this.req))
          if (params) { // 附加请求参数
            req[0] = {
              ...req[0],
              ...params
            }
          }
          this.$emit('before-submit', JSON.parse(JSON.stringify(req)), (val) => {
            submitBeforeCallback = val
          })
          if (submitBeforeCallback === undefined) {
            let promise = this.$ajaxRequest(req)
            promise.then((result) => {
              if (result.code === '0') { // 提交成功
                this.$emit('submit-success', result)
              } else { // 提交失败
                this.$emit('submit-fail', result)
              }
            }).catch((err) => { // 提交失败
              this.$emit('submit-fail', err)
            })
            return promise
          } else {
            if (submitBeforeCallback !== false) {
              let promise = this.$ajaxRequest(submitBeforeCallback)
              promise.then((result) => {
                if (result.code === '0') { // 提交成功
                  this.$emit('submit-success', result)
                } else { // 提交失败
                  this.$emit('submit-fail', result)
                }
              }).catch((err) => { // 提交失败
                this.$emit('submit-fail', err)
              })
              return promise
            }
          }
        } else {
          return new Promise((resolve, reject) => {
            resolve({
              msg: this.$t('表单校验未通过')
            })
          })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>

<template lang="pug">
  DatePicker(
    v-model="bindValue"
    ref="datePicker"
    :value-format="valueFormat"
    :readonly="readonly"
    :disabled="disabled"
    :editable="editable"
    :clearable="clearable"
    :size="size"
    :placeholder="placeholder"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :type="type"
    :format="valueFormat"
    :align="align"
    :popper-class="popperClass"
    :picker-options="pickerOptions"
    :range-separator="rangeSeparator"
    :default-value="defaultValue"
    :default-time="defaultTime"
    :name="name"
    :unlink-panels="unlinkPanels"
    :prefix-icon="prefixIcon"
    :clear-icon="clearIcon"
    :validate-event="validateEvent"
    @change="handleChage"
    @blur="handleBlur"
    @focus="handleFocus"
  )
</template>

<script>
import { DatePicker } from 'element-ui'
export default {
  name: 'njs-date-picker',
  components: {
    DatePicker
  },
  props: {
    value: String,
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    size: String,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    type: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    align: {
      type: String,
      default: 'left'
    },
    popperClass: String,
    pickerOptions: {
      type: Object,
      default () {
        return {}
      }
    },
    rangeSeparator: {
      type: String,
      default: '-'
    },
    defaultValue: Date,
    defaultTime: [String, Array],
    name: String,
    unlinkPanels: {
      type: Boolean,
      default: false
    },
    prefixIcon: {
      type: String,
      default: 'el-icon-date'
    },
    clearIcon: {
      type: String,
      default: 'el-icon-circle-close'
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    bindValue: {
      get () {
        let val = this.value
        if (val) {
          let valArr = val.split(',')
          if (valArr.length === 1) {
            return val
          } else {
            return valArr
          }
        }
      },
      set (val) {
        if (val instanceof Array) {
          this.$emit('input', val.join(','))
        } else {
          this.$emit('input', val)
        }
      }
    },
    // 值的格式
    // eslint-disable-next-line vue/return-in-computed-property
    valueFormat () {
      switch (this.type) {
        case 'year':
          return 'yyyy'
        case 'month':
          return 'MM'
        case 'date':
          return 'yyyy-MM-dd'
        case 'dates':
          return 'yyyy-MM-dd'
        case 'week':
          return 'yyyy-WW'
        case 'datetime':
          return 'yyyy-MM-dd HH:mm:ss'
        case 'datetimerange':
          return 'yyyy-MM-dd HH:mm:ss'
        case 'daterange':
          return 'yyyy-MM-dd'
        case 'monthrange':
          return 'yyyy-MM'
      }
    }
  },
  methods: {
    handleChage () {
      this.$emit('change', this.bindValue)
    },
    handleBlur () {
      this.$emit('blur')
    },
    handleFocus () {
      this.$emit('focus')
    },
    focus () {
      this.$refs.datePicker.focus()
    }
  }
}
</script>

<style scoped>

</style>

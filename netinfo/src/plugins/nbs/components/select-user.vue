<template lang="pug">
  njs-auto-complete(
    v-model="bindValue"
    service="P0201401"
    search-key="QUERY_TEXT"
    service-data-value="USER_CODE"
    service-data-label="USER_CODE,USER_NAME"
    :query="query"
    :disabled="disabled"
    :size="size"
    :clearable="clearable"
    :placeholder='placeholder'
    clearable
    @change="handleChange"
    @visible-change="handleVisChange"
    @clear="handleClear"
    @blur="handleBlur"
    @focus="handleFocus"
    ref="autoComplete"
  )
</template>

<script>
export default {
  name: 'nbs-select-user',
  props: {
    value: String,
    query: {
      type: Object,
      default () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: String,
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: String
  },
  computed: {
    bindValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    focus () {
      this.$refs.autoComplete.focus()
    },
    blur () {
      this.$refs.autoComplete.blur()
    },
    handleChange (val) {
      this.$emit('change', val)
    },
    handleVisChange (val) {
      this.$emit('visible-change', val)
    },
    handleClear () {
      this.$emit('clear')
    },
    handleBlur ($event) {
      this.$emit('blur', $event)
    },
    handleFocus ($event) {
      this.$emit('focus', $event)
    }
  }
}
</script>

<style scoped>

</style>

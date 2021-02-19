export default {
  username: [
    { required: true, message: window.app.$t('请输入用户名'), trigger: 'change' },
    { min: 1, max: 20, message: window.app.$t('长度在 1 到 20 个字符'), trigger: 'change' }
  ],
  password: [
    { required: true, message: window.app.$t('请输入密码'), trigger: 'change' }
  ]
}

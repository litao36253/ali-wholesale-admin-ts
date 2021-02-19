<template lang="pug">
  njs-dialog(:title="$t('修改个人资料')" :visible.sync="editperflieVisible" width="620px")
    njs-form(:model="formData" ref="updateUser"  service="P0201306" :rules="EditItemRules" :show-submit="false" :show-reset="false" v-if="editperflieVisible")
      .row
        .col-left
          njs-upload(accept="image/*" dir="userAvatar" class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload")
            .avatar-wrap
              img(:src="formData.USER_ICON" class="avatar")
              i(class="el-icon-edit avatar-uploader-icon")
        .col-right
          njs-form-item(prop="OFF_TEL" :label="$t('办公电话：')")
            njs-input(v-model= "formData.OFF_TEL")
          njs-form-item(prop="MOBILE" :label="$t('移动电话：')")
            njs-input(v-model= "formData.MOBILE")
          njs-form-item(prop="EMAIL" :label="$t('电子邮箱：')" type="email" )
            njs-input(v-model= "formData.EMAIL")
      njs-form-item(prop="REMARK" :label="$t('签名备注：')")
        njs-input(v-model= "formData.REMARK" type="textarea" :rows="4")
    template(slot="footer")
      njs-button(type="primary" @click="userinfo") {{ $t('保 存') }}
      njs-button(@click="editperflieVisible = false") {{ $t('关 闭') }}
</template>

<script>
import { validateTelephone, validateEmail, validateMobile } from '@/validator/common'
import { mapGetters } from 'vuex'
export default {
  name: 'c-update-info',
  props: {
    visible: Boolean
  },
  created () {
    this.formData = {
      USER_CODE: this.g_user.USER_CODE || '', // 用户编号
      // USER_NAME: this.g_user.USER_NAME || '', // 用户名称
      OFF_TEL: this.g_user.OFF_TEL || '', // 办公电话
      MOBILE: this.g_user.MOBILE || '', // 移动电话
      EMAIL: this.g_user.EMAIL || '', // 电子邮箱
      USER_ICON: this.g_user.USER_ICON || '', // 用户头像
      REMARK: this.g_user.ASIGN || '' // 签名备注
    }
  },
  data () {
    return {
      formData: {
        USER_CODE: '', // 用户编号
        // USER_NAME: '', // 用户名称
        OFF_TEL: '', // 办公电话
        MOBILE: '', // 移动电话
        EMAIL: '', // 电子邮箱
        USER_ICON: '', // 用户头像
        REMARK: '' // 签名备注
      },
      EditItemRules: {// 修改用户信息验证
        EMAIL: [
          { validator: validateEmail, trigger: ['blur', 'change'] }
        ],
        OFF_TEL: [
          { validator: validateTelephone, trigger: ['blur', 'change'] }
        ],
        MOBILE: [
          { validator: validateMobile, trigger: ['blur', 'change'] }
        ],
        REMARK: [
          { message: this.$t('输入的长度不能超过1000'), max: 1000, trigger: ['blur', 'change'] }
          // { max: 1000, message: this.$t('长度不能超过 1000'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    userinfo () {
      this.$refs.updateUser.submit().then((result) => {
        console.log(result)
        if (result.code === '0') {
          for (let key in this.formData) {
            this.$store.commit('M_USER_INFO', { key: key, val: this.formData[key] })
          }
          this.$message({
            type: 'success',
            message: this.$t('个人资料修改成功！')
          })
          this.editperflieVisible = false
        }
      })
    },
    handleAvatarSuccess (result, file) {
      this.formData.USER_ICON = file.FILEVIEWURL
    },
    beforeAvatarUpload (file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  },
  computed: {
    ...mapGetters(['g_user']),
    editperflieVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    g_user: {
      deep: true,
      handler (val) {
        this.formData = {
          USER_CODE: val.USER_CODE || '', // 用户编号
          // USER_NAME: val || '', // 用户名称
          OFF_TEL: val.OFF_TEL || '', // 办公电话
          MOBILE: val.MOBILE || '', // 移动电话
          EMAIL: val.EMAIL || '', // 电子邮箱
          USER_ICON: val.USER_ICON || '', // 用户头像
          REMARK: val.REMARK || '' // 签名备注
        }
      }
    }
  }
}
</script>

<style scoped>
  .row {
    display: flex;
  }
  .col-left {
    width: 170px;
    height: 160px;
    display: flex;
  }
  .col-right {
    flex: 1;
  }
  .avatar-wrap {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 6px;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
  .avatar-uploader-icon {
    font-size: 36px;
    color: #ffffff;
    width: 100%;
    height: 100%;
    line-height: 130px;
    text-align: center;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    left: 0;
    top: 0;
    display: none;
  }
  .avatar-wrap:hover .avatar-uploader-icon {
    display: block;
  }
</style>

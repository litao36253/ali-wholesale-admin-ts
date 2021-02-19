<template>
  <div class="errPage-wrap">
    <div class="errPage-container">
      <njs-button @click="back" icon='arrow-left' class="pan-back-btn">{{ $t('首页') }}</njs-button>
      <br/>
      <br/>
      <br/>
      <njs-row>
        <njs-col :span="12">
          <h1 class="text-jumbo text-ginormous">Oops!</h1><br/>
          <h2>{{ $t('你没有权限访问该页面') }}</h2><br/><br/>
          <h6>{{ $t('如有需要联系管理员') }}</h6><br/><br/>
          <ul class="list-unstyled">
            <li>{{ $t('或者你可以去:') }}</li>
            <li class="link-type"><a href="http://www.netinfosz.com/">{{ $t('随便逛逛') }}</a></li>
          </ul>
        </njs-col>
        <njs-col :span="12">
          <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
        </njs-col>
      </njs-row>
    </div>
  </div>
</template>

<script>
import errGif from '@/assets/images/401_images/401.gif'

export default {
  name: 'page401',
  data () {
    return {
      errGif: errGif + '?' + +new Date()
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .errPage-wrap
    width 100vw
    height 100vh
    background #fff
  .errPage-container {
    width: 800px;
    margin: auto;
    padding-top 100px
    .pan-back-btn {
      background: #008489;
      color: #fff;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>

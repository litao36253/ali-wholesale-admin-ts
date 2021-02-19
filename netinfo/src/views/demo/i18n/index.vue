2<template lang="pug">
    .container-wrap
        .title {{$t('i18n国际化示例')}}
        <!-- 系统菜单说明 -->
        njs-divider(content-position="left") 1.系统菜单标题i18n
        div(style="padding-left:40px;font-size:16px") 
            | 1.1 在routers文件里面配置菜单项的标题(title)属性
            br
            | 1.2 在zh_CN.js和en_US.js中添加键值对.(中文也需要添加)
            njs-row
                njs-col(:span="12")
                    .code-content
                        |{
                        .code   name: 'demo.i18n',
                        .code       path: 'i18n',
                        .code       meta: {
                        .code(style="color:red")        title: 'i18n国际化',
                        .code        ignoreAuth: true // 是否开放访问
                        .code        },
                        .code        component: resolve => require(['../views/demo/i18n'], resolve)
                        | }
                    .img-tip 图-1.1 routers文件配置实例
                njs-col(:span="12")
                        .code-content
                            |router: { // 路由的国际化词条
                            .code   
                            .code '星网信通': '星网信通',
                            .code '首页': '首页',
                            .code '岗位管理': '岗位管理',
                            .code '角色信息管理': '角色信息管理',
                            .code '员工资料管理': '员工资料管理',
                            .code '业务分组管理': '业务分组管理',
                            .code(style="color:red") 'i18n国际化': 'i18n国际化'
                            | }
                        .img-tip 图-1.2 zh_CN文件配置实例
        <!-- template 页面说明-->
        njs-divider(content-position="left") 2.template页面元素i18n
        div(style="padding-left:40px;font-size:16px") 
            span 2.1 元素属性,调用全局方法 
                b $t('')
            br
            span 2.2 普通文本,调用全局方法 
                b $t('')
            njs-row
                njs-col(:span="12")
                    .code-content
                        |&lt;template lang="pug"&gt;
                        .code njs-form(:label-position='labelPosition')
                            .code njs-form-item(label="
                                span.red $t('名称')
                                span " prop="name")
                                .code njs-input(v-model='formLabelAlign.name')
                        |...
                    .img-tip 图-2.1 元素属性实例
                njs-col(:span="12")
                    .code-content
                        | &lt;template lang="pug"&gt;
                        .code .container-wrap
                        .code.tab1  .title 
                            span.red {{getStaticTxt("$t('i18n国际化示例')")}}
                        |...
                    .img-tip 图-2.2 普通文本实例
        <!-- js代码说明 -->            
        njs-divider(content-position="left") 3.JavaScript代码字符i18n
        div(style="padding-left:40px;font-size:16px") 
            span 3.1 this指向为当前组件的情况: 
                b this.$t('')
                div(style='padding-left:22px') 如: create(),mounted(),methods等..
            br
            span 3.2 this不指向前组件的情况: 
                b window.app.$t('')
                div(style='padding-left:22px') 如: 静态校验对象实例
            njs-row
                njs-col(:span="12")
                    .code-content
                        | methods:{
                        .code saveData(){
                            .code this.$message.info(
                                span.red this.$t('选择的机构ID:')
                                span +this.org.ORG_ID)
                        .code },
                        |...
                    .img-tip 图-3.1 methods实例
                njs-col(:span="12")
                    .code-content
                        | &lt;script&gt;
                        .code import { validateEnNumUdl } from '@/validator/common'
                        .code const DICT_NAME_RULE = [
                        .code { max: 40, message: 
                            span.red window.app.$t('字典名称长度不能超过 40')
                            span , trigger: 'change' }
                        .code ] 
                        |...
                    .img-tip 图-3.2 静态校验对象实例
        br
        br
</template>
<script>
//njs-input(v-model="demoTxt1" type="textarea" rows="8" resize="none" readonly=true)
export default {
    name:'demo.i18n',
    data(){
        return {
            
        }
    },
    mounted(){
        
    },
    methods:{
        saveData(){
            this.$message.info(this.$t('选择的机构ID:')+this.org.ORG_ID)
        },
        getStaticTxt(txt){
            return "{{ "+txt+" }}";
        }
    }
}
</script>
<style lang="stylus" scoped>
.code-content
    font-size 16px
    background-color #444;
    color #ddd
    padding 10px
    border-radius 5px
    margin-right 30px
    .code 
        padding-left 20px
    .tab1
        padding-left 40px
    .tab1
        padding-left 60px
    .red
        color red
.img-tip
    margin-left 30%
    font-size 14px
    color #666
</style>


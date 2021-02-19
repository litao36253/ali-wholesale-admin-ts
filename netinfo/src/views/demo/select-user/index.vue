<template lang="pug">
    .container-wrap
        .title {{$t('员工选择框')}}
        njs-form(:model='user' style='padding: 30px;padding-bottom:0px')
            njs-form-item(:label='$t("请选择员工:")')
                nbs-select-user(
                    v-model='user.USER_CODE' 
                    placeholder="输入工号/姓名查询"
                    :disabled='disabled' 
                )
                njs-divider(direction='vertical')
                njs-button(type='primary' @click='saveData') {{$t('确定')}}
            njs-form-item(label='')
                njs-button(@click='disabled=disabled?false:true') {{disabled?$t('启用'):$t('禁用')}}
        
</template>
<script>
export default {
    name:'demo.select-user',
    data(){
        return {
            user:{USER_CODE:'1'},
            disabled:false, //是否禁用
        }
    },
    methods:{
        saveData(){
            this.$message.info(this.$t('选择的机构ID:')+this.user.USER_CODE)
        }
    }
}
</script>


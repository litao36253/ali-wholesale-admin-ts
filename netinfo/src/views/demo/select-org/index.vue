<template lang="pug">
    .container-wrap
        .title {{$t('机构选择框')}}
        njs-form(:model='org' style='padding: 30px;padding-bottom:0px')
            njs-form-item(:label='$t("请选择机构:")')
                nbs-select-org(
                    ref='selectOrg'
                    v-model='org.ORG_ID' 
                    size='medium' 
                    :query='{ORG_NAME:"广"}'   
                    :disabled='disabled' 
                    :multiple='multiple' 
                    :clearable='clearable'
                    :disabledItem='disabledItem'
                    :filterable='filterable'
                    @change='orgChange'
                )
                njs-divider(direction='vertical')
                njs-button(type='primary' @click='saveData') {{$t('确定')}}
            njs-form-item(label='')
                njs-button(@click='disabled=disabled?false:true') {{disabled?$t('启用'):$t('禁用')}}
                njs-divider(direction='vertical')
                njs-button(size='small' @click='multiple=multiple?false:true') {{multiple?$t('单选'):$t('多选')}}
                njs-divider(direction='vertical')
                njs-button(size='small' @click='clearable=clearable?false:true') {{!clearable?$t('可清除'):$t('不可清除')}}
                njs-divider(direction='vertical')
                njs-button(size='small' @click='filterable=filterable?false:true') {{!filterable?$t('可搜索'):$t('不可搜索')}}
                njs-divider(direction='vertical')
                njs-button(size='small' @click='disabledItem=org.ORG_ID') {{$t('禁用选项')}}
                njs-divider(direction='vertical')
                njs-button(size='small' @click='$refs.selectOrg.refresh()') {{$t('重新加载数据')}}
        
</template>
<script>
export default {
    name:'demo.select-org',
    data(){
        return {
            org:{},
            disabled:false, //是否禁用
            multiple:false, //是否多选
            clearable:true,  //是否可清除
            disabledItem:'', //禁用的节点
            filterable:false, //是否显示查询框
        }
    },
    methods:{
        saveData(){
            this.$message.info(this.$t('选择的机构ID:')+this.org.ORG_ID)
        },
        orgChange(val){
            this.$message.info(this.$t('机构变更:')+val);
        }
    }
}
</script>


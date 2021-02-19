<template lang="pug">
    .container-wrap-aside
        .box-body
            .menu
                .menu-title {{$t('Demo树')}} 
                .menu-con
                    njs-tree(service="P0401404" pid="PAR_ORG"   node-key='ORG_ID' label='ORG_CODE,ORG_NAME' @node-click="nodeClick"
                            :show-search="showSearch"   search-field="ORG_CODE,ORG_NAME" :placeholder="$t('按机构名称查找')"
                            :highlight-current="highlightCurrent"
                            :show-checkbox="showCheckbox"
                            :draggable="draggable"  @node-drop="nodeDrop"
                            )
                    div(style="margin-top:100px;border-top:solid 1px #aaa")
                        njs-button(@click="showSearch=showSearch?false:true") {{showSearch?'隐藏':'显示'}}搜索框
                        njs-button(@click="showCheckbox=showCheckbox?false:true") {{showCheckbox?'隐藏':'显示'}}多选框
                        div(style="padding-top:5px;")
                            njs-button(@click="draggable=draggable?false:true") {{draggable?'禁用':'启用'}}节点拖拽
                            njs-button(@click="highlightCurrent=highlightCurrent?false:true") {{highlightCurrent?'取消高亮':'高亮'}}当前选中节点
            .form-wrap
                .form-title {{$t('节点编辑')}}
                .form
                    njs-form( ref='editForm' :model="formObj" :rules='rules')
                        njs-form-item( :label='$t("节点名称")' prop='ORG_NAME')
                            njs-input(name='ORG_NAME' v-model="formObj.ORG_NAME")
                        njs-button(type='primary' size='medium' @click="saveNode") {{$t('保存')}}
</template>
<script>
export default {
    name:'demo.tree',
    data(){
        return {
            showSearch:false,           //是否显示搜索框
            highlightCurrent:false,     //是否高亮当前选中节点
            showCheckbox:false,         //是否显示多选框
            draggable:false,            //是否可拖拽节点
            formObj:{},
            rules:{
                ORG_NAME:[{required:true,message:this.$t('机构名称必填写!'),trigger:['blur','change']},
                {max:16,message:this.$t('名称长度最多16个字符.'),trigger:['blur']}]
            }
        }
    },
    methods:{
        nodeClick(nodeData,node,tree){//节点--点击事件
            this.formObj=nodeData
        },
        //fromNode 被拖拽的节点
        //toNode 拖拽的目的节点
        //direction fromNode位于toNode的位置:before/after/inner
        //event 事件
        nodeDrop(fromNode,toNode,direction,event){
            var directionTxt='';
            switch(direction){
                case 'before':directionTxt='前面';break;
                case 'after':directionTxt='后面';break;
                case 'inner':directionTxt='里面';break;
            }
            this.$message.info('('+fromNode.data.ORG_NAME+')被移动到('+toNode.data.ORG_NAME+')的'+directionTxt);
            console.log(event);

        },
        saveNode(){ //保存节点信息
            this.$refs.editForm.validate((result)=>{
                if(result){//校验通过
                    this.$ajaxRequest([{
                        ...this.formObj,    //将 formObj的所有属性放入request中
                        service: 'P0401302'
                    }]).then((result) => {
                        if (result.code === '0') {//保存成功
                            this.$message.success(this.$t('保存成功!'))
                        }
                    })
                }else{
                    this.$message.warning(this.$t('请完善节点信息!'))
                }
            })
            
        }
    }   
}
</script>


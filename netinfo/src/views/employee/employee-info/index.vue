<template lang="pug">
  .wrap(@click="enterCell = {USER_CODE: '', property: '', USER_STAT: '',row: {}}")
    njs-datagrid(
      datagrid-id="employee_info_P0405403"
      ref="datagrid"
      :title="$t('员工资料管理')"
      :subheading="$t('用于管理员及运维人员维护员工资料信息。')"
      service="P0405403"
      :rules="rules"
      auto-loading
      :button-list="btnList"
      :prev-button-list="['refresh','hideColumns','export']"
      multiple
    )
      <!-----------     列配置  start ---------------------------------------------------------- -->
      njs-column(prop="USER_CODE" :label="$t('员工编号')" sortable min-width="100")
      njs-column(prop="USER_NAME" :label="$t('员工名称')" show-overflow-tooltip sortable min-width="120")
      njs-column(prop="USER_ACCOUNT" :label="$t('员工账号')" min-width="120")
      njs-column(prop="USER_TYPE" :label="$t('员工类型')" min-width="120" dict="USER_TYPE")
      njs-column(prop="EXTERNAL_SYS_ACCOUNT" :label="$t('外部系统账号')" min-width="120")
      njs-column(prop="USER_STAT" :label="$t('员工状态')" min-width="100")
        template(slot-scope="{row, column}")
          span(v-show="row.USER_CODE !== enterCell.USER_CODE || enterCell.property !== column.property") {{ $store.getters.getDict('USER_STAT', row.USER_STAT) }}
          njs-button(v-show="row.USER_CODE !== enterCell.USER_CODE || enterCell.property !== column.property" type='text' icon="el-icon-edit" @click.stop="editUserState(row, column)")
          njs-combobox(:clearable="false" v-show="row.USER_CODE === enterCell.USER_CODE && enterCell.property === column.property" dict="USER_STAT" v-model="enterCell.USER_STAT" @change="handlerStateChange" @click.native.stop)
          <!--njs-button(v-show="row.USER_CODE === enterCell.USER_CODE && enterCell.property === column.property" type='text' icon="el-icon-close" @click="enterCell={USER_CODE: '', property: '', USER_STAT: ''}")-->
      njs-column(prop="ORG_NAME" :label="$t('所属机构')" min-width="100")
      njs-column(prop="ROLE_NAME_STR" :label="$t('员工角色')" show-overflow-tooltip min-width="100")
      njs-column(prop="GRP_NAME_STR" :label="$t('业务分组')" show-overflow-tooltip min-width="100")
      njs-column(prop="LAST_UPDATE_USER" :label="$t('最后更新人')" min-width="120")
      njs-column(prop="LAST_UPDATE_TIME" :label="$t('最后更新时间')" min-width="160")
      njs-column(:label="$t('操作')" min-width="220" fixed="right")
        template(slot-scope="{row}")
          njs-button(type="text" @click.stop="handlerDeatil(row)") {{$t('详情')}}
          njs-button(type="text" @click.stop="handlerUpdate(row)") {{$t('修改')}}
          njs-button(type="text" @click.stop="handlerPasswordReset(row)") {{$t('密码重置')}}
          njs-dropdown(style="margin-left: 12px;")
            njs-button(type="text") {{ $t('更多') }}
              i(class="el-icon-arrow-down el-icon--right")
            njs-dropdown-menu(slot="dropdown")
              njs-dropdown-item(@click.native.stop="handlerRoleSet(row)")
                njs-button(type="text") {{$t('角色分配')}}
              njs-dropdown-item(@click.native.stop="handlerBusinesGroupeSet(row)")
                njs-button(type="text") {{$t('业务组分配')}}
              njs-dropdown-item(@click.native.stop="handlerPermissionSet(row)" v-if="row.USER_CODE !== '1'")
                njs-button(type="text") {{$t('权限设置')}}
              njs-dropdown-item(@click.native.stop="handlerPermissionClone(row)" v-if="row.USER_CODE !== '1'")
                njs-button(type="text") {{$t('权限复制')}}
      <!-----------     列配置  end ---------------------------------------------------------- -->

      <!-----------     常用查询条件  start ---------------------------------------------------------- -->
      template(slot="more-used-query" slot-scope="{ formData }")
        njs-form-item(prop="USER_CODE")
          njs-input(v-model="formData.USER_CODE" :placeholder="$t('请输入员工编号')" clearable @keydown.13.native="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
        njs-form-item(prop="USER_STAT")
          njs-combobox(v-model="formData.USER_STAT" :placeholder="$t('请选择员工状态')"  dict="USER_STAT" clearable @keydown.native.13="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
        njs-form-item
          njs-button(@click="$refs.datagrid.refresh()" type="primary") {{$t('查询')}}
      <!-----------     常用查询条件  start ---------------------------------------------------------- -->
      template(slot="more-query" slot-scope="{ formData }")
        njs-row(:gutter="20")
          njs-col(:span='12')
            njs-form-item(prop="ROLE_CODE" :label="$t('用户角色')")
              njs-combobox(
                service="P0403404"
                service-data-value="ROLE_CODE"
                ref="roleCombobox"
                service-data-label="ROLE_CODE,ROLE_NAME"
                v-model="formData.ROLE_CODE"
              )
          njs-col(:span='12')
            njs-form-item(:label="$t('员工类型')" prop="USER_TYPE")
              njs-combobox(v-model="formData.USER_TYPE"  style='width: 100%;' dict="USER_TYPE")
        njs-row(:gutter="20")
          njs-col(:span='12')
            njs-form-item(prop="BIZ_GRP_ID" :label="$t('业务分组')")
              njs-combobox(
                service="P0404404"
                service-data-value="BIZ_GRP_ID"
                ref="roleCombobox"
                service-data-label="BIZ_GRP_ID,GRP_NAME"
                v-model="formData.BIZ_GRP_ID"
              )
          njs-col(:span='12')
            njs-form-item(:label="$t('所属机构')" prop="ORG_ID")
              nbs-select-org(v-model="formData.ORG_ID"  style='width: 100%;')
        div(style="border-bottom: 1px dashed rgba(232,232,232,1); margin-bottom:20px;")
        njs-row(:gutter="20")
          njs-col(:span='12')
            njs-form-item(:label="$t('联系电话')" prop="ATTN_TEL")
              njs-input(v-model="formData.ATTN_TEL")
          njs-col(:span='12')
            njs-form-item(:label="$t('联系邮箱')" prop="EMAIL")
              njs-input(v-model="formData.EMAIL")

      <!-- 右侧卡片的插槽 ------------------- start ---- lengxuejian -------------------------------------------- -->
      template(slot="fixed-card" slot-scope="{ formData }")
        njs-datagrid-card(:width="700" :title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
          .form-wrap
            njs-form(v-if="addEditVisible" :model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules"  @before-submit="handleAddBeforeSubmit")
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="USER_ACCOUNT" :label="$t('员工账号')")
                    njs-input(v-model="addEdit[addEditType].formData.USER_ACCOUNT" :disabled="addEditType === 'edit'")
                njs-col(:span='12')
                  njs-form-item(prop="USER_NAME" :label="$t('员工姓名')")
                    njs-input(v-model="addEdit[addEditType].formData.USER_NAME")
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="USER_ICON" :label="$t('员工头像')" v-if="addEditType === 'add'")
                    njs-input(v-model="addEdit[addEditType].formData.USER_ICON")
                njs-col(:span='12')
                  njs-form-item(prop="USER_PASS" :label="$t('员工密码')" v-if="addEditType === 'add'")
                    njs-input(v-model="addEdit[addEditType].formData.USER_PASS" type="password")
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="USER_TYPE" :label="$t('员工类型')")
                    njs-combobox(v-model="addEdit[addEditType].formData.USER_TYPE" dict="USER_TYPE")
                njs-col(:span='12')
                  njs-form-item(prop="LSE_ID" :label="$t('所属租户')")
                    nbs-select-lessee(v-model="addEdit[addEditType].formData.LSE_ID")
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="USER_SEX" :label="$t('员工性别')")
                    njs-radio-group(v-model="addEdit[addEditType].formData.USER_SEX" dict="SEX")
                njs-col(:span='12')
                  njs-form-item(prop="BIRTHDAY" :label="$t('出生日期')")
                    njs-date-picker(v-model="addEdit[addEditType].formData.BIRTHDAY" value-format="yyyy-MM-dd" style='width: 100%;')
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="USER_ID_TYPE" :label="$t('证件类型')")
                    njs-combobox(v-model="addEdit[addEditType].formData.USER_ID_TYPE" dict="ID_TYPE")
                njs-col(:span='12')
                  njs-form-item(prop="USER_ID" :label="$t('证件号码')")
                    njs-input(v-model="addEdit[addEditType].formData.USER_ID")
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="OPEN_DATE" :label="$t('入职日期')")
                    njs-date-picker(v-model="addEdit[addEditType].formData.OPEN_DATE" value-format="yyyy-MM-dd" style='width: 100%;')
                njs-col(:span='12')
                  njs-form-item(prop="USER_STAT" :label="$t('员工状态')")
                    njs-combobox(v-model="addEdit[addEditType].formData.USER_STAT" dict="USER_STAT")
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="EXTERNAL_SYS_ACCOUNT" :label="$t('外部账号')")
                    njs-input(v-model="addEdit[addEditType].formData.EXTERNAL_SYS_ACCOUNT")
                njs-col(:span='12')
                  njs-form-item(prop="OFF_TEL" :label="$t('办公电话')")
                    njs-input(v-model="addEdit[addEditType].formData.OFF_TEL")
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="MOBILE" :label="$t('移动电话')")
                    njs-input(v-model="addEdit[addEditType].formData.MOBILE")
                njs-col(:span='12')
                  njs-form-item(prop="EMAIL" :label="$t('用户邮箱')")
                    njs-input(v-model="addEdit[addEditType].formData.EMAIL")
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="BIZ_GRP_ID" :label="$t('业务分组')" v-if="addEditType === 'add'")
                    njs-combobox(
                      service="P0404404"
                      service-data-value="BIZ_GRP_ID"
                      ref="roleCombobox"
                      service-data-label="BIZ_GRP_ID,GRP_NAME"
                      v-model="addEdit[addEditType].formData.BIZ_GRP_ID"
                    )
                njs-col(:span='12')
                  njs-form-item(prop="ORG_ID" :label="$t('所属机构')")
                    nbs-select-org(v-model="addEdit[addEditType].formData.ORG_ID" style='width: 100%;')
              njs-row(:gutter="20")
                njs-col(:span='12')
                  njs-form-item(prop="ROLE_CODE" :label="$t('员工角色')" v-if="addEditType === 'add'")
                    njs-combobox(
                      service="P0403404"
                      service-data-value="ROLE_CODE"
                      ref="roleCombobox"
                      service-data-label="ROLE_CODE,ROLE_NAME"
                      v-model="addEdit[addEditType].formData.ROLE_CODE"
                    )
                njs-col(:span='12')
                  njs-form-item(prop="POST_ID" :label="$t('员工岗位')" v-if="addEditType === 'add'")
                    njs-combobox(
                      service="P0402404"
                      service-data-value="POST_ID"
                      ref="postCombobox"
                      service-data-label="POST_ID,POST_NAME"
                      v-model="addEdit[addEditType].formData.POST_ID"
                    )
          njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{$t('确定')}}
        //业务分组卡槽
        njs-datagrid-card(:visible.sync="userGrpShowCard" width="50%" hide-title :close-text="$t('取消')")
          njs-datagrid(
            datagrid-id="employee_userGrp_P0405406"
            service="P0405406"
            ref="userGrpDatagrid"
            :title="$t('业务分组分配')"
            :subheading="$t('管理 ') + '<span style=\"color: #f00;\">' + oldRow.USER_NAME + '</span>' + $t(' 的业务分组。')"
            @before-load="handleQueryUserGrpBeforeLoad"
            :auto-loading="true"
            :multiple="true"
            reserve-selection
            row-key="BIZ_GRP_ID"
            v-if="userGrpShowCard"
            @load-success="handleQueryUserGrpSuccess"
            :rules="userGrpRules"
          )
            njs-column(prop="BIZ_GRP_ID" :label="$t('分组编号')" sortable show-overflow-tooltip)
            njs-column(prop="GRP_NAME" :label="$t('分组名称')" sortable show-overflow-tooltip)
            njs-column(prop="GRP_PURP" :label="$t('分组用途')" sortable show-overflow-tooltip dict="GRP_PURP")
            template(slot="more-used-query" slot-scope="{ formData }")
              njs-form-item(prop="BIZ_GRP_ID")
                njs-input(v-model="formData.BIZ_GRP_ID" :placeholder="$t('请输入分组编号')" clearable @keydown.13.native="$refs.userGrpDatagrid.refresh()" @change="$refs.userGrpDatagrid.refresh()")
              njs-form-item(prop="GRP_NAME")
                njs-input(v-model="formData.GRP_NAME" :placeholder="$t('请选择分组名称')" clearable @keydown.native.13="$refs.userGrpDatagrid.refresh()" @change="$refs.userGrpDatagrid.refresh()")
              njs-form-item
                njs-button(@click="$refs.userGrpDatagrid.refresh()" type="primary") {{$t('查询')}}
          njs-button(type="primary" slot="footer" size="medium" @click="submitUserGrp") {{$t('保存')}}

          //角色分配卡槽
        njs-datagrid-card(:visible.sync="userRoleShowCard" width="50%" hide-title :close-text="$t('取消')")
          njs-datagrid(
            datagrid-id="employee_userRole_P0405408"
            service="P0405408"
            ref="userRoleDatagrid"
            :title="$t('角色分配')"
            :subheading="$t('管理 ') + '<span style=\"color: #f00;\">' + oldRow.USER_NAME + '</span>' + $t(' 的角色。')"
            @before-load="handleQueryUserRoleBeforeLoad"
            :multiple="true"
            auto-loading
            reserve-selection
            row-key="ROLE_CODE"
            v-if="userRoleShowCard"
            @load-success="handleQueryUserRoleSuccess"
            :rules="userRoleRules"
          )
            njs-column(prop="ROLE_CODE" :label="$t('角色编号')" sortable show-overflow-tooltip)
            njs-column(prop="ROLE_NAME" :label="$t('角色名称')" sortable show-overflow-tooltip)
            template(slot="more-used-query" slot-scope="{ formData }")
              njs-form-item(prop="ROLE_CODE")
                njs-input(v-model="formData.ROLE_CODE" :placeholder="$t('请输入角色编号')" clearable @keydown.13.native="$refs.userRoleDatagrid.refresh()" @change="$refs.userRoleDatagrid.refresh()")
              njs-form-item(prop="ROLE_NAME")
                njs-input(v-model="formData.ROLE_NAME" :placeholder="$t('请选择角色名称')" clearable @keydown.native.13="$refs.userRoleDatagrid.refresh()" @change="$refs.userRoleDatagrid.refresh()")
              njs-form-item
                njs-button(@click="$refs.userRoleDatagrid.refresh()" type="primary") {{$t('查询')}}
          njs-button(type="primary" slot="footer" size="medium" @click="submitUserRole") {{$t('保存')}}
        //业务分组批量分配卡槽
        njs-datagrid-card(:visible.sync="userGrpBatchShowCard" width="50%" hide-title :close-text="$t('取消')")
          njs-datagrid(
            datagrid-id="employee_userGrpBatch_P0404404"
            service="P0404404"
            ref="userGrpBatchDatagrid"
            :title="$t('业务分组批量分配')"
            :auto-loading="true"
            :multiple="true"
            reserve-selection
            row-key="BIZ_GRP_ID"
            v-if="userGrpBatchShowCard"
            :rules="userGrpRules"
          )
            njs-column(prop="BIZ_GRP_ID" :label="$t('分组编号')" sortable show-overflow-tooltip)
            njs-column(prop="GRP_NAME" :label="$t('分组名称')" sortable show-overflow-tooltip)
            njs-column(prop="GRP_PURP" :label="$t('分组用途')" sortable show-overflow-tooltip dict="GRP_PURP")
            template(slot="more-used-query" slot-scope="{ formData }")
              njs-form-item(prop="BIZ_GRP_ID")
                njs-input(v-model="formData.BIZ_GRP_ID" :placeholder="$t('请输入分组编号')" clearable @keydown.13.native="$refs.userGrpBatchDatagrid.refresh()" @change="$refs.userGrpBatchDatagrid.refresh()")
              njs-form-item(prop="GRP_NAME")
                njs-input(v-model="formData.GRP_NAME" :placeholder="$t('请选择分组名称')" clearable @keydown.native.13="$refs.userGrpBatchDatagrid.refresh()" @change="$refs.userGrpBatchDatagrid.refresh()")
              njs-form-item
                njs-button(@click="$refs.userGrpBatchDatagrid.refresh()" type="primary") {{$t('查询')}}
          njs-button(type="primary" slot="footer" size="medium" @click="submitUserGrpBatch") {{$t('保存')}}
          //角色分配卡槽
        njs-datagrid-card(:visible.sync="userRoleBatchShowCard" width="50%" hide-title :close-text="$t('取消')")
          njs-datagrid(
            datagrid-id="employee_userRoleBatch_P0403404"
            service="P0403404"
            ref="userRoleBatchDatagrid"
            :title="$t('角色批量分配')"
            :auto-loading="true"
            :multiple="true"
            reserve-selection
            row-key="ROLE_CODE"
            v-if="userRoleBatchShowCard"
            :rules="userRoleRules"
          )
            njs-column(prop="ROLE_CODE" :label="$t('角色编号')" sortable show-overflow-tooltip)
            njs-column(prop="ROLE_NAME" :label="$t('角色名称')" sortable show-overflow-tooltip)
            template(slot="more-used-query" slot-scope="{ formData }")
              njs-form-item(prop="ROLE_CODE")
                njs-input(v-model="formData.ROLE_CODE" :placeholder="$t('请输入角色编号')" clearable @keydown.13.native="$refs.userRoleDatagrid.refresh()" @change="$refs.userRoleDatagrid.refresh()")
              njs-form-item(prop="ROLE_NAME")
                njs-input(v-model="formData.ROLE_NAME" :placeholder="$t('请选择角色名称')" clearable @keydown.native.13="$refs.userRoleDatagrid.refresh()" @change="$refs.userRoleDatagrid.refresh()")
              njs-form-item
                njs-button(@click="$refs.userRoleDatagrid.refresh()" type="primary") {{$t('查询')}}
          njs-button(type="primary" slot="footer" size="medium" @click="submitUserRoleBatch") {{$t('保存')}}
        <!-- 权限设置 ------------------- start ---------------------------------------------- -->
        njs-datagrid-card(:visible.sync="showPowerSetCard" width="400px" :title="$t('权限设置')")
          div(style="padding: 20px;")
            njs-tree(
              service="P0405412"
              show-checkbox
              default-expand-all
              node-key="POWER_ID"
              pid="PAR_POWER"
              ref="userPowerSetTree"
              highlight-current
              label="POWER_NAME"
              @load-success="loadSuccessPowerSet"
              @before-load="boforeLoadPowerSet"
              :props="treeProps"
              show-search
            )
          njs-button(type="primary" slot="footer" size="medium" @click="submitUserPowerSet") {{$t('确定')}}
        <!-- 权限设置 ------------------- end ---------------------------------------------- -->
        <!-- 权限复制 ------------------- start ---------------------------------------------- -->
        njs-datagrid-card(:visible.sync="showPowerCloneCard" width="400px" :title="$t('权限复制')")
          .form-wrap
            njs-form(:model="powerClone.formData" v-if="showPowerCloneCard" size="small" ref="powerCloneForm" :show-submit="false" :service="powerClone.service" :show-reset="false" :close-text="$t('取消')" :rules="powerCloneRules")
              njs-form-item(prop="TARG_USER_CODE" :label="$t('复制员工模板')")
                njs-combogrid(datagrid-id="employee_userPower_P0405403"
                  v-model="powerClone.formData.TARG_USER_CODE"
                  ref="userPowerCombogrid"
                  :dialog-title="$t('员工信息')"
                  @before-load="beforeLoadUserInfo"
                  dialog-width="50%"
                  service="P0405403"
                  hide-head
                  single-select
                  data-value="USER_CODE"
                  data-label="USER_CODE,USER_NAME"
                )
                  <!-----------     列配置  start ---------------------------------------------------------- -->
                  njs-column(prop="USER_CODE" :label="$t('员工编号')" sortable min-width="100")
                  njs-column(prop="USER_NAME" :label="$t('员工名称')" show-overflow-tooltip sortable min-width="120")
                  njs-column(prop="USER_ACCOUNT" :label="$t('员工账号')" min-width="120")
                  njs-column(prop="USER_TYPE" :label="$t('员工类型')" min-width="120" dict="USER_TYPE")
                  njs-column(prop="EXTERNAL_SYS_ACCOUNT" :label="$t('外部系统账号')" min-width="120")
                  njs-column(prop="USER_STAT" :label="$t('员工状态')" min-width="100" dict="USER_STAT")
                  njs-column(prop="ORG_NAME" :label="$t('所属机构')" min-width="100")
                  njs-column(prop="ROLE_NAME_STR" :label="$t('员工角色')" show-overflow-tooltip min-width="100")
                  njs-column(prop="GRP_NAME_STR" :label="$t('业务分组')" show-overflow-tooltip min-width="100")
                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
                  template(slot="more-used-query" slot-scope="{ formData }")
                    njs-form-item(prop="USER_CODE")
                      njs-input(v-model="formData.USER_CODE" :placeholder="$t('请输入员工编号')" clearable @keydown.13.native="$refs.userPowerCombogrid.refresh()" @change="$refs.userPowerCombogrid.refresh()")
                    njs-form-item(prop="USER_STAT")
                      njs-combobox(v-model="formData.USER_STAT" :placeholder="$t('请选择员工状态')"  dict="USER_STAT" clearable @keydown.native.13="$refs.userPowerCombogrid.refresh()" @change="$refs.userPowerCombogrid.refresh()")
                    njs-form-item
                      njs-button(@click="$refs.userPowerCombogrid.refresh()" type="primary") {{$t('查询')}}
                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
                  template(slot="more-query" slot-scope="{ formData }")
                    njs-row(:gutter="20")
                      njs-col(:span='12')
                        njs-form-item(prop="ROLE_CODE" :label="$t('用户角色')")
                          njs-combobox(
                            service="P0403404"
                            service-data-value="ROLE_CODE"
                            ref="roleCombobox"
                            service-data-label="ROLE_CODE,ROLE_NAME"
                            v-model="formData.ROLE_CODE"
                          )
                      njs-col(:span='12')
                        njs-form-item(:label="$t('员工类型')" prop="USER_TYPE")
                          njs-combobox(v-model="formData.USER_TYPE"  style='width: 100%;' dict="USER_TYPE")
                    njs-row(:gutter="20")
                      njs-col(:span='12')
                        njs-form-item(prop="BIZ_GRP_ID" :label="$t('业务分组')")
                          njs-combobox(
                            service="P0404404"
                            service-data-value="BIZ_GRP_ID"
                            ref="roleCombobox"
                            service-data-label="BIZ_GRP_ID,GRP_NAME"
                            v-model="formData.BIZ_GRP_ID"
                          )
                      njs-col(:span='12')
                        njs-form-item(:label="$t('所属机构')" prop="ORG_ID")
                          nbs-select-org(v-model="formData.ORG_ID"  style='width: 100%;')
                    div(style="border-bottom: 1px dashed rgba(232,232,232,1); margin-bottom:20px;")
                    njs-row(:gutter="20")
                      njs-col(:span='12')
                        njs-form-item(:label="$t('联系电话')" prop="ATTN_TEL")
                          njs-input(v-model="formData.ATTN_TEL")
                      njs-col(:span='12')
                        njs-form-item(:label="$t('联系邮箱')" prop="EMAIL")
                          njs-input(v-model="formData.EMAIL")
              njs-form-item(prop="CLONE_WAY" :label="$t('复制类型')")
                njs-radio-group(v-model="powerClone.formData.CLONE_WAY" dict="CLONE_WAY")
          njs-button(type="primary" slot="footer" size="medium" @click="submitUserPowerClone") {{$t('确定')}}

    <!-----------     员工资料详情  start ---------------------------------------------------------- -->
    Deatil(:visible.sync="dialogVisible" :empinfo="empinfo")
    <!-----------     员工资料详情  start ---------------------------------------------------------- -->
</template>

<script>
import { validateEnNumUdl, validateTelephone, validateEmail, validateMobile, validateNumber } from '@/validator/common'
import encrypt from '@/utils/encrypt'
import Deatil from './components/c-deatil'

export default {
  name: 'employee.employee-info', // 页面级别组件一定要用路由名称命名！！！
  components: {
    Deatil
  },
  data () {
    return {
      oldRow: {}, // 老的选中行
      empinfo: {},
      dialogVisible: false,
      userGrpShowCard: false, // 业务分组是否显示右侧卡片
      userRoleShowCard: false, // 角色是否显示右侧卡片
      userGrpBatchShowCard: false, // 业务分组批量分配是否显示右侧卡片
      userRoleBatchShowCard: false, // 角色批量分配是否显示右侧卡片
      showPowerSetCard: false, // 权限设置是否显示右侧卡片
      showPowerCloneCard: false, // 权限复制是否显示右侧卡片
      rules: {
      },
      powerCloneRules: {
        TARG_USER_CODE: [
          { required: true, message: this.$t('请选择复制角色模板'), trigger: ['blur', 'change'] }
        ],
        CLONE_WAY: [
          { required: true, message: this.$t('请选择复制类型'), trigger: ['blur', 'change'] }
        ]
      },
      userGrpRules: {
        BIZ_GRP_ID: [
          { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' },
          { validator: validateNumber, trigger: 'change' }
        ],
        GRP_NAME: [
          { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' }
        ]
      },
      userRoleRules: {
        ROLE_CODE: [
          { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' },
          { validator: validateNumber, trigger: 'change' }
        ],
        ROLE_NAME: [
          { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' }
        ]
      },
      addEditRules: { // 新增/修改的校验规则
        USER_ACCOUNT: [
          { required: true, message: this.$t('请输入员工账号'), trigger: ['blur', 'change'] },
          { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' },
          { validator: validateEnNumUdl, trigger: 'change' }
        ],
        USER_NAME: [
          { required: true, message: this.$t('请输入员工姓名'), trigger: ['blur', 'change'] },
          { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' }
        ],
        USER_PASS: [
          { required: true, message: this.$t('请输入密码'), trigger: ['blur', 'change'] },
          { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' }
        ],
        USER_TYPE: [
          { required: true, message: this.$t('请选择员工类型'), trigger: ['blur', 'change'] }
        ],
        OPEN_DATE: [
          { required: true, message: this.$t('请选择入职日期'), trigger: ['blur', 'change'] }
        ],
        USER_STAT: [
          { required: true, message: this.$t('请选择员工状态'), trigger: ['blur', 'change'] }
        ],
        BIZ_GRP_ID: [
          { required: true, message: this.$t('请选择业务分组'), trigger: ['blur', 'change'] }
        ],
        ORG_ID: [
          { required: true, message: this.$t('请选择所属机构'), trigger: ['blur', 'change'] }
        ],
        ROLE_CODE: [
          { required: true, message: this.$t('请选择员工角色'), trigger: ['blur', 'change'] }
        ],
        POST_ID: [
          { required: true, message: this.$t('请选择员工岗位'), trigger: ['blur', 'change'] }
        ],
        EXTERNAL_SYS_ACCOUNT: [
          { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' },
          { validator: validateEnNumUdl, trigger: 'change' }
        ],
        EMAIL: [
          { validator: validateEmail, trigger: 'change' }
        ],
        OFF_TEL: [
          { validator: validateTelephone, trigger: 'change' }
        ],
        MOBILE: [
          { validator: validateMobile, trigger: 'change' }
        ],
        USER_ID: [
          { max: 40, message: this.$t('长度不能超过 30'), trigger: 'change' },
          { validator: validateEnNumUdl, trigger: 'change' }
        ]
      },
      btnList: [
        {
          text: this.$t('新增员工'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.$ajaxRequest([{
              service: 'P0405404'
            }]).then((result) => {
              if (result.code === '0') {
                this.addEdit.add.formData = {
                  USER_ICON: '', // 用户头像
                  LSE_ID: '', // 所属租户
                  USER_ACCOUNT: '', // 用户账号
                  USER_NAME: '', // 用户姓名
                  USER_TYPE: '0', // 用户类型
                  USER_PASS: '', // 用户密码
                  USER_SEX: '1', // 用户性别
                  BIRTHDAY: '', // 出生日期
                  USER_ID_TYPE: '10', // 证件类型
                  USER_ID: '', // 证件号码
                  OPEN_DATE: '', // 入职日期
                  USER_STAT: '1', // 用户状态
                  BIZ_GRP_ID: '', // 业务分组
                  ORG_ID: '', // 所属机构
                  ROLE_CODE: '', // 用户角色
                  POST_ID: '', // 用户岗位
                  EXTERNAL_SYS_ACCOUNT: '', // 外部系统账号
                  OFF_TEL: '', // 办公电话
                  MOBILE: '', // 移动电话
                  EMAIL: '', // 用户邮箱
                  USER_CODE: result.data[0].USER_CODE // 用户编号
                }
                this.$nextTick(() => {
                  this.$refs.addEditForm.clearValidate()
                })
              }
            })
          }
        },
        {
          text: this.$t('业务分组批量分配'),
          handler: () => {
            this.userGrpBatchShowCard = true
          }
        },
        {
          text: this.$t('角色批量分配'),
          handler: () => {
            this.userRoleBatchShowCard = true
          }
        }
      ],
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      addEdit: {
        add: {
          formData: {
            USER_ICON: '', // 用户头像
            LSE_ID: '', // 所属租户
            USER_ACCOUNT: '', // 用户账号
            USER_NAME: '', // 用户姓名
            USER_TYPE: '', // 用户类型
            USER_PASS: '', // 用户密码
            USER_SEX: '', // 用户性别
            BIRTHDAY: '', // 出生日期
            USER_ID_TYPE: '', // 证件类型
            USER_ID: '', // 证件号码
            OPEN_DATE: '', // 入职日期
            USER_STAT: '', // 用户状态
            BIZ_GRP_ID: '', // 业务分组
            ORG_ID: '', // 所属机构
            ROLE_CODE: '', // 用户角色
            POST_ID: '', // 用户岗位
            EXTERNAL_SYS_ACCOUNT: '', // 外部系统账号
            OFF_TEL: '', // 办公电话
            MOBILE: '', // 移动电话
            EMAIL: '' // 用户邮箱
          },
          title: this.$t('新增员工'),
          service: 'P0405101' // 接口号
        },
        edit: {
          formData: {
            USER_ICON: '', // 用户头像
            LSE_ID: '', // 所属租户
            USER_ACCOUNT: '', // 用户账号
            USER_NAME: '', // 用户姓名
            USER_TYPE: '', // 用户类型
            USER_PASS: '', // 用户密码
            USER_SEX: '', // 用户性别
            BIRTHDAY: '', // 出生日期
            USER_ID_TYPE: '', // 证件类型
            USER_ID: '', // 证件号码
            OPEN_DATE: '', // 入职日期
            USER_STAT: '', // 用户状态
            BIZ_GRP_ID: '', // 业务分组
            ORG_ID: '', // 所属机构
            ROLE_CODE: '', // 用户角色
            POST_ID: '', // 用户岗位
            EXTERNAL_SYS_ACCOUNT: '', // 外部系统账号
            OFF_TEL: '', // 办公电话
            MOBILE: '', // 移动电话
            EMAIL: '' // 用户邮箱
          },
          title: this.$t('修改员工'),
          service: 'P0405302' // 接口号
        }
      },
      enterCell: {
        USER_CODE: '',
        property: '',
        USER_STAT: '',
        row: {}
      },
      powerClone: {
        formData: {
          TARG_USER_CODE: '', // 复制员工模板
          CLONE_WAY: '1' // 复制模式
        },
        service: 'P0405114'
      }
    }
  },
  methods: {
    // 详情
    handlerDeatil (row) {
      this.empinfo = row
      this.dialogVisible = true
    },
    // 修改
    handlerUpdate (row) {
      this.addEditVisible = true
      this.addEditType = 'edit'
      this.addEdit.edit.formData = {
        USER_CODE: row.USER_CODE, // 用户编号
        LSE_ID: row.LSE_ID,
        USER_ACCOUNT: row.USER_ACCOUNT, // 用户账号
        USER_NAME: row.USER_NAME, // 用户名
        USER_TYPE: row.USER_TYPE, // 用户类型
        USER_SEX: row.USER_SEX, // 用户性别
        BIRTHDAY: row.BIRTHDAY, // 出生日期
        USER_ID_TYPE: row.USER_ID_TYPE, // 证件类型
        USER_ID: row.USER_ID, // 证件号码
        OPEN_DATE: row.OPEN_DATE, // 入职日期
        USER_STAT: row.USER_STAT, // 用户状态
        EXTERNAL_SYS_ACCOUNT: row.EXTERNAL_SYS_ACCOUNT, // 外部系统账号
        OFF_TEL: row.OFF_TEL, // 办公电话
        MOBILE: row.MOBILE, //  移动电话
        EMAIL: row.EMAIL, //  用户邮箱
        ORG_ID: row.ORG_ID
      }
      this.$nextTick(() => {
        this.$refs.addEditForm.clearValidate()
      })
    },
    // 状态变更
    handlerStateChange (val) {
      this.$ajaxRequest([{
        service: 'P0405305',
        USER_CODE: this.enterCell.USER_CODE,
        USER_STAT: val
      }]).then((result) => {
        if (result.code === '0') {
          this.enterCell.row.USER_STAT = this.enterCell.USER_STAT
        } else {
          this.enterCell.USER_STAT = this.enterCell.row.USER_STAT
        }
        this.enterCell = {
          USER_CODE: '',
          property: '',
          USER_STAT: '',
          row: {}
        }
      }).catch((err) => {
        this.enterCell.USER_STAT = this.enterCell.row.USER_STAT
        this.enterCell = {
          USER_CODE: '',
          property: '',
          USER_STAT: '',
          row: {}
        }
        console.error(err)
      })
    },
    // 密码重置
    handlerPasswordReset (row) {
      let defPass = this.$store.getters.getSysParam('DEF_PSW') // 获取系统参数用户默认密码
      if (!defPass) {
        defPass = '888888'
      }
      this.$confirm(this.$t('你确定将员工 ') + row.USER_NAME + this.$t(' 的密码重置为') + defPass + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        let encryptPass = encrypt(defPass, row.USER_CODE)
        this.$ajaxRequest([{
          service: 'P0405305',
          USER_CODE: row.USER_CODE, // 用户编号
          USER_PASS: encryptPass, // 加密密码
          CLEAR_PASS_UPDATE_TIME: '1' // 清空密码更新时间
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('员工 ') + row.USER_NAME + this.$t(' 密码重置成功')
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消密码重置')
        })
      })
    },
    // 角色分配
    handlerRoleSet (row) {
      this.userRoleShowCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
    },
    // 查询当前人的角色
    handleQueryUserRoleBeforeLoad  (req, callback) {
      req[0].USER_CODE = this.oldRow.USER_CODE
      callback(req)
    },
    // 查询个人角色勾选已有的角色
    handleQueryUserRoleSuccess (data) {
      data.forEach((item) => {
        if (item.FLAG === '1') {
          this.$refs.userRoleDatagrid.toggleRowSelection(item, true)
        }
      })
    },
    submitUserRole () {
      let selection = this.$refs.userRoleDatagrid.getAttr('selection')
      if (selection.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择记录')
        })
        return
      }
      let roleCodes = ''
      selection.forEach((item, index) => {
        if (index === 0) {
          roleCodes += item.ROLE_CODE
        } else {
          roleCodes += `,${item.ROLE_CODE}`
        }
      })
      this.$ajaxRequest([{
        service: 'P0405109',
        ROLE_CODE: roleCodes,
        USER_CODE: this.oldRow.USER_CODE
      }]).then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.userRoleShowCard = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 业务分组分配
    handlerBusinesGroupeSet (row) {
      this.userGrpShowCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
    },
    // 查询当前人的业务分组
    handleQueryUserGrpBeforeLoad  (req, callback) {
      req[0].USER_CODE = this.oldRow.USER_CODE
      callback(req)
    },
    // 查询个人业务分组勾选已有的业务分组
    handleQueryUserGrpSuccess (data) {
      data.forEach((item) => {
        if (item.FLAG === '1') {
          this.$refs.userGrpDatagrid.toggleRowSelection(item, true)
        }
      })
    },
    // 保存个人业务分组
    submitUserGrp () {
      let selection = this.$refs.userGrpDatagrid.getAttr('selection')
      if (selection.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择记录')
        })
        return
      }
      let bizGrpIds = ''
      selection.forEach((item, index) => {
        if (index === 0) {
          bizGrpIds += item.BIZ_GRP_ID
        } else {
          bizGrpIds += `,${item.BIZ_GRP_ID}`
        }
      })
      this.$ajaxRequest([{
        service: 'P0405107',
        BIZ_GRP_ID: bizGrpIds,
        USER_CODE: this.oldRow.USER_CODE
      }]).then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.userGrpShowCard = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 权限设置
    handlerPermissionSet (row) {
      this.showPowerSetCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.$refs.userPowerSetTree.refresh()
    },
    // 权限复制
    handlerPermissionClone (row) {
      this.showPowerCloneCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.$set(this.powerClone, 'formData', {
        TARG_USER_CODE: '', // 复制员工模板
        CLONE_WAY: '1' // 复制模式
      })
      this.$nextTick(() => {
        this.$refs.userPowerCombogrid.loadText()
      })
    },
    // 权限复制排除当前员工
    beforeLoadUserInfo (req, callback) {
      req[0].CLONE_USER_CODE = this.oldRow.USER_CODE
      callback(req)
    },
    // 提交权限复制
    submitUserPowerClone () {
      this.$refs.powerCloneForm.submit({ USER_CODE: this.oldRow.USER_CODE }).then((result) => {
        if (result.code === '0') {
          this.showPowerCloneCard = false
        }
      })
    },
    // 强制登出
    handlerMandatoryLogout (row) {
      this.$alert(this.$t('待开发(*￣︶￣)'))
    },
    // 提交新增或修改
    submitAddEdit () {
      this.$refs.addEditForm.submit().then((result) => {
        if (result.code === '0') {
          if (this.addEditType === 'add') {
            this.$message({
              type: 'success',
              message: this.$t('新增员工') + this.addEdit.add.formData.USER_NAME + this.$t('成功')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改员工') + this.addEdit.edit.formData.USER_NAME + this.$t('成功')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 新增员工将密码加密保存
    handleAddBeforeSubmit (req, callback) {
      if (this.addEditType === 'add') {
        req[0].USER_PASS = encrypt(req[0].USER_PASS, req[0].USER_CODE)
        console.log(req[0].USER_PASS)
        callback(req)
      }
    },
    // 状态变更标记哪一行那一列
    editUserState (row, column) {
      this.enterCell.USER_CODE = row.USER_CODE
      this.enterCell.property = column.property
      this.enterCell.USER_STAT = row.USER_STAT
      this.enterCell.row = row
    },
    // 业务分组批量分配保存
    submitUserGrpBatch () {
      // 获取员工
      let userSelection = this.$refs.datagrid.getAttr('selection')
      if (userSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择员工')
        })
        return
      }
      // 获取业务分组
      let bizSelection = this.$refs.userGrpBatchDatagrid.getAttr('selection')
      if (bizSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择业务分组')
        })
        return
      }
      let userIds = ''
      userSelection.forEach((item, index) => {
        if (index === 0) {
          userIds += item.USER_CODE
        } else {
          userIds += `,${item.USER_CODE}`
        }
      })
      let bizGrpIds = ''
      bizSelection.forEach((item, index) => {
        if (index === 0) {
          bizGrpIds += item.BIZ_GRP_ID
        } else {
          bizGrpIds += `,${item.BIZ_GRP_ID}`
        }
      })
      this.$ajaxRequest([{
        service: 'P0405110',
        BIZ_GRP_ID: bizGrpIds,
        USER_CODE: userIds
      }]).then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.userGrpBatchShowCard = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    submitUserRoleBatch () {
      // 获取员工
      let userSelection = this.$refs.datagrid.getAttr('selection')
      if (userSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择员工')
        })
        return
      }
      // 获取角色
      let roleSelection = this.$refs.userRoleBatchDatagrid.getAttr('selection')
      if (roleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择角色')
        })
        return
      }
      let userIds = ''
      userSelection.forEach((item, index) => {
        if (index === 0) {
          userIds += item.USER_CODE
        } else {
          userIds += `,${item.USER_CODE}`
        }
      })
      let roleCodes = ''
      roleSelection.forEach((item, index) => {
        if (index === 0) {
          roleCodes += item.ROLE_CODE
        } else {
          roleCodes += `,${item.ROLE_CODE}`
        }
      })
      this.$ajaxRequest([{
        service: 'P0405111',
        ROLE_CODE: roleCodes,
        USER_CODE: userIds
      }]).then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.userRoleBatchShowCard = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 查询当前选中员工的权限
    boforeLoadPowerSet (req, callback) {
      req[0].USER_CODE = this.oldRow.USER_CODE
      callback(req)
    },
    // 员工权限设置加载成功回写数据
    loadSuccessPowerSet (data) {
      let powerArr = []
      data.forEach((item, index) => {
        if ((item.USER_POWER_FLAG === '1' || item.ROLE_POWER_FLAG !== '0') && item.PAR_POWER !== '0') {
          powerArr.push(item.POWER_ID)
        }
      })
      this.$refs.userPowerSetTree.setCheckedKeys(powerArr)
    },
    // 提交权限设置
    submitUserPowerSet () {
      let data = this.$refs.userPowerSetTree.getCheckedNodes(false, true)
      console.log(data)
      if (data.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择记录')
        })
        return
      }
      let powerArr = []
      data.forEach((item, index) => {
        if (item.USER_POWER_FLAG === '1') {
          powerArr.push(item.POWER_ID)
        } else if ((item.USER_POWER_FLAG === '0' && item.ROLE_POWER_FLAG === '0') || item.PAR_POWER === '0') {
          powerArr.push(item.POWER_ID)
        }
      })
      let powerIds = powerArr.join(',')
      console.log(powerIds)
      this.$ajaxRequest([{
        service: 'P0405113',
        USER_CODE: this.oldRow.USER_CODE,
        POWER_ID: powerIds
      }]).then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.showPowerSetCard = false
        }
      })
    }
  },
  computed: {
    treeProps () {
      return {
        disabled (data) {
          if (data.ROLE_POWER_FLAG !== '0' && data.PAR_POWER !== '0') {
            return true
          } else {
            return false
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>

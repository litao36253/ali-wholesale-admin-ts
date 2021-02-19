import storage from '@/commons/storage'
import { language } from '@/conf/'
let lang = storage.lang || language.default
export default {
  /***************************************
   * 获取数据字典，传一个参数获取一整个字典，传两个参数获取指定字典的某一字典项的值
   * @author litao
   * @params key: 'key' | string
   * @params val: 'val' | string
   * @return dict: [{},{}] | string
   **************************************/
  getDict: state => (key, val) => {
    if (key) {
      if (state.dictList) {
        if (state.dictList[key]) {
          let dict = state.dictList[key][lang.toUpperCase()] // 此处由于数据库里存的字段名全为大写（包括语言名代号也是大写），所以前端也统一转成大写 ！！！！！！！！！！！！！！！！！！！！！！！！！
          if (dict) {
            if (val) {
              for (let i = 0; i < dict.length; i++) {
                if (dict[i]['DICT_ITEM'] === val) {
                  return dict[i]['DICT_ITEM_NAME']
                }
              }
            } else {
              if (val === '') {
                return ''
              }
              return dict
            }
          }
        }
      }
    } else {
      console.error('getters.getDict：获取数据字典需要传入字典key值。')
    }
  },
  /***************************************
   * 获取系统参数
   * @author litao
   * @params key: 'key' | string
   * @return sysParam: mix | mix
   **************************************/
  getSysParam: state => key => {
    if (key) {
      if (state.sysParam) {
        if (state.sysParam[key]) {
          if (state.sysParam[key][0]) {
            return state.sysParam[key][0]['PARAM_VAL']
          }
        }
      }
    } else {
      console.error('getters.getSysParam：获取系统参数需要传入系统参数key值。')
    }
  },
  /***************************************
   * 获取g_user对象
   * @author litao
   * @params key: 'key' | string
   * @return sysParam: mix | mix
   **************************************/
  g_user: state => state.userBaseInfo

}

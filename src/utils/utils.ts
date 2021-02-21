import store from '@/store/store'

export function getDict (dictCode: string, dictItemCode?: string) {
  // @ts-ignore
  const dictItems = store.state.common.dict[dictCode] || []
  if (dictItemCode) {
    return dictItems.find(item => item.dict_item_code === dictItemCode)?.dict_item_name || ''
  }
  return dictItems
}

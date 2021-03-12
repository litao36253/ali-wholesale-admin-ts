import store from '@/store/store'

/**
 * 获取数据字典，传一个参数得到一个字典的所有字典项，传两个参数得到某个字典的某个字典项
 * @param dictCode string
 * @param dictItemCode string
 * @return 字典项集合或字典项
 */
export function getDict (dictCode: string, dictItemCode?: string) {
  // @ts-ignore
  const dictItems = store.state.common.dict[dictCode] || []
  if (dictItemCode) {
    return dictItems.find(item => item.dict_item_code === dictItemCode)?.dict_item_name || ''
  }
  return dictItems
}

/**
 * listTransTree  list转树方法,传入 list 数组指定节点 id 的字段和父节点 pid 的字段名
 * @author 李涛
 * @parma list Object[] 传入 list 数组
 * @parma id String 指定节点 ID 的字段名
 * @parma parentId String 指定父节点 ID 的字段名
 * @parma children String 指定每个节点的子节点集合的名称，不指定则为 “children”
 * @return [tree] 返回树形结构的数据
 */
export const listTransTree = (list, id = '_id', parentId = 'parentId', children = 'children') => {
  const ids = list.map(item => item[id])
  return list.filter(function (parent) {
    const branchArr = list.filter(function (child) {
      return parent[id] === child[parentId]
    })
    // parent[children || 'children'] = []
    if (branchArr.length > 0) {
      parent[children] = branchArr
    }
    return !ids.includes(parent[parentId]) // 找不到父节点的节点作为一级节点
  })
}

/**
 * treeTransList  list转树方法,传入 list 数组指定节点 id 的字段和父节点 id 的字段
 * @author 李涛
 * @parma tree Array 传入树形数组
 * @parma childKey String 指定节点子节点的字段名
 * @return [list] 返回 list 形结构的数据
 */
export const treeTransList = (tree = [], childKey = 'children') => {
  return tree.reduce(function fn (con, item) {
    con.push(item)
    // @ts-ignore
    if (item[childKey] && item[childKey].length > 0) { item[childKey].reduce(fn, con) }
    return con
  }, []).map(function (item) {
    delete item[childKey]
    return item
  })
}

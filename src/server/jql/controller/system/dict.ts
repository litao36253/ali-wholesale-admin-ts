import handleResult from '@/server/jql/middleware/handle-result'
import { Pagination } from '@/server/jql/types'

const db = uniCloud.database()

/**
 * 查询数据字典
 * @param param 查询参数
 * @param pagination 分页参数
 * @return Promise<Result>
 */
export const queryDict = async (param: { code?: string, name: string, type: string }, pagination: Pagination) => {
  const collection = db.collection('uni-dict,uni-id-users')
  const query = {
    code: new RegExp(param.code, 'i'),
    name: new RegExp(param.name, 'i'),
    type: new RegExp(param.type, 'i'),
    is_delete: false
  }
  const res = collection.where(query)
    .field('code, name, type, edit_enable, comment, last_reviser{username}, update_time')
    .orderBy('update_time', 'desc')
    .skip(pagination.pageSize * (pagination.currentPage - 1))
    .limit(pagination.pageSize)
    .get()

  const countRes = collection.where(query).count()

  const result = await handleResult(res, countRes)

  result.data = result.data.map(item => {
    item.last_reviser = item.last_reviser && item.last_reviser[0]
    item.last_reviser_id = item.last_reviser?._id
    item.last_reviser_username = item.last_reviser?.username
    return item
  })

  return result
}

/**
 * 新增数据字典
 * @param param 参数
 * @return Promise<Result>
 */
export const createDict = (param: { code: string, name: string, type: string, edit_enable: string, comment: string }) => {
  const collection = db.collection('uni-dict')
  const res = collection.add(param)
  return handleResult(res)
}

/**
 * 修改数据字典
 * @param param 参数
 * @return Promise<Result>
 */
export const updateDict = (param: { _id: string, code: string, name: string, type: string, edit_enable: string, comment: string }) => {
  const collection = db.collection('uni-dict')
  const res = collection.doc(param._id).update({
    ...param,
    _id: undefined
  })
  return handleResult(res)
}

/**
 * 删除数据字典（软删除）
 * @param param 参数
 * @return Promise<Result>
 */
export const deleteDict = (_id: string) => {
  const collection = db.collection('uni-dict')
  const res = collection.doc(_id).update({
    is_delete: true
  })
  return handleResult(res)
}

/**
 * 查询数据字典项
 * @param param 查询参数
 * @param pagination 分页参数
 * @return Promise<Result>
 */
export const queryDictItem = async (param: { dict_code?: string }, pagination: Pagination) => {
  const collection = db.collection('uni-dict-item,uni-id-users')
  const query = {
    dict_code: new RegExp(param.dict_code, 'i'),
    is_delete: false
  }
  const res = collection.where(query)
    .field('dict_item_code, dict_item_name, number, edit_enable, comment, last_reviser{username}, update_time')
    .orderBy('update_time', 'desc')
    .orderBy('number', 'asc')
    .skip(pagination.pageSize * (pagination.currentPage - 1))
    .limit(pagination.pageSize)
    .get()

  const countRes = collection.where(query).count()

  const result = await handleResult(res, countRes)

  result.data = result.data.map(item => {
    item.last_reviser = item.last_reviser && item.last_reviser[0]
    item.last_reviser_id = item.last_reviser?._id
    item.last_reviser_username = item.last_reviser?.username
    return item
  })

  return result
}

/**
 * 新增数据字典项
 * @param param 参数
 * @return Promise<Result>
 */
export const createDictItem = (param: { dict_code: string, dict_item_code: string, dict_item_name: string, number: number, edit_enable: string, comment: string }) => {
  const collection = db.collection('uni-dict-item')
  const res = collection.add(param)
  return handleResult(res)
}

/**
 * 修改数据字典项
 * @param param 参数
 * @return Promise<Result>
 */
export const updateDictItem = (param: { _id: string, dict_item_code: string, dict_item_name: string, number: number, edit_enable: string, comment: string }) => {
  const collection = db.collection('uni-dict-item')
  const res = collection.doc(param._id).update({
    ...param,
    _id: undefined
  })
  return handleResult(res)
}

/**
 * 删除数据字典项（软删除）
 * @param param 参数
 * @return Promise<Result>
 */
export const deleteDictItem = (_id: string) => {
  const collection = db.collection('uni-dict-item')
  // const res = collection.doc(_id).update({
  //   is_delete: true
  // })
  const res = collection.doc(_id).remove()
  return handleResult(res)
}

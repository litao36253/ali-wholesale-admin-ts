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
  const collection = db.collection('system-dict,uni-id-users')
  const query = {
    code: new RegExp(param.code, 'i'),
    name: new RegExp(param.name, 'i'),
    type: new RegExp(param.type, 'i')
  }
  const res = collection.where(query)
    .field('code, name, type, edit_enable, comment, last_reviser{username}, update_time')
    .orderBy('update_time', 'desc')
    .skip(pagination.pageSize * (pagination.currentPage - 1))
    .limit(pagination.pageSize)
    .get()

  const countRes = collection.where(query).count()

  const result = await handleResult(res, countRes)

  if (!result.code) {
    result.data = result.data.map(item => {
      item.last_reviser = item.last_reviser && item.last_reviser[0]
      item.last_reviser_id = item.last_reviser?._id
      item.last_reviser_username = item.last_reviser?.username
      return item
    })
  }

  return result
}

/**
 * 新增数据字典
 * @param param 参数
 * @return Promise<Result>
 */
export const createDict = async (param: { code: string, name: string, type: string, edit_enable: string, comment: string }) => {
  const collection = db.collection('system-dict')
  const res = collection.add(param)
  return handleResult(res)
}

/**
 * 修改数据字典
 * @param param 参数
 * @return Promise<Result>
 */
export const updateDict = (param: { _id: string, code: string, name: string, type: string, edit_enable: string, comment: string }) => {
  const collection = db.collection('system-dict')
  const res = collection.doc(param._id).update({
    ...param,
    _id: undefined
  })
  return handleResult(res)
}

/**
 * 删除数据字典
 * @param param 参数
 * @return Promise<Result>
 */
export const deleteDict = async (_id: string) => {
  const transaction = await db.startTransaction() // 发起事务
  try {
    const collection = db.collection('system-dict')
    const currentDict = collection.doc(_id)
    const currentDictCode = (await currentDict.field('code').get()).result.data[0].code
    await currentDict.remove()
    await db.collection('system-dict-item').where({
      dict_code: currentDictCode
    }).remove()
    return handleResult(transaction.commit()) // 提交事务
  } catch (e) {
    await transaction.rollback() // 回滚事务
    return handleResult(e)
  }
}

/**
 * 查询数据字典项
 * @param param 查询参数
 * @param pagination 分页参数
 * @return Promise<Result>
 */
export const queryDictItem = async (param: { dict_code?: string }, pagination: Pagination) => {
  const collection = db.collection('system-dict-item,uni-id-users')
  const query = {
    dict_code: new RegExp(param.dict_code, 'i')
  }
  const res = collection.where(query)
    .field('dict_code, dict_item_code, dict_item_name, number, edit_enable, comment, last_reviser{username}, update_time')
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
export const createDictItem = async (param: { dict_code: string, dict_item_code: string, dict_item_name: string, number: number, edit_enable: string, comment: string }) => {
  const collection = db.collection('system-dict-item')
  const res = collection.add(param)
  return handleResult(res)

  // 以下代码是做云开发数据库压力测试用的。阿里云最多支持500条数据的查询，2000条数据的插入，update和remove无限制，数据量大时响应速度挺好，高并发待测试。腾讯云待测试

  // const collection = db.collection('system-dict-item')
  // const list = []
  // for (let i = 0; i < 2000; i++) {
  //   const p = JSON.parse(JSON.stringify(param))
  //   const random = Math.random() + ''
  //   p.dict_item_code = random
  //   p.dict_item_name = random
  //   list.push(p)
  // }
  // const res = collection.add(list)
  // const result = await handleResult(res)
  // console.log(result)
  // return result
}

/**
 * 修改数据字典项
 * @param param 参数
 * @return Promise<Result>
 */
export const updateDictItem = (param: { _id: string, dict_item_code: string, dict_item_name: string, number: number, edit_enable: string, comment: string }) => {
  const collection = db.collection('system-dict-item')
  const res = collection.doc(param._id).update({
    ...param,
    _id: undefined
  })
  return handleResult(res)
}

/**
 * 删除数据字典项
 * @param param 参数
 * @return Promise<Result>
 */
export const deleteDictItem = (_id: string) => {
  const collection = db.collection('system-dict-item')
  const res = collection.doc(_id).remove()
  return handleResult(res)
}

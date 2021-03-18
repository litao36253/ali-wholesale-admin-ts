import handleResult from '@/server/jql/middleware/handle-result'
import { Pagination } from '@/server/jql/types'

const db = uniCloud.database()
const dbCmd = db.command

/**
 * 创建素材分类
 * @param param 参数
 * @return Promise<Result>
 */
export const createSourceCategories = async (param: {
  name: string,
  parent_ids: string[]
}) => {
  const collection = db.collection('system-source-categories')
  const res = collection.add(param)
  const createResult = await handleResult(res)
  // console.log(createResult)
  return createResult
}

/**
 * 修改素材分类
 * @param param 参数
 * @return Promise<Result>
 */
export const editSourceCategories = async (param: {
  _id: string,
  name: string
}) => {
  const collection = db.collection('system-source-categories')
  const res = collection.doc(param._id).update({
    name: param.name
  })
  const createResult = await handleResult(res)
  // console.log(createResult)
  return createResult
}

/**
 * 查询素材分类
 * @param param 查询参数
 * @param pagination 分页参数
 * @return Promise<Result>
 */
export const querySourceCategories = async (
  param?: { name: string },
  pagination: Pagination = { pageSize: 500, currentPage: 1 }
) => {
  const collection = db.collection('system-source-categories')
  const query = {
    name: new RegExp(param?.name, 'i')
  }
  const res = collection.where(query)
    // .orderBy('number', 'desc')
    .skip(pagination.pageSize * (pagination.currentPage - 1))
    .limit(pagination.pageSize)
    .get()

  const result = await handleResult(res)

  return result
}

/**
 * 删除素材分类及该分类下的所有子分类和素材
 * @param param 参数
 * @return Promise<Result>
 */
export const deleteSourceCategories = async (_id: string) => {
  const transaction = await db.startTransaction() // 发起事务
  try {
    const collection = db.collection('system-source-categories')
    await collection.doc(_id).remove()
    await collection.where({
      // parent_ids: _id // parent_ids 中包含了 _id
      parent_ids: dbCmd.elemMatch(dbCmd.eq(_id)) // parent_ids 中包含了 _id
    }).remove()
    return handleResult(transaction.commit()) // 提交事务
  } catch (e) {
    await transaction.rollback() // 回滚事务
    return handleResult(e)
  }
}

/**
 * 查询素材
 * @param param 查询参数
 * @param pagination 分页参数
 * @return Promise<Result>
 */
export const querySource = async (param: { file_name: string, file_type: string, categories: string }, pagination: Pagination) => {
  const collection = db.collection('system-source')
  const query = {
    categories: dbCmd.elemMatch(dbCmd.eq(param.categories)),
    file_name: new RegExp(param.file_name, 'i'),
    file_type: param.file_type
  }
  const res = collection.where(query)
    .skip(pagination.pageSize * (pagination.currentPage - 1))
    .limit(pagination.pageSize)
    .orderBy('create_time', 'desc')
    .get()

  const countRes = collection.where(query).count()

  return await handleResult(res, countRes)
}

/**
 * 创建素材
 * @param sources 要创建的素材集合
 * @return Promise<Result>
 */
export const createSource = async (sources: {file_name: string, categories: string[], url: string, type: string}[]) => {
  const collection = db.collection('system-source')
  const res = collection.add(sources)
  return await handleResult(res)
}

/**
 * 删除素材
 * @param target 要删除的素材id或id集合
 * @return Promise<Result>
 */
export const deleteSource = async (target: string | string[]) => {
  const collection = db.collection('system-source')
  let res
  if (typeof target === 'string') {
    res = collection.doc(target).remove()
  } else {
    res = collection.where({
      _id: dbCmd.in(target)
    })
      .remove()
  }
  return await handleResult(res)
}

/**
 * 修改素材
 * @param source 要修改的素材
 * @return Promise<Result>
 */
export const updateSource = async (source: {_id: string, file_name: string}) => {
  const collection = db.collection('system-source')
  const res = collection.doc(source._id).update({
    file_name: source.file_name
  })
  return await handleResult(res)
}

/**
 * 移动素材
 * @param sourceIds 要移动的素材
 * @param target 要移动到的分类
 * @return Promise<Result>
 */
export const moveSources = async (sourceIds: string[], target: string) => {
  const collection = db.collection('system-source')
  try {
    let targetCategories
    if (target === '0') {
      targetCategories = {
        _id: '0',
        parent_ids: []
      }
    } else {
      const { result } = await db.collection('system-source-categories').doc(target).get()
      targetCategories = result.data[0]
    }
    const res = collection.where({
      _id: dbCmd.in(sourceIds)
    }).update({
      categories: [targetCategories._id].concat(targetCategories.parent_ids)
    })
    return await handleResult(res)
  } catch (e) {
    return handleResult(e)
  }
}

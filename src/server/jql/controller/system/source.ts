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

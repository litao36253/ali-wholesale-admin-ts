import handleResult from '@/server/jql/middleware/handle-result'
import { Pagination } from '@/server/jql/types'

const db = uniCloud.database()

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

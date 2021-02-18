import handleResult from '@/server/jql/middleware/handle-result'
import { Pagination } from '@/server/jql/types'

const db = uniCloud.database()

/**
 * 查询数据字典
 * @param param 查询参数
 * @param pagination 分页参数
 * @return Promise<Result>
 */
export const queryDict = async (param: { code?: string }, pagination: Pagination) => {
  const collection = db.collection('uni-dict,uni-id-users')

  const res = collection.where({
    ...param,
    is_delete: false
  })
    .field('code, name, type, edit_enable, comment, creator{username}, create_time')
    .skip(pagination.pageSize * (pagination.currentPage - 1))
    .limit(pagination.pageSize)
    .get()

  const countRes = collection.where({
    ...param
  }).count()

  const result = await handleResult(res, countRes)

  result.data = result.data.map(item => {
    item.creator = item.creator[0]
    item.creator_id = item.creator?._id
    item.creator_username = item.creator?.username
    return item
  })

  return result
}

/**
 * 新增数据字典
 * @param param 参数
 * @return Promise<Result>
 */
export const addDict = (param: { code: string, name: string, type: string, edit_enable: string, comment: string }) => {
  const collection = db.collection('uni-dict')
  const res = collection.add(param)
  return handleResult(res)
}

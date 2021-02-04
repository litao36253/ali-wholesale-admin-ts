import handleResult from '@/server/jql/middleware/handle-result'
import { Pagination } from '@/server/jql/types'

const db = uniCloud.database()

export const queryDict = (param: { code?: string }, pagination: Pagination) => {
  const collection = db.collection('uni-dict')
  const res = collection.where({
    ...param
  })
    .skip(4)
    .get()
  const countRes = collection.where({
    ...param
  }).count()
  return handleResult(res, countRes)
}

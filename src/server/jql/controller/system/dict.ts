import handleResult from '@/server/jql/middleware/handle-result'

const db = uniCloud.database()

export const queryDict = (param: { code?: string }) => {
  return handleResult(param)
}

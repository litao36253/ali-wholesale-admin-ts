import jql from '@/server/jql/jql'
import groupBy from 'lodash/groupBy'

export default {
  // 查询所有的数据字典
  async queryAllDict ({ commit }) {
    const pageSize = 500 // 阿里云一次最多查询500条数据，腾讯云不知道，万一腾讯云支持一次查询数量小后期在做兼容
    let currentPage = 1
    const res = await jql.system.dict.queryDictItem({}, { pageSize, currentPage })
    if (res.code) {
      return
    }
    let dicts = res.data
    let nowTotal = pageSize
    const moreRequests = []
    while (res.total > nowTotal) {
      currentPage++
      moreRequests.push(jql.system.dict.queryDictItem({}, { pageSize, currentPage }))
      nowTotal += pageSize
    }
    moreRequests.length && await Promise.all(moreRequests).then(result => {
      for (let i = 0; i < result.length; i++) {
        if (result[i].code) {
          throw new Error('获取数据字典失败')
        }
        dicts = dicts.concat(result[i].data)
      }
    })
    commit('changeDict', groupBy(dicts, 'dict_code'))
  }
}

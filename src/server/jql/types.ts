export type Result = {
  code?: string | number,
  message?: string,
  data?: any[],
  id?: string,
  duration?: number,
  affectedDocs?: number,
  total?: number,
  error?: Error
}

export type Pagination = {
  pageSize: number,
  currentPage: number
}

export type Result = Promise<{ code?: string | number, message?: string, data?: any[], duration: number, affectedDocs: number, total?: number }>

export type Pagination = { pageSize: number, currentPage: number }

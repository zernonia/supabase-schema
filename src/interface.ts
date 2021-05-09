export interface Column {
  title: string
  format: string
  type: string
  default: any
  required: boolean
  pk: boolean
  fk?: string | undefined
}
export interface Table {
  title: string
  columns?: Column[]
}

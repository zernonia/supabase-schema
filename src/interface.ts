export interface Column {
  title: string
  format: string
  type: string
  default: any
  required: boolean
  pk: boolean
  fk?: string | undefined
}

export interface Position {
  x: number
  y: number
}

export interface Table {
  title: string
  columns?: Column[]
  position: Position
}

export interface TableState {
  [key: string]: Table
}

export interface Payload {
  name: string
  value: string | number
}

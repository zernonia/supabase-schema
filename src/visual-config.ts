export class Visual {
  table: string

  constructor(table: string) {
    this.table = table
  }

  log() {
    console.log(this.table)
  }
}

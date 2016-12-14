/* @flow */

const {writeEffect$} = require('./src/convert')

writeEffect$("./assets/all.xlsx")("./assets/result-ast.json")
  .subscribe(console.log, console.error, () => console.log('完了'))

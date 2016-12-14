/* @flow */

const fs = require('fs')
const {Observable} = require('rxjs')
const xlsToJSON = require('xls-to-json')

// type Hazard = {
//   level: number,
//   ranking: number,
// }

// type Place = {
//   address: string,
//   street: string
// }

const createConvert$ = (pathToXls: string) => Observable
  .bindCallback(xlsToJSON)({
    input: pathToXls,
    output: './assets/result.json'
  })
  .map(xs => xs[1])
  .map(xs => xs
    .filter((x, i) => i > 1)
    .map(x => ({
      address: x["市区町村"],
      street: x["町丁目名"],
      kind: x["地盤分類"],
      hazards: {
        fire: {
          level: x["火災危険度ランク"],
          ranking: x["火災危険度順位"],
        },
        destruction: {
          level: x["建物倒壊危険度ランク"],
          ranking: x["建物倒壊危険度順位"],
        },
        comprehension: {
          level: x["総合危険度ランク"],
          ranking: x["総合危険度順位"],
        }
      },
      hazardsWithDifficality: {
        fire: {
          level: x["災害時活動困難度を考慮した危険度火災危険度ランク"],
          ranking: x["災害時活動困難度を考慮した危険度火災危険度順位"],
        },
        destruction: {
          level: x["災害時活動困難度を考慮した危険度建物倒壊危険度ランク"],
          ranking: x["災害時活動困難度を考慮した危険度建物倒壊危険度順位"],
        },
        comprehension: {
          level: x["災害時活動困難度を考慮した危険度総合危険度ランク"],
          ranking: x["災害時活動困難度を考慮した危険度総合危険度順位"],
        }
      },
    }))
  )

const writeEffect$ = (pathToXls: string) => (pathToResult: string) => createConvert$(pathToXls)
  .do(x => fs
    .createWriteStream(pathToResult)
    .write(JSON.stringify(x))
  )

module.exports = { writeEffect$, createConvert$ }
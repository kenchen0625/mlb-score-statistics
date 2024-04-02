const RegularSeasonGame = require('./lib/regularSeasonGame')
const fs = require('fs')
const path = require('path')
const csvPath = path.join(__dirname, "./sum.csv")
const statisticFilePath = path.join(__dirname, "./result.csv")

// writeScoreData()
main()

async function main() {
  const result = {
    odd: 0,
    even: 0
  }
  const rawScoreData = fs.readFileSync(csvPath).toString()
  const scoreDataArray = rawScoreData.split("\n")
  scoreDataArray.splice(0, 1)
  for (const scoreData of scoreDataArray) {
    const score = scoreData.split(",")[1]
    score % 2 === 0 ? result.even++ : result.odd++
  }
  fs.writeFileSync(statisticFilePath, `單,${result.odd}\n`)
  fs.appendFileSync(statisticFilePath, `雙,${result.even}`)
}

async function writeScoreData() {
  fs.writeFileSync(csvPath, "date,totalScore\n")

  const startSeasonDate = new Date(2023, 2, 31)
  const endSeasonDate = new Date(2023, 9, 2)
  for (let d = startSeasonDate; d <= endSeasonDate; d.setDate(d.getDate() + 1)) {
    const dateString = new Date(d).toISOString('zh-TW', {
      timeZone: 'Asia/Taipei'
    })
    const parsedDateString = dateString.split("T")[0].replaceAll("-", "")
    const regularSeasonGame = new RegularSeasonGame(parsedDateString)
    const scoreData = await regularSeasonGame.getScoreSums()
    const scoreDataString = scoreData.join("\n")
    fs.appendFileSync(csvPath, scoreDataString)

    if (scoreData.length != 0)
      fs.appendFileSync(csvPath, "\n")
  }
}
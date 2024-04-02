const Scraper = require('./scraper')
const cheerio = require('cheerio')

class RegularSeasonGame extends Scraper {
  constructor(date) {
    super()
    this._date = date
  }

  async getScoreSums() {
    const res = await this.sendRequest({
      url: `https://www.espn.com/mlb/scoreboard/_/date/${this._date}`,
      method: 'get',
      'Connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    })

    const $ = cheerio.load(res.data)

    const scoreData = []

    $('#fittPageContainer > div:nth-child(3) > div > div > div:nth-child(1) > div > div > section > div').children().each((i, el) => {
      const homeTeam = $(`#${el.attribs.id} li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--home > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--baseball > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 div`).text()

      const awayTeam = $(`#${el.attribs.id} li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--away > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--baseball > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 div`).text()

      const homeScore = $(`#${el.attribs.id} li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--home > div.ScoreboardScoreCell_Linescores.baseball.flex.justify-end > div:nth-child(1)`).text()
      const awayScore = $(`#${el.attribs.id} li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--away > div.ScoreboardScoreCell_Linescores.baseball.flex.justify-end > div:nth-child(1)`).text()
      const totalScore = parseInt(homeScore) + parseInt(awayScore)
      if (!isNaN(totalScore)) {
        scoreData.push(`${this._date},${awayTeam} vs ${homeTeam},${totalScore}`)
      }
    })

    console.log(this._date)
    console.log(scoreData)
    return scoreData
  }
}

module.exports = RegularSeasonGame
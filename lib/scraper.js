const axios = require('axios')

class Scraper {
  constructor() {
    this._client = axios.create({
      maxRedirects: 0,
      validateStatus: (status) => {
        return status >= 200 && status < 400
      },
    })
  }

  async wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  async sendRequest(options) {
    const result = await this._client(options).catch(err => {
      console.log(err.error.toString())
      return false
    })

    return result
  }

}

module.exports = Scraper
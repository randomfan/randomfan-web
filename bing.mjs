import axios from 'axios'

export default class BingSearchApi {
    constructor(config) {
        if (!config.key) throw new Error('subscription key is missing')
        this.baseUrl = config.url ?? 'https://api.bing.microsoft.com'
        this.subscriptionKey = config.key
        this.safeSearch = config.safeSearch ?? 'Strict'
    }

    async request(method, endpoint, params) {
        try {
            const response = await axios({
                method: method,
                headers: {
                    'Ocp-Apim-Subscription-Key' : this.subscriptionKey,
                },
                url: `${this.baseUrl}${endpoint}`,
                params, params
            })
            return response
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data.error)

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request)
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message)
            }
        }
    }

    async imageSearch(params) {
        const response = await this.request('get', '/v7.0/images/search', params)
        return response.data
    }

    async getImageList(term, limit = 300) {
        const params = {
            'q': term,
            'safeSearch': this.safeSearch,
            'minWidth': '600',
            'maxWidth': '1000',
            'mkt': 'en-GB',
            'count': limit
        }

        const results = await this.imageSearch(params)
        if (!results.value || !results.value.length) throw new Error('no results for image search')

        let list = results.value.map(x=>{
            return {
                name: x.name,
                url: x.contentUrl
            }
        })
        list = list.filter(x=>x.url.startsWith('https'))
        return list
    }
}
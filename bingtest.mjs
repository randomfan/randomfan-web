import BingSearchApi from './bing.mjs'
const bingSearchSubscriptionKey = process.env.BING_SEARCH_API_KEY
const api = new BingSearchApi({key: bingSearchSubscriptionKey})

const results = await api.getImageList('fan', 200)
console.log(results)
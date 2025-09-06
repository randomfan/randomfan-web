import getImageList from './lib/serpapi.mjs'
const apikey = process.env.SERP_API_KEY

const results = await getImageList('fan', apikey)
console.log(results)
console.log(results.length)
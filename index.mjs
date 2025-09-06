// index.mjs

/**
 * Required External Modules
 */

import express from 'express'
import path from 'path'
import Graceful from '@ladjs/graceful'
import actuator from 'express-actuator'
import { fileURLToPath } from 'url'
import getImageList from './lib/serpapi.mjs'

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || '8000'
const apikey = process.env.SERP_API_KEY
const topic = process.env.TOPIC ?? 'fan'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")
app.use(express.static(path.join(__dirname, "public")))
const options = {
    customEndpoints: [
        {
            id: 'data',
            controller: (req, res) => {
                res.status(200).json({
                    topic: topic,
                    dataset: images.length
                })
            }
        }
    ]
}
app.use(actuator(options))

// get image list
let images = []
try {
    images = await getImageList(topic, apikey)
    console.log('retrieved list of images to use')
    console.log('size of dataset is ' + images.length)
} catch (error) {
    console.log(error.message)
    console.log('will use default error image')
    images.push({name: 'this is not supposed to be here...', url: '/error.jpg'})
}

/**
 * Routes Definitions
 */

app.get('/', async (req, res) => {
    // pick random image
    const randomIndex = Math.floor(Math.random() * images.length)
    const randomImage = images[randomIndex]
    res.render("index", { title: "random picture of a " + topic, imageUrl: randomImage.url, imageAlt: randomImage.name })
})

app.get('/debug', async (req, res) => {
    res.render("debug", { data: JSON.stringify(images) })
})

/**
 * Server Activation
 */

const server = app.listen(port, () => {
    console.log(`listening to requests on http://localhost:${port}`)
})
const graceful = new Graceful({ servers: [server] })
graceful.listen()
import { getJson } from "serpapi";

export default async function getImageList(needle, apikey) {
    const response = await getJson({
        api_key: apikey,
        engine: 'google_images',
        google_domain: 'google.com',
        q: needle,
        hl: "en",
        gl: "uk",
        imgsz: "svga"
    })

    if (response.images_results) {
        return response.images_results.map(x=>{
            return {
                name: x.title,
                url: x.original
            }
        })
    } else {
        console.log('no image result in response')
        console.log(response)
        throw new Error('image search failure')
    }
}


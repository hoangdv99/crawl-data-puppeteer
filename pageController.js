import { audioListScraper, audioDetailScraper } from './pageScraper.js'
async function scrapeAudioList(browserInstance){
    let browser;
    try{
        browser = await browserInstance
        await audioListScraper.scraper(browser)
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err)
    }
}

async function scrapeDetail(browserInstance) {
    let browser
    try{
        browser = await browserInstance
        await audioDetailScraper.scraper(browser)
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err)
    }
}

export {
  scrapeAudioList,
  scrapeDetail
}

import startBrowser from './browser.js'
import { scrapeAudioList, scrapeDetail } from './pageController.js'
import fs from 'fs'

//Start the browser and create a browser instance
let browserInstance = startBrowser()

// // Pass the browser instance to the scraper controller

scrapeDetail(browserInstance)

// const audios = JSON.parse(fs.readFileSync('audioList.json'))
// const data = []
// for (let i = 0; i < audios.length; i++) {  
//   for (let j = 0; j < audios[i].topicIds.length; j++) {
//     const item = {
//       audio_id: i + 3,
//       topic_id: audios[i].topicIds[j]
//     }
//     data.push(item)
//   }
// }

//import slugify from 'slugify'

// const slugified = audios.map(audio => slugify(audio.title, {lower: true,locale: 'vi'}))
// console.log(slugified)

// fs.writeFile('audio_topic.json', JSON.stringify(data), () => {
//   console.log(`Done ${audios.length} item`);
// })
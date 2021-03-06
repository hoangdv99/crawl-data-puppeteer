import fs from 'fs'
import voiceBook from './crawl.js'

const audioListScraper = {
  urls: [
    'https://hemradio.com/truyen-ngan/',
    'https://hemradio.com/truyen-dai/',
    'https://hemradio.com/sach-noi/',
  ],
  async scraper(browser) {
    let page = await browser.newPage()
    let audioList = []
    for (let i = 0; i < this.urls.length; i++) {
      try {
        await page.goto(this.urls[i])
        let count = 0
        while (count < 100){
          page.waitForSelector('.pages-nav').then(() => {
            page.click('.pages-nav')
          })
          count++
        }
        // const list = await page.evaluate(() => {
        //   let list = []
        //   let items = document.querySelectorAll('.post-title > a')
        //   let thumbs = document.querySelectorAll('.wp-post-image')
        //   items.forEach((item, index) => {
        //     list.push({
        //       tag: index,
        //       title: item.innerText,
        //       url: item.getAttribute('href'),
        //       thumbnail: thumbs[index].getAttribute('src')
        //     })
        //   })
        //   return list
        // })
        // audioList = audioList.concat(list)
        await page.waitFor(5000)
      } catch (error) {
        console.log(error);
        continue
      }
    }
    fs.writeFile('titleList.json', JSON.stringify(audioList), () => {
      console.log(`Done ${audioList.length} item`);
    })
    await browser.close()
  }
}

const audioDetailScraper = {
  async scraper(browser) {
    const links = voiceBook
    console.log(links);
    const audioList = []
    for (let i = 0; i < links.length; i++) {
      console.log(links[i]);
      // delete links[i].tag
      // links[i].author = links[i].title.split('|').pop().trim()
      // links[i].title = links[i].title.split('|')[0].trim()

      let page = await browser.newPage()
      // page.on('console', async (msg) => {
      //   const msgArgs = msg.args();
      //   for (let i = 0; i < msgArgs.length; ++i) {
      //     console.log(await msgArgs[i].jsonValue());
      //   }
      // });
      let audio = {}
      await page.goto(links[i])
      try {
        const details = await page.evaluate(() => {
          const header = document.querySelector('.entry-header > .entry-title') ? document.querySelector('.entry-header > .entry-title').innerText : ''
          const isMeJs = document.querySelector('.mejs-audio')
          if (!isMeJs) return null
          const voices = [
            'Tr???n Ng???c San',
            'K??? Tr???m H????ng',
            'H???m Radio',
            'Ph??? Radio',
            'Nguy???n Huy',
            'Nguy???n Nguy???n',
            'Tr?????ng T??n',
            'T???nh Kh???u',
            'Th??i Ho??ng Phi',
            'Nam Phong',
            'Anh Kh??i',
            'Bookaholic',
            'Hi???u.Tv',
            'Thy Mai',
            'Kim Ph?????ng',
            'Y???n Linh',
            'Tr??i T??o',
            'L??? H???ng',
            'Qu???nh Nga',
            'S??i G??n Voice',
            'Xu??n Hi???u',
            'VOH',
            '??i H??a',
            'Anh Chi',
            'Thanh Tr??c',
            'Hu???nh Th??',
            'An ?????ng',
            'Ph????ng Minh',
            'Trinh'
          ].map(voice => voice.toLowerCase())
          let voiceId = 0
          let description = ''
          let thumbnailUrl = ''
          if (document.querySelector('.entry-sub-title')) { voiceId = voices.indexOf(document.querySelector('.entry-sub-title').innerText.split(':')[1].trim().toLowerCase()) + 1}
          const audioUrl = document.querySelector('audio').getAttribute('src')
          description = document.querySelector('.entry-content > p') ? document.querySelector('.entry-content > p').innerText : ''
          thumbnailUrl = document.querySelector('.attachment-jannah-image-post') ? document.querySelector('.attachment-jannah-image-post').getAttribute('src') : ''
          let topics = ['T??nh Y??u', 'S???ng ?????p', 'K??? N??ng s???ng', 'S??ch kinh t???', 'Truy???n teen', 'Thi???u nhi', 'Ph???t gi??o', 'Gia ????nh', 'V??n h???c h???c ???????ng', 'T?? li???u', 'LGBT', 'Kinh d???', 'Ki???n th???c', 'Tring th??m']
          topics = topics.map(topic => topic.toLowerCase())
          let topicIds = []
          document.querySelectorAll('.tagcloud > a').forEach(e => {
            const topicId = topics.indexOf(e.innerText.toLowerCase())
            if (topicId !== -1) topicIds.push(topicId + 1)
          })
      
          return { voiceId, audioUrl, description, topicIds, thumbnailUrl, header }
  
        })
        if (details) {
          //console.log(details);
          audio.voiceId = details.voiceId
          audio.url = details.audioUrl
          audio.description = details.description
          audio.topicIds = details.topicIds
          audio.thumbnailUrl = details.thumbnailUrl
          audio.type = 3
          audio.title = details.header.split('|')[0]?.trim() || ''
          audio.author = details.header.split('|')[1]?.trim() || ''
          audioList.push(audio)
        }
        fs.appendFileSync('audioList3.json', JSON.stringify(audio) + ',', () => {
          console.log(`Done ${audioList.length} item`);
        })
      } catch (error) {
        console.log(error);
      }
      await page.waitFor(2000)
      await page.close()
    }
    await browser.close()
    
  }
}

export { audioListScraper, audioDetailScraper }



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
            'Trần Ngọc San',
            'Kẻ Trộm Hương',
            'Hẻm Radio',
            'Phố Radio',
            'Nguyễn Huy',
            'Nguyễn Nguyễn',
            'Trường Tân',
            'Tịnh Khẩu',
            'Thái Hoàng Phi',
            'Nam Phong',
            'Anh Khôi',
            'Bookaholic',
            'Hiếu.Tv',
            'Thy Mai',
            'Kim Phượng',
            'Yến Linh',
            'Trái Táo',
            'Lệ Hằng',
            'Quỳnh Nga',
            'Sài Gòn Voice',
            'Xuân Hiếu',
            'VOH',
            'Ái Hòa',
            'Anh Chi',
            'Thanh Trúc',
            'Huỳnh Thơ',
            'An Đồng',
            'Phương Minh',
            'Trinh'
          ].map(voice => voice.toLowerCase())
          let voiceId = 0
          let description = ''
          let thumbnailUrl = ''
          if (document.querySelector('.entry-sub-title')) { voiceId = voices.indexOf(document.querySelector('.entry-sub-title').innerText.split(':')[1].trim().toLowerCase()) + 1}
          const audioUrl = document.querySelector('audio').getAttribute('src')
          description = document.querySelector('.entry-content > p') ? document.querySelector('.entry-content > p').innerText : ''
          thumbnailUrl = document.querySelector('.attachment-jannah-image-post') ? document.querySelector('.attachment-jannah-image-post').getAttribute('src') : ''
          let topics = ['Tình Yêu', 'Sống Đẹp', 'Kỹ Năng sống', 'Sách kinh tế', 'Truyện teen', 'Thiếu nhi', 'Phật giáo', 'Gia đình', 'Văn học học đường', 'Tư liệu', 'LGBT', 'Kinh dị', 'Kiến thức', 'Tring thám']
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



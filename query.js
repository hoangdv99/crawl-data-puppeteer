import shortStories from './audioList1.json'
import slugify from 'slugify'
import fs from 'fs'


shortStories.slice(0, 1).forEach((e, index) => {
  const slug = slugify(e.title, {lower: true,locale: 'vi'})
  const insertAudioQuery = `INSERT INTO audios (id, title, description, url, author, thumbnail_url, posted_by, voice_id, slug, type, created_at, updated_at) values(
    ${index + 1},'${e.title}','${e.description}', '${e.url}', '${e.author}', '${e.thumbnailUrl}', 1, ${e.voiceId}, '${slug}',1, now(), now()
  );\n`
  fs.appendFileSync('query.txt', insertAudioQuery, () => {
    console.log(`Done`);
  })
  e.topicIds.forEach(topic => {
    const insertTopicQuery = `INSERT INTO audio_topic (audio_id, topic_id) values (${topic}, ${index+1});\n`
    fs.appendFileSync('query.txt', insertTopicQuery, () => {
      console.log(`Done`);
    })
  })
  
})

const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3')
const visualRecognition = new VisualRecognitionV3({ version: '2018-03-19' })
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: './public/images' })
const fs = require('fs')

const app = express()
  .use(express.static('public'))
  .set('view engine', 'hbs')
  .get('/', (req, res) => res.render('form'))
  .post('/', upload.single('image'), async (req, res) => {
    const result = await visualRecognition.classify({
      images_file: fs.createReadStream(req.file.path),
      classifier_ids: ["DefaultCustomModel_850992278"]
    })

    console.log(JSON.stringify(result, null, 2))
    res.render('result', {
      classes: result.images[0].classifiers[0].classes,
      path: `images/${req.file.filename}`
    })
  })

app.listen(3000, err => {
  if (err) console.error(err)
  else console.log('Server running at http://localhost:3000!')
})

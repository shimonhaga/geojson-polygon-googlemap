require('dotenv').config()

// --------------------------------------------------
// setup
// --------------------------------------------------
const express = require('express')

const app = express()
const port = process.env.SERVER_PORT || 3002

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

// --------------------------------------------------
// routing
// --------------------------------------------------
app.get('/', (request, response) => {
  response.render(
    __dirname + '/src/index.ejs',
    { google_api_key: process.env.GOOGLE_API_KEY }
  )
})

// app.post('/geojson', (request, response) => {
//   const { geojson } = request.body
//   if (!geojson) {
//     response.status(500).json({ error: 'geojson がありません' })
//     return
//   }
//   response.json({ success: true })
// })

// --------------------------------------------------
// run
// --------------------------------------------------
const listener = app.listen(port, () => {
  console.log('listen: ' + listener.address().port)
})

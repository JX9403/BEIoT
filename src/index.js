const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 8081

const webRoutes = require('./routes/web')
const apiRoutes = require('./routes/api')

const connection = require('./config/database')

// config request body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', webRoutes);
app.use('/v1/api/', apiRoutes);


// test connection

(async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (error) {
    console.log(`Error connected to DB: `, error)
  }
})()


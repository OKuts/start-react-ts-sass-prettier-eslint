const express = require('express')
const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator')
require('dotenv').config()

const Card = require('./models/Card')
const Order = require('./models/Order')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology: true, useNewUrlParser: true})
    app.listen(process.env.PORT, ()=> {
      console.log('Server start')
    })
  } catch (error) {
    console.log('Server error', error.message)
    process.exit(1)
  }
}

app.get('/api/cards', async (req, res)=> {
  try {
    const cards = await Card.find()
    res.json(cards)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

app.get('/', (req, res) => {
    res.send("req")
})

app.post(
  '/api/order',
  body('name').isLength({min: 6} ),
  body('phone').isNumeric(),
  async (req, res)=> {
  try {
    const errors = validationResult(req)
    console.log(errors)
    const {name, phone} = req.body
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }
    const order = new Order({name, phone})
    await order.save()
    res.json(order)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

start()

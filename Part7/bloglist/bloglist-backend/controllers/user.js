const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', async(req, res) => {
  const users = await User.find({})
    .populate('blogs', {
      title: 1,
      url: 1,
      author: 1,
      likes: 1
    })

  const usersToJson = users.map(user => user.toJSON())

  res.status(200).json(usersToJson)
})

router.get('/:id', async(req, res) => {
  const user = await User.find(req.params.id)
    .populate('blogs', {
      title: 1,
      url: 1,
      author: 1,
      likes: 1
    })

  res.status(200).json(user.toJSON())
})

router.post('/', async (req, res) => {
  const body = req.body

  if (body.password.length < 3) {
    return res.status(401).json({
      error: 'password is too short'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  res.json(savedUser.toJSON())
})

module.exports = router
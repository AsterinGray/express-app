const express = require('express')
const { homeIndex, loginIndex, loginAction, idIndex } = require('./controllers')
const router = express.Router()

router.get('/', homeIndex) // ctrl + space
router.get('/login', loginIndex)
router.post('/login', loginAction)
router.get('/:id', idIndex)

module.exports = router

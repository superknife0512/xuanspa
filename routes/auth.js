const express = require('express');
const authCtrl = require('../controllers/authCtrl');
const router = express.Router();

// router.get('/signup', authCtrl.getSignup);
// router.post('/signup', authCtrl.postSignup);

router.get('/signin', authCtrl.getSignin);
router.post('/signin', authCtrl.postSignin);

router.post('/logout', authCtrl.logout);

module.exports = router;
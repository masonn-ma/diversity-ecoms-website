const express = require('express');
const router = express.Router();

const timeLog = (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
}
router.use(timeLog)

router.get('/', (req, res) => { // About us
    const userName = req.cookies.username;
    const darkMode = req.cookies.darkmode;
    res.render('site/aboutus', { username: userName, dark: darkMode });
});

module.exports = router
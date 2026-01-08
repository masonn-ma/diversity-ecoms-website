const express = require('express');
const router = express.Router();

const timeLog = (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
}
router.use(timeLog)

router.get('/', async (req, res) => { // Landing page
    const userName = req.cookies.username;
    const darkMode = req.cookies.darkmode;
    const prodFromDb = await Prod.find();
    res.render('site/index', { username: userName, prodList: prodFromDb, dark: darkMode });
  });

module.exports = router
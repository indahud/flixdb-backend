const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")

const User = require('../Models/User'); 

router.post('/', async (req, res) => {
    const { username, email, password, age } = req.body
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const result = await User.findOneAndUpdate(
            { username }, 
            { username, email, password: hash, age },
            { new: true, upsert: true }
            )
        res.json(result);
    } catch (err) {
        res.json({message: err });
    } 
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const pass = await User.findOne({ username }, { password: 1 }).lean();
        const response = await bcrypt.compare(password, pass.password )
        
        if (response) {
            return res.status(200).json({ code: 'Success', messsage: 'Logged in successfully' })
        }

        return res.json({ code: 'Failure', message: 'Login failed'});
    } catch (err) {
        res.json({message: err });
    } 
});

router.get('/details/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const result = await User.findOne({ username }, { username: 1, age: 1 }).lean()
        return res.status(200).json(result);
    } catch (err) {
        return res.json({ message : err });
    }
});




module.exports = router;    
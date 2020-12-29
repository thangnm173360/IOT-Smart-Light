const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validations/auth');
const auth = require('../middlewares/auth');
const User = require('../models/User');

const router = require('express').Router();

//Register
router.post('/register', async (req, res) => {
    //Validate schema before add a user
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).json({code: 400, message: error.details[0].message });

    //Checking if the email is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
        return res.status(400).json({code: 400 ,message: 'Email already exists' });

    //Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
    });
    try {
        const savedUser = await user.save();
        res.status(200).json({code: 200, savedUser});
    } catch (err) {
        res.status(400).json({code: 400, message: err.message });
    }
});

//Login
router.post('/login', async (req, res) => {
    //Validate schema
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).json({code: 400, message: error.details[0].message });

    //Checking if the email is not already in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({code: 400, message: 'Email is wrong' });

    //Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).json({code: 400, message: 'Invalid password' });

    //Create and assign a token
    const token = jwt.sign(
        { email: user.email, role: user.role, name: user.name },
        process.env.TOKEN_SECRET
    );
    res.status(200).json({code: 200, accessToken: token });
});

router.post('/', auth('admin'), async (req, res) => {
    try {
        res.status(200).json({code: 200});
    } catch (error) {
        res.status(402).json({code: 402});
    }
});

module.exports = router;

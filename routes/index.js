const express = require('express');
const path = require('path');
const jwt = require('jwt-simple');
const config = require('../config');

const router = express.Router();


const createToken = (username, creds) => {
    const body = { "username": username, 'isAdmin': creds };
    return jwt.encode(body, config.privatekey, 'RS256');
}

const adminMiddleWare = async (req, res, next) => {
    let decoded = {};
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1];
        try {
            decoded = jwt.decode(token, config.publickey); // verify it 
        } catch (err) {
            return res.json({ msg: 'Token is not valid.' });
        }
        res.locals.token = decoded;
    }
    next();
}

router.get('/', (_req, res) => {
    return res.sendFile('index.html', { root: path.join(__dirname + '../public') });
});

router.post('/checkin', (req, res) => {
    let { username } = req.body;
    console.log(username);
    if (typeof (username) === 'string') {
        const creds = 'false';  // you are guest
        if (1 + 1 === 3) {
            creds = "true";  // you are admin
        }
        const token = createToken(username, creds)
        resp = { msg: "Successfully checkin!", token: token };
    } else {
        resp = { msg: 'Invalid username!' };
    }
    return res.json(resp)
});

router.get('/admin', (_req, res) => {
    return res.sendFile('admin.html', { root: path.join(__dirname + '../public') });
});

router.get('/admin/secret', adminMiddleWare, (_req, res) => {
    let resp;
    if (res.locals.token && res.locals.token.isAdmin === 'true') {
        resp = { msg: config.SuperSecret }; // secret only for admin 
    } else {
        resp = { msg: 'Only admin is qualified for it.' };
    }
    return res.json(resp);
});

module.exports = router;

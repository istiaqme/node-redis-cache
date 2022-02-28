const express = require('express');
const router = express.Router();
const needle = require('needle');
const url = require('url');
const redis = require('redis');

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Setup Redis Cache
const redisClient = redis.createClient(REDIS_PORT);

function redisCacheCity (req, res, next) {
    const city = url.parse(req.url, true).query.q;
    redisClient.get(username, (err, data) => {
        if(err) throw err;
        if(data !== null){
            res.status(200).json(data);
        }
        else{
            next(); 
        }
    })
}


router.get('/', redisCacheCity() , async (req, res) => {
    try { 
        const queryParams = new URLSearchParams({
            [API_KEY_NAME] : API_KEY_VALUE,
            ...url.parse(req.url, true).query,
        });
        console.log(queryParams)
        const apiRes = await needle('get', `${API_BASE_URL}?${queryParams}`);
        const data = apiRes.body;
        if(process.env.NODE_ENV !== "production"){
            console.log(`Outer Request: ${API_BASE_URL}?${queryParams}`);
        }
        // Set data in Redis
        redisClient.setEx(url.parse(req.url, true).query.q, 3600, data);

        res.status(200).json(data); 
    }
    catch(error){
        console.log(error);
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();


router.post('/addSong', async(req, res) => {
    const { name, url } = req.body;
    const newSong = { name: name, url: url, date: new Date() };
    try{
        const result = await req.songsCollection.insertOne(newSong);
        res.status(201).json({ id: result.insertedId });
    } catch(error){
        console.log("Error adding song to MongoDB", error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
})

module.exports = router;
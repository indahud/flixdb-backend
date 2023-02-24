const express = require('express');
const router = express.Router();
const Movies = require('../Models/Movies');
const { getCount } = require('../utils');
var ObjectId = require('mongodb').ObjectID;


router.post('/search', async (req, res) => {
    try {
        const { query } = req.body

        if (!query) {
            return res.status(500).json({ message: 'cant be empty' })
        }
        
        const searchList = await Movies.find({ $text: { $search: query }})
        if (searchList.length === 0) {
            return res.status(500).json({ status: 'empty', message: 'looks like no matching movies' });
        } 
        
        return res.status(200).json(searchList);
    } catch (err) {
        return res.json({message: err });
    } 
});

router.get('/all/:restricted/:page/', async (req, res) => {
    try {
        const { page, restricted } = req.params;
        
        if (restricted === 'y') {
            const lastPage = await Movies.find({ rating: { $ne: 'R' } }).countDocuments();
            const count = Math.ceil(lastPage / 10);

            if (page > count) {
                return res.status(500).json({ message: 'You have reached the the end'})
            }

            const { skip, limit } = paginate(page)

            const all = await Movies.find({ rating: { $ne: 'R' } }).skip(skip).limit(limit).lean();
            return res.status(200).json(all);

        }

        const lastPage = await Movies.find().countDocuments();
        const count = Math.ceil(lastPage / 10);


        if (page > count) {
            return res.status(500).json({ message: 'You have reached the the end'})
        }

        const { skip, limit } = paginate(page)

        const all = await Movies.find().skip(skip).limit(limit).lean();
        return res.status(200).json(all);
    } catch (err) {
        return res.json({ message : err });
    }
});

router.get('/movies/:page', async (req, res) => {
    try {
        const { page } = req.params;
        const lastPage = await Movies.find({ type: 'Movie' }).countDocuments();
        const count = Math.ceil(lastPage / 10);

        if (page > count) {
            return res.status(500).json({ message: 'You have reached the the end'})
        }

        const { skip, limit } = paginate(page)

        const movies = await Movies.find({ type: 'Movie' }).skip(skip).limit(limit).lean();
        return res.status(200).json(movies);
    } catch (err) {
        return res.json({message : err});
    }
});

router.get('/tv/:page', async (req, res) => {
    try {
        const { page } = req.params;
        const lastPage = await Movies.find({ type: 'TV Show' }).countDocuments();
        const count = getCount(lastPage)
        
        if (page > count) {
            return res.status(500).json({ message: 'You have reached the the end'})
        }
        const { skip, limit } = paginate(page)


        const tv = await Movies.find({ type: 'TV Show' }).skip(skip).limit(limit).lean();
        return res.status(200).json(tv);
    } catch (err) {
        return res.json({ message : err });
    }
});

router.get('/single/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const result = await Movies.findOne({ "_id": new ObjectId(_id) })
        return res.status(200).json(result);
    } catch (err) {
        return res.json({ message : err });
    }
});



module.exports = router;    

const paginate = (pageNo) => {
    return {
        skip: parseInt(10, 10) * (pageNo - 1),
        limit: parseInt(10, 10),
    }
}
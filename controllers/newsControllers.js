const {formidable} = require('formidable')
const cloudinary = require('cloudinary').v2
const newsModel = require('../models/newsModel')
const {mongo: { ObjectId }} = require('mongoose')
const moment = require('moment')
const galleryModel = require('../models/galleryModel')

class newsControllers {

    add_news = async (req,res) => {
        // console.log('add news') 
        const { id, name, category } = req.userInfoNew
        const form = formidable({})

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        });

        try {
            const [ fields, files ] = await form.parse(req)
            const { url } = await cloudinary.uploader.upload(files.image[0].filepath, {folder: 'news_images'})
            const {title, description} = fields

            const news = await newsModel.create({
                writerId: id,
                writerName: name,
                title: title[0].trim(), 
                slug: title[0].trim().split(' ').join('-'),
                category, 
                description: description[0],
                date: moment().format('LL'),
                image: url
            })
            return res.status(201).json({message: 'News Added Successfully',news})
            
        } catch (error) {
              return res.status(500).json({message: 'Internal server Error'})
        } 
    }

    get_images = async (req, res) => {
        const {id} = req.userInfoNew
        // console.log(id)
        try {
            const images = await galleryModel.find({ writerId: new ObjectId(id) }).sort({ createdAt: -1 })
            return res.status(201).json({ images })
         } catch (error) {
             return res.status(500).json({message: 'Internal server Error'})
         }
    }

    add_images = async (req, res) => {

    }
}

module.exports = new newsControllers()
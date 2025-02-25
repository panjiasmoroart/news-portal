const {formidable} = require('formidable')
const cloudinary = require('cloudinary').v2
const newsModel = require('../models/newsModel')
const {mongo: { ObjectId }} = require('mongoose')
const moment = require('moment')

class newsControllers {

    add_news = async (req,res) => {
        // console.log('add news') 
        const { id, name, category } = req.userInfo
        const form = formidable({})

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        })
    }
}

module.exports = new newsControllers()
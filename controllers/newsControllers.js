const {formidable} = require('formidable')
const cloudinary = require('cloudinary').v2
const newsModel = require('../models/newsModel')
const authModel = require('../models/authModel')
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
        const { id } = req.userInfoNew
        const form = formidable({})

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        })

        try {
            const [ _, files ] = await form.parse(req);
            let allImages = [];
            const { images } = files;

            for (let i = 0; i < images.length; i++) {
                const { url } = await cloudinary.uploader.upload(images[i].filepath, {folder: 'news_images'});
                allImages.push({ writerId: id,url });
            }

            const image = await galleryModel.insertMany(allImages);
            
            return res.status(201).json({ 
                images:image, 
                message: "Images Uploaded Successfully" 
            });

        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'});
        }
    }

    get_dashboard_news = async (req, res) => {
        const {id, role} = req.userInfoNew
      try {
        if (role === 'admin') {
            const news = await newsModel.find({}).sort({ createdAt: -1 })
            return res.status(200).json({ news })
        } else {
            const news = await newsModel.find({ writerId: new ObjectId(id) }).sort({ createdAt: -1 })
            return res.status(200).json({ news })
        }
        
      } catch (error) {
        return res.status(500).json({message: 'Internal server Error'})
      }
    }

    get_edit_dashboard_news = async(req, res) => {
        const {news_id} = req.params 
        try {
            const news = await newsModel.findById(news_id)
            return res.status(200).json({news})
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    }

    update_news = async (req,res) => {
        const { news_id } = req.params
        const form = formidable({})
    
        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        })
    
        try {
            const [ fields, files ] = await form.parse(req)
            const {title,description} = fields
            let url = fields.old_image[0]
     
            if (Object.keys(files).length > 0) {
                const spliteImage = url.split('/')
                const imagesFile = spliteImage[spliteImage.length - 1].split('.')[0]
                await cloudinary.uploader.destroy(imagesFile); 
                const data = await cloudinary.uploader.upload(files.new_image[0].filepath, {folder: 'news_images'})
                url = data.url
            }
            
            const news = await newsModel.findByIdAndUpdate(news_id,{
                title: title[0].trim(), 
                slug: title[0].trim().split(' ').join('-'), 
                description: description[0], 
                image: url
            },{new: true});

            return res.status(201).json({
                message: 'News Updated Successfully',news
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Internal server Error'
            });
        } 
    }

    delete_news = async (req, res) => {
        const { news_id } = req.params
        // console.log(news_id)
        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        })
    
        try {
            const news = await newsModel.findById(news_id);
            if (!news) {
                return res.status(404).json({message: 'News not found'});
            }
    
            const imageUrl = news.image
            const publicId = imageUrl.split('/').pop().split('.')[0];
    
            await cloudinary.uploader.destroy(`news_images/${publicId}` ,(error,result) => {
                if (error)  {
                    console.log('error deleting image from cloudinary',error)
                    return res.status(500).json({ message: 'Failed to delete image form cloudinary' })
                }
                console.log('Image Deleted from Cloudinary',result)
            })
    
            await newsModel.findByIdAndDelete(news_id)
            return res.status(200).json({ message: 'News deleted with Image successfully' })
            
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    }
    
    update_news_status = async (req, res) => {

        const { role } = req.userInfoNew
        const { news_id} = req.params
        const { status } = req.body
    
        // console.log(role)
        // console.log(news_id)
        // console.log(status)

        if (role === 'admin') {
            const news = await newsModel.findByIdAndUpdate(news_id, {status},{news: true})
            return res.status(200).json({ message: 'News Status Updated Success', news})
        } else {
            return res.status(401).json({message: 'You cannot acess this api'})
        }
    
    }

    get_all_news = async (req,res) => {
        // console.log('get api')
        try {
            const category_news = await newsModel.aggregate([
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $match: {
                        status: 'active'
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        news: {
                            $push: {
                                _id: '$_id',
                                title: '$title',
                                slug: '$slug',
                                writerName: '$writerName',
                                image: '$image',
                                description: '$description',
                                date: '$date',
                                category: '$category',
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: '$_id',
                        news: {
                            $slice: ['$news', 5]
                        }
                    }
                }
            ])
    
        const news = {}
        for (let i = 0; i < category_news.length; i++) {
            news[category_news[i].category] = category_news[i].news 
        }
        return res.status(200).json({ news }) 
    
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        } 
        
    }

    get_categories = async(req,res) => {

        try {
            const categories = await newsModel.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: {$sum: 1}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$_id", 
                        count: 1
                    }
                }
            ])
            return res.status(200).json({categories})
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    
    }

    get_details_news = async (req, res) => {
        const { slug } = req.params;
        // console.log(slug);

        try {
            const news = await newsModel.findOneAndUpdate({ slug } , {
            $inc: { count:1 }
        }, { new: true})
    
            const relatedNews = await newsModel.find({
            $and: [
                {
                    slug: {
                        $ne: slug
                    }
                }, {
                    category: {
                        $eq: news.category
                    }
                }
            ]
        }).limit(4).sort({ createAt: -1 })
            return res.status(200).json({ news: news ? news: {}, relatedNews});
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'});
        }
    }

    get_category_news = async (req, res) => {
        const {category} =  req.params
        // console.log(category);
        try {
            const news = await newsModel.find({
                $and: [
                    {
                        category: {
                            $eq: category
                        }
                    },
                    {
                        status: {
                            $eq: 'active'
                        }
                    }
                ]
            })
    
            return res.status(201).json({ news })
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    }

    get_popular_news = async (req, res) => {

        try {
            const popularNews = await newsModel.find({ status: 'active' }).sort({count: -1 }).limit(4)
            return res.status(200).json({ popularNews })
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    
    }

    get_latest_news = async (req, res) => {
        try {
            const news = await newsModel.find({ status: 'active' }).sort({createdAt: -1 }).limit(5)
            return res.status(200).json({ news })
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    }

    get_recent_news = async (req, res) => {
        try {
            const news = await newsModel.find({ status: 'active' }).sort({createdAt: -1 }).skip(6).limit(5)
            return res.status(200).json({ news })
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    }

    get_images_news = async (req, res) => {

        try {
            const images = await newsModel.aggregate([
                {
                    $match:{
                        status: 'active'
                    }
                },
                {
                    $sample: {
                        size: 9
                    }
                },
                {
                    $project: {
                        image: 1
                    }
                }
            ])
            return res.status(200).json({ images })
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    
    }

    news_search = async (req, res) => {
        const { value } =  req.query;
        // console.log(value); 
        try {
            if (!value) {
                return res.status(400).json({ message: 'Search value is required'})
            }
    
            const news = await newsModel.find({
                status: 'active',
                title: { $regex: value, $options: 'i' }
            })
            return res.status(200).json({ news })
            
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    }

    news_statistics = async (req, res) => {
        try {
            const totalNews = await newsModel.countDocuments()
            const pendingNews = await newsModel.countDocuments({ status: 'pending' })
            const activeNews = await newsModel.countDocuments({ status: 'active' })
            const deactiveNews = await newsModel.countDocuments({ status: 'deactive' })
            const totalWriters = await authModel.countDocuments({ role: 'writer' })
            
            return res.status(200).json({
                totalNews,
                pendingNews,
                activeNews,
                deactiveNews,
                totalWriters
            });    
        } catch (error) {
            return res.status(500).json({
                message: 'Internal server Error'
            });
        }
    }
        
}

module.exports = new newsControllers()
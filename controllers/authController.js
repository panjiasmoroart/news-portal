const authModel = require('../models/authModel');

class authController {
    
    login = async(req,res) => {
        console.log('controller login');
    }
}

module.exports = new authController()
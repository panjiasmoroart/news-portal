const jwt = require('jsonwebtoken');

class middleware {

    auth = async(req,res, next) => {
        const { authorization } = req.headers;
        
        if (authorization) {
            const token = authorization.split('Bearer ')[1];
            
            if (token) {
                try {
                    const userInfo = await jwt.verify(token, process.env.secret);
                    req.userInfoNew = userInfo;
                    next();
                } catch (error) {
                    return res.status(401).json({ 
                        message: 'Unauthorized'
                    });
                }
            }
            else {
                return res.status(401).json({ 
                    message: 'Unauthorized'
                });
            }

        }else{
            return res.status(401).json({ 
                message: 'Unauthorized'
            });
        }
    }

    role = async (req,res, next) => {
        // console.log(req);
        const { userInfoNew } = req
        if (userInfoNew.role === 'admin' || userInfoNew.role === 'writer') {
            next();
        }else {
            return res.status(401).json({ 
                message: 'Unable to access this api'
            });
        }
    } 

    
}

module.exports = new middleware()
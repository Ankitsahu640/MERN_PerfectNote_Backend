const jwt = require('jsonwebtoken');

const jwt_secret = "toextendwarentycall18004254999";

const fetchUser=async(req,res,next)=>{
    const token = req.header("auth-token");
    if(!token){
        return res.status(401).send({error:"Please authenticate with valid token"})
    }
    try{
        const data = jwt.verify(token,jwt_secret);
        req.id = data.id;
        next();
    }
    catch{
        return res.status(401).send({error:"Please authenticate with valid token"});
    }
}

module.exports = fetchUser;
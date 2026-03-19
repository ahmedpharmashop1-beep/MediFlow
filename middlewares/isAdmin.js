module.exports=function (req,res,next){
    if(!req.user.isAdmin){
        return res.status(403).send({errors:[{msg:'Not Admin'}]});
    }
    next();
}
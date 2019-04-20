
module.exports = (req,res,next)=>{
    if(req.session.isLogin !== true){
        res.redirect('/auth/signin')
    } else {
        next()
    }
}
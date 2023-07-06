const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs')

exports.getSignup = async (req,res,next)=>{
    try {
        res.render('auth/signup',{
            title: 'Signup',
            err: null
        })
        
    } catch (err) {
        next(err)
    }
}

exports.postSignup = async (req,res,next)=>{
    try {
        const email = req.body.email;
        const existedAdmin = await Admin.findOne({email: email});
        if (existedAdmin) {
            res.redirect('/auth/signup')
        }

        const password = req.body.password;

        const hasPass =await bcrypt.hash(password, 10);

        const admin = new Admin({
            email,
            password: hasPass
        })
        
        await admin.save();
        res.redirect('/auth/signin')
    } catch (err) {
        next(err)
    }
}

exports.getSignin = async (req,res,next)=>{
    try {
        res.render('auth/signin', {
            title: 'Sign in',
            err: null
        })
    } catch (err) {
        next(err)
    }
}

exports.postSignin = async (req,res,next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const admin = await Admin.findOne({email: email});
        if(!admin){
            res.render('auth/signin', {
                title: 'Sign in',
                err: 'Email is not existed yet'
            })
        }
        const result = bcrypt.compare(password, admin.password);
        if(!result){
            res.render('auth/signin', {
                title: 'Sign in',
                err: 'Password is not correct'
            })
        }

        req.session.admin = admin;
        req.session.isLogin = true;
        req.session.save((err)=>{
            if(err){
                throw err
            } else {
                res.redirect('/admin')
            }
        })

    } catch (err) {
        
    }
}

exports.logout = async (req,res,next)=>{
    try {
        req.session.destroy(err=>{
            if(err){
                throw err
            } else {
                res.redirect('/auth/signin')
            }
        });
    } catch (err) {
        next(err)
    }
}
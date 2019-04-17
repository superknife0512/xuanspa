const fs = require('fs');

module.exports = (pathlink)=>{
    fs.unlink(pathlink, err=>{
        if(err){
            throw err
        } else {
            console.log('Has deleted the old files');
        }
    })
}
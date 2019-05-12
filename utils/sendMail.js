const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const toEmail = process.env.DEFAULT_EMAIL;

module.exports = (from, subject, html, to = toEmail) => {
    const msg = {
      to,
      from,
      subject,
      html,
    };
    sgMail.send(msg, err=>{
        if(err){
            throw err
        } else {
            console.log('Has sent a mail');
        }
    });
}
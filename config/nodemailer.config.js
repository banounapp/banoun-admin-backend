require("dotenv").config();
const nodemailer = require("nodemailer");
const config = require("../config/auth.config");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendReject = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: " عائلة بنون",
      // text: "" +"   " +confirmationCode,
      html: `<h3>
  <span  font-family: verdana;">  شكرا لتقديم طلبك </span> : نأسف جدا لعدم قبول طلبك كمتخصص عندنا يرجي التحقق من اليانات و التقدم في وقت اخر
    </h3>
    <b style="color:blue;"></b>`,
    })
    .catch((err) => console.log(err));
};

module.exports.sendApproval = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "عائلة بنون ",
      // text: "" +"   " +confirmationCode,
      html: `<h3>
  <span  font-family: verdana;">  شكرا لتقديم طلبك </span> : تهانينا انت الان فرد من عائلة بنون تم تفعيل حسابك يمكنك الان الدخول كمتخصص 
    </h3>
    <b style="color:blue;"></b>`,
    })
    .catch((err) => console.log(err));
};

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

      <img src ="file:///C:/Users/THE%20LAPTOP%20SHOP/Downloads/Logo01@2x.png"/>
  <span  font-family: verdana;">  شكرا لتقديم طلبك </span> : نأسف جدا لعدم قبول طلبك كمتخصص عندنا الرجاء التحقق من البيانات و التقديم في وقت اخر
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
      html: `

      
      <h3>

  <span  font-family: verdana;">  شكرا لتقديم طلبك </span> : تهانينا انت الان فرد من عائلة بنون تم تفعيل حسابك يمكنك الان الدخول كمتخصص 
    </h3>
    <b style="color:blue;"></b>`,
    })
    .catch((err) => console.log(err));
};

module.exports.sendDelEvent = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "عائلة بنون ",
      // text: "" +"   " +confirmationCode,
      html: `

      
      <h3>

  <span  font-family: verdana;">  شكرا لتقديم طلبك </span> :نأسف لك تم رفض الحدث الخاص بك و تم اضافة حدث اخري لحسابك يمكنك عمل طلب مرة اخري 
    </h3>
    <b style="color:blue;"></b>`,
    })
    .catch((err) => console.log(err));
};

module.exports.sendConnectus = (name, email, text) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "تواصل معانا",
      // text: "" +"   " +confirmationCode,
      html: `<h3>
  <span  font-family: verdana;"> ${name} اهلا</span> : ${text}
    </h3>
    <b style="color:blue;">عائلة بنون</b>
    
    `,
    })
    .catch((err) => console.log(err));
};

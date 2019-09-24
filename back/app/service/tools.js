'use strict';
const Service = require('egg').Service;
const nodemailer = require('nodemailer');
const svgCaptcha = require('svg-captcha');

const userEmail = '13829722776@163.com'; // 个人测试邮箱
const transporter = nodemailer.createTransport({
  service: 'smtp.163.com',
  host: 'smtp.163.com',
  port: 465, // 端口都为465,qq、163
  secureConnetion: true,
  auth: {
    user: userEmail,
    pass: 'liuhao1992', // 邮箱对应的POP3/SMTP/IMAP 授权码,不是邮箱密码
  },
});

class ToolsService extends Service {
  captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      // background:'#77b0f9'
    });
    return captcha;
  }
  async sendEmail(email, title, html) {
    const mailOptions = {
      from: userEmail,
      to: email,
      subject: title,
      text: '',
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = ToolsService;

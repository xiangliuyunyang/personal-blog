'use strict';

const md5 = require('md5');
const BaseController = require('./base');

class UserController extends BaseController {
  async index() {
    const { ctx } = this;
    ctx.body = '刘浩 个人信息';
  }
  async email() {
    // controller 写业务逻辑，通用的逻辑，抽象成service
    const { ctx } = this;
    const email = ctx.query.email;
    const code = Math.random()
      .toString()
      .slice(2, 6); // 随机生成四位数

    console.log('邮件' + email + '验证码是' + code);
    const title = '个人博客验证码';
    const html = `
      <h1>个人博客验证码</h1>
      <div>
        <a href="https://baidu.com/">${code}</a>
      </div>
    `;
    const hasSend = await this.service.tools.sendEmail(email, title, html);
    if (hasSend) {
      ctx.session.emailCode = code;
      this.message('发送成功');
    } else {
      this.error('发送失败');
    }
  }
  async captcha() {
    // 生成验证码，我们也需要service
    const { ctx } = this;
    const captcha = await this.service.tools.captcha();

    ctx.session.captcha = captcha.text;
    console.log('验证码' + captcha.text);
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
  async register() {
    const { ctx } = this;
    const { email, password, emailCode, captcha, userName } = ctx.request.body;
    console.log(emailCode, ctx.session.emailCode);
    if (emailCode !== ctx.session.emailCode) {
      return this.error('邮箱验证码出错');
    }
    console.log(captcha, ctx.session.captcha);
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('图片验证码错误');
    }
    if (await this.checkEmail(email)) {
      return this.error('邮箱已经存在');
    }
    const ret = await ctx.model.User.create({
      email,
      userName,
      password: md5(password),
    });
    if (ret._id) {
      this.success('注册成功');
    }
  }
}

module.exports = UserController;

<template>
  <el-container>
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="0">
          <!-- <img class="logo" src="/logo.png" alt /> -->
          <span>向流云扬</span>
        </el-menu-item>
        <el-menu-item index="1">
          <nuxt-link to="/">首页</nuxt-link>
        </el-menu-item>
        <el-menu-item v-if="userinfo.id" index="3" class="right">
          <nuxt-link to="/user">退出</nuxt-link>
        </el-menu-item>
        <el-menu-item v-if="userinfo.id" index="4" class="right">
          <nuxt-link to="/user">{{userinfo.nickname}}</nuxt-link>
        </el-menu-item>
        <el-menu-item v-if="userinfo.id" index="3" class="right">
          <nuxt-link to="/editor/new">
            <el-button type="primary">写文章</el-button>
          </nuxt-link>
        </el-menu-item>
        <el-menu-item v-if="!userinfo.id" index="2" class="right">
          <el-button type="text" @click="openAuth('register')">注册</el-button>
        </el-menu-item>
        <el-menu-item v-if="!userinfo.id" index="3" class="right">
          <el-button type="text" @click="openAuth('login')">登录</el-button>
        </el-menu-item>
      </el-menu>
    </el-header>

    <el-main>
      <nuxt />
      <div class="auth-modal-box" v-if="auth">
        <div class="auth-form">
          <i title="关闭" @click="closeAuth" class="close-btn el-icon-close"></i>
          <div class="panel">
            <h1 class="title">{{operation[currentOper]}}</h1>
            <el-form ref="form" :model="loginForm" v-if="currentOper == 'login'">
              <el-form-item>
                <el-input v-model="loginForm.phoneOrEmail" placeholder="请输入手机号或邮箱"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <el-form-item class="submit">
                <el-button
                  type="primary"
                  @click.native.prevent="handleLogin"
                >{{operation[currentOper]}}</el-button>
              </el-form-item>
            </el-form>
            <el-form
              ref="registerForm"
              :rules="registerRules"
              :model="registerForm"
              v-if="currentOper == 'register'"
            >
              <el-form-item prop="userName">
                <el-input v-model="registerForm.userName" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="email">
                <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item prop="emailCode">
                <el-input v-model="registerForm.emailCode" placeholder="邮箱验证码"></el-input>
                <el-button type="text" class="send-vcode-btn" @click="sendCode">获取验证码</el-button>
              </el-form-item>
              <el-form-item prop="captcha">
                <el-input v-model="registerForm.captcha" placeholder="请再次输入密码"></el-input>
                <div class="captcha-btn">
                  <img slot="append" :src="code.captcha" @click="resetCptcha" alt />
                </div>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="registerForm.password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <el-form-item prop="rePassword">
                <el-input v-model="registerForm.rePassword" placeholder="请再次输入密码"></el-input>
              </el-form-item>
              <el-form-item class="submit">
                <el-button
                  type="primary"
                  @click.native.prevent="handleRegister"
                >{{operation[currentOper]}}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="prompt-box" v-if="currentOper == 'login'">
            没有账号？
            <span class="clickable" @click="openAuth('register')">注册</span>
            <a data-v-e9db305a href="/reset-password" class="right clickable">忘记密码</a>
          </div>
          <div class="prompt-box center" v-if="currentOper == 'register'">
            <span class="clickable" @click="openAuth('login')">已有账号登录</span>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer>底部信息</el-footer>
  </el-container>
</template>
<script>

import md5 from 'md5'

export default {
  data () {
    return {
      auth: false,
      currentOper: '',
      operation: {
        register: '注册',
        login: '登录'
      },
      loginForm: {
        phoneOrEmail: 'xiangliuyunyang',
        password: 'aaaaa888'
      },
      registerForm: {
        userName: 'xiangliuyunyang',
        email: '863270685@qq.com',
        emailCode: '',
        password: 'aaaaa888',
        rePassword: 'aaaaa888',
        captcha: ''
      },
      code: {
        captcha: '/api/user/captcha'
      },
      registerRules: {
        userName: [{ required: true, message: '请输入用户名' }],
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱' },
        ],
        emailCode: [
          { required: true, message: '请输入邮箱验证码' },
        ],
        password: [
          { required: true, message: '请输入密码' },
          { max: 12, message: '密码长度12以内' },
        ],
        captcha: [
          { required: true, message: '请输入验证码' },
        ],
        repassword: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致，请重新输入'))
              } else {
                callback()
              }
            }
          }
        ]
      }

    }
  },
  mounted () {
  },
  methods: {
    openAuth (op) {
      this.auth = true
      this.currentOper = op
    },
    closeAuth () {
      this.auth = false
    },
    resetCptcha () {
      this.code.captcha = '/api/user/captcha?_t=' + new Date().getTime()
    },
    async sendCode () {
      let ret = await this.$http.get('/user/sendcode?email=' + this.registerForm.email)
      if (ret.code === 0) {
        this.$notify({
          title: '发送成功',
          type: 'success'
        })
      }
    },
    handleRegister () {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          console.log('loading状态切换')
          let obj = {
            email: this.registerForm.email,
            password: md5(this.registerForm.password),
            emailCode: this.registerForm.emailCode,
            captcha: this.registerForm.captcha,
            userName: this.registerForm.userName
          }
          console.log(obj)
          let ret = await this.$http.post('/user/register', obj)
          console.log(ret)
          if (ret.code === 0) {
            // 注册成功信息提醒

            // 跳转登录页
          } else {
            this.$notify({
              title: ret.message,
              type: 'warning'
            })
          }

        }
      })
    }
  }
}
</script>
<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.right {
  float: right !important;
}
.center {
  text-align: center;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
.logo {
  height: 37px;
}
a {
  text-decoration: none;
}
.auth-modal-box {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 500;
}
.auth-form {
  position: relative;
  padding: 2rem;
  width: 40rem;
  max-width: 100%;
  font-size: 1.167rem;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
}
.close-btn {
  float: right;
  cursor: pointer;
  opacity: 0.4;
}
.title {
  font-size: 1.5rem;
  margin: 0 0 2rem;
}
.el-form-item__content {
  position: relative;
  margin-bottom: 0.8rem;
}
.submit .el-button {
  width: 100%;
}
.prompt-box {
  margin: 1rem 0 0;
  color: #8b9196;
  .clickable {
    color: #007fff;
    cursor: pointer;
  }
}
.send-vcode-btn,
.captcha-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem 1.3rem;
  height: 100%;
  color: #007fff;
  line-height: 1;
  background-color: transparent;
}
.captcha-btn {
  padding: 0;
}
</style>

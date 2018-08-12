<template>
  <section class="login">
    <header class="login-header">
      <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon/>
    </header>

    <el-form class="login-form" auto-complete="off" :model="user" label-width="75px"
             :rules="rules" ref="loginForm">
      <h2 class="heading">Register</h2>
      <el-form-item label="Email" prop="email">
        <el-input type="text" v-model="user.email" placeholder="Please enter email">
        </el-input>
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input type="text" v-model="user.name" placeholder="Please enter username">
        </el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input type="password" v-model="user.password" placeholder="Please enter password">
        </el-input>
      </el-form-item>
      <el-form-item label="password" prop="passwordR">
        <el-input type="password" v-model="user.passwordR"
                  placeholder="Please enter password"
                  v-on:keyup.enter.native="submit('loginForm')">
        </el-input>
      </el-form-item>
      <el-button type="primary" :loading="loading" @click="submit('loginForm')">
        {{ loading ? 'Loading...' : 'Register' }}
      </el-button>
    </el-form>
    <footer class="login-footer">
      already register go to
      <router-link to="/login">login</router-link>
    </footer>
  </section>
</template>

<script>
  import {reg} from '../api/user';
  import HmacSHA256 from 'crypto-js/hmac-sha256';
  export default {
    name      : 'reg',
    components: {
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.user.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const user       = {
        email    : '',
        name     : '',
        password : '',
        passwordR: ''
      };
      // form validate rules
      const rules      = {
        name     : [
          {required: true, message: '请输入用户名'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符'}
        ],
        email    : [
          {required: true, message: '请输入邮箱', type: 'email'}
        ],
        password : [
          {required: true, message: '请输入密码'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符'}
        ],
        passwordR: [
          {validator: validatePass},
          {required: true, message: '请再次输入密码'}
        ]
      };
      return {
        user : user, rules: rules,
        error: null, loading: false
      };
    },
    methods   : {
      submit(formName) {
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            this.error   = null;
            this.loading = true;
            let password = HmacSHA256(this.user.password, 'sharedoc').toString();
            reg({
              name    : this.user.name,
              email   : this.user.email,
              password: password
            })
              .then(result => {
                this.$store.dispatch('setUserInfo', result.user)
                  .then(() => {
                    this.$router.replace({path: this.$route.query.redirect || '/'});
                    this.loading = false;
                  });
              })
              .catch(err => {
                this.error   = {title: '发生错误', message: err};
                this.loading = false;
              });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login {
    flex: 1;
    width: 95%;
    max-width: 22rem;
    margin: 0 auto;
    font-size: .875rem;
  }
  .login .login-header {
      margin-bottom: 1rem;
  }
  .login .login-header .brand {
        margin: 4.5rem 0 3.5rem;
        text-align: center;
        letter-spacing: .125rem;
  }
  .login .login-header brand  a {
          margin: 0;
          color: #D3DCE6;
          font: 300 3rem sans-serif;
  }
  .login .login-header  brand a :hover {
            color: #FFFFFF;
            text-shadow: 0 0 1rem #FFFFFF;
  }
  .login .login-form {
      margin-bottom: 2.5rem;
      padding: 1.875rem 1.25rem;
      background: #F8F9FB;
      color: #2b3b49;
  }
  .login .login-form     .heading {
        margin: 0 0 1rem;
        font-weight: 400;
        font-size: 1.5rem;
      }
  .login .login-form     .el-button {
        margin-top: .5rem;
        width: 100%;
      }
  
  .login .login-footer {
      margin-bottom: 1rem;
      padding: .625rem;
      border: .0625rem solid #D3DCE6;
      font-size: .75rem;
      text-align: center;
  }
  .login .login-footer     a {
        color: #D3DCE6;
  }
</style>

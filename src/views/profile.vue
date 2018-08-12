<template>
  <el-row>
    <section class="profile">
      <header>
        <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon/>
      </header>
      <el-form auto-complete="on" :model="user" label-width="75px" size="mini"
               :rules="rules" ref="profileForm">
        <h2>Setting</h2>
        <el-form-item label="name" prop="name">
          <el-input type="text" v-model="user.name" placeholder="Please enter username">
          </el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input type="text" v-model="user.email" placeholder="Please enter email">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="Password" prop="password">
          <el-input type="text" v-model="user.password" placeholder="Please enter password">
          </el-input>
        </el-form-item> -->
        <el-form-item label="intro" prop="intro">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                    v-model="user.intro" placeholder="Please enter introduction">
          </el-input>
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="submit('profileForm')">
          {{ loading ? 'Loading...' : 'Update' }}
        </el-button>
      </el-form>
    </section>
  </el-row>
</template>

<script>
  import {update} from '../api/user';
  export default {
    name   : "profile",
    data() {
      // form validate rules
      let user    = {
        id: 0, name: '', permission: 0, intro: '', password: '', email: ''
      };
      const rules = {
        name : [
          {required: true, message: '请输入用户名'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符'}
        ],
        pass : [
          {required: true, message: '请输入用户名'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符'}
        ],       
        email: [
          {required: true, message: '', type: 'email'}
        ],
        intro: [
          {required: false, message: ''},
          {min: 2, max: 120, message: '长度在 2 到 120 个字符'}
        ],
      };
      return {
        user : user, rules: rules,
        error: null, loading: false,
      };
    },
    created() {
      this.user = this.$store.getters.userInfo;
    },
    methods: {
      submit(formName) {
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            this.error   = null;
            this.loading = true;
            update(this.user)
              .then(result => {
                this.user.password = '';
                this.$store.dispatch('setUserInfo', this.user)
                  .then(() => {
                    this.loading = false;
                    this.$notify({
                      title  : 'success',
                      message: 'updated',
                      type   : 'success'
                    });
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
  .profile {
    flex: 1;
    max-width: 34rem;
    font-size: .875rem;
  }
</style>
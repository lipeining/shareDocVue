<template>
  <div>
    <h1>simple login page</h1>
    <el-input v-model="id" clearable></el-input>
    <el-button @click="login">
      login
    </el-button>
    <router-link to="/">Go to quill</router-link>
  </div>
</template>
<script>
  import {
    login
  } from '../api/user'
  export default {
    name: 'login',
    data() {
      return {
          id: 0
      }
    },
    methods: {
      login() {
        login({
            id: this.id
        })
          .then(result => {
            this.$store.dispatch('setUserInfo', result.user)
            this.$router.push({
                path: '/'
            })
          })
          .catch(err => {
            console.log('login error ' + err)
          })
      }
    }
  }

</script>

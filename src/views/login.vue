<template>
  <div>
    <h1>simple login page</h1>
    <el-input v-model="id" placeholder="input user id" clearable></el-input>
    <el-button @click="login()">
      login
    </el-button>
    <el-input v-model="collectionName" placeholder="input collection name" clearable></el-input>
    <el-input v-model="documentId" placeholder="input document id" clearable></el-input>
    <el-button @click="openDoc()">
      go to edit doc
    </el-button>
    <!-- <router-link to="/">Go to quill</router-link> -->
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
        id: 0,
        collectionName: '',
        documentId: ''
      }
    },
    methods: {
      login() {
        login({
            id: this.id
          })
          .then(result => {
            this.$store.dispatch('setUserInfo', result.user)
            // this.$router.push({
            //   path: '/'
            // })
          })
          .catch(err => {
            console.log('login error ' + err)
          })
      },
      openDoc() {
        if (this.documentId == '' || this.collectionName == '') {
          this.$notify.error({
            title: 'try to open doc error',
            message: 'empty collectionName or documentId'
          });
        } else {
          this.$router.push({
            path: '/',
            query: {
              documentId: this.documentId,
              collectionName: this.collectionName
            }
          });
        }
      }
    }
  }

</script>

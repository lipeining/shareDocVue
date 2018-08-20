<template>
  <el-header>
    <el-menu :router=true :default-active="$route.path" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="/"> Home</el-menu-item>
      <!-- <el-menu-item index="/timeslider"> TimeSlider</el-menu-item> -->
      <el-menu-item index="/importdoc"> import doc</el-menu-item>
      <el-submenu index="">
        <template slot="title">{{curUser.name}}</template>
        <el-menu-item index="/profile"> Profile</el-menu-item>
        <el-menu-item index="">
          <i @click="logout()">logout
          </i>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index=""><i class="el-icon-news" :class="{'readMsg': needRead}"></i></el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
  import {
    logout
  } from '../api/user';
  import {
    mapGetters
  } from 'vuex';
  export default {
    name: 'app-header',
    computed: {
      ...mapGetters({
        curUser: 'userInfo',
        isAdmin: 'isAdmin'
      })
    },
    data() {
      return {
        needRead: false,
        menuIndex: '1'
      };
    },
    sockets: {
      connect: function(){
        console.log('header.vue socket connected');
      },
      updateUser: function(data){
        console.log('this method was fired by the socket server. eg: io.emit("updateUser", data)');
         this.$store.dispatch('setUserInfo', data.user);
      },
      index: function(data){
        console.log('this method was fired by the socket server. eg: io.emit("index", data)');
        console.log(JSON.stringify(data));
        this.needRead = true;
      }
    },
    created() {},
    methods: {
      logout() {
        logout()
          .then(res => {
            this.$store.dispatch('delUserInfo');
            this.$router.push({
              path: '/login'
            })
          })
          .catch(err => {
            // todo
            this.$store.dispatch('delUserInfo');
            this.$router.push({
              path: '/login'
            })
          })
      }
    }
  }

</script>

<style scoped>
  .readMsg {
    background-color: goldenrod;
  }

</style>

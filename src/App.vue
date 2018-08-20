<template>
  <div id="app">
    <app-header v-if="showHeader()">
    </app-header>
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
  import AppHeader from './components/header'
  import {mapGetters} from 'vuex'
  export default {
    name: 'App',
    components: {
      AppHeader
    },
    computed  : {
      // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'isLogin'
      ])
    },
    methods: {
      showHeader() {
        return this.isLogin && this.$route.name!=='doc';
      }
    }
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

</style>

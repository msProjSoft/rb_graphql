<template>
<div>
  <div id="slogan" class="text-center">
    <h1>NameGator <span class="fa fa-check"></span></h1>
  <br/>
  <h6 class="text-secondary">Gerador de nomes utilizando Vue.js</h6>
  </div>

  <div id="main">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css"
import "font-awesome/css/font-awesome.css"
import DomainList from "./components/DomainList"
export default {
  name: 'app',
  components: {
    DomainList,
  },

}

</script>

<style>
#slogan {
  margin-top: 30px;
  margin-bottom: 30px;
}
#main {
  background-color:aquamarine;
  padding-top: 30px;
  padding-bottom: 30px;

}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

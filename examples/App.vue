<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/AutoComplete">AutoComplete</router-link> |
    <router-link to="/excel">ExcelTable</router-link> |
    <router-link to="/face">LiveFace</router-link> |
    <router-link to="/canvas">Canvas</router-link>
  </div> -->
  <router-view/>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow-y: auto;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: @primary-pink-color;
    }
  }
}
</style>

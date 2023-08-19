<template>
  <div v-if="!isLoggedIn">
    <!-- login -->
    <template v-if="showLogin">
      <login-form/>
      <p class="text-center">No account yet? <a class="btn btn-outline-info" @click="showLogin=false">Sign up</a> instead.</p>
    </template>
    <!-- or register -->
    <template v-else>
      <signup-form/>
      <p class="text-center">Already registered? <a class="btn btn-outline-info" @click="showLogin=true">Sign in</a> instead.</p>
    </template>
  </div>
  <!-- is logged in -->
  <div v-else>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">TODO LIST</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          </ul>
          <div class="d-flex" role="search">
            <button class="btn btn-outline-success">{{ displayName }}</button>
            &nbsp;
            <button class="btn btn-outline-danger" v-on:click="logout()">LOGOUT</button>
          </div>
        </div>
      </div>
    </nav>
    <div class="container-fluid mt-2">
      <TodoList/>
    </div>
  </div>
</template>

<script>
  import SignupForm from './components/SignupForm'
  import LoginForm from './components/LoginForm'
  import TodoList from './components/TodoList.vue'
  import { auth } from './firebase'

  export default {
    components: {
      TodoList,
      SignupForm, 
      LoginForm 
    },
    data() {
      return {
        isLoggedIn: false,
        showLogin: true,
        displayName: ''
      }
    },methods: {
      checkLogin() {
        var self = this;
        console.log('checkLogin')
        if (auth.currentUser) {
          console.log(auth)
          self.displayName = auth.currentUser.displayName
          self.isLoggedIn = true;
        }
      },
      logout(){
        auth.signOut().then(function() { 
          console.log('logout');
          location.reload();
        })
      }
    },
    created() {
      var self = this;
      // check login
      auth.onAuthStateChanged(function(user) {
        console.log(user);
        if (user != null) {
          self.displayName = user.displayName;
          self.isLoggedIn  = true;
        }
      });
    }, 
    // beforeUpdate() {
    //   var self = this;
    //   console.log('beforeUpdate');
    //   if (auth.currentUser) {
    //     auth.currentUser.reload();
    //     console.log(auth.currentUser.displayName)
    //     // set local 'displayName' to user's displayName
    //     if(auth.currentUser.displayName != null){
    //       self.displayName = auth.currentUser.displayName
    //     }
    //     self.isLoggedIn  = true;
    //   }
    // }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
</style>

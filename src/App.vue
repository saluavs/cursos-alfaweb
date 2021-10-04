<template>
  <v-app dark>
    <Toolbar />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Toolbar from './components/Toolbar.vue'
import Footer from './components/Footer.vue'
import firebase from 'firebase'

export default {
  name: 'App',
  components: {
    Toolbar,
    Footer,
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('cargaUser', user)
      } else {
        this.$store.dispatch('cargaUser', null)
      }
    })
    this.$store.dispatch('cursosBd')
  },
}
</script>

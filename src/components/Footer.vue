<template>
  <v-footer dark padless>
    <v-card class="flex" flat tile>
      <v-card-title class="purple darken-4">
        <strong class="white--text">
          ¡Conéctate con nosotros a través de las redes sociales!
        </strong>

        <v-spacer></v-spacer>

        <v-btn v-for="icon in icons" :key="icon" class="mx-4" dark icon>
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram'],
    }
  },
}
</script>

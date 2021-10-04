<template>
  <v-container>
    <h1 class="mt-15">Login de Usuario</h1>
    <div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="email" :rules="emailRequired" label="E-mail" required></v-text-field>
        <v-text-field v-model="password" :counter="10" :rules="passwordRequired" label="Password" required type="password" maxlength="10"></v-text-field>
        <v-container class="mt-5 d-flex justify-center align-content-center flex-column flex-sm-column flex-md-row flex-lg-row flex-xl-row">
          <v-btn :disabled="!valid" color="success darken-5" dark class="mt-2 mt-sm-2 mt-md-0 mt-lg-0 mt-xl-0 mx-4" @click="validate">INICIAR</v-btn>
          <v-btn color="error darken-5" dark class="mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mx-4" @click="reset">LIMPIAR FORMULARIO</v-btn>
          <v-btn color="warning darken-5" dark class="mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mx-4" @click="resetValidation">LIMPIAR VALIDACIÓN</v-btn>
        </v-container>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import Swal from 'sweetalert2'

export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      password: '',
      passwordRequired: [
        (v) => !!v || 'Este campo es obligatorio',
        (v) =>
          (v && v.length >= 6) ||
          'La contraseña debe tener más de 5 caracteres',
      ],
      email: '',
      emailRequired: [
        (v) => !!v || 'Este campo es obligatorio',
        (v) => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido',
      ],
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate()
      if (this.$refs.form.validate()) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            setTimeout(() => {
              this.$router.replace({ name: 'Home' }).catch((error) => {
                console.info(error.message)
              })
            }, 500)
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        console.log('No permitido')
        Swal.fire({
          icon: 'error',
          text: 'Ingresa datos correctos',
          footer: 'Intenta nuevamente',
        })
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

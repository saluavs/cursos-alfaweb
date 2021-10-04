<template>
  <v-container>
    <h1 class="my-6 text-center display-3">Editando el curso: {{ nombre }}</h1>
    <div class="mt-10">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="nombre" :counter="20" label="Nombre"></v-text-field>
        <v-text-field v-model="imagen" label="URL de la imagen" type="url"></v-text-field>
        <v-text-field v-model="cupos" label="Cupos del curso"></v-text-field>
        <v-text-field v-model="inscritos" label="Inscritos en el curso"></v-text-field>
        <v-text-field v-model="duracion" label="Duración del curso"></v-text-field>
        <v-text-field v-model="costo" label="Costo del curso"></v-text-field>
        <v-text-field v-model="codigo" label="Código del curso"></v-text-field>
        <v-textarea   v-model="descripcion" outlined label="Descripción del curso"></v-textarea>
        <v-text-field v-model="fecharegistro" label="Fecha de Registro" type="date"></v-text-field>
        <v-switch     v-model="estado" :label="estado ? 'Terminado: Si' : 'Terminado: No'" color="indigo" :true-value="estado" hide-details></v-switch>
        <v-container  class="mt-5 d-flex justify-center align-content-center flex-column flex-sm-column flex-md-row flex-lg-row flex-xl-row">
          <v-btn color="success" class="mt-2 mt-sm-2 mt-md-0 mt-lg-0 mt-xl-0 mx-4" @click="validate">ACTUALIZAR</v-btn>
          <v-btn color="error" class="mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mx-4"   @click="reset">LIMPIAR FORMULARIO</v-btn>
          <v-btn color="warning" class="mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mx-4" @click="resetValidation">LIMPIAR VALIDACIÓN</v-btn>
          <v-btn color="primary" class="mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mx-4" @click="$router.go(-1)" >VOLVER</v-btn>
        </v-container>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2'
import { mapGetters } from 'vuex'
export default {
  name: 'Edicion',
  props: ['id'],
  computed: {
    ...mapGetters(['enviandoCursos']),
  },
  data() {
    return {
      valid: true,
      nombre: '',
      imagen: '',
      codigo: '',
      inscritos: 0,
      descripcion: '',
      cupos: 0,
      cuposRequired: [
        (v) => !!v || 'Cupos es requerido',
        (v) =>
          (v && v.length >= 0 && /\d/gim.test(v) && v >= 0) ||
          'Ingresa números positivos',
      ],
      inscritosRequired: [
        (v) => !!v || 'Cantidad de Inscritos es requerida',
        (v) =>
          (v && v.length >= 0 && /\d/gim.test(v) && v >= 0) ||
          'Ingresa números positivos',
        (v) => v <= this.cupos || 'Inscritos no puede ser mayor a cupos',
      ],
      duracion: '',
      costo: 0,
      costoRequired: [
        (v) => !!v || 'Costo es requerido',
        (v) =>
          (v && v.length >= 0 && /\d/gim.test(v) && v >= 0) ||
          'Ingresa números positivos',
      ],
      nombreRequired: [
        (v) => !!v || 'Nombre es requerido',
        (v) =>
          (v && v.length >= 2) ||
          'El nombre debe ser mayor o igual a dos caracteres',
      ],
      dialog: false,
      fecharegistro: '',
      estado: false,
    }
  },
  watch: {
    estado(nuevo) {
      if (nuevo) {
        this.inscritos = 0
      }
    },
  },
  mounted() {
    let cursoExiste = this.enviandoCursos.find(
      (result) => result.idDoc === this.id)
    if (cursoExiste !== undefined) {
      this.cupos = parseInt(cursoExiste.cupos)
      this.duracion = cursoExiste.duracion
      this.codigo = cursoExiste.codigo
      this.idDoc = cursoExiste.idDoc
      this.imagen = cursoExiste.imagen
      this.descripcion = cursoExiste.descripcion
      this.nombre = cursoExiste.nombre
      this.costo = parseFloat(cursoExiste.costo)
      this.estado = cursoExiste.estado
      this.inscritos = parseInt(cursoExiste.inscritos)
      let fecha = cursoExiste.fecharegistro.toDate()
      fecha = new Intl.DateTimeFormat('cl').format(fecha)
      this.fecharegistro = fecha.split('-').reverse().join('-')
    } else {
      Swal.fire({
        icon: 'error',
        text: 'El curso no existe. ¡Vuelve a intentarlo!',
      })
      setTimeout(() => {
        this.$router.replace({ name: 'Administracion' })
      }, 1000)
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate()
      if (this.$refs.form.validate()) {
        let cursoNuevo = {
          nombre: this.nombre,
          codigo: this.codigo,
          costo: parseFloat(this.costo),
          cupos: parseInt(this.cupos),
          inscritos: parseInt(this.inscritos),
          imagen: this.imagen,
          duracion: this.duracion,
          estado: this.estado,
          fecharegistro: new Date(this.fecharegistro),
          idDoc: this.idDoc,
          descripcion: this.descripcion,
        }
        this.$store.dispatch('actualizandoCurso', cursoNuevo).then(() => {
          Swal.fire('Curso actualizado exitosamente')
          this.reset()
          setTimeout(() => {
            this.$router.replace({ name: 'Administracion' })
          }, 1000)
        })
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Error en los datos ingresados. ¡Vuelve a intentarlo!',
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

<style scoped></style>

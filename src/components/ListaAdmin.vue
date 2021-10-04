<template>
  <v-container>
    <h2 class="my-6 text-center display-3">Administración</h2>
    <div class="my-6 d-flex justify-right">
      <section class="my-auto">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary darken-5" dark v-bind="attrs" v-on="on">
              Agregar Curso
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Agregando Curso</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="nombre"
                    :counter="30"
                    :rules="nombreRequired"
                    label="Nombre"
                    required
                    maxlength="30"
                  ></v-text-field>
                  <v-text-field
                    v-model="imagen"
                    label="URL de la imagen"
                    required
                    type="url"
                  ></v-text-field>
                  <v-text-field
                    v-model="cupos"
                    :rules="cuposRequired"
                    label="Cupos del curso"
                    required
                    value="0"
                  ></v-text-field>
                  <v-text-field
                    v-model="inscritos"
                    :rules="inscritosRequired"
                    label="Inscritos en el curso"
                    required
                    value="0"
                  ></v-text-field>
                  <v-text-field
                    v-model="duracion"
                    label="Duración del curso"
                    placeholder="Ej.: 2 meses"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="costo"
                    :rules="precioRequired"
                    label="Costo del curso"
                    required
                    type="number"
                    value="0"
                  ></v-text-field>
                  <v-text-field
                    v-model="codigo"
                    label="Código del curso"
                    required
                  ></v-text-field>
                  <v-textarea
                    outlined
                    label="Descripción del curso"
                    v-model="descripcion"
                    :counter="280"
                    maxlength="280"
                  ></v-textarea>

                  <v-container class="mt-5 d-flex justify-center">
                    <v-btn
                      :disabled="!valid"
                      color="success darken-5"
                      dark
                      class="mt-2 mt-sm-2 mt-md-0 mt-lg-0 mt-xl-0 mx-4"
                      @click="validate"
                    >
                      AGREGAR
                    </v-btn>

                    <v-btn
                      color="error darken-5"
                      dark
                      class="mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mx-4"
                      @click="reset"
                    >
                      LIMPIAR FORMULARIO
                    </v-btn>

                    <v-btn
                      color="warning darken-5"
                      dark
                      class="mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mx-4"
                      @click="resetValidation"
                    >
                      LIMPIAR VALIDACIÓN
                    </v-btn>
                  </v-container>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="gray darken-2" @click="dialog = false">
                CANCELAR
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </section>
    </div>
    <div>
      <v-data-table
        :headers="headers"
        :items="enviandoCursos"
        :items-per-page="5"
        item-key="nombre"
        class="elevation-1"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus',
        }"
      >
        <template v-slot:[`item.costo`]="{ item }">
          <v-chip color="green" dark>
            {{ item.costo | formatoNum }}
          </v-chip>
        </template>

        <template v-slot:[`item.fecharegistro`]="{ item }">
          <v-chip color="green" dark>
            {{ item.fecharegistro | formatoFecha }}
          </v-chip>
        </template>

        <template v-slot:[`item.estado`]="{ item }">
          <v-chip
            :color="item.estado ? 'blue lighten-1' : 'brown lighten-3'"
            dark
          >
            {{ item.estado ? 'Sí' : 'No' }}
          </v-chip>
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="mr-3"
                @click="editando(item)"
                v-bind="attrs"
                v-on="on"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small @click="eliminando(item)" v-bind="attrs" v-on="on">
                mdi-delete
              </v-icon>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </div>
    <div class="mt-8">
      <v-alert
        color="purple"
        dense
        elevation="1"
        icon="mdi-account-group"
        outlined
      >
        Cantidad total de alumnos permitidos:
        <strong>{{ TotalAlumnosPermitidos }}</strong>
      </v-alert>
      <v-alert
        color="blue"
        dense
        elevation="1"
        icon="mdi-account-multiple-check"
        outlined
      >
        Cantidad total de alumnos inscritos:
        <strong>{{ TotalAlumnosInscritos }}</strong>
      </v-alert>
      <v-alert
        color="red"
        dense
        elevation="1"
        icon="mdi-account-clock"
        outlined
      >
        Cantidad total de cupos restantes:
        <strong>{{ cuposRestantes }}</strong>
      </v-alert>
      <v-alert
        color="pink"
        dense
        elevation="1"
        icon="mdi-block-helper"
        outlined
      >
        Cantidad total de cursos terminados:
        <strong>{{ TotalCursosTerminados }}</strong>
      </v-alert>
      <v-alert color="brown" dense elevation="1" icon="mdi-bell-ring" outlined>
        Cantidad total de cursos activos:
        <strong>{{ cursosActivos }}</strong>
      </v-alert>
      <v-alert
        color="deep-orange"
        dense
        elevation="1"
        icon="mdi-bell-ring"
        outlined
      >
        Cantidad total de cursos:
        <strong>{{ cantidadTotalCursos }}</strong>
      </v-alert>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: 'ListaAdmin',
  data() {
    return {
      valid: true,
      nombre: '',
      imagen: '',
      codigo: '',
      cupos: 0,
      inscritos: 0,
      cuposRequired: [
        (v) => !!v || 'Este campo es obligatorio',
        (v) =>
          (v && v.length >= 0 && /\d/gim.test(v) && v >= 0) ||
          'Solo deben ser números positivos',
      ],
      inscritosRequired: [
        (v) => !!v || 'Este campo es obligatorio',
        (v) =>
          (v && v.length >= 0 && /\d/gim.test(v) && v >= 0) ||
          'Solo deben ser números positivos',
        (v) =>
          v <= this.cupos || 'Cantidad de inscritos debe ser menor que cupos',
      ],
      duracion: '',
      costo: 0,
      descripcion: '',
      precioRequired: [
        (v) => !!v || 'Este campo es obligatorio',
        (v) =>
          (v && v.length >= 0 && /\d/gim.test(v) && v >= 0) ||
          'Solo deben ser números positivos',
      ],
      nombreRequired: [
        (v) => !!v || 'Este campo es obligatorio',
        (v) => (v && v.length >= 2) || 'Nombre debe tener más de 2 caracteres',
      ],
      dialog: false,
      headers: [
        { text: 'Curso', align: 'start', value: 'nombre' },
        { text: 'Cupos', value: 'cupos' },
        { text: 'Inscritos', value: 'inscritos' },
        { text: 'Duración', value: 'duracion' },
        { text: 'Costo', value: 'costo' },
        { text: 'Terminado', value: 'estado' },
        { text: 'Fecha', value: 'fecharegistro' },
        { text: 'Acciones', value: 'acciones' },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'enviandoCursos',
      'TotalAlumnosPermitidos',
      'TotalAlumnosInscritos',
      'TotalCursosTerminados',
    ]),
    cuposRestantes() {
      return this.TotalAlumnosPermitidos - this.TotalAlumnosInscritos
    },
    cursosActivos() {
      return this.enviandoCursos.length - this.TotalCursosTerminados
    },
    cantidadTotalCursos() {
      return this.enviandoCursos.length
    },
  },
  filters: {
    formatoNum(valor) {
      return new Intl.NumberFormat('cl', {
        style: 'currency',
        currency: 'CLP',
      }).format(valor)
    },
    formatoFecha(valor) {
      let fecha = new Intl.DateTimeFormat('cl').format(valor.toDate())
      return fecha
    },
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
          imagen: this.imagen,
          inscritos: parseInt(this.inscritos),
          duracion: this.duracion,
          estado: false,
          descripcion: this.descripcion,
          fecharegistro: new Date(),
        }
        Swal.fire({
          title: '¿Seguro que deseas agregar el curso?',
          text: '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0a0',
          cancelButtonColor: '#aaa',
          cancelButtonText: '<span style="color: white">Cancelar</span>',
          confirmButtonText: 'Agregar Curso',
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch('agregandoCurso', cursoNuevo).then(() => {
              this.reset()
              this.dialog = false
            })
          } else {
            this.reset()
            this.dialog = false
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          text:
            'Existen errores en los datos ingresados. ¡Vuelve a intentarlo!',
        })
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    eliminando(item) {
      Swal.fire({
        title:
          '<span>Eliminará el curso seleccionado. ¿Desea continuar?</span>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: '#aaa',
        cancelButtonText:
          '<span style="color: white"><strong>Cancelar</strong></span>',
        confirmButtonText:
          '<span style="color: white"><strong>Eliminar</strong></span>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch('eliminandoCurso', item.idDoc).then(() => {})
        }
      })
    },
    editando(item) {
      this.$router.push({ name: 'Edicion', params: { id: item.idDoc } })
    },
  },
}
</script>

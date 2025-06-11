<template>
  <div class="group-form">
    <h3>{{ isEditing ? 'Editar Grupo' : 'Crear Nuevo Grupo' }}</h3>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nombre del Grupo</label>
        <input type="text" id="name" v-model="form.name" required>
      </div>
      <div class="form-group">
        <label for="description">Descripción</label>
        <textarea id="description" v-model="form.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label for="mode">Modo de Grupo</label>
        <select id="mode" v-model="form.mode">
          <option value="gastos">Gastos compartidos</option>
          <option value="ahorro">Ahorro conjunto</option>
        </select>
      </div>
      <div class="form-group">
        <label for="category">Categoría</label>
        <select id="category" v-model="form.category">
          <option value="trip">Viaje</option>
          <option value="home">Hogar</option>
          <option value="event">Evento</option>
          <option value="project">Proyecto</option>
          <option value="other">Otro</option>

        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="isLoading || !form.name">
          {{ isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Grupo') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'GroupForm',
  props: {
    group: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        category: 'other',
        mode: 'gastos'
      },
      isLoading: false,
      error: null
    };
  },
  computed: {
    isEditing() {
      return !!this.group;
    }
  },
  created() {
    if (this.group) {
      this.form = { ...this.group };
    }
  },
  methods: {
    async submitForm() {
      if (!this.form.name) {
        this.error = 'El nombre del grupo es obligatorio';
        return;
      }
      if (this.isLoading) return;
      this.isLoading = true;
      this.error = null;
      try {
        this.$emit('submit', this.form);
      } catch (error) {
        this.error = 'Error al guardar el grupo';
      } finally {
        this.isLoading = false;
      }
    }


  }
};
</script>

<style scoped>
@import '../../assets/css/groups/group-form.css';
</style>
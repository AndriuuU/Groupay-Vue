<template>
  <div class="group-list">
    <div class="group-list-header">
      <h2>Mis Grupos</h2>
      <button class="btn btn-primary" @click="showCreateGroupModal = true">
        <i class="fas fa-plus"></i> Nuevo Grupo
      </button>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando grupos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle error-icon"></i>
      <h3>Error al cargar los grupos</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="fetchGroups">
        Intentar de nuevo
      </button>
    </div>

    <div v-else-if="groups.length === 0" class="empty-state">
      <i class="fas fa-users-slash empty-icon"></i>
      <h3>No tienes grupos todavía</h3>
      <p>Crea un grupo para comenzar a compartir gastos</p>
      <button class="btn btn-primary" @click="showCreateGroupModal = true">
        Crear mi primer grupo
      </button>
    </div>

    <div v-else class="groups-grid">
      <group-item 
        v-for="group in groups" 
        :key="group.id" 
        :group="group"
        @click="navigateToGroup(group.id)"
      />
    </div>

    <modal v-if="showCreateGroupModal" @close="showCreateGroupModal = false">
      <template #header>
        <h3>Crear Nuevo Grupo</h3>
      </template>
      <template #body>
        <group-form 
          @submit="createGroup" 
          @cancel="showCreateGroupModal = false" 
        />
      </template>
    </modal>
  </div>
</template>

<script>
import GroupItem from './GroupItem.vue';
import GroupForm from './GroupForm.vue';
import Modal from '../common/Modal.vue';
import groupService from '../../services/groupService';
import { auth } from '../../services/firebase';

export default {
  name: 'GroupList',
  components: {
    GroupItem,
    GroupForm,
    Modal
  },
  data() {
    return {
      groups: [],
      isLoading: false,
      showCreateGroupModal: false,
      error: null
    };
  },
  created() {
    this.fetchGroups();
  },
  methods: {// En el método fetchGroups
    async fetchGroups() {
      this.isLoading = true;
      this.error = null;

      try {
        const groups = await groupService.getGroups();
        
        const groupsWithDetails = await Promise.all(
          groups.map(async (group) => {
            // Usar el nuevo método de Firestore
            const expenses = await groupService.getGroupExpenses(group.id);
            return {
              ...group,
              gastos: expenses,
              members: group.members 
            };
          })
        );

        this.groups = groupsWithDetails;
      } catch (error) {
        console.error('Error al cargar grupos:', error);
        this.error = 'Error al cargar los grupos. Intenta recargar la página.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchGroups() {
      this.isLoading = true;
      this.error = null;

      try {
        // Obtener grupos desde Firebase
        const groups = await groupService.getGroups();
        
        // Obtener detalles adicionales para cada grupo
        const groupsWithDetails = await Promise.all(
          groups.map(async (group) => {
            const expenses = await groupService.getGroupExpenses(group.id);
            return {
              ...group,
              gastos: expenses,
              members: group.members // Los miembros ya vienen en el documento del grupo
            };
          })
        );

        this.groups = groupsWithDetails;
      } catch (error) {
        console.error('Error al cargar grupos:', error);
        this.error = 'Error al cargar los grupos. Intenta recargar la página.';
      } finally {
        this.isLoading = false;
      }
    },

    async createGroup(groupData) {
      try {
        const newGroup = {
          ...groupData,
          createdBy: auth.currentUser.uid,
          members: [auth.currentUser.uid]
        };
        
        await groupService.createGroup(newGroup);
        await this.fetchGroups();
        this.showCreateGroupModal = false;
      } catch (error) {
        console.error('Error al crear grupo:', error);
        this.error = 'Error al crear el grupo. Verifica los datos.';
      }
    },

    navigateToGroup(groupId) {
      this.$router.push(`/groups/${groupId}`);
    }
  }
};
</script>

<style scoped>
@import '../../assets/css/groups/group-list.css';
</style>

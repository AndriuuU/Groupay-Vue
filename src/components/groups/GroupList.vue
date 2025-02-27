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
          <group-form @submit="createGroup" @cancel="showCreateGroupModal = false" />
        </template>
      </modal>
    </div>
  </template>
  
  <script>
  import GroupItem from './GroupItem.vue';
  import GroupForm from './GroupForm.vue';
  import Modal from '../common/Modal.vue';
  
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
    methods: {
      async fetchGroups() {
        this.isLoading = true;
        try {
          // Aquí utilizarías tu servicio de grupos
          // const response = await groupService.getGroups();
          // this.groups = response.data;
          
          // Datos de ejemplo mientras no tienes la API
          setTimeout(() => {
            this.groups = [
              {
                id: 1,
                name: 'Viaje a Barcelona',
                description: 'Gastos del viaje de fin de semana',
                category: 'trip',
                members: [
                  { id: 1, name: 'Ana' },
                  { id: 2, name: 'Carlos' },
                  { id: 3, name: 'Elena' }
                ],
                balance: 45.50,
                createdAt: '2025-02-20T10:30:00'
              },
              {
                id: 2,
                name: 'Piso Compartido',
                description: 'Gastos mensuales del apartamento',
                category: 'home',
                members: [
                  { id: 1, name: 'Ana' },
                  { id: 4, name: 'Miguel' }
                ],
                balance: -23.75,
                createdAt: '2025-01-15T08:45:00'
              }
            ];
            this.isLoading = false;
          }, 1000);
        } catch (error) {
          this.error = 'Error al cargar los grupos';
          this.isLoading = false;
        }
      },
      async createGroup(groupData) {
        try {
          // const response = await groupService.createGroup(groupData);
          // this.groups.push(response.data);
          // Simulación
          const newGroup = {
            id: this.groups.length + 1,
            ...groupData,
            members: [{ id: 1, name: 'Tú' }],
            balance: 0,
            createdAt: new Date().toISOString()
          };
          this.groups.push(newGroup);
          this.showCreateGroupModal = false;
        } catch (error) {
          this.error = 'Error al crear el grupo';
        }
      },
      navigateToGroup(groupId) {
        this.$router.push(`/groups/${groupId}`);
      }
    }
  };
  </script>
  
  <style scoped>
@import '../../assets/css/expenses/expense-list.css';
</style>
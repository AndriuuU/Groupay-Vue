import { defineStore } from 'pinia'

export const useGastosStore = defineStore('gastos', {
  state: () => ({
    listaDeGastos: [],
    totalGastado: 0
  }),
  actions: {
    agregarGasto(gasto) {
      this.listaDeGastos.push(gasto)
      this.totalGastado += gasto.monto
    },
    eliminarGasto(idGasto) {
      const gastoAEliminar = this.listaDeGastos.find(gasto => gasto.id === idGasto)
      if (gastoAEliminar) {
        this.totalGastado -= gastoAEliminar.monto
        this.listaDeGastos = this.listaDeGastos.filter(gasto => gasto.id !== idGasto)
      }
    },
    cargarGastos(gastos) {
      this.listaDeGastos = gastos
      this.totalGastado = gastos.reduce((total, gasto) => total + gasto.monto, 0)
    }
  }
})

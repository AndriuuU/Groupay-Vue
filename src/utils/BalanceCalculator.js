// src/utils/BalanceCalculator.js

export class BalanceCalculator {
    constructor(members, expenses) {
      this.members = members; // Array de objetos { uid, name, email }
      this.expenses = expenses; // Array de objetos { amount, paidBy, participants }
      this.balances = this.#initializeBalances();
    }
  
    // Inicializa los balances en 0 para todos los miembros
    #initializeBalances() {
      return this.members.reduce((acc, member) => {
        acc[member.uid] = {
          uid: member.uid,
          name: member.name || member.email,
          totalPaid: 0,
          totalOwed: 0,
          balance: 0
        };
        return acc;
      }, {});
    }
  
    // Calcula los balances generales
calculateBalances() {
  // Reinicia balances
  this.balances = this.#initializeBalances();

  this.expenses.forEach(expense => {
    const share = expense.amount / expense.participants.length;

    // Suma lo pagado al pagador
    this.balances[expense.paidBy].totalPaid += expense.amount;

    // A cada participante le suma lo que le corresponde pagar
    expense.participants.forEach(participantId => {
      this.balances[participantId].totalOwed += share;
    });
  });

  // Calcula el balance final de cada usuario
  Object.values(this.balances).forEach(user => {
    user.balance = parseFloat((user.totalPaid - user.totalOwed).toFixed(2));
  });

  return this.#formatBalances();
}
    // Calcula la forma óptima de saldar deudas (algoritmo greedy)
    calculateSettlements() {
      const balances = this.calculateBalances();
      const settlements = [];
      
      const creditors = [];
      const debtors = [];
      
      // Separar en acreedores y deudores
      Object.values(balances).forEach(user => {
        if (user.balance > 0) creditors.push({ ...user });
        if (user.balance < 0) debtors.push({ ...user });
      });
  
      // Ordenar de mayor a menor
      creditors.sort((a, b) => b.balance - a.balance);
      debtors.sort((a, b) => a.balance - b.balance);
  
      // Calcular transacciones
      while (creditors.length && debtors.length) {
        const creditor = creditors[0];
        const debtor = debtors[0];
        
        const amount = Math.min(
          Math.abs(creditor.balance),
          Math.abs(debtor.balance)
        );
        
        settlements.push({
          from: debtor.uid,
          fromName: debtor.name,
          to: creditor.uid,
          toName: creditor.name,
          amount: parseFloat(amount.toFixed(2))
        });
  
        creditor.balance -= amount;
        debtor.balance += amount;
  
        // Actualizar listas
        if (creditor.balance === 0) creditors.shift();
        if (debtor.balance === 0) debtors.shift();
      }
  
      return settlements;
    }
  
    // Formatear los balances para mostrar
    #formatBalances() {
      return Object.values(this.balances).map(user => ({
        ...user,
        totalPaid: parseFloat(user.totalPaid.toFixed(2)),
        totalOwed: parseFloat(user.totalOwed.toFixed(2)),
        balance: parseFloat(user.balance.toFixed(2))
      }));
    }
  }
  
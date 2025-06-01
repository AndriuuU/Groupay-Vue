
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
admin.initializeApp();

sgMail.setApiKey(functions.config().sendgrid.key);

exports.notifyOnGroupEvent = functions.firestore
  .document('groups/{groupId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    // Detectar si hay nuevos miembros
    if (after.members.length > before.members.length) {
      const newMembers = after.members.filter(
        m => !before.members.some(bm => bm.id === m.id)
      );
      for (const member of newMembers) {
        await sgMail.send({
          to: member.email,
          from: 'noreply@groupay.com',
          subject: '¡Te han añadido a un grupo en Groupay!',
          html: `<p>Hola ${member.name},<br>Has sido añadido al grupo <b>${after.name}</b> en Groupay.</p>`
        });
      }
    }
  });

exports.notifyOnNewExpense = functions.firestore
  .document('expenses/{expenseId}')
  .onCreate(async (snap, context) => {
    const expense = snap.data();
    // Obtener los miembros del grupo
    const groupSnap = await admin.firestore().collection('groups').doc(expense.groupId).get();
    const group = groupSnap.data();
    // Notificar a todos los participantes excepto el pagador
    for (const member of group.members) {
      if (expense.participants.includes(member.id) && member.id !== expense.paidBy) {
        await sgMail.send({
          to: member.email,
          from: 'noreply@groupay.com',
          subject: 'Nuevo gasto en tu grupo',
          html: `<p>Hola ${member.name},<br>Se ha añadido un nuevo gasto en el grupo <b>${group.name}</b>: <b>${expense.description}</b> por ${expense.amount} €.</p>`
        });
      }
    }
  });

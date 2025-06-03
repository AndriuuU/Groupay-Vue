const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

// Configura tu Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'notify.groupay@gmail.com',
    pass: 'Molina01$.'
  }
});

// Trigger: cuando se añade un miembro a un grupo
exports.sendEmailOnMemberAdded = functions.firestore
  .document('groups/{groupId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (after.members.length > before.members.length) {
      const newMembers = after.members.filter(
        m => !before.members.some(bm => bm.id === m.id)
      );
      for (const member of newMembers) {
        await transporter.sendMail({
          from: '"Groupay" notify.groupay@gmail.com',
          to: member.email,
          subject: '¡Te han añadido a un grupo en Groupay!',
          html: `<p>Hola ${member.name},<br>Has sido añadido al grupo <b>${after.name}</b> en Groupay.</p>`
        });
      }
    }
  });

// Trigger: cuando se añade un gasto
exports.sendEmailOnExpenseAdded = functions.firestore
  .document('expenses/{expenseId}')
  .onCreate(async (snap, context) => {
    const expense = snap.data();
    const groupSnap = await admin.firestore().collection('groups').doc(expense.groupId).get();
    const group = groupSnap.data();
    for (const member of group.members) {
      if (expense.participants.includes(member.id) && member.id !== expense.paidBy) {
        await transporter.sendMail({
          from: '"Groupay" notify.groupay@gmail.com',
          to: member.email,
          subject: 'Nuevo gasto en tu grupo',
          html: `<p>Hola ${member.name},<br>Se ha añadido un nuevo gasto en el grupo <b>${group.name}</b>: <b>${expense.description}</b> por ${expense.amount} €.</p>`
        });
      }
    }
  });

  exports.sendEmailHttp = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Método no permitido');
    }
    const { to, subject, text, html } = req.body;
    try {
      await transporter.sendMail({
        from: '"Groupay" <TU_CORREO@gmail.com>',
        to,
        subject,
        text,
        html
      });
      res.status(200).send('Email enviado');
    } catch (error) {
      res.status(500).send('Error al enviar email: ' + error.toString());
    }
  });
});
# Groupay-Vue

Groupay es una aplicación web diseñada para facilitar el seguimiento y gestión de gastos compartidos entre grupos de personas. Ofrece una variedad de funcionalidades para simplificar la gestión financiera y mejorar la colaboración entre los miembros de un grupo[1].

## Funcionalidades

- **Creación de Grupos**: Organiza tus gastos por grupos, ya sean viajes, hogar, eventos o cualquier otra categoría. Cada grupo puede tener su propia configuración y miembros asignados.
- **Registro de Gastos**: Añade gastos fácilmente y asígnalos a los participantes del grupo. Los gastos se pueden categorizar y fechar para una mejor organización.
- **Cálculo de Balances**: Visualiza quién debe a quién y cuánto de forma automática. Groupay calcula los balances entre los miembros del grupo basándose en los gastos registrados.
- **Sugerencias de Pago**: Recibe recomendaciones para igualar los balances entre los miembros del grupo. Esto facilita la resolución de deudas pendientes de manera justa y eficiente.
- **Autenticación y Perfil de Usuario**: Gestiona tu cuenta y perfil de usuario. Los usuarios pueden iniciar sesión y acceder a sus grupos y gastos de manera segura.
- **Interfaz Responsiva**: La aplicación está diseñada para ser accesible desde cualquier dispositivo, ya sea un ordenador, tableta o teléfono móvil.
- **Tema Oscuro y Claro**: Personaliza la apariencia de la aplicación según tus preferencias con temas oscuro y claro.

## Instrucciones de Instalación y Uso

1. **Clonar el Repositorio**

    ```
    git clone https://github.com/AndriuuU/Groupay-Vue
    ```

2. **Instalar Dependencias**

    ```
    npm install
    ```

3. **Iniciar la Aplicación**

    ```
    npm run dev
    ```

4. **Acceder a la Aplicación**

    Abre tu navegador y accede a `http://localhost:5173/`.

## Despliegue Público

La aplicación está desplegada en [group-pay.netlify.app](https://group-pay.netlify.app/). Puedes acceder y probarla directamente desde allí.

## Tecnologías Utilizadas

- **Frontend**: Vue.js
- **Router**: Vue Router
- **Estilos**: CSS con variables
- **Iconos**: Font Awesome
- **Build**: Vite

## Estructura del Proyecto

- **src**: Código fuente de la aplicación.
- **components**: Componentes reutilizables.
- **router**: Configuración del router.
- **stores**: Almacén de estado con Pinia.
- **services**: Servicios para interactuar con la API.
- **assets**: Recursos estáticos (estilos, imágenes, etc.).


Directory structure:
└── andriuuu-groupay-vue/
    ├── README.md
    ├── ENTREGA.md
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   └── _redirects
    └── src/
        ├── App.vue
        ├── main.js
        ├── style.css
        ├── assets/
        │   ├── css/
        │   │   ├── app.css
        │   │   ├── global.css
        │   │   ├── variables.css
        │   │   ├── app/
        │   │   │   ├── AppFooter.css
        │   │   │   ├── AppHeader.css
        │   │   │   └── LoadingOverlay.vue
        │   │   ├── auth/
        │   │   │   ├── login-form.css
        │   │   │   └── register-form.css
        │   │   ├── balances/
        │   │   │   └── balance-list.css
        │   │   ├── common/
        │   │   │   ├── DashboardSkeleton.css
        │   │   │   └── modal.css
        │   │   ├── expenses/
        │   │   │   ├── expense-form.css
        │   │   │   ├── expense-item.css
        │   │   │   ├── expense-list.css
        │   │   │   ├── expenses-item.css
        │   │   │   └── expenses-list.css
        │   │   ├── groups/
        │   │   │   ├── group-form.css
        │   │   │   ├── group-item.css
        │   │   │   └── group-list.css
        │   │   └── views/
        │   │       ├── dashboard.css
        │   │       ├── group-detail.css
        │   │       ├── home.css
        │   │       ├── login.css
        │   │       ├── not-found.css
        │   │       └── register.css
        │   ├── images/
        │   │   └── icons/
        │   └── js/
        │       └── fontawesome.js
        ├── components/
        │   ├── auth/
        │   │   ├── LoginForm.vue
        │   │   └── RegisterForm.vue
        │   ├── balances/
        │   │   └── BalanceList.vue
        │   ├── common/
        │   │   ├── DashboardSkeleton.vue
        │   │   ├── Modal.vue
        │   │   └── ThemeToggle.vue
        │   ├── expenses/
        │   │   ├── ExpenseForm.vue
        │   │   ├── ExpenseItem.vue
        │   │   └── ExpenseList.vue
        │   ├── groups/
        │   │   ├── GroupForm.vue
        │   │   ├── GroupItem.vue
        │   │   ├── GroupList.vue
        │   │   ├── GroupPieChart.vue
        │   │   └── GroupStatistics.vue
        │   ├── layout/
        │   │   ├── AppFooter.vue
        │   │   └── AppHeader.vue
        │   └── payments/
        │       ├── PaymentCard.vue
        │       ├── PaymentForm.vue
        │       └── PaymentList.vue
        ├── router/
        │   └── index.js
        ├── services/
        │   ├── api.js
        │   ├── authService.js
        │   ├── emailService.js
        │   ├── expenseService.js
        │   ├── firebase.js
        │   ├── groupService.js
        │   ├── notificationService.js
        │   └── paymentService.js
        ├── store/
        │   ├── authStore.js
        │   ├── gastosStore.js
        │   └── mainStore.js
        ├── utils/
        │   ├── BalanceCalculator.js
        │   ├── Payment.js
        │   └── sendEmail.js
        └── views/
            ├── Dashboard.vue
            ├── ExpenseItem.vue
            ├── ExpensesList.vue
            ├── GroupDetail.vue
            ├── Home.vue
            ├── Login.vue
            ├── NotFound.vue
            ├── Profile.vue
            ├── Register.vue
            └── Statistics.vue

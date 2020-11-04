//===============================
//============PUERTO=============
//===============================
//Que conecte con el puerto de producción si no existe que conecte con el puerto 3000
process.env.PORT = process.env.PORT || 3000;

//==============================
//===========ENTORNO============
//==============================
//Esta es una variable que establece heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//======================================
//=========VENCIMIENTO TOKEN============
//======================================
process.env.CADUCIDAD_TOKEN = '30d'; //En 30 dias expira el token


//======================================
//========SEED DE AUTENTICACIÓN=========
//======================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//====================================
//===========Base de Datos============
//====================================
let urlDB;

//Aqui creamos una condición dependiendo a que base de datos conectaremos, si en local o remoto en mongo atlas
if(process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
}
else{

   //MONGO_URI pertenece a la variable de configuración que se creo en heroku
   urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//=======================================
//===========GOOGLE CLIENT ID============
//=======================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '481305318760-8j1bdfuh3hfa5d0lnptej8slu9cmajtb.apps.googleusercontent.com';
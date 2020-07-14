//===============================
//          Puerto
//===============================
process.env.PORT = process.env.PORT || 3000;

//===============================
//          Entorno
//===============================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//===============================
//    Vencimiento del token
//===============================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//===============================
//    SEED de autenticación
//===============================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

//===============================
//          Base de datos
//===============================
let urlDB;
if (process.env.NODE_ENV === "dev") {
	urlDB = "mongodb://localhost:27017/cafe";
} else {
	urlDB = process.env.MONGO_URL;
}
process.env.URL_DB = urlDB;

//===============================
//        Google Clien ID
//===============================
process.env.CLIENT_ID =
	process.env.CLIENT_ID ||
	"750312409038-knvng8lde0ku2ouqqc1folqrb99vhpv0.apps.googleusercontent.com";

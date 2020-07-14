require("./config/config");

const express = require("express");
const colors = require("colors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

/** Body parser */
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/** Fin Body parser */

// Rutas
app.use(require("./routes/index"));

//Habilitar el public
app.use(express.static(path.resolve(__dirname, "../public")));

// Configuración

const puerto = process.env.PORT;

mongoose.connect(
	process.env.URL_DB,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	(err, res) => {
		if (err) throw err;
		console.log("Base de datos ONLINE".cyan);
	}
);

app.listen(puerto, () => {
	console.log(`Escuchando puerto: ${puerto}`);
});

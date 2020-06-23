const express = require("express");
const app = express();
require("./config/config");

/** Body parser */
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/** Fin Body parser */

// GET
app.get("/usuario", function (req, res) {
	res.json("get usuario");
});

// POST
app.post("/usuario", function (req, res) {
	let body = req.body;

	if (body.nombre === undefined) {
		res.status(400).json({
			ok: false,
			mensaje: "El nombre es necesario",
		});
	} else {
		res.json({
			persona: body,
		});
	}
});

// PUT
//:id variable
app.put("/usuario/:id", function (req, res) {
	let id = req.params.id;
	res.json({
		id,
	});
});

// DELETE
app.delete("/usuario", function (req, res) {
	res.json("delete usuario");
});

// Configuración

const puerto = process.env.PORT;

app.listen(puerto, () => {
	console.log(`Escuchando puerto: ${puerto}`);
});

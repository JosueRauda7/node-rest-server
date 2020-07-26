const express = require("express");
const Categoria = require("../models/categoria");
const _ = require("underscore");

let {
	verificaToken,
	verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

// Todas las categorias, paginada
app.get("/categorias", verificaToken, (req, res) => {
	Categoria.find({ estado: true })
		.sort("descripcion")
		.populate("usuario", "nombre email")
		.exec((err, categorias) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.status(200).json({
				ok: true,
				categorias,
			});
		});
});

// Todas una categoria, por id
app.get("/categorias/:id", verificaToken, (req, res) => {
	let id = req.params.id;

	Categoria.findById(id, (err, categoria) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		if (!categoria) {
			return res.status(404).json({
				ok: false,
				message: "Categoria no encontrado",
			});
		}

		res.status(200).json({
			ok: true,
			categoria,
		});
	});
});

// Crear categoria
app.post("/categorias", verificaToken, (req, res) => {
	//regresa la nueva categoria
	let body = req.body;

	let categoria = new Categoria({
		nombre: body.nombre,
		descripcion: body.descripcion,
		estado: body.estado,
		usuario: req.usuario._id,
	});

	categoria.save((err, category) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!category) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.status(201).json({
			ok: true,
			categoria: category,
		});
	});
});

// Actualiza una categoria, por id
app.put("/categorias/:id", verificaToken, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["nombre", "descripcion", "estado"]);

	Categoria.findByIdAndUpdate(id, body, (err, categoria) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		if (!categoria) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}

		res.status(200).json({
			ok: true,
			categoria,
		});
	});
});

// Todas una categoria, por id
app.delete(
	"/categorias/:id",
	[verificaToken, verificaAdmin_Role],
	verificaToken,
	(req, res) => {
		let id = req.params.id;

		Categoria.findByIdAndUpdate(id, { estado: false }, (err, categoria) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.status(200).json({
				ok: true,
				categoria,
			});
		});
	}
);

module.exports = app;

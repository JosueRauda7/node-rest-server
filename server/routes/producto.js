const express = require("express");
const _ = require("underscore");

const { verificaToken } = require("../middlewares/autenticacion");

let app = express();
let Producto = require("../models/producto");

// Obtener todos los productos
app.get("/productos", verificaToken, (req, res) => {
	//todos los productos, con populate (user, category)
	//paginado

	let from = req.query.from || 0;
	from = Number(from);
	let to = req.query.to || 8;
	to = Number(to);

	Producto.find({ disponible: true })
		.sort("nombre")
		.skip(from)
		.limit(to)
		.populate("usuario", "nombre email")
		.populate("categoria", "nombre descripcion")
		.exec((err, productoDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}
			return res.status(200).json({
				ok: true,
				producto: productoDB,
			});
		});
});

// Obtener todos los productos por id
app.get("/productos/:id", verificaToken, (req, res) => {
	//populate (user, category)
	let id = req.params.id;

	Producto.find({ _id: id, disponible: true })
		.populate("usuario", "nombre email")
		.populate("categoria", "nombre descripcion")
		.exec((err, productoDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			if (!productoDB) {
				return res.status(404).json({
					ok: false,
					message: "No se ha encontrado ese producto.",
				});
			}

			return res.status(200).json({
				ok: true,
				producto: productoDB,
			});
		});
});

// Buscaro productos
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
	let termino = req.params.termino;

	let regex = new RegExp(termino, "i");

	Producto.find({ nombre: regex })
		.populate("categoria", "nombre descripcion")
		.exec((err, productos) => {
			if (err) {
				return res.status(404).json({
					ok: false,
					err,
				});
			}

			return res.status(200).json({
				ok: true,
				productos,
			});
		});
});

// Nuevo producto
app.post("/productos", verificaToken, (req, res) => {
	//grabar usuario y categoria
	let body = req.body;
	let usuario = req.usuario._id;

	const producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		categoria: body.categoriaId,
		usuario,
	});

	producto.save((err, productoBD) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		if (!productoBD) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}

		return res.status(201).json({
			ok: true,
			producto: productoBD,
		});
	});
});

// Actualizar producto
app.put("/productos/:id", verificaToken, (req, res) => {
	// console.log(req.params.id);
	// console.log(req.body);
	let id = req.params.id;
	let body = {
		..._.pick(req.body, ["nombre", "precioUni", "descripcion", "disponible"]),
		categoria: req.body.categoriaId,
	};

	Producto.findOneAndUpdate(id, body, (err, productoBD) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		return res.status(200).json({
			ok: true,
			producto: productoBD,
		});
	});
});

// Borrar producto
app.delete("/productos/:id", verificaToken, (req, res) => {
	let id = req.params.id;

	Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoBD) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		return res.status(200).json({
			ok: true,
			producto: productoBD,
		});
	});
});

module.exports = app;

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require("fs");
const path = require("path");

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

//default options
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {
	let tipo = req.params.tipo;
	let id = req.params.id;

	if (!req.files) {
		return res.status(400).json({
			ok: false,
			err: {
				message: "No se ha seleccionado ningún archivo",
			},
		});
	}

	//Validar tipo
	let tiposValidos = ["productos", "usuarios"];
	if (tiposValidos.indexOf(tipo) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: `Los tipos permitidos son: ${tiposValidos.join(", ")}`,
			},
		});
	}

	let archivo = req.files.archivo;
	let nombreCortado = archivo.name.split(".");
	let extension = nombreCortado[nombreCortado.length - 1];

	//Extensiones permitidas
	let extensionesValidas = ["jpg", "png", "gif", "jpeg"];

	if (extensionesValidas.indexOf(extension) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: `Las extensiones permitidas son: ${extensionesValidas.join(
					", "
				)}`,
				extension,
			},
		});
	}

	// Cambiar el nombre al archivo
	let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		//Registrando imagen en Base de Datos
		if (tipo === "usuarios") {
			imagenUsuario(id, res, nombreArchivo);
		} else {
			imagenProducto(id, res, nombreArchivo);
		}
	});
});

function imagenUsuario(id, res, nombreArchivo) {
	Usuario.findById(id, (err, usuarioBD) => {
		if (err) {
			//Filtro para eliminar archivo que se subió y dió error
			borrarArchivo(nombreArchivo, "usuarios");

			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!usuarioBD) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}

		//Filtro para borrar imagen anterior
		borrarArchivo(usuarioBD.img, "usuarios");

		usuarioBD.img = nombreArchivo;

		usuarioBD.save((err, usuarioGuardado) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			return res.status(200).json({
				ok: true,
				usuario: usuarioGuardado,
				img: nombreArchivo,
			});
		});
	});
}

function imagenProducto(id, res, nombreArchivo) {
	Producto.findById(id, (err, productoDB) => {
		if (err) {
			//Filtro para eliminar archivo que se subió y dió error
			borrarArchivo(nombreArchivo, "productos");
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!productoDB) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}

		//Filtro para borrar imagen anterior
		borrarArchivo(productoDB.img, "productos");

		productoDB.img = nombreArchivo;
		productoDB.save((err, productoGuardado) => {
			if (err) {
				//Filtro para eliminar archivo que se subió y dió error
				borrarArchivo(nombreArchivo, "productos");
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			return res.status(200).json({
				ok: true,
				producto: productoGuardado,
				img: nombreArchivo,
			});
		});
	});
}

function borrarArchivo(img, tipo) {
	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
	if (fs.existsSync(pathImagen)) {
		fs.unlinkSync(pathImagen);
	}
}

module.exports = app;

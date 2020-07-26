const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
	nombre: {
		type: String,
		unique: true,
		required: [true, "El nombre de la categoria es un campo necesario"],
	},
	descripcion: {
		type: String,
		required: false,
	},
	estado: {
		type: Boolean,
		required: false,
		default: true,
	},
	usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
});

mongoose.plugin(uniqueValidator, { message: "{PATH} debe ser único" });

module.exports = mongoose.model("Categoria", categoriaSchema);

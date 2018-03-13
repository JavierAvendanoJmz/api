var mongoose = require('mongoose');

var usuarioSchema = new mongoose.Schema({
    usuario: String,
    contra: String,
});

mongoose.model('usuarios', usuarioSchema);
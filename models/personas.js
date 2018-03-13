var mongoose = require('mongoose');

var personaSchema = new mongoose.Schema({
    nombre: String,
    telefono: String,
});

mongoose.model('Persona', personaSchema);

//db.Persona.insert({nombre:'luis',telefono:'123456789',fecha_nac:'1519950249326'});
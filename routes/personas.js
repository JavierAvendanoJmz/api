var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
var usuariooo;

router.use(bodyParser.urlencoded({extended:true}));

router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in  req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}))

router.route('/iniciarSesion')
    .post(function(req, res) {
        var usuario = req.body.usuario;
        var contra = req.body.contra;
        mongoose.model('usuarios').findOne({'usuario':usuario, 'contra':contra},
            function(error, persona) {
                if(error)
                    console.log("no se encontró");
                else {
                    console.log("se encontró");
                    console.log(persona);
                    if(persona != null) {
                        usuariooo = usuario;
                        res.format({
                            html:function (argument) {
                                res.location("/personas");
                                res.redirect("/personas");
                            }
                        })
                    } else {
                        res.render('index',{title:"Iniciar Sesion"});
                    }
                }
            }
        )   
    });

router.route('/')
    .post(function(req, res) {
        var nombre = req.body.nombre;
        var telefono = req.body.telefono;
        mongoose.model('Persona').create({nombre, telefono},
            function(err,persona) {
                if(err)
                    res.send("Error al guardar el dato");
                else {
                    console.log("Dato guardado")
                    res.format({
                        html:function (argument) {
                            res.location("/personas");
                            res.redirect("/personas");
                        }
                    })
                }
            }
        )
    })
    .get(function(req, res, next) {
        mongoose.model('Persona').find({},
            function(err, personas) {
                if(err)
                    return console.log;
                else {
                    res.format({
                        html:function(){
                            res.render('personas/index',{
                                title:'Bienvenido ' + usuariooo +': Lista personas',
                                personas: personas
                            });
                        },
                        json:function(){
                            res.json(personas);
                        }
                    });
                }
            });
});

router.route('/eliminar/:telefono')
    .post(function(req,res){
        var telefono = req.body.telefono;
        var nombre = req.body.nombre;
        mongoose.model('Persona').findOneAndRemove({'telefono':telefono},
            function(err,persona) {
                if(err)
                    res.send("Error al eliminar el dato");
                else {
                    console.log("Dato eliminar")
                    res.format({
                        html:function (argument) {
                            res.location("/personas");
                            res.redirect("/personas");
                        }
                    })
                }
            }
        )
    })
    .get(function(req,res){
        console.log(req.params.telefono);
        mongoose.model('Persona').findOne({'telefono':req.params.telefono},
            function(error, persona) {
                if(error)
                    console.log("no se encontró");
                else {
                    console.log("se encontró");
                    console.log(persona);
                    res.format({
                        html:function (argument) {
                            res.render('personas/eliminar',{title:"Eliminar","persona":persona});
                        }
                    })
                }
            }
        )        
    });

router.route('/actualizar/:telefono')
    .post(function(req,res){
        var telefono = req.body.telefono;
        var nombre = req.body.nombre;
        mongoose.model('Persona').findOneAndUpdate({'telefono':telefono}, {$set: {'nombre':nombre}}, {new: true},
            function(err,persona) {
                if(err)
                    res.send("Error al actualizar el dato");
                else {
                    console.log("Dato actualizado")
                    res.format({
                        html:function (argument) {
                            res.location("/personas");
                            res.redirect("/personas");
                        }
                    })
                }
            }
        )
    })
    .get(function(req,res){
        console.log(req.params.telefono);
        mongoose.model('Persona').findOne({'telefono':req.params.telefono},
            function(error, persona) {
                if(error)
                    console.log("no se encontró");
                else {
                    console.log("se encontró");
                    console.log(persona);
                    res.format({
                        html:function (argument) {
                            res.render('personas/actualizar',{title:"Actualizar","persona":persona});
                        }
                    })
                }
            }
        )        
    });

router.get('/agregar', function(req, res) {
    res.render('personas/agregar',{title:"Agregar"});
});

router.route('/busqueda/')
.post(function(req, res, next) {
    var nombre = req.body.nombre;
    mongoose.model('Persona').find({'nombre': new RegExp(nombre,"i")},
        function(err, personas) {
            if(err)
                return console.log;
            else {
                res.format({
                    html:function(){
                        res.render('personas/index',{
                            title:'Lista personas',
                            personas: personas
                        });
                    },
                    json:function(){
                        res.json(personas);
                    }
                });
            }
        });
});

router.get('/buscar', function(req, res) {
    res.render('personas/buscar',{title:"Buscar"});
});

module.exports = router;
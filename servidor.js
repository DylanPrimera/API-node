const express = require('express');
const methodOverride = require('method-override')
// definimos la aplicacion como una instancia de express
const app = express();

// importamos mongoose para conectarnos con la BD Mongo
const mongoose = require('mongoose');

// importamos cors
const cors =  require('cors');

// nos conectamos a la BD
mongoose.connect('mongodb://localhost:27017/lista-angular');

// una vez generada la BD generamos los modelos
// creamos la tabla y sus celdas
const Lista = mongoose.model('Lista', {
    texto: String,
    terminado: Boolean
});

// configuramos la ruta basse de los archivos estaticos
app.configure(function () {
    app.use(express.static(__dirname + '/publico'));
    app.use(express.bodyParser()); // toma los valores que llegan desde HTML y los va a procesar
    app.use(methodOverride());
})

// configuramos el CORSS
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// definimos la llamada POST
app.post('/api/lista', function (request, response) {
    // creamos un registro
    Lista.create({
        texto: request.body.texto // capturamos en caso que nos envien una variable llamda texto
    }, function (error, lista) {
        // esta funcion se ejecuta cada vez que termine el proceso anterior
        if (error) {
            response.send(error);
        }
        Lista.find(function (error, lista) {
            if (error) {
                response.send(error);
            }
            response.json(lista); // mandamos en formato JSON la informacion
        })
    })
})

// llamada GET
app.get('/api/lista', function (request, response) {
    Lista.find(function (error, lista) {
        if (error) {
            response.send(error);
        }
        response.json(lista);
    })
})

// llamda DELETE
app.delete('/api/lista/:item', function (request, response) {
    Lista.remove({
        _id: request.params.item //buscamos el id que deseamos eliminar
    }, function (error, lista) {
        if (error) {
            response.send(error); //en caso de error
        }
        // actualizamos la informacion
        Lista.find(function (error, lista) {
            if (error) {
                response.send(error);
            }
            response.json(lista); //devolvemos la informacion
        })
    })
})

// llamada UPDATE
app.put('/api/lista/:item', function (request,response) {
    Lista.findOneAndUpdate(
        {
            _id: request.params.item // criterio de busqueda para actualizar
        },
        {texto: request.body.texto},
        function (error,lista) {
            if(error) {
                response.send(error);
            }
            Lista.find(function (error,lista) {
                if(error) {
                    response.send(error);
                }
                response.json(lista); // enviamos la informacion actualizada de la lista
            })
        }
    )
})

// escuchamos la informacion
// una vez escuchamos el puerto ejecutamos una funcion
app.listen(9090, function () {
    console.log('API running');
})
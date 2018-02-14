var express = require('express');
var engines = require('consolidate');
var bodyParser = require('body-parser');

// Service
var app = express();
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(express.static("public"));
app.use(bodyParser.json());


app.get('/', function (request,response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    response.redirect("/");
});

app.use(function(request,response, next){
    if ('OPTIONS' == request.method) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        response.send(200);
    }
    else {
        response.sendStatus(404);
        next();
    }
});

console.log("Preparing to start server");
app.listen(process.env.PORT || 3000, function(){
   console.log('Picolabs api up and running in port http://localhost:3000/..');
});


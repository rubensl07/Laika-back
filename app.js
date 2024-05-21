/********************************************************************************
 * Objetivo: Criar uma aplicação web de um petshop que atenda a clientes e funcionários, cumprindo com os requisitos estabelecidos pelos orientadores
 * Data: 21/05/2024
 * Autor: Matheus Noronha da Silva, Rubens Luiz Lobo de Almeida, Pedro Henrique Inocente, Letícia Melo da Silva
 * Versão: 1.0
 * 
 *******************************************************************************/
var express = require('express')
var server = express()
var bodyParser = require ('body-parser')
const bodyParserJSON = bodyParser.json()
var cors = require('cors') 

server.use((request,response,next)=>{
    response.header('Acess-Control-Allow-Origin','*');
    response.header('Acess-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    server.use(cors());
    next();
})
const controllerClientes = require('./controller/controller_clientes.js')

server.get('/v1/laika/clientes', cors(), async function(request, response,){
    let dados = await controllerClientes.getListarClientes();
    response.status(dados.status_code)
    response.json(dados)
})

var port = process.env.PORT || 8080
server.listen(port,function(){
    console.log("Nasceu!!\nPorta "+port)
})
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

//------------------------------------------------------------CLIENTES-----------------------------------------------------------------------//
const controllerClientes = require('./controller/controller_clientes.js')

server.get('/v1/laika/clientes', cors(), async function(request, response,){
    let dados = await controllerClientes.getListar();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/cliente/:id', cors(), async function(request, response,){
    let dados = await controllerClientes.getBuscarId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.post('/v1/laika/cliente', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let dados = await controllerClientes.setInserir(dadosBody, contentType);

    response.status(dados.status_code);
    response.json(dados);
});
server.delete('/v1/laika/cliente/:id', cors(), async function(request,response){
    let dados = await controllerClientes.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)
})

//---------------------------------------------------------FUNCIONÁRIOS-----------------------------------------------------------------------//
const controllerFuncionarios = require('./controller/controller_funcionario.js')

server.get('/v1/laika/funcionarios', cors(), async function(request, response,){
    let dados = await controllerFuncionarios.getListar();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/funcionario/:id', cors(), async function(request, response,){
    let dados = await controllerFuncionarios.getBuscarId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.post('/v1/laika/funcionario', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let dados = await controllerFuncionarios.setInserir(dadosBody, contentType);

    response.status(dados.status_code);
    response.json(dados);
});

server.delete('/v1/laika/funcionario/:id', cors(), async function(request,response){
    let dados = await controllerFuncionarios.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)
})

//------------------------------------------------------------PRODUTOS-----------------------------------------------------------------------//
const controllerProdutos = require('./controller/controller_produtos.js')

server.get('/v1/laika/produtos', cors(), async function(request, response,){
    let dados = await controllerProdutos.getListar();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/produto/:id', cors(), async function(request, response,){
    let dados = await controllerProdutos.getBuscarId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})

server.post('/v1/laika/produto', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let dados = await controllerProdutos.setInserir(dadosBody, contentType);

    response.status(dados.status_code);
    response.json(dados);
});


server.delete('/v1/laika/produto/:id', cors(), async function(request,response){
    let dados = await controllerProdutos.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)
})


server.put('/v1/laika/produto/:id', async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    console.log(dadosBody);
    let id = request.params.id;

    let dados = await controllerProdutos.setAtualizar(id, dadosBody, contentType);

    // Validar content type
    if (String(contentType).toLowerCase() !== 'application/json') {
        response.status(415)(dados.status_code);
        return;
    }

    let resultadoAtualizacao = await controllerProdutos.setAtualizar(id, dados);

    response.status(resultadoAtualizacao.status_code);
    response.json(resultadoAtualizacao);
});

//------------------------------------------------------------SERVICOS-----------------------------------------------------------------------//

const controllerServicos = require('./controller/controller_servicos.js')

server.get('/v1/laika/servicos', cors(), async function(request, response,){
    let dados = await controllerServicos.getListar();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/servico/:id', cors(), async function(request, response,){
    let dados = await controllerServicos.getBuscarId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})

server.delete('/v1/laika/servico/:id', cors(), async function(request,response){
    let dados = await controllerServicos.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)
})

//------------------------------------------------------------ENDERECOS-----------------------------------------------------------------------//

const controllerEnderecos = require('./controller/controller_endereco.js')

server.get('/v1/laika/enderecos', cors(), async function(request, response,){
    let dados = await controllerEnderecos.getListar();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/endereco/:id', cors(), async function(request, response,){
    let dados = await controllerEnderecos.getBuscarId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})

//-----------------------------------------------------------------CARGO-----------------------------------------------------------------------//

const controllerCargos = require('./controller/controller_cargo.js')
server.post('/v1/laika/cargo', async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let newCargo = await controllerCargos.setInsert(dadosBody, contentType);

    response.status(newCargo.status_code);
    response.json(newCargo);
});


server.get('/v1/laika/cargos', async function(request, response) {
    let todosCargos = await controllerCargos.getAll();

    response.status(todosCargos.status_code);
    response.json(todosCargos);
});

server.delete('/v1/laika/cargo/:id', cors(), async function(request,response){
    let dados = await controllerCargos.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)
})




var port = process.env.PORT || 8080
server.listen(port,function(){
    console.log("Nasceu!!\nPorta "+port)
})
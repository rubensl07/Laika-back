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
const base = require('./modulo/base.json')

server.use((request,response,next)=>{
    response.header('Access-Control-Allow-Origin','*');
    response.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    server.use(cors());
    next();
})


server.get('/', async (req, response) => {
    try {
        const json = base
        return response.json(json);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
});

//------------------------------------------------------------CLIENTES-----------------------------------------------------------------------//
const controllerClientes = require('./controller/controller_clientes.js')

server.get('/v1/laika/clientes', cors(), async function(request, response,){
    let dados = await controllerClientes.getAll();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/clientes/resumo', cors(), async function(request, response,){
    let dados = await controllerClientes.getAllResumido();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/clientes/login', cors(), async function(request, response,){
    let dados = await controllerClientes.getAllLogin();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/cliente/:id', cors(), async function(request, response,){
    let dados = await controllerClientes.getId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/cliente/resumo/:id', cors(), async function(request, response,){
    let dados = await controllerClientes.getIdResumido(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/cliente/login/:id', cors(), async function(request, response,){
    let dados = await controllerClientes.getIdLogin(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/cliente/nome/:id', cors(), async function(request, response,){
    let dados = await controllerClientes.getIdNome(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})

server.get('/v1/laika/cliente/img/:id', cors(), async function(request, response,){
    let dados = await controllerClientes.getImg(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})

server.post('/v1/laika/cliente', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let dados = await controllerClientes.setInserir(dadosBody, contentType);

    response.status(dados.status_code);
    response.json(dados);
})
server.put('/v1/laika/cliente/:id', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerClientes.setAtualizar(request.params.id, dadosBody, contentType)    
    response.status(result.status_code)
    response.json(result)
})
server.delete('/v1/laika/cliente/:id', cors(), async function(request,response){
    let dados = await controllerClientes.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)
})

//---------------------------------------------------------FUNCIONÁRIOS-----------------------------------------------------------------------//
const controllerFuncionarios = require('./controller/controller_funcionario.js')

server.get('/v1/laika/funcionarios', cors(), async function(request, response,){
    const search ={
        nome: request.query.nome,
        cargos: request.query.cargos
    } 
    let dados = await controllerFuncionarios.getAll(search);
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/clientes/veterinarios', cors(), async function(request, response,){
    let dados = await controllerFuncionarios.getAllVeterinarios();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/funcionarios/login', cors(), async function(request, response,){
    let dados = await controllerFuncionarios.getAllLogin();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/funcionario/:id', cors(), async function(request, response,){
    let dados = await controllerFuncionarios.getId(request.params.id);
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
server.put('/v1/laika/funcionario/:id', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerFuncionarios.setAtualizar(request.params.id, dadosBody, contentType)    
    response.status(result.status_code)
    response.json(result)
})
server.delete('/v1/laika/funcionario/:id', cors(), async function(request,response){
    let dados = await controllerFuncionarios.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)
})
//---------------------------------------------------------VETERINÁRIOS-----------------------------------------------------------------------//
server.get('/v1/laika/veterinarios', cors(), async function(request, response,){
    let dados = await controllerFuncionarios.getAllVeterinarios();
    response.status(dados.status_code)
    response.json(dados)
})
//------------------------------------------------------------PRODUTOS-----------------------------------------------------------------------//
const controllerProdutos = require('./controller/controller_produtos.js')

server.get('/v1/laika/produtos', cors(), async function(request, response,){
    const search = {
        pesquisa: request.query.pesquisa,
        precoMin: request.query.precoMin,
        precoMax: request.query.precoMax, 
        categoria: request.query.categoria
    }
    let dados = await controllerProdutos.getAll(search);
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/produto/:id', cors(), async function(request, response,){
    let dados = await controllerProdutos.getId(request.params.id);
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

server.put('/v1/laika/produto/:id', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerProdutos.setAtualizar(request.params.id, dadosBody, contentType)    
    response.status(result.status_code)
    response.json(result)
})


// server.put('/v1/laika/produto/:id', async function(request, response) {
//     let contentType = request.headers['content-type'];
//     let dadosBody = request.body;
//     console.log(dadosBody);
//     let id = request.params.id;

//     let dados = await controllerProdutos.setAtualizar(id, dadosBody, contentType);

//     // Validar content type
//     if (String(contentType).toLowerCase() !== 'application/json') {
//         response.status(415)(dados.status_code);
//         return;
//     }

//     let resultadoAtualizacao = await controllerProdutos.setAtualizar(id, dados);

//     response.status(resultadoAtualizacao.status_code);
//     response.json(resultadoAtualizacao);
// });

//------------------------------------------------------------CATEGORIAS-----------------------------------------------------------------------//
const controllerCategorias = require('./controller/controller_categorias.js')

server.get('/v1/laika/categorias', cors(), async function(request, response,){
    let dados = await controllerCategorias.getAll();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/categoria/:id', cors(), async function(request, response,){
    let dados = await controllerCategorias.getId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.post('/v1/laika/categoria', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerCategorias.setInserir(dadosBody, contentType);

    response.status(result.status_code);
    response.json(result);
});
server.put('/v1/laika/categoria/:id', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerCategorias.setAtualizar(request.params.id, dadosBody, contentType)    
    response.status(result.status_code)
    response.json(result)
})
server.delete('/v1/laika/categoria/:id', cors(), async function(request,response){
    let dados = await controllerCategorias.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)})

//------------------------------------------------------------SERVICOS-----------------------------------------------------------------------//

const controllerServicos = require('./controller/controller_servicos.js')

server.get('/v1/laika/servicos', cors(), async function(request, response,){
    let dados = await controllerServicos.getAll();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/servico/:id', cors(), async function(request, response,){
    let dados = await controllerServicos.getId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.post('/v1/laika/servico', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerServicos.setInserir(dadosBody,contentType)
    response.status(result.status_code)
    response.json(result)
})
server.put('/v1/laika/servico/:id', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerServicos.setAtualizar(request.params.id, dadosBody, contentType)    
    response.status(result.status_code)
    response.json(result)
})

server.delete('/v1/laika/servico/:id', cors(), async function(request,response){
    let dados = await controllerServicos.setExcluir(request.params.id)
    
    response.status(dados.status_code)
    response.json(dados)
})

//------------------------------------------------------------ENDERECOS-----------------------------------------------------------------------//

const controllerEnderecos = require('./controller/controller_endereco.js')

server.get('/v1/laika/enderecos', cors(), async function(request, response,){
    let dados = await controllerEnderecos.getAll();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/endereco/:id', cors(), async function(request, response,){
    let dados = await controllerEnderecos.getId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.post('/v1/laika/endereco', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerEnderecos.setInserir(dadosBody,contentType)
    response.status(result.status_code)
    response.json(result)
})
server.put('/v1/laika/endereco/:id', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerEnderecos.setAtualizar(request.params.id, dadosBody, contentType)    
    response.status(result.status_code)
    response.json(result)
})
server.delete('/v1/laika/endereco/:id', cors(), async function(request,response){
    let dados = await controllerEnderecos.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)
})

//-----------------------------------------------------------------CARGO-----------------------------------------------------------------------//

const controllerCargos = require('./controller/controller_cargo.js')
server.get('/v1/laika/cargos', cors(), async function(request, response,){
    let dados = await controllerCargos.getAll();
    response.status(dados.status_code)
    response.json(dados)
})
server.get('/v1/laika/cargo/:id', cors(), async function(request, response,){
    let dados = await controllerCargos.getId(request.params.id);
    response.status(dados.status_code)
    response.json(dados)
})
server.post('/v1/laika/cargo', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerCargos.setInserir(dadosBody, contentType);

    response.status(result.status_code);
    response.json(result);
});
server.put('/v1/laika/cargo/:id', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerCargos.setAtualizar(request.params.id, dadosBody, contentType)    
    response.status(result.status_code)
    response.json(result)
})
server.delete('/v1/laika/cargo/:id', cors(), async function(request,response){
    let dados = await controllerCargos.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)})
//-----------------------------------------------------------------ANIMAIS-----------------------------------------------------------------------//

const controllerAnimais = require('./controller/controller_animais.js')


server.get('/v1/laika/animais', async (req, res) => {    
    let result = await controllerAnimais.getAll();
    res.status(result.status_code).json(result);
});

server.get('/v1/laika/animal/:id', async (req, res) => {
    let result = await controllerAnimais.getId(req.params.id);
    res.status(result.status_code).json(result);
});

server.get('/v1/laika/animais/cliente/:id', async (req, res) => {
    let result = await controllerAnimais.getByClienteId(req.params.id);
    res.status(result.status_code).json(result);
});
server.post('/v1/laika/animal', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let newCargo = await controllerAnimais.setInserir(dadosBody, contentType);

    response.status(newCargo.status_code);
    response.json(newCargo);
});
server.put('/v1/laika/animal/:id', cors(), bodyParserJSON,async function(request,response){
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerAnimais.setAtualizar(request.params.id, dadosBody, contentType)    
    response.status(result.status_code)
    response.json(result)
})
server.delete('/v1/laika/animal/:id', cors(), async function(request,response){
    let dados = await controllerAnimais.setExcluir(request.params.id)

    response.status(dados.status_code)
    response.json(dados)})


//-----------------------------------------------------------------PORTES-----------------------------------------------------------------------//
const controllerPortes = require('./controller/controller_portes.js')


server.get('/v1/laika/portes', async (req, res) => {
    let result = await controllerPortes.getAll();
    res.status(result.status_code).json(result);
});
server.get('/v1/laika/porte/:id', async (req, res) => {
    let result = await controllerPortes.getId(req.params.id);
    res.status(result.status_code).json(result);
});

//-----------------------------------------------------------------TIPOS-----------------------------------------------------------------------//
const controllerTipos = require('./controller/controller_tipos.js')

server.get('/v1/laika/tipos', async (req, res) => {
    let result = await controllerTipos.getAll();
    res.status(result.status_code).json(result);
});
server.get('/v1/laika/tipo/:id', async (req, res) => {
    let result = await controllerTipos.getId(req.params.id);
    res.status(result.status_code).json(result);
});

//-----------------------------------------------------------------RAÇAS-----------------------------------------------------------------------//
const controllerRacas = require('./controller/controller_racas.js')

server.get('/v1/laika/racas', async (req, res) => {
    let result = await controllerRacas.getAll();
    res.status(result.status_code).json(result);
});

server.get('/v1/laika/raca/:id', async (req, res) => {
    let result = await controllerRacas.getId(req.params.id);
    res.status(result.status_code).json(result);
});

server.get('/v1/laika/racas/tipo/:tipoId', async (req, res) => {
    let result = await controllerRacas.getByTipoId(req.params.tipoId);
    res.status(result.status_code).json(result);
});

//-----------------------------------------------------------------AGENDAMENTOS-----------------------------------------------------------------------//
const controllerAgendamentos = require('./controller/controller_agendamentos.js')

server.get('/v1/laika/agendamentos', cors(), async function(request, response) {
    let dados = await controllerAgendamentos.getAll();
    response.status(dados.status_code);
    response.json(dados);
});

server.get('/v1/laika/agendamento/:id', cors(), async function(request, response) {
    let dados = await controllerAgendamentos.getId(request.params.id);
    response.status(dados.status_code);
    response.json(dados);
});

server.get('/v1/laika/agendamentos/cliente/:id', cors(), async function(request, response) {
    let dados = await controllerAgendamentos.getAllCliente(request.params.id);
    response.status(dados.status_code);
    response.json(dados);
});
server.get('/v1/laika/agendamentos/funcionario/:id', cors(), async function(request, response) {
    let dados = await controllerAgendamentos.getAllFuncionario(request.params.id);
    response.status(dados.status_code);
    response.json(dados);
});
server.get('/v1/laika/agendamentos/animal/:id', cors(), async function(request, response) {
    let dados = await controllerAgendamentos.getAllAnimal(request.params.id);
    response.status(dados.status_code);
    response.json(dados);
});

server.post('/v1/laika/agendamento', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerAgendamentos.setInserir(dadosBody, contentType);
    response.status(result.status_code);
    response.json(result);
});

server.put('/v1/laika/agendamento/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerAgendamentos.setAtualizar(request.params.id, dadosBody, contentType);
    response.status(result.status_code);
    response.json(result);
});

server.delete('/v1/laika/agendamento/:id', cors(), async function(request, response) {
    let dados = await controllerAgendamentos.setExcluir(request.params.id);
    response.status(dados.status_code);
    response.json(dados);
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------Inicialização do servidor-----------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------//

var port = process.env.PORT || 8080
server.listen(port,function(){
    console.log("Nasceu!!\nPorta "+port)
})
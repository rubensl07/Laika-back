const message = require('../modulo/config.js')
const animalDAO = require('../model/DAO/animal.js')
const servicosDAO = require('../model/DAO/servico.js')
const clientesDAO = require('../model/DAO/cliente.js')
const funcionariosDAO = require('../model/DAO/funcionario.js')
// const funcionariosController = require('./controller_funcionario.js')
const cargosDAO = require('../model/DAO/cargo.js');



const DAO = require('../model/DAO/agendamentos.js')
const { tratarData } = require('./funcoes.js')

const setInserir = async function (dados, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let json = {};
            if (dados.data_agendamento == '' || dados.data_agendamento == undefined || dados.data_agendamento.length != 10||
            dados.animal_id == '' || dados.animal_id == undefined || isNaN(dados.animal_id) ||
            !Array.isArray(dados.funcionarios) || !Array.isArray(dados.servicos)) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let result = await DAO.insert(dados);
                
                if (result) {
                    let idAgendamento = await DAO.pegarUltimoId();
                    if(dados.funcionarios){
                        (dados.funcionarios).forEach(element => {
                            const json = {
                                idAgendamento,
                                idFuncionario: element
                            }
                            DAO.insertAgendamentoFuncionarios(json)
                        });
                    }
                    if(dados.servicos){
                        (dados.servicos).forEach(idServico => {
                            const json ={
                                idAgendamento,
                                idServico
                            }
                            DAO.insertAgendamentoServicos(json)
                        });
                    }
                    json.dados = dados;
                    json.status = message.SUCCESS_CREATED_ITEM.status;
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code;
                    json.message = message.SUCCESS_CREATED_ITEM.message;
                    json.id = parseInt(idAgendamento);
                    return json; // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500 - Erro na controller
    }
};
const setAtualizar = async function (id, dados, contentType) {
    try{
        if(String(contentType).toLowerCase()== 'application/json'){
            let json = {}
            if (
                dados.data_agendamento == ''|| dados.data_agendamento == undefined|| dados.data_agendamento == null||dados.data_agendamento.length != 10
            )
            {
               return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let result = await DAO.update(id, dados)
                if(result) {
                    json.dados = dados
                    json.status = message.SUCCESS_ACCEPTED_ITEM.status
                    json.status_code = message.SUCCESS_ACCEPTED_ITEM.status_code
                    json.message = message.SUCCESS_ACCEPTED_ITEM.message
                    json.id = parseInt(id)
                    return json //201
                } else {
                    return message.ERROR_NOT_FOUND //404
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error){
        console.error(error);
        return message.ERROR_INTERNAL_SERVER //500 - Erro na controller
    }
}



const setExcluir = async function (id) {
    let json = {};
    let result = await DAO.deletar(id);
    if (result) {
        json.status = message.SUCCESS_ACCEPTED_ITEM.status;
        json.status_code = message.SUCCESS_ACCEPTED_ITEM.status_code;
        json.message = message.SUCCESS_ACCEPTED_ITEM.message;
        return json; // 202
    } else {
        return message.ERROR_NOT_FOUND; // 404
    }
};

const getAll = async function () {
    let json = {};
    let dados = await DAO.selectAll();
    if (dados) {
        if (dados.length > 0) {
            for (let index = 0; index < dados.length; index++) {
                dados[index].data_agendamento = tratarData(dados[index].data_agendamento)
                const infoAnimal = (await animalDAO.selectById(dados[index].animal_id))[0]  
                delete dados[index].animal_id                  
                delete infoAnimal.nascimento
                delete infoAnimal.peso
                delete infoAnimal.cliente_id
                delete infoAnimal.porte_id
                delete infoAnimal.raca_id
                dados[index].animal = infoAnimal 
                if(dados[index].funcionarios){
                    const listaIdsFuncionarios = dados[index].funcionarios.split('-')
                    let listaFuncionarios = []
                    for (let idFuncionario of listaIdsFuncionarios) {
                        // const funcionario = (await funcionariosController.getId(parseInt(idFuncionario))).dados
                        const funcionario = (await funcionariosDAO.selectById(parseInt(idFuncionario)))[0];
                        delete funcionario.email
                        delete funcionario.senha
                        delete funcionario.endereco_id
                        delete funcionario.total_agendamentos
                        if(funcionario.cargos){
                            const listaIdsCargos = funcionario.cargos.split('-')
                            let listaCargos = []
                            for(let idCargo of listaIdsCargos){
                                listaCargos.push((await cargosDAO.selectById(parseInt(idCargo)))[0])
                            }
                            funcionario.cargos = listaCargos
                        }
                        listaFuncionarios.push(funcionario);
                    }
                    dados[index].funcionarios = listaFuncionarios
                }
                if(dados[index].servicos){
                    const listaIdsServicos = dados[index].servicos.split('-')
                    let listaServicos = []
                    for (let idServico of listaIdsServicos) {
                        listaServicos.push((await servicosDAO.selectById(parseInt(idServico)))[0]);
                    }
                    dados[index].servicos = listaServicos
                }
            }
            json.dados = dados;
            json.status_code = 200;
            return json;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}



const getAllAnimal = async function (id) {
    let json = {};
    let dados = await DAO.selectByAnimalId(id);
    if (dados) {
        if (dados.length > 0) {
            json.dados = dados;
            json.status_code = 200;
            return json;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}
const getAllCliente = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; // 400
    } else {
        let dados = await DAO.selectByClienteId(id);
        if (dados) {
            if (dados.length > 0) {
                for (let index = 0; index < dados.length; index++) {
                    dados[index].data_agendamento = tratarData(dados[index].data_agendamento)
                    const infoAnimal = (await animalDAO.selectById(dados[index].animal_id))[0]  
                    delete dados[index].animal_id                  
                    delete infoAnimal.nascimento
                    delete infoAnimal.cliente_id
                    delete infoAnimal.peso
                    delete infoAnimal.porte_id
                    delete infoAnimal.raca_id
                    dados[index].animal = infoAnimal 
                    if(dados[index].funcionarios){
                        const listaIdsFuncionarios = dados[index].funcionarios.split('-')
                        let listaFuncionarios = []
                        for (let idFuncionario of listaIdsFuncionarios) {
                            const funcionario = (await funcionariosDAO.selectById(parseInt(idFuncionario)))[0];
                            delete funcionario.email
                            delete funcionario.senha
                            delete funcionario.endereco_id
                            delete funcionario.total_agendamentos
                            if(funcionario.cargos){
                                const listaIdsCargos = funcionario.cargos.split('-')
                                let listaCargos = []
                                for(let idCargo of listaIdsCargos){
                                    listaCargos.push((await cargosDAO.selectById(parseInt(idCargo)))[0])
                                }
                                funcionario.cargos = listaCargos
                            }
                            listaFuncionarios.push(funcionario);
                        }
                        dados[index].funcionarios = listaFuncionarios
                    }
                    if(dados[index].servicos){
                        const listaIdsServicos = dados[index].servicos.split('-')
                        let listaServicos = []
                        for (let idServico of listaIdsServicos) {
                            listaServicos.push((await servicosDAO.selectById(parseInt(idServico)))[0])
                        }
                        dados[index].servicos = listaServicos
                    }
                }
                json.dados = dados;
                json.status_code = 200;
                return json;
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB; // 500
        }
    }
};

const getAllFuncionario = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; // 400
    } else {
        let dados = await DAO.selectByFuncionarioId(id);
        if (dados) {
            if (dados.length > 0) {
                for (let index = 0; dados < dados.length; index++) {
                    dados[index].data_agendamento = tratarData(dados[index].data_agendamento)
                    const infoAnimal = (await animalDAO.selectById(dados[index].animal_id))[0]  
                    delete dados[index].animal_id                  
                    delete infoAnimal.nascimento
                    delete infoAnimal.peso
                    delete infoAnimal.porte_id
                    delete infoAnimal.raca_id
                    dados[index].animal = infoAnimal 
                    if(dados[index].funcionarios){
                        const listaIdsFuncionarios = dados[index].funcionarios.split('-')
                        let listaFuncionarios = []
                        for (let idFuncionario of listaIdsFuncionarios) {
                            const funcionario = (await funcionariosDAO.selectById(parseInt(idFuncionario)))[0];
                            delete funcionario.email
                            delete funcionario.senha
                            delete funcionario.endereco_id
                            delete funcionario.total_agendamentos
                            if(funcionario.cargos){
                                const listaIdsCargos = funcionario.cargos.split('-')
                                let listaCargos = []
                                for(let idCargo of listaIdsCargos){
                                    listaCargos.push((await cargosDAO.selectById(parseInt(idCargo)))[0])
                                }
                                funcionario.cargos = listaCargos
                            }
                            listaFuncionarios.push(funcionario);
                        }
                        dados[index].funcionarios = listaFuncionarios
                    }
                    if(dados[index].servicos){
                        const listaIdsServicos = dados[index].servicos.split('-')
                        let listaServicos = []
                        for (let idServico of listaIdsServicos) {
                            listaServicos.push((await servicosDAO.selectById(parseInt(idServico)))[0])
                        }
                        dados[index].servicos = listaServicos
                    }
                }
                json.dados = dados;
                json.status_code = 200;
                return json;
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB; // 500
        }
    }
};

const getId = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; // 400
    } else {
        let dados = await DAO.selectById(id);
        if (dados) {
            if (dados.length > 0) {
                dados[0].data_agendamento = tratarData(dados[0].data_agendamento)
                const infoAnimal = (await animalDAO.selectById(dados[0].animal_id))[0]  
                delete dados[0].animal_id                  
                delete infoAnimal.nascimento
                delete infoAnimal.peso
                delete infoAnimal.cliente_id
                delete infoAnimal.porte_id
                delete infoAnimal.raca_id
                dados[0].animal = infoAnimal 
                if(dados[0].funcionarios){
                    const listaIdsFuncionarios = dados[0].funcionarios.split('-')
                    let listaFuncionarios = []
                    for (let idFuncionario of listaIdsFuncionarios) {
                        const funcionario = (await funcionariosDAO.selectById(parseInt(idFuncionario)))[0];
                        delete funcionario.email
                        delete funcionario.senha
                        delete funcionario.endereco_id
                        delete funcionario.total_agendamentos
                        if(funcionario.cargos){
                            const listaIdsCargos = funcionario.cargos.split('-')
                            let listaCargos = []
                            for(let idCargo of listaIdsCargos){
                                listaCargos.push((await cargosDAO.selectById(parseInt(idCargo)))[0])
                            }
                            funcionario.cargos = listaCargos
                        }
                        listaFuncionarios.push(funcionario);
                    }
                    dados[0].funcionarios = listaFuncionarios
                }
                if(dados[0].servicos){
                    const listaIdsServicos = dados[0].servicos.split('-')
                    let listaServicos = []
                    for (let idServico of listaIdsServicos) {
                        listaServicos.push((await servicosDAO.selectById(parseInt(idServico)))[0])
                    }
                    dados[0].servicos = listaServicos
                }
                json.dados = dados[0];
                json.status_code = 200;
                return json;
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB; // 500
        }
    }
};

const setInserirAgendamentoFuncionarios = async function (dados, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let json = {};
            if (dados.funcionario_id == '' || dados.funcionario_id == undefined || dados.agendamento_id == '' || dados.agendamento_id == undefined) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let result = await DAO.insertAgendamentoFuncionarios(dados);
                if (result) {
                    json.status = message.SUCCESS_CREATED_ITEM.status;
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code;
                    json.message = message.SUCCESS_CREATED_ITEM.message;
                    return json; // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500 - Erro na controller
    }
};

const setInserirAgendamentoServicos = async function (dados, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let json = {};
            if (dados.servico_id == '' || dados.servico_id == undefined || dados.agendamento_id == '' || dados.agendamento_id == undefined) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let result = await DAO.insertAgendamentoServicos(dados);
                if (result) {
                    json.status = message.SUCCESS_CREATED_ITEM.status;
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code;
                    json.message = message.SUCCESS_CREATED_ITEM.message;
                    return json; // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500 - Erro na controller
    }
};





module.exports = {
    setInserir,
    setAtualizar,
    setExcluir,
    getAll,
    getAllAnimal,
    getAllCliente,
    getAllFuncionario,
    getId,
    setInserirAgendamentoFuncionarios,
    setInserirAgendamentoServicos,
}
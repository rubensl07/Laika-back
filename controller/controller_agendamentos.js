const message = require('../modulo/config.js')
const animalDAO = require('../model/DAO/animal.js')
const DAO = require('../model/DAO/agendamentos.js')

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
                        (dados.funcionarios).forEach(idFuncionario => {
                            const json = {
                                idAgendamento,
                                idFuncionario
                            }
                            DAO.insertAgendamentoFuncionarios(json)
                        });
                    }

                    // Inserir os serviços
                    // for (let servicoId of dados.servicos) {
                    //     await DAO.insertAgendamentoServicos({ agendamento_id: idAgendamento, servico_id: servicoId });
                    // }

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
                const infoAnimal = (await animalDAO.selectById(dados[index].animal_id))[0]                  
                delete infoAnimal.nascimento
                delete infoAnimal.peso
                delete infoAnimal.cliente_id
                delete infoAnimal.porte_id
                delete infoAnimal.raca_id
                dados[index].animal = infoAnimal 
                delete dados[index].animal_id  
                delete dados[index].animal_id  

                dados[index].servicos = []
                console.log(dados)
                dados[index].funcionarios = []

            }

            json.dados = dados;
            json.quantidade = dados.length;
            json.status_code = 200;
            return json;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

const getById = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; // 400
    } else {
        let dados = await DAO.selectById(id);
        if (dados) {
            if (dados.length > 0) {
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

module.exports = {
    setInserirAgendamentoFuncionarios,
    setInserirAgendamentoServicos,
    setInserir,
    setExcluir,
    getById,
    getAll

};
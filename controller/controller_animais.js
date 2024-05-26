const DAO = require('../model/DAO/animal.js');
const clientesDAO = require('../model/DAO/cliente.js');
const message = require('../modulo/config');


// Função para obter todos os animais com detalhes completos
const getAllAnimais = async function () {

    let resultJSON = {};
    let dados = await DAO.selectAll();

    if (dados) {
        if (dados.length > 0) {
            for (let index = 0; index < dados.length; index++) {
                const racaJSON = (await DAO.selectRacaById(dados[index].raca_id))[0]
                dados[index].dono = (await clientesDAO.selectById(dados[index].cliente_id))
                delete dados[index].cliente_id 
                dados[index].tipo = (await DAO.selectTipoById(racaJSON.tipo_id))[0]
                delete racaJSON.tipo_id
                if(racaJSON.srd){
                    delete dados[index].raca
                } else {
                    delete racaJSON.srd
                    dados[index].raca = racaJSON
                }
                delete dados[index].raca_id
                dados[index].porte = (await DAO.selectPorteById(dados[index].porte_id))[0]
                delete dados[index].porte_id
            }
            resultJSON.dados = dados;
            resultJSON.quantidade = dados.length;
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}

// Função para obter animal por ID com detalhes completos
const getAnimalById = async function (id) {
    let resultJSON = {};
    let dados = await DAO.selectById(id);
    if (dados) {
        if (dados.length > 0) {
            const racaJSON = (await DAO.selectRacaById(dados[0].raca_id))[0]
            dados[0].dono = (await clientesDAO.selectById(dados[0].cliente_id))
            delete dados[0].cliente_id 
            dados[0].tipo = (await DAO.selectTipoById(racaJSON.tipo_id))[0]
            delete racaJSON.tipo_id
            if(racaJSON.srd){
                delete dados[0].raca
            } else {
                delete racaJSON.srd
                dados[0].raca = racaJSON
            }
            delete dados[0].raca_id
            dados[0].porte = (await DAO.selectPorteById(dados[0].porte_id))[0]
            delete dados[0].porte_id

            resultJSON.dados = dados[0];
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}

// Função para obter animais por ID do cliente com detalhes completos
const getAnimaisByClienteId = async function (clienteId) {
    let resultJSON = {};
    let dados = await DAO.selectByIdCliente(clienteId);

    if (dados) {
        if (dados.length > 0) {
            resultJSON.dados = dados;
            resultJSON.quantidade = dados.length;
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}

// Função para obter todos os portes
const getPortes = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAllPortes();

    if (dados) {
        if (dados.length > 0) {
            resultJSON.dados = dados;
            resultJSON.quantidade = dados.length;
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}

// Função para obter todos os tipos
const getTipos = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAllTipos();

    if (dados) {
        if (dados.length > 0) {
            resultJSON.dados = dados;
            resultJSON.quantidade = dados.length;
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}

// Função para obter todas as raças
const getRacas = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAllRacas();

    if (dados) {
        if (dados.length > 0) {
            resultJSON.dados = dados;
            resultJSON.quantidade = dados.length;
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}

// Função para obter raças por tipo ID
const getRacasByTipoId = async function (tipoId) {
    let resultJSON = {};
    let dados = await DAO.selectRacaByTipoId(tipoId);

    if (dados) {
        if (dados.length > 0) {
            resultJSON.dados = dados;
            resultJSON.quantidade = dados.length;
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
}

module.exports = {
    getAllAnimais,
    getAnimalById,
    getAnimaisByClienteId,
    getPortes,
    getTipos,
    getRacas,
    getRacasByTipoId
};
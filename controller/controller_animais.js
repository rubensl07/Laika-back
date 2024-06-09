const DAO = require('../model/DAO/animal.js');
const portesDAO = require('../model/DAO/portes.js');
const racasDAO = require('../model/DAO/racas.js');
const tiposDAO = require('../model/DAO/tipos.js');
const clientesDAO = require('../model/DAO/cliente.js');
const message = require('../modulo/config');


// Função para obter todos os animais com detalhes completos
const getAll = async function () {

    let resultJSON = {};
    let dados = await DAO.selectAll();

    if (dados) {
        if (dados.length > 0) {
            for (let index = 0; index < dados.length; index++) {
                const racaJSON = (await racasDAO.selectById(dados[index].raca_id))[0]
                const dadosCliente = (await clientesDAO.selectById(dados[index].cliente_id))[0]
                delete dadosCliente.telefone
                delete dadosCliente.email
                delete dadosCliente.senha
                delete dadosCliente.endereco_id
                dados[index].dono = dadosCliente
                delete dados[index].cliente_id
                dados[index].tipo = (await tiposDAO.selectById(racaJSON.tipo_id))[0]
                delete racaJSON.tipo_id
                if (racaJSON.srd) {
                    delete dados[index].raca
                } else {
                    delete racaJSON.srd
                    dados[index].raca = racaJSON
                }
                delete dados[index].raca_id
                dados[index].porte = (await portesDAO.selectById(dados[index].porte_id))[0]
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
const getId = async function (id) {
    let resultJSON = {};
    let dados = await DAO.selectById(id);
    if (dados) {
        if (dados.length > 0) {
            const racaJSON = (await racasDAO.selectById(dados[0].raca_id))[0]
            const dadosCliente = (await clientesDAO.selectById(dados[0].cliente_id))[0]
            delete dadosCliente.telefone
            delete dadosCliente.email
            delete dadosCliente.senha
            delete dadosCliente.endereco_id
            dados[0].dono = dadosCliente
            delete dados[0].cliente_id
            dados[0].tipo = (await tiposDAO.selectById(racaJSON.tipo_id))[0]
            delete racaJSON.tipo_id
            if (racaJSON.srd) {
                delete dados[0].raca
            } else {
                delete racaJSON.srd
                dados[0].raca = racaJSON
            }
            delete dados[0].raca_id
            dados[0].porte = (await portesDAO.selectById(dados[0].porte_id))[0]
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
const getByClienteId = async function (id) {

    let resultJSON = {};
    let dados = await DAO.selectByClienteId(id);

    if (dados) {
        if (dados.length > 0) {
            for (let index = 0; index < dados.length; index++) {
                const racaJSON = (await racasDAO.selectById(dados[index].raca_id))[0]
                delete dados[index].cliente_id
                dados[index].tipo = (await tiposDAO.selectById(racaJSON.tipo_id))[0]
                delete racaJSON.tipo_id
                if (racaJSON.srd) {
                    delete dados[index].raca
                } else {
                    delete racaJSON.srd
                    dados[index].raca = racaJSON
                }
                delete dados[index].raca_id
                dados[index].porte = (await portesDAO.selectById(dados[index].porte_id))[0]
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

const setInserir = async function (dados, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let json = {}


            // "id": 1,
            // "nome": "Paçoca",
            // "nascimento": "2014-10-15T00:00:00.000Z",
            // "peso": "20",
            // "img": null,
            // "tipo": {
            //     "id": 1,
            //     "nome": "Cachorro",
            //     "icon": "https://holidaycambriancoast.co.uk/wp-content/uploads/2017/11/dog-icon.png"
            // },
            // "raca": {
            //     "id": 7,
            //     "nome": "Salsicha"
            // },
            // "porte": {
            //     "id": 1,
            //     "nome": "Pequeno"
            // }

            if (
                dados.nome == '' || dados.nome == undefined || dados.nome == null || dados.nome.length > 100 ||
                dados.dono_id == '' || dados.dono_id == undefined || dados.dono_id == null || isNaN(dados.dono_id) ||
                dados.porte_id == '' || dados.porte_id == undefined || dados.porte_id == null || isNaN(dados.porte_id) ||
                dados.raca_id == '' || dados.raca_id == undefined || dados.raca_id == null || isNaN(dados.raca_id) ||
                dados.peso == '' || dados.peso == undefined || dados.peso == null || isNaN(dados.peso) ||
                dados.nascimento == '' || dados.nascimento == undefined || dados.nascimento == null || dados.nascimento.length != 10 ||
                dados.img == '' || dados.img == undefined || dados.img == null || dados.img.length > 200

            ) {
                console.log(dados);
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let result = await DAO.insert(dados)
                let id = parseInt(await DAO.pegarUltimoId())
                if (result && id) {
                    json.dados = dados
                    json.status = message.SUCCESS_CREATED_ITEM.status
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    json.message = message.SUCCESS_CREATED_ITEM.message
                    json.id = id
                    return json //201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER //500 - Erro na controller
    }
}
const setExcluir = async function (id) {
    let json={}
    let result = await DAO.deletar(id)
    if(result){
        json.status = message.SUCCESS_ACCEPTED_ITEM.status
        json.status_code = message.SUCCESS_ACCEPTED_ITEM.status_code
        json.message = message.SUCCESS_ACCEPTED_ITEM.message
        return json //202
    } else {
        return message.ERROR_NOT_FOUND //404
    }
}

const setAtualizar = async function (id, dados, contentType) {
    try{
        if(String(contentType).toLowerCase()== 'application/json'){
            let json = {}
            if (
                dados.nome == '' || dados.nome == undefined || dados.nome == null || dados.nome.length > 100 ||
                dados.porte_id == '' || dados.porte_id == undefined || dados.porte_id == null || isNaN(dados.porte_id) ||
                dados.raca_id == '' || dados.raca_id == undefined || dados.raca_id == null || isNaN(dados.raca_id) ||
                dados.peso == '' || dados.peso == undefined || dados.peso == null || isNaN(dados.peso) ||
                dados.nascimento == '' || dados.nascimento == undefined || dados.nascimento == null || dados.nascimento.length != 10 ||
                dados.img == '' || dados.img == undefined || dados.img == null || dados.img.length > 200
            ) {
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


module.exports = {
    setInserir,
    setAtualizar,
    setExcluir,
    getAll,
    getId,
    getByClienteId,
 
};
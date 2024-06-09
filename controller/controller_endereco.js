const message = require('../modulo/config.js')
const DAO = require('../model/DAO/endereco.js')


const getAll = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAll();
        if (dados) {
        if(dados.length > 0) {
            resultJSON.dados = dados;
            resultJSON.quantidade = dados.length;
            resultJSON.status_code = 200;
            return resultJSON;
        } else {
            return message.ERROR_NOT_FOUND //404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB //500
    }
}
const getId = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; //400
    } else {
        let dados = await DAO.selectById(id);
        if (dados) {
            if (dados.length > 0) {
                json.dados = dados[0]
                json.status_code = 200;
                return json;
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
}
const setInserir = async function (dados, contentType) {
    try {
    if (String(contentType).toLowerCase() == 'application/json'){
    let json = {}
    if (
        dados.rua == ''|| dados.rua == undefined|| dados.rua == null||dados.rua.length > 100 ||
        dados.bairro == ''|| dados.bairro == undefined|| dados.bairro == null||dados.bairro.length > 50 ||
        dados.cidade == ''|| dados.cidade == undefined|| dados.cidade == null||dados.cidade.length > 50 ||
        dados.estado == ''|| dados.estado == undefined|| dados.estado == null||dados.estado.length != 2
        )
    {
       return message.ERROR_REQUIRED_FIELDS //400
    } else {
        let validateStatus = false
            if(
                dados.numero != ''&& dados.numero != undefined&& dados.numero && null
            ){
                if(dados.numero.length > 100){
                    return message.ERROR_REQUIRED_FIELDS //400
                } else {
                    validateStatus = true
                }
            } else {
                validateStatus = true
            }
            if(validateStatus){
                let result = await DAO.insert(dados)
                let id = await DAO.pegarUltimoId()
                if(result && id) {
                    json.dados = dados
                    json.status = message.SUCCESS_CREATED_ITEM.status
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    json.message = message.SUCCESS_CREATED_ITEM.message
                    json.id = parseInt(id)
                    return json //201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }
    }
} else {
    return message.ERROR_CONTENT_TYPE // 415
}
    }catch(error){
        console.error(error);
        return message.ERROR_INTERNAL_SERVER //500 - Erro na controller
    }
}

const setAtualizar = async function (id, dados, contentType) {
    try{
        if(String(contentType).toLowerCase()== 'application/json'){
            let json = {}
            if (
                dados.rua == ''|| dados.rua == undefined|| dados.rua == null||dados.rua.length > 100 ||
                dados.bairro == ''|| dados.bairro == undefined|| dados.bairro == null||dados.bairro.length > 50 ||
                dados.cidade == ''|| dados.cidade == undefined|| dados.cidade == null||dados.cidade.length > 50 ||
                dados.estado == ''|| dados.estado == undefined|| dados.estado == null||dados.estado.length != 2
                )
            {
               return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let validateStatus = false
                if(
                    dados.numero != ''&&dados.numero != undefined&& dados.numero != null
                ){
                    if(dados.numero.length > 100){
                        return message.ERROR_REQUIRED_FIELDS //400
                    } else {
                        validateStatus = true
                    }
                } else {
                    validateStatus = true
                }
                if(validateStatus){
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


module.exports = {
    setInserir,
    setAtualizar,
    setExcluir,
    getAll,
    getId
};
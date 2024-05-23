const DAO = require('../model/DAO/cargo.js'); // Ajuste o caminho conforme necessário
const message = require('../modulo/config.js')

const setInserir = async function (dados, contentType) {
    try {
    if (String(contentType).toLowerCase() == 'application/json'){
    let json = {}
    if (
        dados.nome || dados.nome.length > 50
        )
        {
       return message.ERROR_REQUIRED_FIELDS //400
    } else {
            let result = await DAO.insert(dados)
            let id = await DAO.pegarUltimoId()
            if(result && id) {
                json.dados = dados
                json.status = message.SUCCESS_CREATED_ITEM.status
                json.status_code = message.SUCCESS_CREATED_ITEM.status_code
                json.message = message.SUCCESS_CREATED_ITEM.message
                json.id = 'ID adicionado: '+id
                return json //201
            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
    }
} else {
    return message.ERROR_CONTENT_TYPE // 415
}
    }catch(error){
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

const getAll = async () => {
    try {
        let responseJSON = {};
        let cargos = await DAO.getAll();

        if (cargos) {
            responseJSON.status = message.SUCCESS_ACCEPTED_ITEM.status;
            responseJSON.status_code = message.SUCCESS_ACCEPTED_ITEM.status_code;
            responseJSON.message = message.SUCCESS_ACCEPTED_ITEM.message;
            responseJSON.cargos = cargos;
            return responseJSON;
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

module.exports = {
    setInserir,
    setExcluir,
    getAll
};

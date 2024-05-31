const DAO = require('../model/DAO/portes.js');

const getAll = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAll();

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

module.exports = {
    getAll,
    getId,
}
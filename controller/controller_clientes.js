const message = require('../modulo/config.js')
const DAO = require('../model/DAO/cliente.js')


const getListarClientes = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAllClientes();
    
        if (dados) {
        if(dados.length > 0) {
            resultJSON.clientes = dados;
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

module.exports = {
    getListarClientes
}
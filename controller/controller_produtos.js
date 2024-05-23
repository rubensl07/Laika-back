const message = require('../modulo/config.js')
const DAO = require('../model/DAO/produto.js')


const getListar = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAll();
    
        if (dados) {
        if(dados.length > 0) {
            resultJSON.produtos = dados;
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
const getBuscarId = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; //400
    } else {
        let dados = await DAO.selectById(id);
        if (dados) {
            if (dados.length > 0) {
                json.produto = dados;
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

const setInserir = async function (dados, contentType) {
    try {
    if (String(contentType).toLowerCase() == 'application/json'){
    let json = {}
    if (
        dados.nome || dados.nome.length > 100 ||
        dados.descricao || dados.descricao.length > 65000 ||
        dados.img || dados.img.length > 100 ||
        isNaN(dados.quantidade_estoque)
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

const setAtualizar = async function (id, dados, contentType) {
    try {
        // Validação dos campos obrigatórios
        console.log(dados);
        if (!dados.nome || dados.nome.length > 100 ||
            !dados.descricao || dados.descricao.length > 200 ||
            !dados.img || dados.img.length > 100 ||
            typeof dados.preco > 1000000 ||
            typeof dados.produto_quantidade_estoque > 1000000) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        let atualizado = await DAO.update(id, dados);

        if (atualizado) {
            return message.SUCCESS_ACCEPTED_ITEM;
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.error(error);
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
}

module.exports = {
    setExcluir,
    getListar,
    getBuscarId,
    setInserir,
    setAtualizar
}
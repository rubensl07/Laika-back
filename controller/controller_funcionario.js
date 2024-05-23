const message = require('../modulo/config.js')
const enderecosDAO = require('../model/DAO/endereco.js');
const DAO = require('../model/DAO/funcionario.js')


const getListar = async function () {
    let resultJSON = {};
    let dados = await DAO.selectAll();
    
        if (dados) {
        if(dados.length > 0) {
            resultJSON.funcionarios = dados;
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
                json.funcionario = dados;
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

const setInserir = async (dadosBody, contentType) => {
    try {
        let responseJSON = {};
    
        if (String(contentType).toLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE;
        }

   
        if (!dadosBody.nome || dadosBody.nome.length > 100 ||
            !dadosBody.telefone || dadosBody.telefone.length > 15 ||
            !dadosBody.email || dadosBody.email.length > 100 ||
            !dadosBody.senha || dadosBody.senha.length > 255){
            return message.ERROR_REQUIRED_FIELDS;
        }

       
        if (!dadosBody.endereco || 
            !dadosBody.endereco.rua || dadosBody.endereco.rua.length > 100 ||
            !dadosBody.endereco.bairro || dadosBody.endereco.bairro.length > 50 ||
            !dadosBody.endereco.cidade || dadosBody.endereco.cidade.length > 50 ||
            !dadosBody.endereco.estado || dadosBody.endereco.estado.length !== 2) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        
        let enviarNovoendereco = await enderecosDAO.insert(dadosBody.endereco);
        if (enviarNovoendereco) {
            let ultimoIdEndereco = await enderecosDAO.selectlastId()

             
        dadosBody.endereco_id = ultimoIdEndereco;
        let result = await DAO.insert(dadosBody, ultimoIdEndereco);

        if (result) {
           
            responseJSON.status = message.SUCCESS_CREATED_ITEM.status;
            responseJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code;
            responseJSON.message = message.SUCCESS_CREATED_ITEM.message;
            responseJSON.funcionario = {
                id: result,
                nome: dadosBody.nome,
                telefone: dadosBody.telefone,
                email: dadosBody.email,
                senha: dadosBody.senha,
                endereco_id: ultimoIdEndereco
            };
            return responseJSON;
        } else {
            
            return message.ERROR_INTERNAL_SERVER_DB;
        }

        } else {
            
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};
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
    setExcluir,
    getListar,
    getBuscarId
};
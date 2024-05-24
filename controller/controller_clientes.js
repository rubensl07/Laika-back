const message = require('../modulo/config.js')
const enderecosDAO = require('../model/DAO/endereco.js');
const DAO = require('../model/DAO/cliente.js')


const getAll = async function () {
    let json = {};
    let dados = await DAO.selectAll();
        if (dados) {
        if(dados.length > 0) {
            for (let index = 0; index < dados.length; index++) {
                if(dados[index].endereco_id){
                    const endereco = await enderecosDAO.selectById(dados[index].endereco_id)
                    const novoEndereco = {}
                    novoEndereco.rua = endereco[0].rua
                    novoEndereco.bairro = endereco[0].bairro
                    novoEndereco.cidade = endereco[0].cidade
                    novoEndereco.estado = endereco[0].estado
                    if(endereco[0].complemento){
                        novoEndereco.complemento = endereco[0].complemento
                    }
                    dados[index].endereco = novoEndereco
                }
                delete dados[index].endereco_id
            }
            json.dados = dados;
            json.quantidade = dados.length
            json.status_code = 200
            return json
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
                if(dados[0].endereco_id){
                    const endereco = await enderecosDAO.selectById(dados[0].endereco_id)
                    const novoEndereco = {}
                    novoEndereco.rua = endereco[0].rua
                    novoEndereco.bairro = endereco[0].bairro
                    novoEndereco.cidade = endereco[0].cidade
                    novoEndereco.estado = endereco[0].estado
                    if(endereco[0].complemento){
                        novoEndereco.complemento = endereco[0].complemento
                    }
                    dados[0].endereco = novoEndereco
                }
                delete dados[0].endereco_id

                json.dados = dados[0]
                json.status_code = 200
                return json
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
            !dadosBody.senha || dadosBody.senha.length > 255) {
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
            let ultimoIdEndereco = await enderecosDAO.pegarUltimoId()

             
            
        dadosBody.endereco_id = ultimoIdEndereco;
        let result = await DAO.insert(dadosBody, ultimoIdEndereco);

        if (result) {
           
            responseJSON.status = message.SUCCESS_CREATED_ITEM.status;
            responseJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code;
            responseJSON.message = message.SUCCESS_CREATED_ITEM.message;
            responseJSON.cliente = {
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
    getAll,
    getId
};
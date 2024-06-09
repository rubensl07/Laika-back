const message = require('../modulo/config.js')
const DAO = require('../model/DAO/cliente.js')
const enderecosDAO = require('../model/DAO/endereco.js');
const animalDAO = require('../model/DAO/animal.js')
const animalController = require('./controller_animais.js')
const agendamentoDAO = require('../model/DAO/agendamentos.js')
const agendamentoController = require('./controller_agendamentos.js')





const getAll = async function () {
    let json = {};
    let dados = await DAO.selectAll();
        if (dados) {
        if(dados.length > 0) {
            for (let index = 0; index < dados.length; index++) {
                if(dados[index].endereco_id){
                    const endereco = await enderecosDAO.selectById(dados[index].endereco_id)
                    const novoEndereco = endereco[0]
                    delete novoEndereco.id
                    dados[index].endereco = novoEndereco
                }
                delete dados[index].endereco_id
                delete dados[index].endereco_id
                let listaAnimais = await animalDAO.selectByClienteId(dados[index].id)
                let listaAnimaisController = []
                for (animal of listaAnimais){
                    const dadosAnimal = (await animalController.getId(animal.id)).dados
                    delete dadosAnimal.dono
                    listaAnimaisController.push(dadosAnimal)
                }
                if(listaAnimaisController.length>0){
                    dados[index].animais = listaAnimaisController
                }
                let agendamentosCliente = await agendamentoDAO.selectByClienteId(dados[index].id)
                const listaIdsAgendamentos = []
                agendamentosCliente.forEach(element => {
                    listaIdsAgendamentos.push(element.id)
                })
                if(listaIdsAgendamentos.length>0){
                    const listaAgendamentos = []
                    listaIdsAgendamentos.forEach(async element => {
                        listaAgendamentos.push((await agendamentoController.getId(element)).dados)
                    });
                    dados[index].agendamentos = listaAgendamentos
                }

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
                    const novoEndereco = endereco[0]
                    delete novoEndereco.id
                    dados[0].endereco = novoEndereco
                }
                delete dados[0].endereco_id
                let listaAnimais = await animalDAO.selectByClienteId(id)
                let listaAnimaisController = []
                for(animal of listaAnimais){
                    const dadosAnimal = (await animalController.getId(animal.id)).dados
                    delete dadosAnimal.dono
                    listaAnimaisController.push(dadosAnimal)
                }
                if(listaAnimaisController.length>0){
                    dados[0].animais = listaAnimaisController
                }
                let agendamentosCliente = await agendamentoDAO.selectByClienteId(dados[0].id)
                if(agendamentosCliente.length>0){
                    const listaIdsAgendamentos = []
                    for(element of agendamentosCliente){
                        listaIdsAgendamentos.push(element.id)
                    }
                    const listaAgendamentos = []
                    for(element of listaIdsAgendamentos){
                        listaAgendamentos.push((await agendamentoController.getId(element)).dados)
                    }
                    dados[0].agendamentos = listaAgendamentos
                }
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

const getIdNome = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; //400
    } else {
        let dados = await DAO.selectByIdNome(id);
        if (dados) {
            if (dados.length > 0) {
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

const getAllResumido = async function () {
    let json = {};
    let dados = await DAO.selectAll();
        if (dados) {
        if(dados.length > 0) {
            for (let index = 0; index < dados.length; index++) {
                if(dados[index].endereco_id){
                    const endereco = await enderecosDAO.selectById(dados[index].endereco_id)
                    const novoEndereco = endereco[0]
                    delete novoEndereco.id
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

const getIdResumido = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; //400
    } else {
        let dados = await DAO.selectById(id);
        if (dados) {
            if (dados.length > 0) {
                if(dados[0].endereco_id){
                    const endereco = await enderecosDAO.selectById(dados[0].endereco_id)
                    const novoEndereco = endereco[0]
                    delete novoEndereco.id
                    dados[0].endereco = novoEndereco
                }
                delete dados[0].endereco_id
                delete dados[0].id
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
const getAllLogin = async function () {
    let json = {};
    let dados = await DAO.selectAllLogin();
        if (dados) {
        if(dados.length > 0) {
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
const getIdLogin = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; //400
    } else {
        let dados = await DAO.selectByIdLogin(id);
        if (dados) {
            if (dados.length > 0) {
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


const getImg = async function (id) {
    let json = {};
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID; //400
    } else {
        let dados = await DAO.selectByIdImg(id);
        if (dados) {
            if (dados.length > 0) {
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

const setInserir = async function (dados, contentType) {
    try {
    if (String(contentType).toLowerCase() == 'application/json'){
    let json = {}
    if (
        dados.nome == ''|| dados.nome == undefined|| dados.nome == null||dados.nome.length > 100 ||
        dados.email == ''|| dados.email == undefined|| dados.email == null||dados.email.length > 100 ||
        dados.senha == ''|| dados.senha == undefined|| dados.senha == null||dados.senha.length > 100
        )
    {
       return message.ERROR_REQUIRED_FIELDS //400
    } else {
        let validateStatus = true
        if(
            dados.telefone != ''&&dados.telefone != undefined&& dados.telefone != null
        ){
            validateStatus = false
            if(dados.telefone.length > 11){
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                validateStatus = true
            }
        } else {
            validateStatus = true
        }
        if(
            dados.img != ''&&dados.img != undefined&& dados.img != null
        ){
            validateStatus = false
            if(dados.img.length > 200){
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                validateStatus = true
            }
        } else {
            validateStatus = true
        }
        if(validateStatus){
            if(!dados.endereco){
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
            if (
                dados.endereco.rua == ''|| dados.endereco.rua == undefined|| dados.endereco.rua == null||dados.endereco.rua.length > 100 ||
                dados.endereco.bairro == ''|| dados.endereco.bairro == undefined|| dados.endereco.bairro == null||dados.endereco.bairro.length > 50 ||
                dados.endereco.cidade == ''|| dados.endereco.cidade == undefined|| dados.endereco.cidade == null||dados.endereco.cidade.length > 50 ||
                dados.endereco.estado == ''|| dados.endereco.estado == undefined|| dados.endereco.estado == null||dados.endereco.estado.length != 2
                ) {
                    return message.ERROR_REQUIRED_FIELDS //400
                }
                else {
                    let resultEndereco = await enderecosDAO.insert(dados.endereco)
                    if(resultEndereco){
                        dados.endereco_id = parseInt(await enderecosDAO.pegarUltimoId())
                        let result = await DAO.insert(dados)
                        let id = await DAO.pegarUltimoId()
                        if(result && id){
                            json.dados = dados
                            json.status = message.SUCCESS_CREATED_ITEM.status
                            json.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            json.message = message.SUCCESS_CREATED_ITEM.message
                            json.id = parseInt(id)
                            return json //201
                        } else {
                            return message.ERROR_INTERNAL_SERVER_DB //500
                        }
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }
                }
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
                dados.nome == ''|| dados.nome == undefined|| dados.nome == null||dados.nome.length > 100 ||
                dados.email == ''|| dados.email == undefined|| dados.email == null||dados.email.length > 100 ||
                dados.senha == ''|| dados.senha == undefined|| dados.senha == null||dados.senha.length > 100
                )
            {
               return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let validateStatus = false
                if(
                    dados.telefone != ''&&dados.telefone != undefined&& dados.telefone != null
                ){
                    validateStatus = false
                    if(dados.telefone.length > 11){
                        return message.ERROR_REQUIRED_FIELDS //400
                    } else {
                        validateStatus = true
                    }
                } else {
                    validateStatus = true
                }
                if(
                    dados.img != ''&&dados.img != undefined&& dados.img != null
                ){
                    validateStatus = false
                    if(dados.img.length > 200){
                        return message.ERROR_REQUIRED_FIELDS //400
                    } else {
                        validateStatus = true
                    }
                } else {
                    validateStatus = true
                }
                if(validateStatus){
                    if(dados.endereco){
                        if(!(await DAO.selectById(id)).length>0){
                            return message.ERROR_NOT_FOUND //404
                        } 
                        const idEndereco = (await DAO.selectById(id))[0].endereco_id
                        const resultEndereco = await enderecosDAO.update(idEndereco,dados.endereco)
                        //NÃO SEI SE ESTÁ CORRETO ESSA VERIFICAÇÃO///////
                        if(!resultEndereco){
                            return message.ERROR_REQUIRED_FIELDS //400
                        }
                        ///////////////////////////
                    }
                    const result = await DAO.update(id, dados)
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
    getAllResumido,
    getId,
    getIdResumido,
    getAllLogin,
    getIdLogin,
    getIdNome,
    getImg
};
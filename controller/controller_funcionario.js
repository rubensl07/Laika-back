const message = require('../modulo/config.js')
const enderecosDAO = require('../model/DAO/endereco.js');
const cargosDAO = require('../model/DAO/cargo.js');
const DAO = require('../model/DAO/funcionario.js')

const getAll = async function (search) {
    let json = {};
    let dados = await DAO.selectAll(search);
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
                if(dados[index].cargos){
                    const listaIdsCargos = dados[index].cargos.split('-')
                    let listaCargos = []
                    for(let idCargo of listaIdsCargos){
                        listaCargos.push((await cargosDAO.selectById(parseInt(idCargo)))[0])
                    }
                    dados[index].cargos = listaCargos
                } else {
                    delete dados[index].cargos
                }
            }
            json.dados = dados;
            json.quantidade = dados.length;
            json.status_code = 200;
            return json;
        } else {
            return message.ERROR_NOT_FOUND //404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB //500
    }
}

const getAllVeterinarios = async function () {
    let json = {};
    let dados = await DAO.selectAllVeterinarios();
        if (dados) {
        if(dados.length > 0) {
            for (let index = 0; index < dados.length; index++) {
                if(dados[index].endereco_id){
                    console.log(dados[index]);
                    dados[index].total_agendamentos = parseInt(dados[index].total_agendamentos)

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
            json.quantidade = dados.length;
            json.status_code = 200;
            return json;
        } else {
            return message.ERROR_NOT_FOUND //404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB //500
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
                if(dados[0].cargos){
                    const listaIdsCargos = dados[0].cargos.split('-')
                    let listaCargos = []
                    for(let idCargo of listaIdsCargos){
                        listaCargos.push((await cargosDAO.selectById(parseInt(idCargo)))[0])
                    }
                    dados[0].cargos = listaCargos
                } else {
                    delete dados[0].cargos
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

const setInserir = async function (dados, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let json = {};
            if (
                !dados.nome || dados.nome.length > 100 ||
                !dados.telefone || dados.telefone.length > 11 ||
                !dados.email || dados.email.length > 100 || 
                !dados.senha || dados.senha.length > 100
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                if (!dados.endereco) {
                    return message.ERROR_REQUIRED_FIELDS; // 400
                } else {
                    if (
                        !dados.endereco.rua || dados.endereco.rua.length > 100 ||
                        !dados.endereco.bairro || dados.endereco.bairro.length > 50 ||
                        !dados.endereco.cidade || dados.endereco.cidade.length > 50 ||
                        !dados.endereco.estado || dados.endereco.estado.length !== 2
                    ) {
                        return message.ERROR_REQUIRED_FIELDS; // 400
                    } else {
                        let resultEndereco = await enderecosDAO.insert(dados.endereco);
                        if (resultEndereco) {
                            dados.endereco_id = parseInt(await enderecosDAO.pegarUltimoId());
                            let result = await DAO.insert(dados);
                            let id = await DAO.pegarUltimoId();
                            if (result && id) {
                                if (dados.cargos) {
                                    (dados.cargos).forEach(element => {
                                        const json = {
                                            idFuncionario: id,
                                            idCargo: element
                                        };
                                        DAO.insertCargoFuncionario(json);
                                    });
                                }
                                json.dados = dados;
                                json.status = message.SUCCESS_CREATED_ITEM.status;
                                json.status_code = message.SUCCESS_CREATED_ITEM.status_code;
                                json.message = message.SUCCESS_CREATED_ITEM.message;
                                json.id = parseInt(id);
                                return json; // 201
                            } else {
                                return message.ERROR_INTERNAL_SERVER_DB; // 500
                            }
                        } else {
                            return message.ERROR_INTERNAL_SERVER_DB; // 500
                        }
                    }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500 - Erro na controller
    }
};

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
                let result = await DAO.update(id, dados)
                if(result) {
                    if (dados.cargos) {
                        const result = await cargosDAO.removerCargos(id)
                        console.log(result);
                        (dados.cargos).forEach(element => {
                            const json = {
                                idFuncionario: id,
                                idCargo: element
                            };
                            DAO.insertCargoFuncionario(json);
                        });
                    }
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
    getAllLogin,
    getId,
    getAllVeterinarios,
}
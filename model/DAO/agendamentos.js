const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var tabela = "tbl_agendamentos"
var tabelaAgendamentoFuncionarios = "tbl_agendamento_funcionario"
var tabelaAgendamentoServicos = "tbl_agendamento_servico"

const selectAllAgendamentosServicos = async function (){
    try {
        const sql = `SELECT * FROM ${tabelaAgendamentoServicos}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}

const insertAgendamentoServicos = async function (dados) {
    try {

        let sql = `INSERT INTO ${tabelaAgendamentoServicos} (agendamento_id, servico_id) VALUES (?, ?);`;
        let result = await prisma.$executeRawUnsafe(sql, dados.agendamento_id, dados.servico_id);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};



const selectAllAgendamentosFuncionarios = async function (){
    try {
        const sql = `SELECT * FROM ${tabelaAgendamentoFuncionarios}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}

const insertAgendamentoFuncionarios = async function (dados) {
    try {

        let sql = `INSERT INTO ${tabelaAgendamentoFuncionarios} (agendamento_id, funcionario_id) VALUES (?, ?);`;
        let result = await prisma.$executeRawUnsafe(sql,
            dados.idAgendamento,
             dados.idFuncionario);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};



// Selecionar todos os Servicos
const selectAll = async function (){
    try {
        const sql = `SELECT * FROM ${tabela}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}

const selectById = async function (id) {
    try {
        const sql = `select * FROM ${tabela} WHERE id = ${id}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}

const insert = async function(dados){
    try {
        let sql = `INSERT INTO ${tabela} (data_agendamento, animal_id) VALUES (?, ?);`;
        let result = await prisma.$executeRawUnsafe(sql,
            dados.data_agendamento,
            dados.animal_id);
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
}

const update = async function (id, dados) {
    try{
        let sql = `
            UPDATE ${tabela}
            SET 
                data = '${dados.data_agendamento}',
                animal = '${dados.animal_id}',
            WHERE id = ${id};
        `;
        let result = await prisma.$executeRawUnsafe(sql)
        if(result) {
            return true
        } else {
            return false
        }
    } catch (error){
        console.error(error);
        return false
    }
}
const deletar = async function (id) {
    try {
        const sql = `DELETE FROM ${tabela} WHERE id = ${id}`;
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
}

const pegarUltimoId = async function() {
    try {
        let sql = `SELECT CAST(LAST_INSERT_ID() AS DECIMAL) AS id FROM ${tabela} limit 1;`
    let result = await prisma.$queryRawUnsafe(sql)
    if(result){
        return result[0].id
    } else {
         return false
    }
    } catch (error) {
        console.error(error);
        return false    
    }
}




module.exports = {
    selectAll,
    selectById,
    insert,
    update,
    deletar,
    selectAllAgendamentosFuncionarios,
    selectAllAgendamentosServicos,
    insertAgendamentoFuncionarios,
    insertAgendamentoServicos,
    pegarUltimoId
}

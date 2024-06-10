const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var tabela = "tbl_cargos"
var tabelaCargosFuncionarios = "tbl_cargos_funcionarios"
const insert = async function(dados){
    try {
        let sql = `INSERT INTO ${tabela} (nome) VALUES (?);`;
        let result = await prisma.$executeRawUnsafe(sql, 
            dados.nome
            );
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
                nome = '${dados.nome}'
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
const selectAll = async () => {
    try {
        let sql = `SELECT * FROM ${tabela};`;
        let cargos = await prisma.$queryRawUnsafe(sql);
        return cargos;
    } catch (error) {
        console.error(error);
        return false;
    }
}
const selectById = async function (search) {
    try {
        const sql = `select * FROM ${tabela} WHERE id = ${search}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}


const removerCargos = async function (search) {
    try {
        const sql = `delete from ${tabelaCargosFuncionarios} where funcionario_id = ${search}`;
        let result = await prisma.$executeRawUnsafe(sql);
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}

module.exports = {
    insert,
    update,
    deletar,
    pegarUltimoId,
    selectAll,
    selectById,
    removerCargos,
};

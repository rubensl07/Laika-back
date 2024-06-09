const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var tabela = "tbl_clientes"

// Selecionar todos os clientes
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
const selectAllLogin = async function () {
    try {
        const sql = `select id,email,senha FROM ${tabela}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}
const selectByIdNome = async function (id) {
    try {
        const sql = `select nome FROM ${tabela} WHERE id = ${id}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}
const selectByIdLogin = async function (id) {
    try {
        const sql = `select email,senha FROM ${tabela} WHERE id = ${id}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}
const selectByIdImg = async function (id) {
    try {
        const sql = `select img FROM ${tabela} WHERE id = ${id}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
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

const insert = async function(dados){
    try {
        let sql = `INSERT INTO ${tabela} (nome, telefone, email, senha, img, endereco_id) VALUES (?, ?, ?, ?, ?, ?);`;
        let result = await prisma.$executeRawUnsafe(sql,
            dados.nome,
            dados.telefone,
            dados.email,
            dados.senha,
            dados.img,
            dados.endereco_id);
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
        const sqlInicio = `
        UPDATE ${tabela} SET `
        let sqlMeio = `
                nome = '${dados.nome}',
                email = '${dados.email}',
                senha = '${dados.senha}'`;
        if(dados.img){
            sqlMeio += `, 
                img = '${dados.img}'`
        }
        if(dados.telefone){
            sqlMeio += `, 
                telefone = ${dados.telefone}`
        }
        const sqlFinal = ` 
        WHERE id = ${id}`
        const sql = sqlInicio+sqlMeio+sqlFinal
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

// Leonid é mó legal
// O Marcel tbm
// O Vitor ainda mais
module.exports= {
    selectAll,
    selectAllLogin,
    selectById,
    selectByIdLogin,
    selectByIdNome,
    selectByIdImg,
    pegarUltimoId,
    insert,
    update,
    deletar
}
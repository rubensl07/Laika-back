const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insert = async function(dados){
    try {
        const sql = ` INSERT INTO tbl_servicos (nome,descricao,preco)VALUES('${dados.nome}','${dados.descricao}',${dados.preco})`;
        let result = await prisma.$executeRawUnsafe(sql)
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
const deletar = async function (id) {
    try {
        const sql = `DELETE FROM tbl_servicos WHERE id = ${id}`;
        let result = await prisma.$executeRawUnsafe(sql)
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
const selectAll = async function (){
    try {
        const sql = `SELECT * FROM TBL_SERVICOS`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        return false
    }
}
const selectById = async function (search) {
    try {
        const sql = `select * FROM tbl_servicos WHERE id = ${search}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        return false
    }
}
const pegarUltimoId = async function() {
    try {
        let sql = `SELECT CAST(LAST_INSERT_ID() AS DECIMAL) AS id FROM TBL_ENDERECO limit 1;`
    let result = await prisma.$queryRawUnsafe(sql)
    if(result){
        return result
    } else {
         return false
    }
    } catch (error) {
        return false    
    }
}


module.exports= {
    insert,
    deletar,
    pegarUltimoId,
    selectAll,
    selectById
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const insert = async function(dados){
    try {
        let sql = `INSERT INTO tbl_funcionarios (nome, telefone, email, senha, endereco_id) VALUES (?, ?, ?, ?, ?);`;

        let result = await prisma.$executeRawUnsafe(sql,
            dados.nome,
            dados.telefone,
            dados.email,
            dados.senha,
            ultimoIdEndereco);
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
        const sql = `DELETE FROM tbl_funcionarios WHERE id = ${id}`;
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
        const sql = `SELECT * FROM TBL_funcionarios`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        return false
    }
}
const selectById = async function (search) {
    try {
        const sql = `select * FROM tbl_funcionarios WHERE id = ${search}`;
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
    selectById,
}
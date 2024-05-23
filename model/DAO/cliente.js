const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Selecionar todos os clientes
const selectAll = async function (){
    try {
        const sql = `SELECT * FROM TBL_CLIENTES`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        return false
    }
}
const selectById = async function (search) {
    try {
        const sql = `select * FROM tbl_clientes WHERE id = ${search}`;
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
const insert = async (dados, ultimoIdEndereco) => {
    try {
        // Inserir o cliente
        let sql = `INSERT INTO tbl_clientes (nome, telefone, email, senha, endereco_id, img) VALUES (?, ?, ?, ?, ?, ?)`;
        let result = await prisma.$executeRawUnsafe(sql,
             dados.nome,
              dados.telefone,
               dados.email,
                dados.senha,
                 ultimoIdEndereco,
                  dados.img);
        if (result) {
            return result;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}
const deletar = async function (id) {
    try {
        const sql = `DELETE FROM tbl_clientes WHERE id = ${id}`;
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

// Leonid é mó legal
// O Marcel tbm
module.exports= {
    selectAll,
    selectById,
    pegarUltimoId,
    insert,
    deletar
}
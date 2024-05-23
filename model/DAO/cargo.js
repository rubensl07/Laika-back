const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const insert = async function(dados){
    try {
        let sql = `INSERT INTO tbl_cargos (nome) VALUES (?);`;
        let result = await prisma.$executeRawUnsafe(sql, 
            dados.nome
            );
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
        const sql = `DELETE FROM tbl_cargos WHERE id = ${id}`;
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
const getAll = async () => {
    try {
        let sql = `SELECT * FROM tbl_cargos;`;
        let cargos = await prisma.$queryRawUnsafe(sql);
        return cargos;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    insert,
    deletar,
    pegarUltimoId,
    getAll
};

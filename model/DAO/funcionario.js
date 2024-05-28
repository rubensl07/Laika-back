const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var tabela = "tbl_funcionarios"

const insert = async function(dados){
    try {
        let sql = `INSERT INTO ${tabela} (nome, telefone, email, senha, endereco_id) VALUES (?, ?, ?, ?, ?);`;

        let result = await prisma.$executeRawUnsafe(sql,
            dados.nome,
            dados.telefone,
            dados.email,
            dados.senha,
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
        let sql = `
            UPDATE ${tabela}
            SET 
                nome = '${dados.nome}',
                telefone = '${dados.telefone}',
                email = '${dados.email}',
                senha = '${dados.senha}'
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
const selectAllVeterinarios = async function (){
    try {
        const sql = `select ${tabela}.id,${tabela}.nome from ${tabela} join tbl_cargos_funcionarios on ${tabela}.id = tbl_cargos_funcionarios.funcionario_id where cargo_id = 1`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}



module.exports= {
    insert,
    update,
    deletar,
    pegarUltimoId,
    selectAll,
    selectById,
    selectAllVeterinarios
}
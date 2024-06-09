const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var tabela = "tbl_endereco"
var tabelaClientes = "tbl_clientes"
var tabelaFuncionarios = "tbl_funcionarios"




const insert = async function(dados){
    try {
        let sql
        let result = null
        if(
            dados.numero != '' &&
            dados.numero != null &&
            dados.numero != undefined
        )
        {
            sql = `INSERT INTO ${tabela} (
                rua, 
                bairro,
                cidade, 
                estado, 
                numero
            ) VALUES (?, ?, ?, ?, ?)`;
            result = await prisma.$executeRawUnsafe(sql, 
                dados.rua,
                dados.bairro,
                dados.cidade,
                dados.estado,
                dados.numero
            )
        } else {
            sql = `INSERT INTO ${tabela} (
                rua, 
                bairro,
                cidade, 
                estado
            ) VALUES (?, ?, ?, ?)`
            result = await prisma.$executeRawUnsafe(sql, 
                dados.rua,
                dados.bairro,
                dados.cidade,
                dados.estado
            )
        }
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
        let sql
        let result = null
        if(
            dados.numero != '' &&
            dados.numero != null &&
            dados.numero != undefined
        ){
            sql = `
            UPDATE ${tabela}
            SET 
                rua = '${dados.rua}',
                bairro = '${dados.bairro}',
                cidade = '${dados.cidade}',
                estado = '${dados.estado}',
                numero = '${dados.numero}'
            WHERE id = ${id}
        `
        console.log(sql);
        result = await prisma.$executeRawUnsafe(sql)
        } else {
            sql = `
            UPDATE ${tabela}
            SET 
                rua = '${dados.rua}',
                bairro = '${dados.bairro}',
                cidade = '${dados.cidade}',
                estado = '${dados.estado}'
            WHERE id = ${id}
        `
        console.log(sql);
        result = await prisma.$executeRawUnsafe(sql)
        }
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
        const sqlClientes = `UPDATE ${tabelaClientes} SET endereco_id = null WHERE endereco_id = ${id}` 
        const sqlFuncionarios = `UPDATE ${tabelaFuncionarios} SET endereco_id = null WHERE endereco_id = ${id}` 
        const sql = `DELETE FROM ${tabela} WHERE id = ${id}`;

        await prisma.$executeRawUnsafe(sqlClientes)
        await prisma.$executeRawUnsafe(sqlFuncionarios)
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

// Selecionar todos os endereços
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
        const sql = `select * from ${tabela} WHERE id = ${search}`;
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



module.exports= {
    insert,
    update,
    deletar,
    pegarUltimoId,
    selectById,
    selectAll
}
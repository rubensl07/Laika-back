const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Selecionar todos os perodutos
const deletar = async function (id) {
    try {
        const sql = `DELETE FROM tbl_produtos WHERE id = ${id}`;
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
        const sql = `SELECT * FROM TBL_PRODUTOS`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        return false
    }
}
const selectById = async function (search) {
    try {
        const sql = `select * FROM tbl_produtos WHERE id = ${search}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        return false
    }
}
const insert = async function(dados){
    try {
        let sql = `INSERT INTO tbl_produtos (nome, descricao, preco, img, produto_quantidade_estoque) VALUES (?, ?, ?, ?, ?);`;

        let result = await prisma.$executeRawUnsafe(sql,
            dados.nome,
            dados.descricao,
            dados.preco,
            dados.img,
            dados.quantidade_estoque);
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const update = async function (id, dadosBody) {
    try {
        let sql = `
            UPDATE tbl_produtos
            SET 
                nome = '${dadosBody.nome}',
                descricao = '${dadosBody.descricao}',
                preco = ${dadosBody.preco},
                img = '${dadosBody.img}',
                produto_quantidade_estoque = ${dadosBody.produto_quantidade_estoque}
            WHERE id = ${id};
        `;

       
        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
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
    selectAll,
    selectById,
    pegarUltimoId,
    deletar,
    insert,
    update
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var tabela = "tbl_produtos"
var tabelaCategoriaProduto = "tbl_categorias_produtos"

// Selecionar todos os perodutos
const deletar = async function (id) {
    try {
        const sqlCategoria = `delete from ${tabelaCategoriaProduto} where produto_id =${id}`
        const sql = `DELETE FROM ${tabela} WHERE id = ${id}`;
        let resultCategoria = await prisma.$executeRawUnsafe(sqlCategoria)
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
const selectAll = async (search) => {
    try {
        let pesquisaSearch = ''
        if(search.pesquisa){
            pesquisaSearch = search.pesquisa
        }
        let minSearch = 0
        if(search.precoMin){
            minSearch = search.precoMin
        }
        let maxSearch = 999999999
        if(search.precoMax){
            maxSearch = search.precoMax
        }
        let sql = `SELECT p.id, p.nome, p.descricao, p.preco, p.img, p.quantidade_estoque, p.categoria_id FROM ${tabela} p`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}
const selectById = async function (search) {
    try {
        let sql = `SELECT p.id, p.nome, p.descricao, p.preco, p.img, p.quantidade_estoque, p.categoria_id FROM ${tabela} p where p.id = ${search}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}
const insert = async function(dados){
    try {
        let sql = `INSERT INTO ${tabela} (nome, descricao, preco, img, quantidade_estoque) VALUES (?, ?, ?, ?, ?);`;

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
                descricao = '${dados.descricao}',
                preco = ${dados.preco},
                img = '${dados.img}',
                quantidade_estoque = ${dados.quantidade_estoque}
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

const insertCategoriaProduto = async function (dados) {
    try {

        let sql = `INSERT INTO ${tabelaCategoriaProduto} (produto_id, categoria_id) VALUES (?, ?)`;
        let result = await prisma.$executeRawUnsafe(sql,
            dados.idProduto,
             dados.idCategoria);             
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};
module.exports= {
    selectAll,
    selectById,
    pegarUltimoId,
    deletar,
    insert,
    update,
    insertCategoriaProduto
}
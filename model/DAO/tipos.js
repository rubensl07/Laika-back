const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tabela = "tbl_animal_tipo";

const selectAll = async function () {
    try {
        const sql = `SELECT * FROM ${tabela}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}
const selectById = async function (id) {
    try {
        const sql = ` select * from ${tabela} WHERE id = ${id}`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    selectAll,
    selectById
}
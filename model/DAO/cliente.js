const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const selectAllClientes = async function (){
    try {
        const sql = `SELECT * FROM TBL_CLIENTES`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        return false
    }
}

module.exports= {
    selectAllClientes
}
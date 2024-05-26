const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const tabelaAnimais = "tbl_animais";
const tabelaPortes = "tbl_animal_porte";
const tabelaTipos = "tbl_animal_tipo";
const tabelaRacas = "tbl_animal_raca";

// Função para inserir um novo animal
const insert = async function (dados) {
    try {
        let sql = `INSERT INTO ${tabelaAnimais} (nome, nascimento, peso, img, cliente_id, porte_id, raca_id) VALUES (?, ?, ?, ?, ?, ?, ?);`
        let result = await prisma.$executeRawUnsafe(sql, 
            dados.nome,
            dados.nascimento,
            dados.peso,
            dados.img,
            dados.cliente_id,
            dados.porte_id,
            dados.raca_id
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const selectAll = async function () {
    try {
        const sql = ` select * from ${tabelaAnimais}`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Selecionar todos os animais com detalhes completos
// const selectAll = async function () {
//     try {
//         const sql = `
//             SELECT 
//                 a.id, a.nome, a.nascimento, a.peso, a.img, a.cliente_id,
//                 p.nome AS porte, 
//                 r.nome AS raca, 
//                 t.nome AS tipo 
//             FROM ${tabelaAnimais} a
//             JOIN ${tabelaPortes} p ON a.porte_id = p.id
//             JOIN ${tabelaRacas} r ON a.raca_id = r.id
//             JOIN ${tabelaTipos} t ON r.tipo_id = t.id;
//         `;
//         let result = await prisma.$queryRawUnsafe(sql);
//         return result;
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }

// Selecionar animal por ID com detalhes completos

const selectById = async function (id) {
    try {
        const sql = ` select * from ${tabelaAnimais} WHERE id = ${id}`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// const selectById = async function (id) {
//     try {
//         const sql = `
//             SELECT 
//                 a.id, a.nome, a.nascimento, a.peso, a.img, a.cliente_id,
//                 p.nome AS porte, 
//                 r.nome AS raca, 
//                 t.nome AS tipo 
//             FROM ${tabelaAnimais} a
//             JOIN ${tabelaPortes} p ON a.porte_id = p.id
//             JOIN ${tabelaRacas} r ON a.raca_id = r.id
//             JOIN ${tabelaTipos} t ON r.tipo_id = t.id
//             WHERE a.id = ${id};
//         `;
//         let result = await prisma.$queryRawUnsafe(sql);
//         return result;
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }

// Selecionar animais por ID do cliente com detalhes completos
const selectByIdCliente = async function (clienteId) {
    try {
        const sql = `
            SELECT 
                a.id, a.nome, a.nascimento, a.peso, a.img, a.cliente_id,
                p.nome AS porte, 
                r.nome AS raca, 
                t.nome AS tipo 
            FROM ${tabelaAnimais} a
            JOIN ${tabelaPortes} p ON a.porte_id = p.id
            JOIN ${tabelaRacas} r ON a.raca_id = r.id
            JOIN ${tabelaTipos} t ON r.tipo_id = t.id
            WHERE a.cliente_id = ${clienteId};
        `;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Selecionar todos os portes
const selectAllPortes = async function () {
    try {
        const sql = `SELECT * FROM ${tabelaPortes}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}
const selectPorteById = async function (id) {
    try {
        const sql = ` select * from ${tabelaPortes} WHERE id = ${id}`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Selecionar todos os tipos
const selectAllTipos = async function () {
    try {
        const sql = `SELECT * FROM ${tabelaTipos}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}
const selectTipoById = async function (id) {
    try {
        const sql = ` select * from ${tabelaTipos} WHERE id = ${id}`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Selecionar todas as raças
const selectAllRacas = async function () {
    try {
        const sql = `SELECT * FROM ${tabelaRacas}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}
const selectRacaById = async function (id) {
    try {
        const sql = ` select * from ${tabelaRacas} WHERE id = ${id}`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Selecionar raças por tipo ID
const selectRacaByTipoId = async function (tipoId) {
    try {
        const sql = `SELECT * FROM ${tabelaRacas} WHERE tipo_id = ${tipoId}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    selectAll,
    selectById,
    selectByIdCliente,
    selectAllPortes,
    selectPorteById,
    selectAllTipos,
    selectTipoById,
    selectAllRacas,
    selectRacaById,
    selectRacaByTipoId,
    insert
};

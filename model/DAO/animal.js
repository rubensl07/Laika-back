const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const tabela = "tbl_animais";
const tabelaPortes = "tbl_animal_porte";
const tabelaTipos = "tbl_animal_tipo";
const tabelaRacas = "tbl_animal_raca";

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

// Função para inserir um novo animal
const insert = async function (dados) {
    try {
        let sql = `INSERT INTO ${tabela} (nome, nascimento, peso, img, cliente_id, porte_id, raca_id) VALUES (?, ?, ?, ?, ?, ?, ?)`
        let result = await prisma.$executeRawUnsafe(sql, 
            dados.nome,
            dados.nascimento,
            dados.peso,
            dados.img,
            dados.dono_id,
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
}

const update = async function (id, dados) {
    try{
        let sql = `
            UPDATE ${tabela}
            SET 
                nome = '${dados.nome}',
                nascimento = '${dados.nascimento}',
                peso = '${dados.peso}',
                img = '${dados.img}',
                porte_id = '${dados.porte_id}',
                raca_id = '${dados.raca_id}'
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
const selectAll = async function () {
    try {
        const sql = ` select * from ${tabela}`
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
// const selectByIdCliente = async function (clienteId) {
//     try {
//         const sql = `
//             SELECT 
//                 a.id, a.nome, a.nascimento, a.peso, a.img, a.cliente_id,
//                 p.nome AS porte, 
//                 r.nome AS raca, 
//                 t.nome AS tipo 
//             FROM ${tabela} a
//             JOIN ${tabelaPortes} p ON a.porte_id = p.id
//             JOIN ${tabelaRacas} r ON a.raca_id = r.id
//             JOIN ${tabelaTipos} t ON r.tipo_id = t.id
//             WHERE a.cliente_id = ${clienteId};
//         `;
//         let result = await prisma.$queryRawUnsafe(sql);
//         return result;
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }

// Selecionar animal por ID com detalhes completos
// const selectById = async function (id) {
//     try {
//         const sql = `
//             SELECT 
//                 a.id, a.nome, a.nascimento, a.peso, a.img, a.cliente_id,
//                 p.nome AS porte, 
//                 r.nome AS raca, 
//                 t.nome AS tipo 
//             FROM ${tabela} a
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

// const selectByIdCliente = async function (clienteId) {
//     try {
//         const sql = `
//             SELECT 
//                 a.id, a.nome, a.nascimento, a.peso, a.img, a.cliente_id,
//                 p.nome AS porte, 
//                 r.nome AS raca, 
//                 t.nome AS tipo 
//             FROM ${tabela} a
//             JOIN ${tabelaPortes} p ON a.porte_id = p.id
//             JOIN ${tabelaRacas} r ON a.raca_id = r.id
//             JOIN ${tabelaTipos} t ON r.tipo_id = t.id
//             WHERE a.cliente_id = ${clienteId};
//         `;
//         let result = await prisma.$queryRawUnsafe(sql);
//         return result;
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }

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

const selectByClienteId = async function (id) {
    try {
        const sql = `SELECT * FROM ${tabela} WHERE cliente_id = ${id}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    pegarUltimoId,
    selectAll,
    selectById,
    selectByClienteId,
    insert,
    update,
    deletar
};

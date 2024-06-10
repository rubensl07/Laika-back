const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var tabela = "tbl_funcionarios"
var tabelaCargos = "tbl_cargos"
var tabelaCargosFuncionarios = "tbl_cargos_funcionarios"
var tabelaAgendamentos = "tbl_agendamentos"
var tabelaAgendamentoFuncionario = "tbl_agendamento_funcionario"

const insert = async function (dados) {
    try {
        let sql
        let result = null
        if(
            dados.img != '' &&
            dados.img != null &&
            dados.img != undefined
        )
        {
            sql = `INSERT INTO ${tabela} (nome, telefone, email, senha, endereco_id, img) VALUES (?, ?, ?, ?, ?, ?);`;
            result = await prisma.$executeRawUnsafe(sql,
                dados.nome,
                dados.telefone,
                dados.email,
                dados.senha,
                dados.endereco_id,
                dados.img
            )
        }
        else{
            sql = `INSERT INTO ${tabela} (nome, telefone, email, senha, endereco_id) VALUES (?, ?, ?, ?, ?);`;
            result = await prisma.$executeRawUnsafe(sql,
                dados.nome,
                dados.telefone,
                dados.email,
                dados.senha,
                dados.endereco_id
            )
        }

        console.log(sql);
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
    try {
        let sql
        if(
            dados.img != '' &&
            dados.img != null &&
            dados.img != undefined
        ){
            sql =  `UPDATE ${tabela} SET 
            nome = '${dados.nome}',
            telefone = '${dados.telefone}',
            email = '${dados.email}',
            senha = '${dados.senha}',
            img = '${dados.img}'
            WHERE id = ${id}`
        } else {
           sql =  `UPDATE ${tabela} SET 
                nome = '${dados.nome}',
                telefone = '${dados.telefone}',
                email = '${dados.email}',
                senha = '${dados.senha}'
                WHERE id = ${id}`
        }
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
const deletar = async function (id) {
    try {
        const sqlCargos = `DELETE FROM ${tabelaCargosFuncionarios} WHERE funcionario_id = ${id}`
        const sqlAgendamentos = `DELETE FROM ${tabelaAgendamentoFuncionario} WHERE funcionario_id = ${id}`
        const sql = `DELETE FROM ${tabela} WHERE id = ${id}`
        let resultCargos = await prisma.$executeRawUnsafe(sqlCargos)
        let resultAgendamentos= await prisma.$executeRawUnsafe(sqlAgendamentos)
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
const selectAll = async function (search) {
    try {
        let nomeSearch = ''
        if (search.nome) {
            nomeSearch = search.nome
        }
        let cargosSearch
        if (search.cargos) {
            cargosSearch = `(cf.cargo_id IN (${search.cargos}))`
        } else {
            cargosSearch = `(cf.cargo_id IN (SELECT id FROM ${tabelaCargos}) OR cf.cargo_id IS NULL)`
        }
        let sql =
                `
        SELECT 
    f.id,
    f.nome,
    f.telefone,
    f.email,
    f.senha,
    f.img,
    f.endereco_id,
    GROUP_CONCAT(c.id SEPARATOR '-') AS cargos,
    COALESCE(total_agendamentos, 0) AS total_agendamentos
FROM
${tabela} f
LEFT JOIN
${tabelaCargosFuncionarios} cf ON f.id = cf.funcionario_id
LEFT JOIN
${tabelaCargos} c ON cf.cargo_id = c.id
LEFT JOIN
    (SELECT 
        funcionario_id,
        COUNT(*) AS total_agendamentos
    FROM
    ${tabelaAgendamentoFuncionario} af
    LEFT JOIN
    ${tabelaAgendamentos} a ON af.agendamento_id = a.id
    GROUP BY
        funcionario_id) AS agendamentos_count ON f.id = agendamentos_count.funcionario_id
WHERE
    f.nome LIKE '%${nomeSearch}%'
    AND ${cargosSearch}
GROUP BY
    f.id;
`

        let result = await prisma.$queryRawUnsafe(sql);
        for (let index = 0; index < result.length; index++) {
            result[index].total_agendamentos = parseInt(result[index].total_agendamentos)            
        }

        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}
const selectById = async function (search) {
    try {
        const sql =
        `
        SELECT 
    f.id,
    f.nome,
    f.telefone,
    f.email,
    f.senha,
    f.img,
    f.endereco_id,
    GROUP_CONCAT(c.id SEPARATOR '-') AS cargos,
    COALESCE(total_agendamentos, 0) AS total_agendamentos
FROM
${tabela} f
LEFT JOIN
${tabelaCargosFuncionarios} cf ON f.id = cf.funcionario_id
LEFT JOIN
${tabelaCargos} c ON cf.cargo_id = c.id
LEFT JOIN
    (SELECT 
        funcionario_id,
        COUNT(*) AS total_agendamentos
    FROM
    ${tabelaAgendamentoFuncionario} af
    LEFT JOIN
    ${tabelaAgendamentos} a ON af.agendamento_id = a.id
    GROUP BY
        funcionario_id) AS agendamentos_count ON f.id = agendamentos_count.funcionario_id
WHERE
    f.id = ${search}`
    
    let result = await prisma.$queryRawUnsafe(sql);
    result[0].total_agendamentos = parseInt(result[0].total_agendamentos)
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}

const selectAllLogin = async function () {
    try {
        const sql = `select id,email,senha FROM ${tabela}`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}
const pegarUltimoId = async function () {
    try {
        let sql = `SELECT CAST(LAST_INSERT_ID() AS DECIMAL) AS id FROM ${tabela} limit 1;`
        let result = await prisma.$queryRawUnsafe(sql)
        if (result) {
            return result[0].id
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
}
const selectAllVeterinarios = async function () {
    try {
        const sql = `select ${tabela}.id,${tabela}.nome from ${tabela} join ${tabelaCargosFuncionarios} on ${tabela}.id = ${tabelaCargosFuncionarios}.funcionario_id where cargo_id = 1`
        let result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.error(error);
        return false
    }
}
const insertCargoFuncionario = async function (dados) {
    try {

        let sql = `INSERT INTO ${tabelaCargosFuncionarios} (cargo_id, funcionario_id) VALUES (?, ?)`;
        let result = await prisma.$executeRawUnsafe(sql,
            dados.idCargo,
            dados.idFuncionario);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};



module.exports = {
    insert,
    update,
    deletar,
    pegarUltimoId,
    selectAll,
    selectById,
    selectAllLogin,
    selectAllVeterinarios,
    insertCargoFuncionario,
}
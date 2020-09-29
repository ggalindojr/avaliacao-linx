var Mysql = require('mysql2');

var conexao = Mysql.createConnection({
    host: 'localhost',
    user: 'app',
    password: '12345678',
    database: "bdlugui"
});

function promocao(a) {

    let maxProducts = '';

    if (a.num >= 10)
        maxProducts = 'LIMIT ' + parseInt(a.num);
    else
        maxProducts = 'LIMIT ' + parseInt(10);

    return ("SELECT * FROM  ("
        + 'SELECT '
        + 'id, name, oldPrice, '
        + 'CASE '
        + 'WHEN price < oldPrice THEN price '
        + 'END AS promocao, '
        + 'ROUND(((price-oldPrice)/oldPrice)*100) AS perc, '
        + 'installment, '
        + 'images '
        + 'FROM bdlugui.linx) X '
        + 'WHERE X.promocao IS NOT NULL ORDER BY perc ASC ' + maxProducts);
}

async function infoTratada(d) {
    const a = await d;

    try {

        // Declaração de variáveis
        var ticket = [];
        var ticket2 = { imagem: [] };

        for (let i = 0; i < a.length; i++) {

            // Converter string em Json
            prestacao = a[i].installment;
            prest = JSON.parse(prestacao.replace(/'/g, '"'));

            // Converter string em Json
            imagem = a[i].images;
            img = JSON.parse(imagem.replace(/'/g, '"'));
            ticket2.imagem.push(img);

            ticket.push({
                nome: a[i].name, preco: a[i].oldPrice, promocao: a[i].promocao,
                parcela: prest.count, vlrparc: prest.price, imagens: ticket2.imagem[i]
            });
        }

        return ticket;

    } catch (error) {
        console.error(error);
    }
}

function execSQLQuery(sqlQry, res) {
    return new Promise((resolve, reject) => {
        conexao.query(sqlQry, function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

var consulta = async function (a, res) {

    a.num != null ? varFull = a.num : varFull = 0;

    sqlQry = promocao(a);

    const b = await execSQLQuery(sqlQry)
        // .then(dados => console.log(dados))
        .then(function (dados) {
            return dados;
        })

    const c = await infoTratada(b)
        .then(function (d) {
            return d;
        })

    res.json(c);
}

module.exports = consulta;
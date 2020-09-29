var Mysql = require('mysql2');

var conexao = Mysql.createConnection({
    host: 'localhost',
    user: 'app',
    password: '12345678',
    database: "bdlugui"
});

function compacta(a) {
    parametro = { compacta: a.id };
    console.log(parametro);

    let filter = '';
    if (a.id) filter = 'WHERE id = ' + parseInt(a.id);
    return ('SELECT name, price, status, categories FROM bdlugui.linx ' + filter);
}

function completa(a) {
    parametro = { completa: a.full };
    console.log(parametro);

    let filter = '';
    if (a.id) filter = 'WHERE id = ' + parseInt(a.id);
    return ('SELECT name, price, description, status, categories FROM bdlugui.linx ' + filter);
}

function infoTratada(a) {
    cat = a[0].categories;

    // Converter Categories string em Json
    cat2 = JSON.parse(cat.replace(/'/g, '"'));
    var ticket = { categoria: [] };

    // Lista categorias
    for (let i = 0; i < cat2.length; i++) {
        data = { nome: cat2[i].name };
        ticket.categoria.push(data);
    }

    if (!a[0].description)
        return ({
            nome: a[0].name, preco: a[0].price, status: a[0].status, categoria: ticket.categoria
        });
    else
        return ({
            nome: a[0].name, preco: a[0].price, status: a[0].status, descricao: a[0].description, categoria: ticket.categoria
        });
}

var execSQLQuery = function (a, res) {

    a.full != null ? varFull = a.full.toLowerCase() : varFull = 0;

    if (varFull == 'full') {
        sqlQry = completa(a);
        conexao.query(sqlQry, function (error, results, fields) {
            if (error)
                res.json(error);
            else
                result = infoTratada(results);
                // console.log(result);
                res.json(result);
        });
    } else {
        sqlQry = compacta(a);
        conexao.query(sqlQry, function (error, results, fields) {
            if (error)
                res.json(error);
            else
                result = infoTratada(results);
                res.json(result);
        });
    }
}

module.exports = execSQLQuery;
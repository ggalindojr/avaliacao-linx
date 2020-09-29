'use strict' // Força o javascript a ser mais criterioso com pontos e variáveis

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./dbSyncSql2')
// const router = express.Router()

//configurando o body parser para pegar POSTS
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//definindo servidor
const host = 'localhost'
const port = 4000

//definindo as rotas
app.get('/', (req, res) => res.json({ message: 'Funcionando!' }))

app.get('/produto/:id', (req, res) => {
    db(req.params, res);
})

app.get('/produto/:id/:full', (req, res) => {
    db(req.params, res);
})

app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}/`)
    console.log('Para derrubar o servidor: ctrl + c');
})
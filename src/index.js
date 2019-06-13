const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

require('dotenv').config()

// Permite o servidor receber protocolo http e websocket para comunicação em tempo real
const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-6kbw6.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true
});

// Torna global as informações do io para todos os controllers que forem necessários
app.use((req, res, next) => {
    req.io = io;

    next();
});

// Habilita o acesso da aplicação para todos os ip's e urls(pode ser bloqueado especificadamente usando configurações)
app.use(cors());

// Rota para acessar arquivos estáticos, ou seja, as imagens que foram de upload
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

// Declara as rotas da aplicação
app.use(require('./routes'));

server.listen(3333);
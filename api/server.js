const express = require("express");

const server = express();

server.use(express.jso

    server.use('*', (req, res) => {
        res.status(404).json({
            message: 'not found',
        })
    })
module.exports = server;

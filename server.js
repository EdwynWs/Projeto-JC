import express from 'express';
import usuarioRouter from './routes/usuarioRoute.js';
import categoriaRouter from './routes/categoriaRoute.js';
import manualRouter from './routes/manualRoute.js';

import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
//a baixo esta a importação da env
import dotenv from 'dotenv';
dotenv.config();

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const outputJson = require("./swagger-output.json");

import socketInit from './sockets/socket.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app);
const io = new Server(server);

// socket
socketInit(io);

// middlewares
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true                
}));

// swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(outputJson));

//Rotas
app.use("/usuario", usuarioRouter);
app.use("/categoria", categoriaRouter);
app.use("/manual", manualRouter);

// servidor
server.listen(5001, function() {
    console.log('backend em execução');
});
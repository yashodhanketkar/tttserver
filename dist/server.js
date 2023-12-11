"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsInstance = exports.appWS = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const config_1 = require("./config");
exports.app = (0, express_1.default)();
exports.appWS = (0, express_ws_1.default)(exports.app).app;
exports.wsInstance = (0, express_ws_1.default)(exports.appWS);
// apply configs
exports.app.use(config_1.configApp);
(0, config_1.mongoConnection)();
// logs and returns message recieved by websocket
exports.appWS.ws("/", (ws) => {
    ws.on("message", (msg, _req, _res) => {
        const wsClients = exports.wsInstance.getWss().clients;
        wsClients.forEach((client) => {
            console.log("WS: ", msg);
            client.send(`Got ${msg}`);
        });
    });
});
exports.app.use("/api", config_1.MainRouter);
exports.app.listen(config_1.PORT, config_1.HOST, () => {
    console.log("Server is running");
});

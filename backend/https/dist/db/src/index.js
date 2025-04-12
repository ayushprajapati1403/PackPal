"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return client_1.Permission; } });
const client = new client_1.PrismaClient();
exports.default = client;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const routerAuth = (0, express_1.Router)();
const authController = new auth_controller_1.default;
routerAuth.post('/login', authController.login);
routerAuth.post('/register', authController.register);
routerAuth.post('/logout', authController.logout);
exports.default = routerAuth;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const app_1 = __importDefault(require("../app"));
const encrypt_1 = require("../helper/encrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const response_1 = __importDefault(require("../core/response"));
class AuthController {
    async login(req, res) {
        try {
            // Log email and password for debugging
            // console.log("Email:", req.body.email);
            //console.log("Password:", req.body.password);
            const user = await app_1.default.prisma.user.findUnique({
                where: { email: req.body.email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    role: true,
                    client: {
                        select: {
                            nom: true,
                            prenom: true,
                            telephone: true
                        }
                    }
                }
            });
            // Log the user object for debugging
            // console.log("Retrieved User:", user);
            if (user && bcryptjs_1.default.compareSync(req.body.password, user.password)) {
                // If this works, the issue might be with the implementation of encrypt.comparepassword
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(http_status_codes_1.StatusCodes.OK).send({
                    token: token
                });
            }
            else {
                console.log('Password does not match');
            }
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                data: null,
                message: "email ou password incorrecte"
            });
        }
        catch (error) {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                data: error,
                message: "Erreur lors du traitement"
            });
        }
    }
    // async register(req: AuthRequest, res: Response) {
    //     try {
    //         const { email, password, clientId } = req.body;
    //         // Find the client by ID
    //         const client = await app.prisma.client.findUnique({
    //             where: { id: Number.parseInt(clientId) },
    //         });
    //         if (!client) {
    //             return res.status(StatusCodes.NOT_FOUND).send(
    //                 RestResponse.response(null, StatusCodes.NOT_FOUND, "Le Client n'existe pas")
    //             );
    //         }
    //         // Create the new user with a default role
    //         const newUser = await app.prisma.user.create({
    //             data: {
    //                 email,
    //                 password: await encrypt.encryptepass(password),
    //                 role: 'ADMIN',  // Set a default role
    //                 client: {
    //                     connect: { id: client.id }
    //                 }
    //             },
    //         });
    //         res.status(StatusCodes.CREATED).send(
    //             RestResponse.response(newUser, StatusCodes.CREATED, "Utilisateur créé avec succès.")
    //         );
    //     } catch (error) {
    //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
    //             RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors de la création de l'utilisateur.")
    //         );
    //     }
    // }
    async register(req, res) {
        try {
            const { email, password, clientId, role } = req.body;
            // Find the client by ID
            const client = await app_1.default.prisma.client.findUnique({
                where: { id: Number.parseInt(clientId) },
            });
            if (!client) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(response_1.default.response(null, http_status_codes_1.StatusCodes.NOT_FOUND, "Le Client n'existe pas"));
            }
            // Check if the authenticated user is an admin
            const userRole = req.user?.role;
            if (userRole !== 'ADMIN' && role) {
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send(response_1.default.response(null, http_status_codes_1.StatusCodes.FORBIDDEN, "Seul un administrateur peut définir le rôle."));
            }
            // If the user is an admin, set the role; otherwise, default to 'CLIENT'
            const newUserRole = userRole === 'ADMIN' && role ? role : 'CLIENT';
            // Create the new user
            const newUser = await app_1.default.prisma.user.create({
                data: {
                    email,
                    password: await encrypt_1.encrypt.encryptepass(password),
                    role: newUserRole,
                    client: {
                        connect: { id: client.id }
                    }
                },
            });
            res.status(http_status_codes_1.StatusCodes.CREATED).send(response_1.default.response(newUser, http_status_codes_1.StatusCodes.CREATED, "Utilisateur créé avec succès."));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(response_1.default.response(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors de la création de l'utilisateur."));
        }
    }
    async logout(req, res) {
    }
}
exports.default = AuthController;
// const token = encrypt.generateToken({id:user.id, email:user.email},'300s')
//     return res.status(StatusCodes.OK).send({
//     "token": token
//     })

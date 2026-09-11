import UsuarioEntity from "../entities/usuarioEntity.js";
import UsuarioRepository from "../repositories/usuarioRepositoy.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = process.env.JWT_SECRET || "segredo";
const PERFIL_USUARIO_NORMAL = 1;
const PERFIL_ADMIN = 2;

export default class UsuarioController {

    #repoUsuario;

    constructor() {
        this.#repoUsuario = new UsuarioRepository();
    }


    async cadastroUsuario(req, res){
        try{
            let {usuarioNome, usuarioEmail, usuarioSenha} = req.body;
            if (!usuarioNome || !usuarioEmail || !usuarioSenha) {
                return res.status(400).json({
                    msg: "Todos os campos são obrigatórios"
                });
            }
            let existente = await this.#repoUsuario.buscarPorEmail(usuarioEmail);

            if (existente){
                return res.status(400).json({
                    msg: "Este e-mail já está cadastrado"
                });
            }

            // Criptografa a senha
            let senhaHash = await bcrypt.hash(usuarioSenha, 10);

            let usuarioAtivo = 1;
            let perID = PERFIL_USUARIO_NORMAL;
            let usuario = new UsuarioEntity(null, usuarioNome, usuarioEmail, senhaHash, perID, 1);

            if (!usuario.validar()){
                return res.status(400).json({
                    msg: "Parâmetros inválidos"
                });
            }

            await this.#repoUsuario.cadastrarUsuario(usuario);

            return res.status(201).json({
                msg: "Usuário cadastrado com sucesso",
                 usuario: {
                    usuarioNome: usuario.usuarioNome,
                    usuarioEmail: usuario.usuarioEmail,
                    perID: usuario.perID,
                    usuarioAtivo: usuario.usuarioAtivo
                }
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao cadastrar usuário"
            });
        }
    }

    async listarUsuarios(req, res){
        try{
            let usuarios = await this.#repoUsuario.listarUsuarios();

            if (usuarios.length === 0){
                return res.status(404).json({
                    msg: "Nenhum usuário encontrado"
                });
            }

            return res.status(200).json(usuarios);

        } 
        catch (error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao listar usuários"
            });
        }
    }

    async obter(req, res){
        try{
            let {id} = req.params;

            if (!id || isNaN(id)){
                return res.status(400).json({
                    msg: "ID do usuário inválido"
                });
            }

            let usuario = await this.#repoUsuario.obter(id);

            if (!usuario){
                return res.status(404).json({
                    msg: "Usuário não encontrado"
                });
            }

            return res.status(200).json(usuario);

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao buscar usuário"
            });
        }
    }


    async inativarUsuario(req, res){
        try{
            let {id} = req.params;

            if (!id || isNaN(id)){
                return res.status(400).json({
                    msg: "ID do usuário inválido"
                });
            }

            let usuario = await this.#repoUsuario.obter(id);

            if (!usuario){
                return res.status(404).json({
                    msg: "Usuário não encontrado"
                });
            }

            if (Number(usuario.usuarioAtivo) !== 1) {
              return res.status(403).json({
                  msg: "Seu usuário está inativo. Entre em contato com o administrador."
              });
            }

            let resultado = await this.#repoUsuario.inativarUsuario(id);

            if (!resultado){
                return res.status(400).json({
                    msg: "Não foi possível inativar o usuário"
                });
            }

            return res.status(200).json({
                msg: "Usuário inativado com sucesso"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao inativar usuário"
            });
        }
    }

    async ativar(req, res) {

        try {

            const id = req.params.id;

            const usuario = await this.#repoUsuario.buscarPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    msg: "Usuário não encontrado."
                });
            }

            await this.#repoUsuario.ativar(id);

            return res.status(200).json({
                msg: "Usuário ativado com sucesso."
            });

        } catch (error) {

            console.error("Erro ao ativar usuário:", error);

            return res.status(500).json({
                msg: "Erro ao ativar usuário."
            });
        }
    }

    async cadastroUsuario(req, res) {

     try {

         let {usuarioNome, usuarioEmail, usuarioSenha} = req.body;

         if (!usuarioNome || !usuarioEmail || !usuarioSenha) {
             return res.status(400).json({
                 msg: "Todos os campos são obrigatórios."
             });
         }

         let usuarioExistente = await this.#repoUsuario.buscarPorEmail(usuarioEmail);

         if (usuarioExistente) {
             return res.status(400).json({
                 msg: "Este e-mail já está cadastrado."
             });
         }

         let senhaHash = await bcrypt.hash(usuarioSenha, 10);

         let usuario = new UsuarioEntity(0, usuarioNome, usuarioEmail, senhaHash, 1, 1);

         let resultado = await this.#repoUsuario.cadastrarUsuario(usuario);

         if (resultado) {
             return res.status(201).json({
                 msg: "Conta criada com sucesso!"
             });

         }

         return res.status(400).json({
             msg: "Não foi possível criar a conta."
         });

     } catch(error){

         console.error(error);

         return res.status(500).json({
             msg: "Erro ao cadastrar usuário."
         });

     }

    }

    async alterar(req, res){
        try {
            let {id} = req.params;
            let {usuarioNome, usuarioEmail, usuarioSenha, perID, usuarioAtivo} = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    msg: "ID do usuário inválido"
                });
            }

            let usuarioExistente = await this.#repoUsuario.obter(id);

            if (!usuarioExistente) {
                return res.status(404).json({
                    msg: "Usuário não encontrado"
                });
            }

            let usuarioEmailExistente = await this.#repoUsuario.buscarPorEmail(usuarioEmail);
            if (usuarioEmailExistente && Number(usuarioEmailExistente.usuarioId) !== Number(id)){
                return res.status(400).json({
                    msg: "Este email já está sendo utilizado"
                });
            }

            usuarioAtivo = Number(usuarioAtivo);

            let senhaFinal = usuarioExistente.usuarioSenha;

            if (usuarioSenha && usuarioSenha.trim() !== "") {
                senhaFinal = await bcrypt.hash(usuarioSenha, 10);
            }

            let usuario = new UsuarioEntity(id, usuarioNome, usuarioEmail, senhaFinal, perID, 1);

            if (!usuario.validar()){
                return res.status(400).json({
                    msg: "Dados inválidos"
                });
            }

            let resultado = await this.#repoUsuario.alterar(usuario);

            if (!resultado){
                return res.status(400).json({
                    msg: "Não foi possível alterar o usuário"
                });
            }

            return res.status(200).json({
                msg: "Usuário alterado com sucesso"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao alterar usuário"
            });
        }
    }


    async login(req, res) {
        try{
            let {usuarioEmail, usuarioSenha} = req.body;

            if (!usuarioEmail || !usuarioSenha){
                return res.status(400).json({
                    msg: "Email e senha são obrigatórios"
                });
            }

            let usuario = await this.#repoUsuario.buscarPorEmail(usuarioEmail);

            if (!usuario){
                return res.status(401).json({
                    msg: "Email ou senha inválidos"
                });
            }

            let senhaValida = await bcrypt.compare(usuarioSenha, usuario.usuarioSenha);

            if (!senhaValida) {
                return res.status(401).json({
                    msg: "Email ou senha inválidos"
                });
            }

            if (usuario.usuarioAtivo !== 1) {
                return res.status(403).json({
                    msg: "Seu usuário está inativo. Entre em contato com o administrador."
                });
            }

            let token = jwt.sign(
                {usu_id: usuario.usuarioId, usu_nome: usuario.usuarioNome, usu_email: usuario.usuarioEmail, per_id: usuario.perID},
                SECRET,
                {
                    expiresIn: "1h"
                }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 1000

            });

            return res.status(200).json({
                msg: "Login realizado com sucesso",
                usuario: {usuarioId: usuario.usuarioId, usuarioNome: usuario.usuarioNome, usuarioEmail: usuario.usuarioEmail, perID: usuario.perID, usuarioAtivo: usuario.usuarioAtivo}
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao realizar login"
            });
        }
    }


    async usuarioLogado(req, res){
        try{
            if (req.usuario){
                return res.status(200).json(req.usuario);
            }

            return res.status(404).json({
                msg: "Usuário não encontrado"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao buscar usuário logado"
            });
        }
    }


    async logout(req, res){
        try {
            res.clearCookie("token");

            return res.status(200).json({
                msg: "Logout realizado com sucesso"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao realizar logout"
            });
        }
    }


    async deletar(req, res){
        try {
            let {id} = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    msg: "ID do usuário inválido"
                });
            }

            let usuario = await this.#repoUsuario.obter(id);

            if (!usuario) {
                return res.status(404).json({
                    msg: "Usuário não encontrado"
                });
            }

            let resultado = await this.#repoUsuario.deletar(id);

            if (!resultado) {
                return res.status(400).json({
                    msg: "Não foi possível excluir o usuário"
                });
            }

            return res.status(200).json({
                msg: "Usuário excluído com sucesso"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao excluir usuário"
            });
        }
    }
}
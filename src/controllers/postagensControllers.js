import Postagens from "../models/postagensModel.js";
import { z } from "zod";

// Definindo o esquema de validação com Zod
const postSchema = z.object({
    titulo: z.string().min(1, { message: "O titulo é obrigatório" }),
    conteudo: z.string().min(10, { message: "O conteudo é obrigatório" }),
    autor: z.string().min(2, { message: "O autor é obrigatório" }),
    imagem: z.string().url("A URL da imagem é inválida").optional().nullable(),
});
const atualizaSchema = z.object({
    titulo: z.string().min(1, { message: "O titulo é obrigatório" }),
    conteudo: z.string().min(10, { message: "O conteudo é obrigatório" }),
    autor: z.string().min(2, { message: "O autor é obrigatório" }),
    imagem: z.string().url("A URL da imagem é inválida").optional().nullable(),
});
const idSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID deve ser um número inteiro positivo").transform(Number),
});

export const criar = async (request, response) => {
    try {
        // Validando o corpo da requisição com Zod
        const { titulo, conteudo, autor, imagem } = postSchema.parse(request.body);

        const novaPostagem = {
            titulo,
            conteudo,
            autor,
            imagem: imagem || null,
            dataPublicacao: Date(),
        };

        await Postagens.create(novaPostagem);
        response.status(201).json({ message: "Postagem criada" });
    } catch (error) {
        // Tratando erros de validação do Zod
        if (error instanceof z.ZodError) {
            return response.status(400).json({
                validationErrors: error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }

        console.error(error);
        response.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const listarPostagensid = async (request, response) => {
    const { postagem_id } = request.params

    try {
        const postagem = await Postagens.findByPk(postagem_id)

        if (!postagem) {
            return response.status(404).json({ message: `Postagem ${postagem_id} não existe` });
        }

        response.status(200).json({ message: postagem })
    } catch (error) {
        response.status(500).json({ message: "Erro interno do servidor" + error })
    }
}

export const atualizarPostagem = async (request, response) => {
    const { postagem_id } = request.params;

    // Validar o corpo da requisição com Zod
    try {
        const { titulo, conteudo, autor, imagem } = atualizaSchema.parse(request.body);

        // Criar o objeto de atualização apenas com campos não nulos
        const updatedPostagem = {
            titulo: titulo || undefined,
            conteudo: conteudo || undefined,
            autor: autor || undefined,
            imagem: imagem || null, // Define como null se não for passado
        };

        const [linhasAfetadas] = await Postagens.update(updatedPostagem, {
            where: { id: postagem_id },
        });

        if (linhasAfetadas <= 0) {
            return response.status(404).json({ message: "Postagem não encontrada" });
        }

        response.status(200).json({ message: "Postagem atualizada" });
    } catch (error) {
        // Tratando erros de validação do Zod
        if (error instanceof z.ZodError) {
            return response.status(400).json({
                validationErrors: error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }

        console.error(error); // Para depuração
        response.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const listarTudo = async (request, response) => {
    const page = parseInt(request.query.page) || 1
    const limit = 3
    const offset = (page - 1) * limit
    try {
        const postagens = await Postagens.findAndCountAll({
            limit,
            offset
        })

        const totalPaginas = Math.ceil(postagens.count / limit)
        response.status(200).json({
            totalPostagens: postagens.count,
            totalPags: totalPaginas,
            pagAtual: page,
            itensPorPag: limit,
            ProximaPag: totalPaginas === 0 ? null : `http://localhost:3333/tarefas?page=${page + 1}`,
            pagAnterior: page - 1 === 0 ? null : `http://localhost:3333/tarefas?page=${page - 1}`,
            Postagens: postagens.rows
        });
    } catch (error) {
        response.status(500).json({ message: "Erro interno do servidor: " + error })
    }
}

export const excluirPostagem = async (request, response) => {
    const { id } = request.params;

    try {
        idSchema.parse({ id });

        const linhasAfetadas = await Postagens.destroy({
            where: { id },
        });

        if (linhasAfetadas <= 0) {
            return response.status(404).json({ message: "Postagem não encontrada" });
        }

        response.status(200).json({ message: "Postagem excluída" });
    } catch (error) {

        if (error instanceof z.ZodError) {
            return response.status(400).json({
                validationErrors: error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }
        response.status(500).json({ message: "Erro interno do servidor" });
    }
};
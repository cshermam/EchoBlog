import Postagens from "../models/postagensModel.js";
import { z } from "zod";

// Definindo o esquema de validação com Zod
const postSchema = z.object({
    titulo: z.string().min(1, { message: "O titulo é obrigatório" }),
    conteudo: z.string().min(10, { message: "O conteudo é obrigatório" }),
    autor: z.string().min(2, { message: "O autor é obrigatório" }),
    imagem: z.string().url("A URL da imagem é inválida").optional().nullable(),
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

export const listarPostagens = async (request, response) => {
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


import { DataTypes } from 'sequelize';
import conn from '../config/conn.js';

const Postagem = conn.define('postagem', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false, // O título é obrigatório
    },
    conteudo: {
        type: DataTypes.TEXT,
        allowNull: false, // O conteúdo é obrigatório
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: false, // O autor é obrigatório
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: true, // Imagem é opcional
    },
    dataPublicacao: {
        type: DataTypes.DATE,
        allowNull: false, // Data de publicação é obrigatória
        defaultValue: DataTypes.NOW, // Valor padrão é a data e hora atuais
    }
    
}, {
    tableName: 'postagem', // Nome da tabela no banco de dados
    timestamps: true
});

export default Postagem;
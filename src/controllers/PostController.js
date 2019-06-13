const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
    // Retorna todos os posts de forma decrescente conforme a data de registro
    async index(req, res) {
        const posts = await Post.find().sort('-createdAt');

        return res.json(posts);
    },

    async store(req, res) {
        // Cadastra novo post
        const { author, place, description, hashtags } = req.body;
        const { filename: image } = req.file;

        const [name] = image.split('.');
        const fileName = `${name}.jpg`;

        // Redimensiona a imagem enviada
        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 90 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            )
        
        // Deleta o arquivo original
        fs.unlinkSync(req.file.path);

        // Salva no BD
        const post = await Post.create({
            author, 
            place,
            description,
            hashtags,
            image: fileName
        });

        // Envia informação em tempo real com os dados do post cadastrado
        req.io.emit('post', post);

        return res.json(post);
    }
};
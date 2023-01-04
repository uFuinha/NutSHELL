const express = require('express');
const fs = require('fs');

const md = require('markdown-it')('commonmark')
    .use(require('markdown-it-mark'))
    .use(require('markdown-it-attrs'))
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-meta'))
    .use(require('markdown-it-mathjax3'));
  

const app = express();
const PORT = process.env.PORT || 8080;
const postdir = './posts';

app.use('/public', express.static('public'));

app.set('view engine', 'ejs');

app.get('/posts', (req, res) => {
    fs.readdir(postdir, 'utf8', (err, files) => {
        const options = fs.readFileSync('./views/components/options.html'),
              header = fs.readFileSync('./views/components/header.html'),
              footer = fs.readFileSync('./views/components/footer.html');
        
        if(err){
            res.render('error', {
                options: options,
                header: header,
                errorMessage: `Nenhum post foi encontrado`,
                footer: footer
            });
        }
        else {
            const posts = files.map(folder => {
                const file = fs.readFileSync(`${postdir}/${folder}/post.md`, 'utf8');
                return {
                    content: md.render(file),
                    title: md.meta.title,
                    subtitle: md.meta.subtitle,
                    id: md.meta.id
                };
            });

            res.render('list', {
                options: options,
                header: header,
                title: 'NutSHELL',
                posts: posts,
                footer: footer
            });
        }
    });
});

app.get('/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(`${postdir}/${id}/post.md`, 'utf8', (err, data) => {
        const options = fs.readFileSync('./views/components/options.html'),
              header = fs.readFileSync('./views/components/header.html'),
              footer = fs.readFileSync('./views/components/footer.html');

        if(err){
            res.render('error', {
                options: options,
                header: header,
                errorMessage: `Post não encontrado!`,
                footer: footer
            });
        }
        else {
            const post = md.render(data);

            res.render('post', {
                options: options,
                header: header,
                footer: footer,
                title: md.meta.title,
                post: post
            });
        }
    })
});

app.listen(PORT, () => {
    console.log(`The app is runing on https://localhost:${PORT}.`);
})

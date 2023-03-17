const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/download', (req, res) => {
  const numLote = req.body.numLote;
  const diretorioCertificados = "P:\\Laboratorio\\Marketing\\Padrões Site Akso\\2023\\"

  if (numLote.length === 0) {
    res.send("Digite o número do lote para baixar o certificado.");
  } else {
    fs.readdir(diretorioCertificados, function (err, files) {
      if (err) {
        console.log(err);
        res.status(500).send("Erro ao ler a pasta de certificados.");
      } else {
        const matchingFiles = files.filter(function (file) {
          return file.includes(numLote);
        });
        if (matchingFiles.length === 0) {
          res.send("Nenhum certificado foi encontrado para o número do lote informado.");
        } else if (matchingFiles.length === 1) {
          const file = fs.createReadStream(path.join(diretorioCertificados, matchingFiles[0]));
          const filename = matchingFiles[0];
          res.setHeader('Content-disposition', 'attachment; filename=' + filename);
          res.setHeader('Content-type', 'application/pdf');
          file.pipe(res);
        } else {
          const html = matchingFiles.map(file => `<li><a href="/download?file=${encodeURIComponent(file)}">${file}</a></li>`).join('');
          res.send(`
            <p>Foram encontrados mais de um certificado para o número do lote informado. Selecione o certificado que deseja baixar:</p>
            <ul>${html}</ul>
          `);
        }
      }
    });
  }
});

app.get('/download', (req, res) => {
  const filename = req.query.file;
  const diretorioCertificados = path.join(__dirname, 'certificados');
  const file = fs.createReadStream(path.join(diretorioCertificados, filename));
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', 'application/pdf');
  file.pipe(res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

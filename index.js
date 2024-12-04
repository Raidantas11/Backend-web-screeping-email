const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const url = "https://pt.wikipedia.org/wiki/Oscar_de_melhor_filme";


async function buscarEEnviar() {
    try {
        
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const filmes = [];
        $(".wikitable tbody tr").each((_, elemento) => {
            const vencedor = $(elemento)
                .find('td[style*="background:#FAEB86"]')
                .last()
                .text()
                .trim();

            if (vencedor) {
                const ano = $(elemento)
                    .find('td[style*="background:#FAEB86"]')
                    .first()
                    .prev("td")
                    .text()
                    .trim()
                    .slice(-4);

                filmes.push(`Filme: ${vencedor} (${ano})`);
            }
        });

        if (filmes.length === 0) {
            console.log("Nenhum dado encontrado.");
            return;
        }

    
        const transporte = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "usaremaildeteste@gamail.com",
                pass: "SuaSenha"
            }
        });

        const opcoesEmail = {
            from: "usaremaildeteste@gmail..com",
            to: "email de quem deve receber",
            subject: "Lista de Vencedores do Oscar",
            text: filmes.join("\n")
        };

        const info = await transporte.sendMail(opcoesEmail);
        console.log("E-mail enviado:", info.response);

    } catch (erro) {
        console.error("Erro: Não foi possível enviar o e-mail", erro.message);
    }
}


buscarEEnviar();



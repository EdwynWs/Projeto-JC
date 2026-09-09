import {
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";

import {
    getSignedUrl
} from "@aws-sdk/s3-request-presigner";

import r2 from "./r2.js";

class R2Service {

    async enviarArquivo(chave, arquivo) {

        if (!arquivo) {
            throw new Error("Arquivo não informado.");
        }

        const comando = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: chave,
            Body: arquivo.buffer,
            ContentType: arquivo.mimetype
        });

        await r2.send(comando);

        return chave;
    }

    async gerarUrlArquivo(chave, nomeArquivo) {

        if (!chave) {
            throw new Error(
                "Chave do arquivo R2 não informada."
            );
        }

        const comando = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: chave,

            ResponseContentType: "application/pdf",

            ResponseContentDisposition:
                `inline; filename="${nomeArquivo || "arquivo.pdf"}"`
        });

        const tempoExpiracao =
            Number(process.env.R2_URL_EXPIRATION) || 900;

        const url = await getSignedUrl(
            r2,
            comando,
            {
                expiresIn: tempoExpiracao
            }
        );

        return url;
    }

    async excluirArquivo(chave) {

        if (!chave) {
            return;
        }

        const comando = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: chave
        });

        await r2.send(comando);
    }
}

export default new R2Service();
import {
    GetObjectCommand
} from "@aws-sdk/client-s3";

import {
    getSignedUrl
} from "@aws-sdk/s3-request-presigner";

import r2 from "../db/r2.js";

class R2Service {

    async gerarUrlArquivo(chave, nomeArquivo) {

        if (!chave) {
            throw new Error("Chave do arquivo R2 não informada.");
        }

        const comando = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,

            Key: chave,

            ResponseContentType: "application/pdf",

            ResponseContentDisposition:
                `inline; filename="${nomeArquivo || "manual.pdf"}"`
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
}

export default new R2Service();
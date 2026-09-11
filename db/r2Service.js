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


    verificarConfiguracao() {

        if (!process.env.B2_APPLICATION_KEY_ID) {

            throw new Error(
                "B2_APPLICATION_KEY_ID não configurado no arquivo .env."
            );

        }


        if (!process.env.B2_APPLICATION_KEY) {

            throw new Error(
                "B2_APPLICATION_KEY não configurado no arquivo .env."
            );

        }


        if (!process.env.B2_BUCKET_NAME) {

            throw new Error(
                "B2_BUCKET_NAME não configurado no arquivo .env."
            );

        }


        if (!process.env.B2_ENDPOINT) {

            throw new Error(
                "B2_ENDPOINT não configurado no arquivo .env."
            );

        }


        if (!process.env.B2_REGION) {

            throw new Error(
                "B2_REGION não configurado no arquivo .env."
            );

        }

    }


    async enviarArquivo(chave, arquivo) {

        this.verificarConfiguracao();


        if (!arquivo) {

            throw new Error(
                "Arquivo não informado."
            );

        }


        const comando = new PutObjectCommand({

            Bucket: process.env.B2_BUCKET_NAME,

            Key: chave,

            Body: arquivo.buffer,

            ContentType: arquivo.mimetype

        });


        await r2.send(comando);


        return chave;

    }


    async gerarUrlArquivo(chave, nomeArquivo, baixar = false) {
        
     this.verificarConfiguracao();

     if (!chave) {
         throw new Error(
             "Chave do arquivo B2 não informada."
         );
     }

     const comando = new GetObjectCommand({

         Bucket: process.env.B2_BUCKET_NAME,

         Key: chave,

         ResponseContentType: "application/pdf",

         ResponseContentDisposition:
             `${baixar ? "attachment" : "inline"}; filename="${nomeArquivo || "arquivo.pdf"}"`

     });

     const tempoExpiracao =
         Number(process.env.B2_URL_EXPIRATION) || 900;

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

        this.verificarConfiguracao();


        if (!chave) {

            return;

        }


        const comando = new DeleteObjectCommand({

            Bucket: process.env.B2_BUCKET_NAME,

            Key: chave

        });


        await r2.send(comando);

    }

}


export default new R2Service();
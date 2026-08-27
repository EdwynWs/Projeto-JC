import swaggerAutogen from "swagger-autogen";

const doc = {

    info: {
        title: "Sistema de Gerenciamento de Manuais",
        description: "API para gerenciamento e consulta de manuais em PDF"
    },

    host: "localhost:5001",

    schemes: ["http"],

    components: {

        securitySchemes: {

            jwt: {
                type: "apiKey",
                in: "cookie",
                name: "token",
                description: "JWT armazenado em cookie"
            }

        },

        schemas: {

            usuario: {
                usuarioNome: "João da Silva",
                usuarioEmail: "joao@gmail.com",
                usuarioSenha: "123456",
                perID: 1
            },

            login: {
                usuarioEmail: "joao@gmail.com",
                usuarioSenha: "123456"
            },

            categoria: {
                catNome: "Painéis Elétricos",
                catDescricao: "Manuais relacionados aos painéis elétricos"
            },

            manual: {
                manNome: "Manual Painel Elétrico Modelo X",
                manVoltagem: "220V",
                catID: 1,
                manChaveR2: "manuais/painel-modelo-x.pdf"
            }

        }

    },

    security: [
        {
            jwt: []
        }
    ]

};

const outputJson = "./swagger-output.json";

const routes = [
    "./server.js"
];

swaggerAutogen({ openapi: "3.0.0" })(
    outputJson,
    routes,
    doc
).then(async () => {

    await import("./server.js");

});
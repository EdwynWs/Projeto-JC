export let ioGlobal;

export default function socketInit(io){

    ioGlobal = io;

    io.on("connection", (socket) => {

        console.log("usuario conectado");

        socket.on("disconnect", () => {
            console.log("usuario desconectado");
        });

    });

}
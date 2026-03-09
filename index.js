const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('MungaSession');
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // WEKA NAMBA YAKO HAPA (Mfano: 255763000000)
    let phoneNumber = "255763071896"; 

    if (!state.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                console.log("\n====================================");
                console.log("KODI YAKO NI: " + code);
                console.log("====================================\n");
            } catch (error) {
                console.log("Imeshindwa kutoa kodi, jaribu tena kuredeploy.");
            }
        }, 5000);
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'close') startBot();
        if (connection === 'open') console.log("Bot ya Munga Jr Imeunganishwa!");
    });
}

startBot();

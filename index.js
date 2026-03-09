
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const app = require("./server"); 
const PORT = process.env.PORT || 3000;

async function startMungaBot() {
    const { state, saveCreds } = await useMultiFileAuthState('MungaSession');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // Endpoint ya kutoa kodi kwenye tovuti ya kijani
    app.get('/pair', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.json({ error: "Weka namba" });
        try {
            let code = await sock.requestPairingCode(num);
            res.json({ code: code });
        } catch (err) {
            res.json({ error: "Jaribu tena" });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        // MFUMO WA ANTIDELETE
        if (msg.message.protocolMessage && msg.message.protocolMessage.type === 0) {
            const key = msg.message.protocolMessage.key;
            console.log(`Meseji imefutwa ID: ${key.id}`);
        }

        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase();

        // --- MENU YENYE MISTARI MIREFU NA COMMANDS NYINGI ---
        if (text === '.menu') {
            const menuText = `
╔════════════════════════════╗
║     ✨ MUNGA-JR-MD ✨      ║
╠════════════════════════════╣
║ 👤 USER: Mark Richard      ║
║ 🔑 PREFIX: .               ║
║ 👑 DEV: Munga Jr Tech      ║
║ 📊 STATUS: Online          ║
╠════════════════════════════╣
║       🚀 DEPLOYMENT        ║
║ 📁 .deploy  |  📁 .runtime ║
╠════════════════════════════╣
║       🛡️ PROTECTION        ║
║ ✅ .antidelete (Active)    ║
║ 🚫 .antilink   | 🚫 .kick  ║
╠════════════════════════════╣
║       🛠️ UTILITIES         ║
║ 📁 .status  |  📁 .ping    ║
║ 📷 .sticker |  🎥 .video   ║
║ 🎵 .song    |  🔍 .search  ║
╠════════════════════════════╣
║    POWERED BY MUNGA TECH   ║
╚════════════════════════════╝`;

            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: "https://files.catbox.moe/k3b7z6.jpg" }, 
                caption: menuText 
            });
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') console.log('--- LIVE 🚀 ---');
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startMungaBot();
        }
    });
}

startMungaBot();
app.listen(PORT, () => console.log("Munga Jr MD is running..."));

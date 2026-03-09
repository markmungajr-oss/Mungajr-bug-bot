const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// SITE YA KIJANI YA PAIRING
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>MUNGA JR MD - PAIRING</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { background: #000; color: #0f0; font-family: monospace; text-align: center; padding-top: 30px; }
        .container { border: 2px solid #0f0; display: inline-block; padding: 25px; border-radius: 20px; box-shadow: 0 0 25px #0f0; background: rgba(0, 10, 0, 0.9); width: 85%; max-width: 450px; }
        h1 { font-size: 26px; text-shadow: 0 0 10px #0f0; }
        input { width: 80%; padding: 15px; margin: 15px 0; border: 1px solid #0f0; background: #000; color: #0f0; text-align: center; border-radius: 10px; font-size: 18px; outline: none; }
        button { background: #0f0; color: #000; border: none; padding: 15px 30px; font-weight: bold; cursor: pointer; border-radius: 10px; width: 90%; }
        #pairCode { margin-top: 30px; font-size: 32px; font-weight: bold; color: #fff; text-shadow: 0 0 15px #0f0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚙️ MUNGA JR MD ⚙️</h1>
        <p>📱 Weka namba yako kuanzia 255</p>
        <input type="number" id="num" placeholder="255763071896">
        <br>
        <button onclick="get()">🚀 PATA KODI 🚀</button>
        <div id="res"></div>
        <h2 id="pairCode"></h2>
        <p style="font-size: 10px; margin-top: 20px;">POWERED BY MUNGA JR TECH ⚡</p>
    </div>
    <script>
        async function get() {
            const n = document.getElementById('num').value;
            const resDisplay = document.getElementById('res');
            const codeDisplay = document.getElementById('pairCode');
            if (!n) return alert("Weka namba! ⚠️");
            resDisplay.innerText = "⏳ Inatafuta kodi...";
            try {
                const r = await fetch('/pair?number=' + n);
                const d = await r.json();
                if (d.code) {
                    resDisplay.innerText = "✅ KODI YAKO NI:";
                    codeDisplay.innerText = d.code;
                } else {
                    resDisplay.innerText = "❌ JARIBU TENA";
                }
            } catch (err) { resDisplay.innerText = "⚠️ ERROR!"; }
        }
    </script>
</body>
</html>`);
});

async function startMungaBot() {
    const { state, saveCreds } = await useMultiFileAuthState('MungaSession');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    app.get('/pair', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.json({ error: "No number" });
        try {
            let code = await sock.requestPairingCode(num);
            res.json({ code: code });
        } catch { res.json({ error: "Fail" }); }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase();

        // MENU YENYE COMMANDS NYINGI
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
║ .deploy    |  .runtime     ║
║ .reboot    |  .restart     ║
╠════════════════════════════╣
║       🛡️ PROTECTION        ║
║ .antidelete (Active)       ║
║ .antilink   |  .kick       ║
║ .ban        |  .unban      ║
╠════════════════════════════╣
║       🛠️ UTILITIES         ║
║ .status     |  .ping       ║
║ .sticker    |  .video      ║
║ .song       |  .search     ║
║ .gitclone   |  .apk        ║
╠════════════════════════════╣
║       👥 GROUPS            ║
║ .tagall     |  .hidetag    ║
║ .promote    |  .demote     ║
╠════════════════════════════╣
║    POWERED BY MUNGA TECH   ║
╚════════════════════════════╝`;

            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: "https://files.catbox.moe/k3b7z6.jpg" }, 
                caption: menuText 
            });
        }
    });

    sock.ev.on('connection.update', (u) => {
        if (u.connection === 'close') startMungaBot();
        if (u.connection === 'open') console.log('MUNGA-JR-MD IS LIVE 🚀');
    });
}

startMungaBot();
app.listen(PORT);

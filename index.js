const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
    <html><body style="background:#000;color:#0f0;text-align:center;font-family:monospace">
    <h1>MUNGA JR MD</h1>
    <input type="number" id="n" placeholder="255..."><br><br>
    <button onclick="g()">PATA KODI</button>
    <h2 id="c"></h2>
    <script>
    async function g(){
        const n=document.getElementById('n').value;
        const r=await fetch('/pair?number='+n);
        const d=await r.json();
        document.getElementById('c').innerText = d.code || "JARIBU TENA";
    }
    </script></body></html>`);
});

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('MungaSession');
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "fatal" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    app.get('/pair', async (req, res) => {
        let num = req.query.number;
        try {
            let code = await sock.requestPairingCode(num);
            res.json({ code: code });
        } catch { res.json({ error: "fail" }); }
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => { if (u.connection === 'close') start(); });
}

start();
app.listen(PORT);

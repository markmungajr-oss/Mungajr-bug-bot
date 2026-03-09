const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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
                resDisplay.innerText = d.code ? "✅ KODI YAKO NI:" : "❌ JARIBU TENA";
                codeDisplay.innerText = d.code || "";
            } catch (err) { resDisplay.innerText = "⚠️ ERROR!"; }
        }
    </script>
</body>
</html>`);
});

module.exports = app;

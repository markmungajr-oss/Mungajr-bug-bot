const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Huu ni muonekano wa mwanzo wa site yako
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MUNGA JR MD PAIRING</title>
            <style>
                body { background: #000; color: #0f0; font-family: 'Courier New', monospace; text-align: center; padding-top: 100px; }
                input { padding: 12px; border: 1px solid #0f0; background: #222; color: #0f0; width: 250px; }
                button { padding: 12px 20px; background: #0f0; color: #000; border: none; cursor: pointer; font-weight: bold; }
                button:hover { background: #0a0; }
                .container { border: 2px solid #0f0; display: inline-block; padding: 30px; border-radius: 10px; box-shadow: 0 0 15px #0f0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>MUNGA JR MD</h1>
                <p>Ingiza namba ya simu (mfano: 255763071896)</p>
                <input type="text" id="phoneNumber" placeholder="2557XXXXXXXXX">
                <button onclick="getCode()">GET CODE</button>
                <h2 id="result"></h2>
            </div>
            <script>
                function getCode() {
                    const num = document.getElementById('phoneNumber').value;
                    document.getElementById('result').innerText = "Inatafuta kodi kwa: " + num + "...";
                    // Hapa tutaunganisha na index.js baadaye
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log("Site inafanya kazi kwenye port: " + PORT);
});

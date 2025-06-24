const express = require("express");
const axios = require("axios");
const cleanResult = require("../common/cleanResult");

const app = express();
app.use(express.json());

app.post("/vendor", async (req, res) => {
    const { request_id, payload } = req.body;

    if (!request_id || !payload) {
        return res.status(400).json({ error: "Missing request_id or payload" });
    }

    console.log(`Async Vendor received job: ${request_id}`);

    setTimeout(async () => {
        try {
            const cleaned = cleanResult(payload);
            const result = {
                payload: cleaned,
                processed_at: new Date().toISOString(),
            };

            await axios.post("http://api:3000/vendor-webhook", {
                request_id,
                result,
            });
            console.log(`Webhook sent for ${request_id}`);
        } catch (err) {
            console.error(`Failed to send webhook: ${err.message}`);
        }
    }, 5000);
    res.json({ status: "accepted", request_id });
});

const PORT = 4002;
app.listen(PORT, () => {
    console.log(`vendor-async running on port ${PORT}`);
});

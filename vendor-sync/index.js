const express = require("express");
const cleanResult = require("../common/cleanResult");

const app = express();
app.use(express.json());

app.post("/vendor", (req, res) => {
    try{
  const { request_id, payload } = req.body;

  if (!request_id || !payload) {
    return res.status(400).json({ status: "error", message: "Missing request_id or payload" });
  }

  console.log(`Received sync job: ${request_id}`);

const cleaned = cleanResult(payload);
  let result = {
    message: `Processed by vendor-sync`,
    payload: cleaned,
    processed_at: new Date().toISOString(),
  };
  res.json({ status: "success", result: result });
}catch(err){
    console.error('error',err);
    res.json({status:'failed',err:'Internal server error'});
}
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`vendor-sync is running on port ${PORT}`);
});

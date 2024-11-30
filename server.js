const express = require('express');
const cors = require('cors');
const path = require('path');
const StockPresentor = require('./presentors/stockPresentor');

const app = express();
const PORT = 30009;

// Enable CORS for all routes
// app.use(cors());
// app.use(cors({
//     origin: 'file:///Users/elinahaque/Desktop/NodeJs_stock_prediction_app/views/index.html',  // Allow frontend running on port 3000
// }));
app.use(cors({
    origin: '*'  // Allow requests from any origin
}));

// Alternatively, you can configure CORS with specific options if you want to limit it to certain domains or methods
// app.use(cors({
//     origin: 'http://your-frontend-domain.com', // only allow requests from this domain
//     methods: 'GET, POST',
// }));

const stockPresentor = new StockPresentor();
// Flag to track whether model training is complete
let modelTrained = false;

// Load stock data and train model
// stockPresentor.loadDataAndTrainModel('./stocks_data.csv');
stockPresentor.loadDataAndTrainModel('./stocks_data.csv')
    .then(() => {
        modelTrained = true;
        console.log('Model trained successfully');
    })
    .catch(err => {
        console.error('Error training model:', err);
    });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the API route
// app.get('/predict', async (req, res) => {
//     const date = req.query.date;
//     const predictedPrice = await stockPresentor.predictStockPrice(date);
//     res.json({ date, predictedPrice });
// });
app.get('/predict', async (req, res) => {
    if (!modelTrained) {
        return res.status(503).json({ error: 'Model is still training, please try again later.' });
    }

    const date = req.query.date;
    try {
        const predictedPrice = await stockPresentor.predictStockPrice(date);
        res.json({ date, predictedPrice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.options('/predict', cors());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

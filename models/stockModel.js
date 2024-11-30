// const tf = require('@tensorflow/tfjs'); require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs-node'); 
const csv = require('csv-parser');
const fs = require('fs')

class StockModel{
    constructor(){
        this.model = null;
    }

    async loadStockData(filePath){
        const stockData = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath) //use this function  createReadStream  to read the file in string
                 .pipe(csv())
                 .on('data', (row) => {
                    stockData.push(row);
                 })
                 .on('end',() => {
                    console.log('stock data loaded successfully')
                    resolve(stockData)
                 })
                 .on('error', (err)=> {
                    reject(err);
                 })
        })

    }

    // async trainModel(stockData){
    //     //convert stockData to tensor
    //     const dates = stockData.map(row => new Date(row.Date).getTime());
    //     const prices = stockData.map(row => row.Close);
    //     const inputTensor = tf.tensor2d(dates, [dates.length,1]);
    //     const outputTensor = tf.tensor2d(prices, [prices.length,1]);

    //     //define and compile model
    //     this.model = tf.sequential();
    //     this.model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    //     this.model.compile({loss : 'meanSquaredError', optimizer : 'sgd'})

    //     //train
    //     await this.model.fit(inputTensor,outputTensor,{epoche: 100})
    //     console.log('model trained successfully');

    // }
    // async trainModel(stockData){
    //     // Convert stockData to tensor
    //     const dates = stockData.map(row => new Date(row.Date).getTime());
    //     const prices = stockData.map(row => row.Close);
    //     const inputTensor = tf.tensor2d(dates, [dates.length, 1]);
    //     const outputTensor = tf.tensor2d(prices, [prices.length, 1]);
    
    //     // Define and compile the model
    //     this.model = tf.sequential();
    //     this.model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    
    //     // Correct the spelling of "optimizer"
    //     this.model.compile({
    //         loss: 'meanSquaredError',
    //         optimizer: 'sgd'  // Fixed typo here
    //     });
    
    //     // Train the model
    //     await this.model.fit(inputTensor, outputTensor, { epochs: 100 });
    //     console.log('Model trained successfully');
    //     console.log(this.model);

    // }

    // async trainModel(stockData){
    //     // Convert stockData to tensor with validation
    //     const dates = stockData.map(row => {
    //         const date = new Date(row.Date).getTime();
    //         return isNaN(date) ? 0 : date;  // Set to 0 if invalid
    //     });
    
    //     const prices = stockData.map(row => {
    //         const price = parseFloat(row.Close);
    //         return isNaN(price) ? 0 : price;  // Set to 0 if invalid
    //     });
    
    //     // Log the first few data points to verify
    //     console.log(dates.slice(0, 5), prices.slice(0, 5));
    
    //     const inputTensor = tf.tensor2d(dates, [dates.length, 1]);
    //     const outputTensor = tf.tensor2d(prices, [prices.length, 1]);
    
    //     // Define and compile the model
    //     this.model = tf.sequential();
    //     this.model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    
    //     // Compile the model
    //     this.model.compile({
    //         loss: 'meanSquaredError',
    //         optimizer: 'sgd'  // Fixed typo here
    //     });
    
    //     // Train the model
    //     await this.model.fit(inputTensor, outputTensor, { epochs: 100 });
    //     console.log('Model trained successfully');
    // }
    async trainModel(stockData) {
        const dates = stockData.map(row => {
            const date = new Date(row.Date).getTime();
            return isNaN(date) ? 0 : date;  // Return 0 if invalid date
        });
    
        const prices = stockData.map(row => {
            const price = parseFloat(row.Close);
            return isNaN(price) ? 0 : price;  // Return 0 if invalid price
        });
    
        // Log the first few dates and prices to check
        console.log('First 5 dates:', dates.slice(0, 5));
        console.log('First 5 prices:', prices.slice(0, 5));
    
        // If all dates or prices are invalid (0), it indicates an issue
        if (dates.every(date => date === 0) || prices.every(price => price === 0)) {
            console.error("Invalid data detected, can't train model.");
            return;
        }
    
        const inputTensor = tf.tensor2d(dates, [dates.length, 1]);
        const outputTensor = tf.tensor2d(prices, [prices.length, 1]);
    
        // Define and compile the model
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    
        // Compile the model
        this.model.compile({
            loss: 'meanSquaredError',
            optimizer: 'sgd'
        });
    
        // Train the model
        await this.model.fit(inputTensor, outputTensor, { epochs: 100 })
            .then(() => {
                console.log('Model trained successfully');
            })
            .catch((error) => {
                console.error('Error during model training:', error);
            });
    }
    
    
    

    // async predictStockPrice(date){
    //     if(!this.model){
    //         throw new Error('Model not trained yet');
    //     }

    //     const inputDate = new Date(date).getTime();
    //     const inputTensor = tf.tensor2d([inputDate], [1,1]);
    //     const predictedPriceTensor = this.model.predict(inputTensor);
    //     const predictedPrice = predictedPriceTensor.dataSync()[0]

    //     return predictedPrice;
    // }
    async predictStockPrice(date) {
        if (!this.model) {
            throw new Error('Model not trained yet');
        }
    
        // Convert date to timestamp
        const inputDate = new Date(date).getTime();
        console.log('Predicted input date (timestamp):', inputDate);
    
        // Check if the date is valid
        if (isNaN(inputDate)) {
            throw new Error("Invalid date format");
        }
    
        const inputTensor = tf.tensor2d([inputDate], [1, 1]);
        const predictedPriceTensor = this.model.predict(inputTensor);
        const predictedPrice = predictedPriceTensor.dataSync()[0];
    
        console.log('Predicted Price:', predictedPrice);  // Log the predicted price
    
        return predictedPrice;
    }
    
}

module.exports = StockModel;
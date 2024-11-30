const  StockModel = require('../models/stockModel');

class StockPresentor{
    constructor(){
        this.model = new StockModel();
    }

    async loadDataAndTrainModel (filePath){
        const stockData = await this.model.loadStockData(filePath)
        await this.model.trainModel(stockData)
    }

    async predictStockPrice(date){
        return await this.model.predictStockPrice(date);
    }
}

module.exports = StockPresentor;

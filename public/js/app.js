// public/js/app.js
document.getElementById('predictionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const date = document.getElementById('dateInput').value;
    const response = await fetch(`/predict?date=${date}`);
    const data = await response.json();
    document.getElementById('predictionResult').innerHTML = `Predicted Price for ${data.date}: ${data.predictedPrice}`;
});
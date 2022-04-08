module.exports = function calcRSI(closes){
    let gains = 0;
    let losses = 0;
    for(let i = closes.length - 14; i < closes.length; i++) {
        const diff = closes[i] - closes[i - 1];
        if(diff >= 0) {
            gains += diff;
        }
        if(diff < 0) {
            losses -= diff;
        }
    }
    const strength = gains / losses;
    const rsi = 100 - (100 / (1 + strength));
    const rsiFormatted = `${rsi.toFixed(2)}%`;
    return { rsi, rsiFormatted };
}
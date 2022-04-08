module.exports = function calcMFI(volumes){
    let gains = 0;
    let losses = 0;
    let oldsRsi = [];
    for(let i = volumes.length - 14; i < volumes.length; i++) {
        const diff = volumes[i] - volumes[i - 1];
        if(diff >= 0) {
            gains += diff;
        }
        if(diff < 0) {
            losses -= diff;
        }
    }
    const strength = gains / losses;
    const  mfi = 100 - (100 / (1 + strength));
    const mfiFormatted = `${mfi.toFixed(2)}%`;
    return {mfi, mfiFormatted}; 
}
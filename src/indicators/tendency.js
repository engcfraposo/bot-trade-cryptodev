
let tendency = 0;

module.exports = function calcTendency(closes){
    let sumCloses = 0;
    let length = 0;
    for(let i = closes.length - 14; i < closes.length; i++) {
        sumCloses += closes[i];
        length += 1;
    }

    const media = sumCloses/length;
    const calcTendency = closes[499] -= media;

    if(calcTendency > 0 && tendency < 15) {
        tendency += 1;
    }
    if(calcTendency < 0 && tendency > -15) {
        tendency -= 1;
    }

    const mediaFormatted = `${media.toFixed(2)}`;
    return { tendency, media, mediaFormatted };
}
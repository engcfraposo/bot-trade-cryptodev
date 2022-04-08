module.exports = function highTendencyAndHasOrder(tendency, order){
    return tendency < -4 && order !== 0;
}
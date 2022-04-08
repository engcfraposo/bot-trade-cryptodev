module.exports = function lowTendencyHasBalanceAndOrder(tendency, balance, order, limit){
    return tendency > 4 && balance > 0 && order < limit;
}
const calcBetData = ({ playerList, amount, choice }) => {
  const totalBet = playerList.length * amount;
  const totalPlayer = playerList.length;
  const winnerList = playerList.filter((p) => p.choice === choice);
  const lostList = playerList.filter((p) => p.choice !== choice);




  return {
    totalBet,
    totalPlayer,
    winnerList,
    lostList,
  };
};

module.exports = {
  calcBetData,
};

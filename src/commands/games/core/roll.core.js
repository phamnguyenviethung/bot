const _ = require('lodash');

const rollData = [
  {
    name: '🎅🏼',
    value: [0, 0],
  },
  {
    name: '🎄',
    value: [1, 1],
  },
  {
    name: '🏂🏼',
    value: [2, 4],
  },
  {
    name: '❄️',
    value: [3, 5],
  },
  {
    name: '🦌',
    value: [4, 6],
  },
  {
    name: '🔔',
    value: [5, 8],
  },
  {
    name: '🎁',
    value: [0, 15],
  },
];
function copyNText(content, n = 1) {
  let text = '';
  for (let i = 0; i < n; i++) {
    text += content + ' ';
  }

  return text;
}

function generateRollAwardText() {
  let text = '';

  rollData.forEach((item) => {
    text += `${copyNText(item.name, 2)}                   **x${
      item.value[0] >= 10 ? item.value[0] : item.value[0] + ' '
    }**   |    ${copyNText(item.name, 3)}                   **x${
      item.value[1]
    }**\n\n`;
  });

  return text;
}

function getRollResult() {
  const result = [];

  for (let i = 0; i < 3; i++) {
    const random = rollData[2];
    result.push(random);
  }

  return _.shuffle(result);
}

module.exports = {
  rollData,
  generateRollAwardText,
  getRollResult,
};

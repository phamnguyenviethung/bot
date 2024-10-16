const rollData = [
  {
    name: '🍇',
    value: [1, 1],
  },
  {
    name: '🤢',
    value: [2, 4],
  },
  {
    name: '🎄',
    value: [3, 5],
  },
  {
    name: '🐀',
    value: [4, 6],
  },
  {
    name: '🪓',
    value: [5, 8],
  },
  {
    name: '🎱',
    value: [0, 20],
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

module.exports = {
  rollData,
  generateRollAwardText,
};

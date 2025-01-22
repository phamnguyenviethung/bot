const axios = require('axios');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const vietnamTime = require('../../../utils/time');
const { join } = require('path');
GlobalFonts.registerFromPath(
  join(
    __dirname,
    '..',
    '..',
    '..',
    'statics',
    'fonts',
    'BeVietnamPro-SemiBold.ttf'
  ),
  'BVN'
);
const BOT_NAME = 'Kaka';
class ThreeCardGame {
  CARD_BACK_IMG_URL = 'https://deckofcardsapi.com/static/img/back.png';

  constructor() {
    this.deckId = null;
    this.players = [];
  }

  // Khởi tạo bộ bài từ API
  async initializeDeck() {
    const res = await axios.get(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );
    this.deckId = res.data.deck_id;
    this.addPlayer(BOT_NAME);
  }

  addPlayer(playerName) {
    this.players.push({ name: playerName, hand: [], score: 0, highCard: null });
  }

  async dealCards() {
    if (!this.deckId) throw new Error('Deck not initialized!');
    const res = await axios.get(
      `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${
        this.players.length * 3
      }`
    );
    const cards = res.data.cards;

    this.players.forEach((player, index) => {
      player.hand = cards.slice(index * 3, index * 3 + 3);
      player.score = this.calculateScore(player.hand);
      player.highCard = this.getHighCard(player.hand);
    });
  }

  calculateScore(hand) {
    const faceCards = ['JACK', 'QUEEN', 'KING'];

    const isThreeFaceCards = hand.every((card) =>
      faceCards.includes(card.value)
    );

    if (isThreeFaceCards) {
      return { score: '3 Tây', isSpecial: true }; // Trả về trường hợp đặc biệt
    }

    let total = 0;
    hand.forEach((card) => {
      const value = card.value;
      if (['JACK', 'QUEEN', 'KING'].includes(value)) total += 10;
      else if (value === 'ACE') total += 1;
      else total += parseInt(value, 10);
    });

    return { score: total % 10, isSpecial: false }; // Điểm từ 0-9
  }

  getHighCard(hand) {
    const rankOrder = {
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      JACK: 11,
      QUEEN: 12,
      KING: 13,
      ACE: 14,
    };
    const suitOrder = { SPADES: 1, CLUBS: 2, DIAMONDS: 3, HEARTS: 4 };

    return hand.reduce((highest, card) => {
      const cardRank = rankOrder[card.value];
      const cardSuit = suitOrder[card.suit];
      const highestRank = rankOrder[highest.value];
      const highestSuit = suitOrder[highest.suit];

      if (
        cardRank > highestRank ||
        (cardRank === highestRank && cardSuit > highestSuit)
      ) {
        return card;
      }
      return highest;
    });
  }

  determineWinner() {
    this.players.forEach((player) => {
      const result = this.calculateScore(player.hand);
      player.score = result.score;
      player.isSpecial = result.isSpecial;
      player.highCard = this.getHighCard(player.hand);
    });

    this.players.sort((a, b) => {
      if (b.isSpecial !== a.isSpecial) return b.isSpecial - a.isSpecial;

      if (b.score !== a.score) return b.score - a.score;

      const rankOrder = {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        JACK: 11,
        QUEEN: 12,
        KING: 13,
        ACE: 14,
      };
      const suitOrder = { SPADES: 1, CLUBS: 2, DIAMONDS: 3, HEARTS: 4 };

      const aHighRank = rankOrder[a.highCard.value];
      const aHighSuit = suitOrder[a.highCard.suit];
      const bHighRank = rankOrder[b.highCard.value];
      const bHighSuit = suitOrder[b.highCard.suit];

      if (bHighRank !== aHighRank) return bHighRank - aHighRank;
      return bHighSuit - aHighSuit;
    });

    return this.players[0];
  }
  createCanvasCtx({ money, index }) {
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgba(135, 35, 65, ${index < 0 ? 1 : index * 0.35})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFF6E9';
    ctx.font = '10px BVN';
    ctx.fontWeight = 'bold';
    ctx.fillText(vietnamTime().format('DD/MM/YYYY HH:mm:ss'), 5, 20);

    ctx.fillStyle = '#FFF6E9';
    ctx.font = '10px BVN';
    ctx.fontWeight = 'bold';
    ctx.fillText(`Số tiền bet: ${money.toLocaleString('en-US')}`, 5, 40);
    return { ctx, canvas };
  }

  sortForDraw() {
    return [...this.players].sort((a, b) => (a.name === BOT_NAME ? -1 : 1));
  }

  async drawCanvas(data) {
    const { ctx, canvas } = this.createCanvasCtx(data);
    const { width, height } = canvas;
    const drawData = this.sortForDraw();
    for (let i = 0; i < drawData.length; i++) {
      const player = drawData[i];
      const x = width / 2 - 150;
      const y = height / (9 - i) + i * 220;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px BVN';
      ctx.fillText(`${player.name}: ${player.score.score} điểm`, x, y);

      for (let j = 0; j < player.hand.length; j++) {
        const card = player.hand[j];
        const cardImg = await loadImage(card.image);
        ctx.drawImage(cardImg, x + j * 120, y + 30, 100, 150);
      }
    }

    const winner = this.determineWinner();
    ctx.fillStyle = '#F6FB7A';
    ctx.font = '30px BVN';
    ctx.fontWeight = 'bold';
    ctx.fillText(`Win: ${winner.name}`, width / 2 - 100, height - 50);

    return await canvas.encode('png');
  }

  async drawFakeCanvas(data) {
    const { ctx, canvas } = this.createCanvasCtx(data);
    const { width, height } = canvas;
    const drawData = this.sortForDraw();
    // Vẽ từng người chơi
    for (let i = 0; i < drawData.length; i++) {
      const player = drawData[i];
      const x = width / 2 - 150;
      const y = height / (9 - i) + i * 220;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px BVN';
      ctx.fillText(
        `${player.name}: ${
          player.name !== BOT_NAME ? '???' : player.score.score
        } điểm`,
        x,
        y
      );

      for (let j = 0; j < player.hand.length; j++) {
        const card = player.hand[j];
        const cardImg = await loadImage(
          j >= data.index && player.name !== BOT_NAME
            ? this.CARD_BACK_IMG_URL
            : card.image
        );
        ctx.drawImage(cardImg, x + j * 120, y + 30, 100, 150);
      }
    }

    return await canvas.encode('png');
  }
}

// Sử dụng
const startGame = async ({ username, money }) => {
  const game = new ThreeCardGame();
  await game.initializeDeck();
  game.addPlayer(username ?? 'Player');

  await game.dealCards();
  const fakeCanvas1 = await game.drawFakeCanvas({
    money: money ?? -1,
    index: 1,
  });
  const fakeCanvas2 = await game.drawFakeCanvas({
    money: money ?? -1,
    index: 2,
  });
  const finalCanvas = await game.drawCanvas({ money: money ?? -1, index: -1 });
  const winner = await game.determineWinner();

  return {
    fakeCanvas1,
    fakeCanvas2,
    finalCanvas,
    isWin: winner.name !== BOT_NAME,
  };
};

module.exports = { startGame };

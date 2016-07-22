const TelegramBot = require('node-telegram-bot-api');
const compliments = require('./compliments.json');
const sampleSize = require('lodash.samplesize');

const token = process.env.NODE_ENV;

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, msg => {
	const message = [
		'/random - случайный комплимент',
		'/random Х - Х случайных комплиментов',
		'/last - последний комплимент',
		'/last X - X последних комплиментов',
	].join('\n');
	bot.sendMessage(msg.from.id, message);
});

bot.onText(/\/random( ([0-9]+))*/, (msg, match) => {
  bot.sendMessage(msg.from.id, concatMessage(getRandom(match[1])));
});

bot.onText(/\/last( ([0-9]+))*/, (msg, match) => {
  bot.sendMessage(msg.from.id, concatMessage(getLast(match[1])));
});

bot.on('inline_query', msg => {
	bot.answerInlineQuery(msg.id, toInlineQuery(getRandom(5)));
})

function getRandom(n = 1) {
	return sampleSize(compliments, n);
}

function getLast(n = 1) {
	return compliments.slice().reverse().slice(0, n);
}

function concatMessage(list = []) {
	let message = '';
	list.map(item => {
		message = `${message}\n${item.text}`;
	});
	return message;
}

function toInlineQuery(list = []) {
	const articles = [];
	list.map((item, index) => {
		articles.push({
			type: 'article',
			id: `${Math.random()}`,
			title: item.text,
			cache_time: 60,
			input_message_content: {
				message_text: item.text
			},
			thumb_url: `https://s.dnlv.co/bots/complimentobot/flower${(index + 1)}.jpg`,
			thumb_width: 200,
			thumb_height: 200,
		});
	});
	return articles;
}

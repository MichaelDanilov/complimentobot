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

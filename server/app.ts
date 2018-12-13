import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as req from 'request-promise';
import * as cheerio from 'cheerio';
import * as  mcache from 'memory-cache';

var cache = (duration) => {
	return (request, response, next) => {
		let key = '__express__' + request.originalUrl || request.url
		let cachedBody = mcache.get(key)
		if (cachedBody) {
			response.send(cachedBody);
			return;
		} else {
			response.sendResponse = response.send;
			response.send = (body) => {
				mcache.put(key, body, duration * 1000);
				response.sendResponse(body);
			}
		}
		next();
	}
}

class App {
	public app: express.Application;
	private morgan: morgan.Morgan;

	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.app.use(morgan('dev'));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
	}

	routes() {
		this.app.route('/').get(cache(100), (request, res) => {
			setTimeout(() => {
				const url = 'https://www2.ufscar.br/restaurantes-universitario/cardapio';
				const result = req('https://www2.ufscar.br/restaurantes-universitario/cardapio').then(function (htmlString) {
					const s = cheerio.load(htmlString);

					const refeicoes = s('div.periodo').children();
					let lista = [];
					for (var i = 0; i < refeicoes.length; i++) {
						const sobremesa = refeicoes[i]['children'][13]['children'][3]['children'][0]['data'];
						const salada = refeicoes[i]['children'][11]['children'][3]['children'][0]['data'];
						const feijao = refeicoes[i]['children'][9]['children'][3]['children'][0]['data'];
						const arroz = refeicoes[i]['children'][7]['children'][3]['children'][0]['data'];
						const guarnicao = refeicoes[i]['children'][5]['children'][3]['children'][0]['data'];
						const prato = refeicoes[i]['children'][3]['children'][3]['children'][0]['data'];
						const dia = refeicoes[i]['children'][1]['children'][1]['children'][0]['data'];
						const dia_semana = refeicoes[i]['children'][1]['children'][5]['children'][0]['data'];
						const refeicao = refeicoes[i]['children'][1]['children'][9]['children'][0]['data'];
						lista.push({ 'data': dia, 'dia-semana': dia_semana, 'refeicao': refeicao, 'prato': prato, 'guarnicao': guarnicao, 'arroz': arroz, 'feijao': feijao, 'salada': salada, 'sobremesa': sobremesa });
					}

					return res.status(200).json(lista);
				})
			}, 0);
		});
	}
}

export default new App();
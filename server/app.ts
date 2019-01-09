import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import Parser from './parser';
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
		this.app.route('/cardapio').get(cache(100), (request, response) => {
			Parser.get_cardapio().then((cardapio) => {
				return response.status(200).json(cardapio);
			});
		});
	}
}

export default new App();
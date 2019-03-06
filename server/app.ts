import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import Parser from './parser';
import * as apicache from 'apicache';
import * as request_promise from 'request-promise';

let cache = apicache.middleware

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
		this.app.use(cors());
	}

	routes() {
		this.app.route('/foto/:ra').get((request, response) => {
			const URL_CARTEIRINHA = 'http://www.carteirinha.ufscar.br/fotos/';

			const ra: string = request.params.ra;
			const url = URL_CARTEIRINHA + ra + '.jpg';

			request_promise(url, { encoding: null }).then((data) => {
				return response.status(200).end(data);
			});
		});

		this.app.route('/cardapio').get(cache('60 minutes'), (request, response) => {
			Parser.get_cardapio_semana().then((cardapio) => {
				return response.status(200).json(cardapio);
			});
		});

		this.app.route('/cardapio/hoje').get(cache('60 minutes'), (request, response) => {
			let refeicao = request.params.refeicao;
			Parser.get_cardapio_hoje().then((cardapio) => {
				return response.status(200).json(cardapio);
			});
		});

		this.app.route('/cardapio/hoje/:refeicao').get(cache('60 minutes'), (request, response) => {
			let refeicao = request.params.refeicao;
			Parser.get_cardapio_hoje().then((cardapio) => {
				cardapio = cardapio.filter((item) => {
					return item.refeicao === refeicao;
				});
				return response.status(200).json(cardapio);
			});
		});
	}
}

export default new App();
import * as request_promise from 'request-promise';
import * as cheerio from 'cheerio';

class Parser {

	public async get_cardapio_semana() {
		const url: string = 'https://www2.ufscar.br/restaurantes-universitario/cardapio';

		let result: Array<{ 'data': string, 'dia-semana': string, 'refeicao': string, 'prato': string, 'guarnicao': string, 'arroz': string, 'feijao': string, 'salada': string, 'sobremesa': string }>;

		await request_promise(url).then(function (htmlString: string) {
			const cheerioStatic: CheerioStatic = cheerio.load(htmlString);

			const refeicoes: Cheerio = cheerioStatic('div.periodo').children();
			let lista: Array<{ 'data': string, 'dia-semana': string, 'refeicao': string, 'prato': string, 'guarnicao': string, 'arroz': string, 'feijao': string, 'salada': string, 'sobremesa': string }> = [];
			for (var i = 0; i < refeicoes.length; i++) {
				const sobremesa: string = refeicoes[i]['children'][13]['children'][3]['children'][0]['data'];
				const salada: string = refeicoes[i]['children'][11]['children'][3]['children'][0]['data'];
				const feijao: string = refeicoes[i]['children'][9]['children'][3]['children'][0]['data'];
				const arroz: string = refeicoes[i]['children'][7]['children'][3]['children'][0]['data'];
				const guarnicao: string = refeicoes[i]['children'][5]['children'][3]['children'][0]['data'];
				const prato: string = refeicoes[i]['children'][3]['children'][3]['children'][0]['data'];
				const dia: string = refeicoes[i]['children'][1]['children'][1]['children'][0]['data'];
				const dia_semana: string = refeicoes[i]['children'][1]['children'][5]['children'][0]['data'];
				const refeicao: string = refeicoes[i]['children'][1]['children'][9]['children'][0]['data'];
				lista.push({ 'data': dia, 'dia-semana': dia_semana, 'refeicao': refeicao, 'prato': prato, 'guarnicao': guarnicao, 'arroz': arroz, 'feijao': feijao, 'salada': salada, 'sobremesa': sobremesa });
			}
			result = lista;
		});
		return result;
	}

	public async get_cardapio_hoje() {
		const url: string = 'https://www2.ufscar.br/restaurantes-universitario/';
		let result: Array<{ 'data': string, 'dia-semana': string, 'refeicao': string, 'prato': string, 'guarnicao': string, 'arroz': string, 'feijao': string, 'salada': string, 'sobremesa': string }>;
		await request_promise(url).then(function (htmlString) {
			const cheerioStatic = cheerio.load(htmlString);
			const refeicoes = cheerioStatic('div.periodo').children();
			let lista: Array<{ 'data': string, 'dia-semana': string, 'refeicao': string, 'prato': string, 'guarnicao': string, 'arroz': string, 'feijao': string, 'salada': string, 'sobremesa': string }> = [];
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
			result = lista;
		});
		return result;
	}
}

export default new Parser();
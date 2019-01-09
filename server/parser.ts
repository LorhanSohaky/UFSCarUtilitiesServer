import * as request from 'request-promise';
import * as cheerio from 'cheerio';

class Parser {

	public async get_cardapio_semana() {
		const url = 'https://www2.ufscar.br/restaurantes-universitario/cardapio';
		let result;
		await request(url).then(function (htmlString) {
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
			result = lista;
		});
		return result;
	}
}

export default new Parser();
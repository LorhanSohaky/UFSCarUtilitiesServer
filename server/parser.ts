import * as request from 'request-promise';
class Parser {
	cardapio() {
		const url = 'https://www2.ufscar.br/restaurantes-universitario/cardapio';
		const result = request('https://www2.ufscar.br/restaurantes-universitario/cardapio').then(function (htmlString) {
			var doc = document.createElement('html');
			doc.innerHTML = htmlString;
			var elementos = [];
		});
	}
}
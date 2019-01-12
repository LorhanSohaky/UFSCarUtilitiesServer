import App from './app';

const port: number = Number(process.env.PORT) || 8080;

App.app.listen(port, () => console.log('Server on'));
import App from './app';

const port: number = Number(process.env.port) || 8080;

App.app.listen(port, () => console.log('Server on'));
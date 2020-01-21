import 'module-alias/register';
import App from './app';

const app = new App();
app.listen();

export default app.server;

const http = require('http');
const app = require('./src/app');
const models = require('./src/database/models');
const logger = require('./src/lib/logger');

const port = process.env.APP_PORT || 9010;
const hostname = process.env.APP_HOSTNAME || 'localhost';

/** Setup Application */
app.set('port', port);
app.set('hostname', hostname);

/** Create the Server */
const server = http.createServer(app);

models.sequelize.sync()
  .then(() => {
    server.listen(port, hostname, () => {
      logger.info(`Service listening on port ${server.address().port}`);
    });
  })
  .catch((error) => {
    logger.error(error);
    process.exit(0);
  });

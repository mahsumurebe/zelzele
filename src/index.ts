import 'config';
import {fromEvent, merge, Observable} from 'rxjs';
import {IProvider, IProviderResponse} from './Providers/types';
import {Signale} from 'signale';
import WS from './Servers/WS';

const logger = new Signale({
    scope: 'ZELZELE',
    types: {
        fatal: {
            label: '',
            badge: '->',
            color: 'red',
        },
    },
});

async function init() {
    logger.info('Starting WebSocket server.');
    const wsServer = new WS();
    await wsServer.listen();

    const newEarthquake = logger.scope('ZELZELE', 'NEW');
    logger.info(`Running providers.`);

    let observable: Observable<IProviderResponse>;
    const providers: { [key: string]: IProvider } = require('./Providers');
    const chalk = require('chalk');

    for (const provider of Object.values(providers)) {
        logger.debug(`Starting ${provider.providerName} provider.`);
        provider.run().catch(() => provider.stop());
        observable = merge<IProviderResponse>(fromEvent<IProviderResponse>(provider as any, 'data'));
    }

    observable.subscribe(value => {
        newEarthquake.fatal(`${chalk.red('EarthQuake')} ${chalk.blue('Date:')} ${value.date}\t${chalk.blue('Lat:')} ${value.lat}\t${chalk.blue('Long:')} ${value.long}\t${chalk.blue('Depth:')} ${value.depth}\t${chalk.blue('MD:')} ${isNaN(value.magnitude.local) ? '-.-' : value.magnitude.local}\t${chalk.blue('ML:')} ${isNaN(value.magnitude.moment) ? '-.-' : value.magnitude.moment}\t${chalk.blue('MW:')} ${isNaN(value.magnitude.duration) ? '-.-' : value.magnitude.duration}\t${chalk.blue('Location:')} ${value.location}`);
        wsServer.emit(value);
    });
}

init().catch(e => logger.fatal(e));
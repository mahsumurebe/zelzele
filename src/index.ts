import {fromEvent, merge, Observable} from 'rxjs';
import {IProvider, IProviderResponse} from './Providers/types';
import {Signale} from 'signale';

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

const newEarthquake = logger.scope('ZELZELE', 'NEW');
logger.info(`Running providers.`);

let observable: Observable<IProviderResponse>;
const providers: { [key: string]: IProvider } = require('./Providers');
const chalk = require('chalk');

for (const provider of Object.values(providers)) {
    logger.debug(`Starting ${provider.providerName} provider.`);
    provider.run().catch(e => provider.stop());
    observable = merge<IProviderResponse>(fromEvent<IProviderResponse>(provider as any, 'data'));
}

observable.subscribe(value => {
    newEarthquake.fatal(`${chalk.red('EarthQuake')} ${chalk.blue('Date:')} ${value.date.getUTCDate()}  ${chalk.blue('Lat:')} ${value.lat} ${chalk.blue('Lat:')} ${value.long} ${chalk.blue('Lat:')} ${value.depth} ${chalk.blue('MD:')} ${isNaN(value.magnitude.local) ? '-.-' : value.magnitude.local} ${chalk.blue('ML:')} ${isNaN(value.magnitude.moment) ? '-.-' : value.magnitude.moment} ${chalk.blue('MW:')} ${isNaN(value.magnitude.duration) ? '-.-' : value.magnitude.duration} ${chalk.blue('Location:')} ${value.location}`);
});
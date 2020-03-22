import {IProviderResponse} from '../../Providers/types';
import http from 'http';
import https from 'https';
import {IWSConfig} from './types';
import {IServer} from '../types';
import ws from 'ws';
import {Signale} from 'signale';

const signale = new Signale({
    scope: 'WS',
});
export default class WS implements IServer {
    private readonly server: http.Server | https.Server;
    private readonly wsServer: ws.Server;
    private config: IWSConfig;

    constructor() {
        this.config = {
            hostname: process.env.WS_SERVER_HOSTNAME,
            port: +(process.env.WS_SERVER_PORT || '3001'),
            https: {
                use: process.env.WS_SERVER_HTTPS_USE === 'true',
                certFile: process.env.WS_SERVER_HTTPS_CERT_FILE,
                privateKey: process.env.WS_SERVER_HTTPS_PRIVATE_KEY_FILE,
            },
        };
        //region HTTP/HTTPS Server
        if (this.config.https.use) {
            if (!this.config.https.certFile) {
                throw new Error('Certificate file is not defined.');
            } else if (!this.config.https.privateKey) {
                throw new Error('Private Key is not defined.');
            }


            const fs = require('fs');

            if (!fs.existsSync(this.config.https.certFile)) {
                throw new Error('Certificate file not found.');
            } else if (!fs.existsSync(this.config.https.privateKey)) {
                throw new Error('Private Key file not found.');
            }

            const privateKey = fs.readFileSync(this.config.https.privateKey, 'utf8');
            const certificate = fs.readFileSync(this.config.https.certFile, 'utf8');
            const credentials = {key: privateKey, cert: certificate};

            this.server = https.createServer(credentials);
        } else {
            this.server = http.createServer();
        }
        //endregion

        this.wsServer = new ws.Server({
            server: this.server,
        });
        this.wsServer.on('error', error => signale.error(`Websocket Error:`, error));
        this.wsServer.on('listening', () => {
            signale.log(`WebSocket server listening on ws${this.config.https.use ? 's' : ''}://${this.config.hostname}:${this.config.port}`);
        });
        this.wsServer.on('close', () => signale.info(`WebSocket server is closed.`));

    }

    async emit(data: IProviderResponse): Promise<this> {
        this.wsServer.clients.forEach(client => {
            client.send(JSON.stringify(data));
        });
        return this;
    }

    async listen(): Promise<void> {
        this.server.listen(this.config.port, this.config.hostname);
        return;
    }

}
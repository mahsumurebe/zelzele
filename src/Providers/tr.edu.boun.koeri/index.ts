import {IProvider, IProviderResponse} from '../types';
import Axios, {AxiosInstance} from 'axios';
import {EventEmitter} from 'events';

class TrEduBounKoeri extends EventEmitter implements IProvider {
    providerName = 'KRDAE BDTİM';
    url = 'http://www.koeri.boun.edu.tr/scripts/lst4.asp';
    request: AxiosInstance;

    private interval = 1000; // Interval ms
    private timeout: NodeJS.Timeout;
    private lastTime = 0;
    private stress = 0;

    constructor() {
        super();
        this.request = Axios.create({
            baseURL: this.url,
        });
    }

    async get(lastTime: number): Promise<Array<IProviderResponse>> {
        const self = this;
        return this.request
            .get<string>('')
            .then(data => {
                const out: IProviderResponse[] = [];
                const content = data.data;
                const regex = /^([0-9]{4}.[0-9]{2}.[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2})\s+([0-9]{1,2}\.[0-9]{0,4})\s+([0-9]{1,2}\.[0-9]{0,4})\s+([0-9]{1,2}\.[0-9]{0,4})\s+([0-9-]{1,2}\.[0-9-]{0,4})\s+([0-9-]{1,2}\.[0-9-]{0,4})\s+([0-9-]{1,2}\.[0-9-]{0,4})\s+([A-Z-()\s]+)\s.*$/gm;
                for (const i of content.matchAll(regex)) {
                    const [all, date, lat, long, depth, magnitude_local, magnitude_moment, magnitude_duration, location] = i;
                    out.push({
                        provide: {
                            name: self.providerName,
                            url: self.url,
                        },
                        date: new Date(date),
                        lat,
                        long,
                        depth,
                        magnitude: {
                            local: +magnitude_local,
                            moment: +magnitude_moment,
                            duration: +magnitude_duration,
                        },
                        location,
                    });
                }
                return out.filter(item => {
                    return item.date.getTime() > lastTime;
                });
            });
    }

    async run(): Promise<void> {
        const self = this;
        this.timeout = setTimeout(() => {
            self.get(self.lastTime)
                .then((data) => {
                    if (data.length > 0) {
                        for (const item of data) {
                            if (this.lastTime < item.date.getTime()) {
                                this.lastTime = item.date.getTime();
                            }
                            self.emit('data', item);
                        }
                    }
                    setTimeout(() => self.run(), this.interval);
                })
                .catch((e) => {
                    if (this.stress > 5) {
                        return self.stop();
                    }
                    self.stress++;
                });
        }, this.interval);
        return;
    }

    async stop(): Promise<void> {
        clearTimeout(this.lastTime);
        return;
    }
}

const provide = new TrEduBounKoeri();
export default provide;
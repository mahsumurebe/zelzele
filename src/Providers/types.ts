export interface IProvider {
    providerName: string;
    url: string;

    get(lastTime: number): Promise<Array<IProviderResponse>>;

    run(): Promise<void>;

    stop(): Promise<void>;
}

export interface IProviderResponse {
    provide: {
        name: string;
        url: string;
    }
    date: Date;
    lat: string;
    long: string;
    depth: string;
    magnitude: {
        local: number;
        moment: number;
        duration: number;
    };
    location: string;
}
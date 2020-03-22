export interface IWSConfig {
    hostname: string;
    port: number;
    pathname?: string;
    https?: {
        use: boolean;
        certFile: string;
        privateKey: string;
    },
}
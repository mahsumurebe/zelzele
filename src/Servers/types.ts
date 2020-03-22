import {IProviderResponse} from '../Providers/types';

export interface IServer {
    emit(data: IProviderResponse): Promise<this>

    listen(): Promise<void>;
}
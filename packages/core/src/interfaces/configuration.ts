import { LoggerLevel } from './cdmlogger';

export interface Appender {
    type: string;
    [key: string]: any;
}
export interface Configuration {
    appenders: { [name: string]: Appender; };
    categories: { [name: string]: { appenders: string[]; level: string; enableCallStack?: boolean; } };
    pm2?: boolean;
    pm2InstanceVar?: string;
    levels?: LoggerLevel[];
    disableClustering?: boolean;
}


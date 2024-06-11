declare module 'bunyan-logstash-amqp' {
  interface IBunyanLogstashAmqp {
    createStream(options?: IBunyanLogstashAmqpOptions): NodeJS.WritableStream;
  }

  interface IBunyanLogstashAmqpOptions {
    exchange: string | IBunyanLogstashAmqpExchangeOptions;
    host?: string;
    port?: number;
    vhost?: string;
    login?: string;
    password?: string;
    level?: string;
    server?: string;
    application?: string;
    pid?: string;
    tags?: string[];
    type?: string;
    bufferSize?: number;
    sslEnable?: boolean;
    sslKey?: string;
    sslCert?: string;
    sslCA?: string;
    sslRejectUnauthorized?: boolean;
    messageFormatter?: (message: any) => any;
  }

  interface IBunyanLogstashAmqpExchangeOptions {
    name: string;
    properties: any;
  }

  const instance: IBunyanLogstashAmqp;

  export = instance;
}

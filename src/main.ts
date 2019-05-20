import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { async } from "rxjs/internal/scheduler/async";

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', reason => {
  console.error(reason);
});

process.on('uncaughtException', reason => {
  console.error(reason);
});

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    try {
      // const expressApp = require('express')();
      const nestApp = await NestFactory.create(AppModule);
      nestApp.use(eventContext());
      await nestApp.init();
      cachedServer = createServer(nestApp.getHttpAdapter().getInstance(), undefined, binaryMimeTypes);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.resolve(cachedServer);
}

export const initializer = async (context, callback) => {
  cachedServer = await bootstrapServer();
  callback()
};

export const handler: Handler = async (
  event: any,
  context: Context,
  callback,
) => {
  console.log(event.toString());
  proxy(cachedServer, JSON.parse(event.toString()), context, 'CALLBACK', callback);
  // callback(null, {
  //   statusCode: 200,
  //   body: {
  //     data: {
  //       hello: 'Hello world1 nest!',
  //     },
  //   },
  // });
};

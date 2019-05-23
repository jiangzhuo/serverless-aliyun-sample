import { buffer } from "rxjs/operators";
import { Stream } from "stream";

const OSS = require('ali-oss');
const Busboy = require('busboy');
const inspect = require('util').inspect;
const hasha = require('hasha');
const mime = require('mime');

module.exports.handler = function (event, context, callback) {
    console.log(event.toString());
    // let event = {
    //     "body": "LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTI3NTYyNzQ3NTg2ODAwMTEwMjM0NjQzNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJhYWFhIg0KDQpmZmZmZg0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTI3NTYyNzQ3NTg2ODAwMTEwMjM0NjQzNy0tDQo=",
    //     "headers": {
    //         "Accept": "*/*",
    //         "Postman-Token": "faa93db8-5093-49f2-94f1-1ad267c08ba0",
    //         "content-type": "multipart/form-data; boundary=--------------------------275627475868001102346437",
    //         "cache-control": "no-cache",
    //         "accept-encoding": "gzip, deflate"
    //     },
    //     "httpMethod": "POST",
    //     "isBase64Encoded": true,
    //     "path": "/upload",
    //     "pathParameters": {},
    //     "queryParameters": {}
    // }
    // console.log(Buffer.from(JSON.parse(event.toString()).body,'base64').toString())

    let finalFile;
    let finalMimeType;
    let finalEncoding;
    let finalFileStream;

    const parsedEvent = JSON.parse(event.toString());

    const busboy = new Busboy({ headers: parsedEvent.headers });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        finalEncoding = encoding;
        finalMimeType = mimetype;
        finalFileStream = file;


        // const client = new OSS({
        //     region: `oss-${context.region}`,
        //     accessKeyId: context.credentials.accessKeyId,
        //     accessKeySecret: context.credentials.accessKeySecret,
        //     stsToken: context.credentials.securityToken,
        //     bucket: 'fc-upload-test',
        //     internal: true
        // });

        // client.putStream("test/aaaaa.jpeg", file).then((result) => {
        //     console.log("test/aaaaa.jpeg finished")
        // }).catch((error) => {
        // });

        let buffers = [];
        console.log('File [' + fieldname + ']: filename: ' + filename);
        file.on('data', function (data) {
            buffers.push(data)
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function () {
            finalFile = Buffer.concat(buffers);
            console.log(finalFile.toString('hex'));
            console.log(`File [${fieldname}] Finished Encoding [${encoding}] MimeType ${mimetype}`);
        });
    });
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function () {
        console.log('Done parsing form!');
        const client = new OSS({
            region: `oss-${context.region}`,
            accessKeyId: context.credentials.accessKeyId,
            accessKeySecret: context.credentials.accessKeySecret,
            stsToken: context.credentials.securityToken,
            bucket: 'fc-upload-test',
            internal: true
        });

        const fileName = `${hasha(finalFile, { algorithm: 'md5' })}.${mime.getExtension(finalMimeType)}`;
        const filename = `test/${fileName}`;
        client.put(filename, finalFile).then((result) => {
            console.log(result);
            callback(null, { statusCode: 200, body: "ok" });
        }).catch((error) => {
            //todo
            callback(error);
        });
        // client.putStream(filename, finalFileStream).then((result) => {
        //     callback(null, { statusCode: 200, body: "ok" });
        // }).catch((error) => {
        //     //todo
        //     callback(error);
        // });
    });

    const Readable = require('stream').Readable;
    const s = new Readable();
    s.push(Buffer.from(JSON.parse(event.toString()).body, 'base64').toString());
    s.push(null);
    s.pipe(busboy);

    // console.log(context);
    // callback(null, { statusCode: 200, body: "ok" });
};
//# sourceMappingURL=upload.js.map

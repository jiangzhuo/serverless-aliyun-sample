const getRawBody = require('raw-body');
const getFormBody = require('body/form');
const body = require('body');
const OSS = require('ali-oss');

/*
if you open the initializer feature, please implement the initializer function, as below:
module.exports.initializer = function(context, callback) {
    console.log('initializing');
    callback(null, '');
};
*/

module.exports.handler = function(req, resp, context) {
    console.log('hello world');
    console.log(context);
    // let context = {
    //     requestId: 'ac4cdf28-cf57-614c-30d6-e906c0f950e5',
    //     credentials:
    //         {
    //             accessKeyId: 'STS.NJcqufiQUimcosDvPzvGvWLMP',
    //             accessKeySecret: 'DMCcxvpC8RSqFyj3s4VZgLSDGaF4bruSHE94KJbJN8D3',
    //             securityToken: 'CAISlgJ1q6Ft5B2yfSjIr4nWOs/ShI503q+IbVX1klAveshauInmsjz2IHlFeXBoAekZs/QymWhX5/gflqZdVplOWU3Da+B364xK7Q756gR/PAnwv9I+k5SANTW5KXyShb3/AYjQSNfaZY3eCTTtnTNyxr3XbCirW0ffX7SClZ9gaKZ8PGD6F00kYu1bPQx/ssQXGGLMPPK2SH7Qj3HXEVBjt3gX6wo9y9zmk5XDu0WP1gyim7RF+d+sGPX+MZkwZqUYesyuwel7epDG1CNt8BVQ/M909vcdqGqe5onEXAQBvkjebLuKr8cvNwtiI7M3AbBJtvzxjuY9s+jShpnxjgpAJv0QXynBAY2wzcCBAuStO8aH+Dd8t+ksuRqAAYjBqqnNqBJZNjMZMEB8W4Bx7hR8FglBs44zr4X6o+Pw8nOAI7PMoJfVGtFaIpVvlHCW+h9xq+dQGAlDw75bXv/y1KoIEJ7Ev56IGFhZWaueMpllYm6CgtnGwFj+FZRmzY0G5fTZfHOc8Eos0UKaDwmT+T3Lwc3v0AUrnAyhdV6y'
    //         },
    //     function:
    //         {
    //             name: 'upload',
    //             handler: 'index.handler',
    //             memory: 128,
    //             timeout: 60,
    //             initializer: undefined,
    //             initializationTimeout: NaN
    //         },
    //     service:
    //         {
    //             name: 'serverless-aliyun-test-dev',
    //             logProject: 'sls-1907979290938635-logs',
    //             logStore: 'serverless-aliyun-test-dev',
    //             qualifier: 'LATEST',
    //             versionId: ''
    //         },
    //     region: 'cn-shanghai',
    //     accountId: '1907979290938635'
    // }

    var params = {
        path: req.path,
        queries: req.queries,
        headers: req.headers,
        method : req.method,
        requestURI : req.url,
        clientIP : req.clientIP,
    }

    // let a = {
    //     "path": "/",
    //     "queries": {},
    //     "headers": {
    //         "accept": "text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2",
    //         "cache-control": "no-cache",
    //         "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    //         "pragma": "no-cache",
    //         "user-agent": "Java/1.8.0_152"
    //     },
    //     "method": "POST",
    //     "requestURI": "/2016-08-15/proxy/serverless-aliyun-test-dev.LATEST/upload/",
    //     "clientIP": "106.11.231.199",
    //     "body": ""
    // }

    // getRawBody(req, function(err, body) {
    //
    //     for (var key in req.queries) {
    //         var value = req.queries[key];
    //         resp.setHeader(key, value);
    //     }
    //     params.body = body.toString();
    //     resp.send(JSON.stringify(params, null, '    '));
    // });

    getFormBody(req, function(err, formBody) {
        const client = new OSS({
            region: `oss-${context.region}`,
            accessKeyId: context.credentials.accessKeyId,
            accessKeySecret: context.credentials.accessKeySecret,
            bucket: 'fc-upload-test',
            internal: true
        });
        console.log(client)
        // client.listBuckets().then((result)=>{
        //     console.log(result)
        // })


        for (var key in req.queries) {
          var value = req.queries[key];
          resp.setHeader(key, value);
        }
        params.body = formBody;
        console.log(formBody);
        resp.send(JSON.stringify(params));
    });
}

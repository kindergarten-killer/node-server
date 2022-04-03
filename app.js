const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const parameter = require('koa-parameter')
const Router = require('koa-router')
const error = require('koa-json-error')
const app = new Koa();
const Log = require('./log4/logger');

app.use(Log({
    env: app.env,  // koa 提供的环境变量
    projectName: 'back-API',
    appLogLevel: 'debug',
    dir: 'logs',
    serverIp: '192.168.108.100'
}))
app.use(bodyParser());  // 解析request的body
app.use(parameter(app))
app.use(error({
    postFormat:( e, {stack,name,...rest}) => {
        if(process.env.NODE_ENV === 'production') {
            console.log(rest)
            switch(rest.status) {
                case 500:
                    rest.message = '服务器内部错误';
                    break
                case 422:
                case 400:
                    rest.message = '参数出错';
                    rest.status = 400;
                    break
                case 404:
                    rest.message = '请求不存在';
                    break
                case 401:
                    rest.message = '会话过期，请重新登陆'
                    break
            }
            return {message: rest.message, status: rest.status}
        } else {
            return {stack, name, ...rest}
        }
    }
}))

const router = new Router()

router.get('/', async (ctx, next) => {
})


router.get('/user', async (ctx, next) => {
    ctx.verifyParams({
        id:{type:'number',required:true},
        title:{type: 'string', required: false}
    })
    ctx.body = 'hello world'
})

app.use(router.routes());
// response
app.use(async ctx => {
    
})

app.listen(3000)
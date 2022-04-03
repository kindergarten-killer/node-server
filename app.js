const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const parameter = require('koa-parameter')
const error = require('koa-json-error')
const Router = require("koa-router");
const app = new Koa();
const log4js = require('./log4js/log4js')
//requireDirectory是一个直接导出的方法
const requireDirectory = require("require-directory");
//监听端口号
const port = '3000';
//服务端地址
const host = '0.0.0.0'

/*
*日志处理模块，包含错误日志，响应日志
**/
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  log4js.resLogger(ctx, ms)
})

// error-handling
app.on('error', (err, ctx) => {
  log4js.errLogger(ctx, err)
  console.error('server error', err)
})



app.use(bodyParser());  // 解析request的body
app.use(parameter(app)) //参数验证

/*
*全局请求错误处理
**/
app.use(error({
    postFormat:( e, {stack,name,...rest}) => {
        if(process.env.NODE_ENV === 'production') {

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

/*
*加载所有路由并挂载
**/
function whenLoadModule(router) {
    if (router instanceof Router)
      app.use(router.routes()).use(router.allowedMethods());
}  

//requireDirectory方法也支持opitons参数，配置响应的回调函数
requireDirectory(module, "./router", { visit: whenLoadModule });

app.listen(port, host, () => {
    console.log(`API server listening on ${host}:${port}`);
})
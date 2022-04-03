const getLog = ({ env, appLogLevel, dir }, name) => {

    //log4js基本说明配置项，可自定义设置键名，用于categories.appenders自定义选取
    let appenders = {
        // 自定义配置项1
        cheese: {
            type: 'dateFile', //输出日志类型
            filename: `${dir}/task`,  //输出日志路径
            pattern: '-yyyy-MM-dd.log', //日志文件后缀名（task-2019-03-08.log）
            alwaysIncludePattern: true
        }
    }
    // 如果为开发环境配置在控制台上打印信息
    if (env === "dev" || env === "local" || env === "development") {
        // 自定义配置项2
        appenders.out = {
            type: "stdout"
        }
    }
    // log4js配置
    let config = {
        appenders,
        //作为getLogger方法获取log对象的键名，default为默认使用
        categories: {
            default: {
                appenders: Object.keys(appenders), // 取appenders中的说有配置项
                level: appLogLevel
            }
        }
    }
    log4js.configure(config) //使用配置项
    return log4js.getLogger(name)// 这个cheese参数值先会在categories中找，找不到就会默认使用default对应的appenders,信息会输出到yyyyMMdd-out.log
}

module.exports = (options) => {
    const contextLogger = {}; //后期赋值给ctx.log
    const { env, appLogLevel, dir, serverIp, projectName } = Object.assign({}, baseInfo, options || {});
    // 取出通用配置（项目名，服务器请求IP）
    const commonInfo = { projectName, serverIp };

    const logger = getLog({env, appLogLevel, dir},'cheese');

    return async (ctx, next) => {
        const start = Date.now(); //日志记录开始时间
        // 将日志类型赋值ctx.log，后期中间件特殊位置需要记录日志，可直接使用ctx.log.error(err)记录不同类型日志
        methods.forEach((method, i) => {
            contextLogger[method] = (message) => {
                logger[method](logInfo(ctx, message, commonInfo))
            }
        })
        ctx.log = contextLogger;
        // 执行中间件
        await next()
        // 结束时间
        const responseTime = Date.now() - start;
        // 将执行时间记录logger.info
        logger.info(logInfo(ctx,
            {
                responseTime: `响应时间为${responseTime/1000}s`
            }, commonInfo)
        )
    }
}
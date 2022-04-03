# node-server
node服务端构建
### 项目描述
  本项目是使用koa来搭建，尽可能同企业项目一样搭建，方便自己更快熟悉并上手node来开发
# 项目构建技术栈
1. 请求体解析koa-bodyparser
2. 参数校验koa-parameter
3. 路由转发koa-router
4. 请求错误处理koa-json-error
5. 错误响应日志记录log4js
6. 直接导出文件require-directory
# 待完善技术构建
1. 鉴权处理jwt
2. 接入数据库（还待考量）
3. 引入webpack，保证项目的打包
4. router逻辑分controller编写
5. 每个module由类与类实现
6. 跨域处理
7. 响应码统一处理
8. 是否支持国际化
9. 搭建koa-cli
10. 搭建docker
11. 配置nignx
# 待补充
暂时还没想到
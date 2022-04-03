const Router = require('koa-router')
const router = new Router({
    prefix: '/tables'
})


router.get('/', async (ctx, next) => {
    ctx.body = 'list'
})

router.get('/list', async (ctx, next) => {
    ctx.body = 'get lsit'
})



module.exports = router
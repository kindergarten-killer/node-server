const Router = require('koa-router')
const router = new Router({
    prefix: '/users'
})


router.get('/', async () => {
    ctx.body = '收i'
})

router.get('/login', async (ctx, next) => {
    ctx.verifyParams({
        username: { type: 'string', required: true },
        password: { type: 'string', required: true }
    })
    ctx.body = 'loggin'
})







module.exports = router
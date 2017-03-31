const koa = require('koa');
const hbs = require('..');

const app = koa();

// koa-hbs is middleware. Use it before you want to render a view
app.use(hbs.middleware({
  viewPath: __dirname + '/views'
}));

// Render is attached to the koa context. Call ctx.render in your middleware
// to attach your rendered html to the response body.
app.use(async (ctx) => {
  await ctx.render('main', {title: 'koa-hbs'});
});

app.listen(3000);

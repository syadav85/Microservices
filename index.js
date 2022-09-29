
var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'product', cmd: 'add' }, function (msg, respond) {
        this.make('product').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'product', cmd: 'get' }, function (msg, respond) {
        this.make('product').load$(msg.data.product_id, respond);
    });

    seneca.add({ role: 'product', cmd: 'get-all' }, function (msg, respond) {
        this.make('product').list$({}, respond);
    });

    seneca.add({ role: 'product', cmd: 'delete' }, function (msg, respond) {
        this.make('product').remove$(msg.data.product_id, respond);
    });

    seneca.add({ role: 'product', cmd: 'delete-all' }, function (msg, respond) {
        this.make('product').remove$({}, respond);
    });


}

module.exports = plugin;



var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd:add-product', function (args, done) {
    console.log("--> cmd:add-product");
    var product = {
        product: args.product,
        price: args.price,
        category: args.category
    }
    console.log("--> product: " + JSON.stringify(product));
    seneca.act({ role: 'product', cmd: 'add', data: product }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-products', function (args, done) {
    console.log("--> cmd:get-all-products");
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-product', function (args, done) {
    console.log("--> cmd:get-product, args.product_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'get', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-product', function (args, done) {
    console.log("--> cmd:delete-product, args.product_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'delete', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-products', function (args, done) {
    console.log("--> cmd:delete-all-products");
    seneca.act({ role: 'product', cmd: 'delete-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.act('role:web', {
    use: {
        prefix: '/products',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-product': { POST: true },
            'get-all-products': { GET: true },
            'get-product': { GET: true, },
            'delete-product': { GET: true, },
            'delete-all-products': { GET: true, }
        }
    }
})

let countGET = 0;
let countPOST = 0;

function countMiddleWare(req, res, next) {
    if(req.method === "GET")countGET++;
    if(req.method === "POST")countPOST++;
    console.log("Processed Request Count -> Get: " + countGET+ " , Post: "+ countPOST);
    if(next)next();
}

var express = require('express');
var app = express();
app.use(countMiddleWare);
app.use(require("body-parser").json())
app.use(seneca.export('web'));


app.listen(3009)
console.log("Server is listening at localhost:3009/");
console.log("----- Endpoints -------------------------");
console.log("http://localhost:3009/products/add-product?product=Laptop&price=201.99&category=PC");
console.log("http://localhost:3009/products/get-all-products");
console.log("http://localhost:3009/products/get-product?product_id=12345");
console.log("http://localhost:3009/products/delete-product?product_id=12345");
console.log("http://localhost:3009/products/delete-all-products");
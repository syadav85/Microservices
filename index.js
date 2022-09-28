
var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'employee', cmd: 'add' }, function (msg, respond) {
        this.make('employee').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'employee', cmd: 'get' }, function (msg, respond) {
        this.make('employee').load$(msg.data.user_id, respond);
    });

    seneca.add({ role: 'employee', cmd: 'get-all' }, function (msg, respond) {
        this.make('employee').list$({}, respond);
    });

    seneca.add({ role: 'employee', cmd: 'delete' }, function (msg, respond) {
        this.make('employee').remove$(msg.data.user_id, respond);
    });


}

module.exports = plugin;



var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd:add-user', function (args, done) {
    console.log("--> cmd:add-user");
    var employee = {
        firstname: args.firstname,
        lastname: args.lastname,
        position: args.position
    }
    console.log("--> employee: " + JSON.stringify(employee));
    seneca.act({ role: 'employee', cmd: 'add', data: employee }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-users', function (args, done) {
    console.log("--> cmd:get-all-users");
    seneca.act({ role: 'employee', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-user', function (args, done) {
    console.log("--> cmd:get-user, args.user_id: " + args.user_id);
    seneca.act({ role: 'employee', cmd: 'get', data: { user_id: args.user_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-user', function (args, done) {
    console.log("--> cmd:delete-user, args.user_id: " + args.user_id);
    seneca.act({ role: 'employee', cmd: 'delete', data: { user_id: args.user_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-users', function (args, done) {
    done(null, { cmd: "delete-all-users" });
});

seneca.act('role:web', {
    use: {
        prefix: '/abservice',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-user': { GET: true },
            'get-all-users': { GET: true },
            'get-user': { GET: true, },
            'delete-user': { GET: true, }
        }
    }
})
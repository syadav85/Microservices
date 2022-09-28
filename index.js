
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



"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var message_schema_1 = require("./message.schema");
var repository_1 = require("../repository");
var MessageRepository = (function (_super) {
    __extends(MessageRepository, _super);
    function MessageRepository() {
        _super.call(this, message_schema_1.MessageSchema);
    }
    MessageRepository.Instance = function () {
        if (MessageRepository._instance)
            return MessageRepository._instance;
        MessageRepository._instance = new MessageRepository();
        return MessageRepository._instance;
    };
    MessageRepository.prototype.retrieveWithUser = function (callback) {
        this._model
            .find()
            .populate("user", "_id email loggedIn")
            .exec(function (error, messages) {
            console.log(JSON.stringify(messages));
            callback(null, messages);
        });
    };
    MessageRepository._instance = null;
    return MessageRepository;
}(repository_1.RepositoryBase));
Object.seal(MessageRepository);
var r = MessageRepository.Instance();
exports.MessageRepository = r;

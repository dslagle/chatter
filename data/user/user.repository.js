"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var user_schema_1 = require("./user.schema");
var repository_1 = require("../repository");
var UserRepository = (function (_super) {
    __extends(UserRepository, _super);
    function UserRepository() {
        _super.call(this, user_schema_1.UserSchema);
    }
    UserRepository.Instance = function () {
        if (UserRepository._instance)
            return UserRepository._instance;
        UserRepository._instance = new UserRepository();
        return UserRepository._instance;
    };
    UserRepository._instance = null;
    return UserRepository;
}(repository_1.RepositoryBase));
Object.seal(UserRepository);
var r = UserRepository.Instance();
exports.UserRepository = r;

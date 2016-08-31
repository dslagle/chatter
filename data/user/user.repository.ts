import { IUser, UserSchema } from "./user.schema";
import { RepositoryBase } from "../repository";

class UserRepository extends RepositoryBase<IUser> {
    private static _instance: UserRepository = null;

    static Instance(): UserRepository {
        if (UserRepository._instance) return UserRepository._instance;

        UserRepository._instance = new UserRepository();
        return UserRepository._instance;
    }

    constructor () {
        super(UserSchema);
    }
}

Object.seal(UserRepository);
let r = UserRepository.Instance();

export{ r as UserRepository }
import * as mongoose from "mongoose";

export class RepositoryBase<T extends mongoose.Document> {
    protected _model: mongoose.Model<T>;

    constructor (schemaModel: mongoose.Model<T>) {
        this._model = schemaModel;
    }

    create (item: T, callback: (error: any, result: T) => void) {
        this._model.create(item, callback);
    }

    retrieve (query: any, callback: (error: any, result: T[]) => void) {
        this._model.find(query, callback);
    }

    retrieveOne (query: any, callback: (error: any, result: T) => void) {
        this._model.findOne(query, callback);
    }

    retrieveColumns (query: any, columns: string, callback: (error: any, result: T[]) => void) {
        this._model.find(query, columns, callback);
    }

    update (_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: T) => void) {
        this._model.update({_id: _id}, item, callback);
    }

    delete (_id: string, callback: (error: any, result: T) => void) {
        this._model.remove({_id: this.toObjectId(_id)}, (err) => callback(err, null));
    }

    findById (_id: string, callback: (error: any, result: T) => void) {
        this._model.findById( _id, callback);
    }

    private toObjectId (_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    }
}
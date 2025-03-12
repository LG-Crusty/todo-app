import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const User = new Schema({
  author: ObjectId,
  username: String,
  email: String,
  password: String,
});

const Todo = new Schema({
task: String,
done: Boolean,
userid : ObjectId
});

const UserModel = mongoose.model("user-data", User)
const TodoModel = mongoose.model("todo-data", Todo)

export {UserModel, 
  TodoModel}
    

  
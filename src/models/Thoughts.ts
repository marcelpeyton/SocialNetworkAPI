import { Schema, model, Document, ObjectId } from 'mongoose';
import mongoose from 'mongoose';

interface IThoughts extends Document {
  thoughtText: string,
  createdAt: Date,
  username: string,
  reactions: IReactions[],
}

interface IReactions extends Document {
  reactionBody: String,
  username: string,
  createdAt: Date,
  reactionId: ObjectId,
}
const reactionsSchema = new Schema<IReactions>({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
    reactionBody : {
      type: String,
      require: true,
      maxLength: 280,
    },
    username: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt : any) => {return createdAt.toISOString().split("T") [0];},
    },
})
const thoughtsSchema = new Schema<IThoughts>(
  {
    thoughtText:{
      type: String,
      require: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt : any) => {return createdAt.toISOString().split("T") [0];},
    },
    username: {
      type: String,
      require: true,
    },
    reactions: {
      reaction: [reactionsSchema],
    }
  },
  {
    // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    toJSON: {
      virtuals: true,
    },
    id: false,
  }  
);

thoughtsSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length
  });

const Thoughts = model('Thoughts', thoughtsSchema);
export default Thoughts;




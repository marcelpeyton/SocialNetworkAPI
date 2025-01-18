import { Schema, model, Document, ObjectId } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  thoughts: ObjectId[];
  friends: ObjectId[];
}


const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true, 
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true, 
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Email format is incorrect.',
      },
    },
    friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    ],
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thoughts',
      },
    ],
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

userSchema
  .virtual('friendCount')
  // Getter
  .get(function (this: IUser) {
    return this.friends?.length;
  });

// Initialize our User model
const User = model('user', userSchema);

export default User;

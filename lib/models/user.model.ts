import mongoose from "mongoose";

//one user can have multiple threads, and multiple communities
const userSchema = new mongoose.Schema({
  id: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  name: { type: String, require: true },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread'
    }
  ],
  onboarded: {
    type: Boolean,
    default: false
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community'
    }
  ]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);//in the first time, mongoose.models.User does not exist yet, so we need to use the fallback

export default User;
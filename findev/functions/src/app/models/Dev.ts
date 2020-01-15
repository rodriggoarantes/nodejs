import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface Dev extends Document {
  name: string;
  githubUsername: string;
  bio?: string;
  avatarUrl?: string;
  techs?: Array<string>;
}

const DevSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  githubUsername: { type: String, required: true },
  bio: { type: String, required: false },
  avatarUrl: { type: String, required: false },
  techs: { type: [String] }
});

export default mongoose.model<Dev>('Dev', DevSchema);

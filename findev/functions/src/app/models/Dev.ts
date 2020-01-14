import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface Dev extends Document {
  email: string;
  name: string;
  lastName: string;
}

const DevSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
});

export default mongoose.model<Dev>('Dev', DevSchema);

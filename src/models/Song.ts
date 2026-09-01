import mongoose, { Document, Schema } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Indexes for faster stats queries
songSchema.index({ genre: 1 });
songSchema.index({ artist: 1 });
songSchema.index({ album: 1 });

export default mongoose.model<ISong>('Song', songSchema);
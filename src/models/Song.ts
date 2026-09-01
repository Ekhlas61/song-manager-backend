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
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'title cannot be empty',
      },
    },
    artist: {
      type: String,
      required: [true, 'artist is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'artist cannot be empty',
      },
    },
    album: {
      type: String,
      required: [true, 'album is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'album cannot be empty',
      },
    },
    genre: {
      type: String,
      required: [true, 'genre is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'genre cannot be empty',
      },
    },
  },
  { timestamps: true }
);

// Indexes for faster stats queries
songSchema.index({ genre: 1 });
songSchema.index({ artist: 1 });
songSchema.index({ album: 1 });

export default mongoose.model<ISong>('Song', songSchema);
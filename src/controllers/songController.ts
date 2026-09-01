import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Song, { ISong } from '../models/Song';

type SongFilter = Partial<Record<'title' | 'artist' | 'album' | 'genre', RegExp>> & {
  $or?: Array<Record<string, RegExp>>;
};

const toTrimmedString = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.length > 0 && typeof value[0] === 'string' ? value[0].trim() : '';
  }

  return typeof value === 'string' ? value.trim() : '';
};

const ensureValidSongId = (req: Request, res: Response): boolean => {
  const songId = typeof req.params.id === 'string' ? req.params.id : '';

  if (!mongoose.Types.ObjectId.isValid(songId)) {
    res.status(400).json({ message: 'Invalid song ID' });
    return false;
  }

  return true;
};

// CREATE
export const createSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = toTrimmedString(req.body.title);
    const artist = toTrimmedString(req.body.artist);
    const album = toTrimmedString(req.body.album);
    const genre = toTrimmedString(req.body.genre);

    if (!title || !artist || !album || !genre) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const song = await Song.create({ title, artist, album, genre });
    res.status(201).json(song);
  } catch (error) {
    next(error);
  }
};

// READ ALL (with optional filter)
export const getSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genre = toTrimmedString(req.query.genre);
    const artist = toTrimmedString(req.query.artist);
    const album = toTrimmedString(req.query.album);
    const search = toTrimmedString(req.query.search);
    const filter: SongFilter = {};

    if (genre) filter.genre = new RegExp(genre, 'i');
    if (artist) filter.artist = new RegExp(artist, 'i');
    if (album) filter.album = new RegExp(album, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { artist: new RegExp(search, 'i') },
        { album: new RegExp(search, 'i') },
      ];
    }

    const songs = await Song.find(filter).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

// READ ONE
export const getSongById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!ensureValidSongId(req, res)) return;

    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!ensureValidSongId(req, res)) return;

    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!ensureValidSongId(req, res)) return;

    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// STATISTICS (rich stats)
export const getStatistics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Song.distinct('artist').then((a) => a.length);
    const totalAlbums = await Song.distinct('album').then((a) => a.length);
    const totalGenres = await Song.distinct('genre').then((g) => g.length);

    const songsPerGenre = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const artistStats = await Song.aggregate([
      {
        $group: {
          _id: '$artist',
          songCount: { $sum: 1 },
          albums: { $addToSet: '$album' },
        },
      },
      {
        $project: {
          artist: '$_id',
          songCount: 1,
          albumCount: { $size: '$albums' },
          albums: 1,
        },
      },
      { $sort: { songCount: -1 } },
    ]);

    const songsPerAlbum = await Song.aggregate([
      { $group: { _id: { album: '$album', artist: '$artist' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    res.json({
      overview: {
        totalSongs,
        totalArtists,
        totalAlbums,
        totalGenres,
      },
      songsPerGenre,
      artistStats,
      songsPerAlbum,
    });
  } catch (error) {
    next(error);
  }
};
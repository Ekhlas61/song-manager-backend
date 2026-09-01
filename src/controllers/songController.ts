import { Request, Response, NextFunction } from 'express';
import Song from '../models/Song';

// CREATE
export const createSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, artist, album, genre } = req.body;
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
    const { genre, artist, album, search } = req.query;
    const filter: any = {};

    if (genre) filter.genre = { $regex: genre as string, $options: 'i' };
    if (artist) filter.artist = { $regex: artist as string, $options: 'i' };
    if (album) filter.album = { $regex: album as string, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { artist: { $regex: search as string, $options: 'i' } },
        { album: { $regex: search as string, $options: 'i' } },
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
    const totalArtists = await Song.distinct('artist').then(a => a.length);
    const totalAlbums = await Song.distinct('album').then(a => a.length);
    const totalGenres = await Song.distinct('genre').then(g => g.length);

    // Songs per genre
    const songsPerGenre = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Songs & albums per artist
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

    // Songs per album
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
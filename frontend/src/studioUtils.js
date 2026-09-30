export const normalizeArtist = (artist) => ({
  bio: artist.bio || 'Artist profile and creative work details are coming soon.',
  likes: typeof artist.likes === 'number' ? artist.likes : 0,
  comments: Array.isArray(artist.comments) ? artist.comments : [],
  links: Array.isArray(artist.links) ? artist.links : [],
  media: Array.isArray(artist.media) ? artist.media : [],
  ...artist,
});

export const createStudioId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

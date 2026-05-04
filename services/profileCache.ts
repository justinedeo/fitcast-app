export type CachedUserProfile = {
  id: string;
  username: string;
  email?: string;
  displayName?: string | null;
  bio?: string | null;
  location?: string | null;
  profilePictureUrl?: string | null;
};

export let cachedUserProfile: CachedUserProfile | null = null;

export const setCachedUserProfile = (profile: CachedUserProfile) => {
  cachedUserProfile = profile;
};
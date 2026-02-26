import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  username: string;
  email: string;
  displayName?: string | null;
}

export interface GetOutfitsData {
  outfitRecommendations: ({
    weatherCondition: string;
    temperatureRange: string;
    imageUrl: string;
    description?: string | null;
  })[];
}

export interface GetOutfitsVariables {
  userId: string;
}

export interface Like_Key {
  userId: string;
  postId: UUIDString;
  __typename?: 'Like_Key';
}

export interface ListPostsData {
  posts: ({
    id: UUIDString;
    content: string;
    imageUrl?: string | null;
    user: {
      username: string;
      displayName?: string | null;
    };
  } & Post_Key)[];
}

export interface OutfitRecommendation_Key {
  id: UUIDString;
  __typename?: 'OutfitRecommendation_Key';
}

export interface Post_Key {
  id: UUIDString;
  __typename?: 'Post_Key';
}

export interface SavedOutfit_Key {
  userId: string;
  outfitRecommendationId: UUIDString;
  __typename?: 'SavedOutfit_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface ListPostsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPostsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPostsData, undefined>;
  operationName: string;
}
export const listPostsRef: ListPostsRef;

export function listPosts(): QueryPromise<ListPostsData, undefined>;
export function listPosts(dc: DataConnect): QueryPromise<ListPostsData, undefined>;

interface GetOutfitsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOutfitsVariables): QueryRef<GetOutfitsData, GetOutfitsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOutfitsVariables): QueryRef<GetOutfitsData, GetOutfitsVariables>;
  operationName: string;
}
export const getOutfitsRef: GetOutfitsRef;

export function getOutfits(vars: GetOutfitsVariables): QueryPromise<GetOutfitsData, GetOutfitsVariables>;
export function getOutfits(dc: DataConnect, vars: GetOutfitsVariables): QueryPromise<GetOutfitsData, GetOutfitsVariables>;


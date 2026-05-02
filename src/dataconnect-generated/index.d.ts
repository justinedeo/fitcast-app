import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreatePostData {
  post_insert: Post_Key;
}

export interface CreatePostVariables {
  userId: string;
  content: string;
  imageUrl: string;
  locationTag?: string | null;
  zipCode?: string | null;
  top?: string | null;
  bottom?: string | null;
  outerwear?: string | null;
  wornAt?: TimestampString | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  username: string;
  email: string;
  displayName?: string | null;
}

export interface GetOutfitsData {
  outfitRecommendations: ({
    imageUrl: string;
    description?: string | null;
  })[];
}

export interface GetOutfitsVariables {
  userId: string;
}

export interface GetUserProfileData {
  user?: {
    id: string;
    username: string;
    displayName?: string | null;
    bio?: string | null;
    location?: string | null;
    profilePictureUrl?: string | null;
    createdAt: TimestampString;
  } & User_Key;
}

export interface GetUserProfileVariables {
  id: string;
}

export interface Like_Key {
  userId: string;
  postId: UUIDString;
  __typename?: 'Like_Key';
}

export interface ListAllUsersData {
  users: ({
    id: string;
    username: string;
    displayName?: string | null;
    profilePictureUrl?: string | null;
    location?: string | null;
  } & User_Key)[];
}

export interface ListPostsData {
  posts: ({
    id: UUIDString;
    content: string;
    imageUrl: string;
    locationTag?: string | null;
    zipCode?: string | null;
    top?: string | null;
    bottom?: string | null;
    outerwear?: string | null;
    wornAt?: TimestampString | null;
    createdAt: TimestampString;
    user: {
      id: string;
      username: string;
      displayName?: string | null;
      profilePictureUrl?: string | null;
    } & User_Key;
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

export interface UpdateUserProfileData {
  user_upsert: User_Key;
}

export interface UpdateUserProfileVariables {
  username: string;
  email: string;
  displayName?: string | null;
  bio?: string | null;
  location?: string | null;
  profilePictureUrl?: string | null;
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

interface UpdateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  operationName: string;
}
export const updateUserProfileRef: UpdateUserProfileRef;

export function updateUserProfile(vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;
export function updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface CreatePostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePostVariables): MutationRef<CreatePostData, CreatePostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePostVariables): MutationRef<CreatePostData, CreatePostVariables>;
  operationName: string;
}
export const createPostRef: CreatePostRef;

export function createPost(vars: CreatePostVariables): MutationPromise<CreatePostData, CreatePostVariables>;
export function createPost(dc: DataConnect, vars: CreatePostVariables): MutationPromise<CreatePostData, CreatePostVariables>;

interface ListPostsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPostsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPostsData, undefined>;
  operationName: string;
}
export const listPostsRef: ListPostsRef;

export function listPosts(options?: ExecuteQueryOptions): QueryPromise<ListPostsData, undefined>;
export function listPosts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPostsData, undefined>;

interface GetOutfitsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOutfitsVariables): QueryRef<GetOutfitsData, GetOutfitsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOutfitsVariables): QueryRef<GetOutfitsData, GetOutfitsVariables>;
  operationName: string;
}
export const getOutfitsRef: GetOutfitsRef;

export function getOutfits(vars: GetOutfitsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOutfitsData, GetOutfitsVariables>;
export function getOutfits(dc: DataConnect, vars: GetOutfitsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOutfitsData, GetOutfitsVariables>;

interface ListAllUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
  operationName: string;
}
export const listAllUsersRef: ListAllUsersRef;

export function listAllUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;
export function listAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;
export function getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;


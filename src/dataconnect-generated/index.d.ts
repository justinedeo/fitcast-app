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

export interface CreateCommentData {
  comment_insert: Comment_Key;
}

export interface CreateCommentVariables {
  postId: UUIDString;
  userId: string;
  content: string;
}

export interface CreateLikeData {
  like_insert: Like_Key;
}

export interface CreateLikeVariables {
  postId: UUIDString;
  userId: string;
}

export interface CreateOutfitFeedbackData {
  outfitFeedback_insert: OutfitFeedback_Key;
}

export interface CreateOutfitFeedbackVariables {
  userId: string;
  postId: UUIDString;
  rating: string;
  temperature?: number | null;
  weatherCondition?: string | null;
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
  tops?: string[] | null;
  topMaterials?: string[] | null;
  bottoms?: string[] | null;
  bottomMaterials?: string[] | null;
  outerwear?: string[] | null;
  outerwearMaterials?: string[] | null;
  wornAt?: TimestampString | null;
  isPublic: boolean;
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

export interface DeleteLikeData {
  like_delete?: Like_Key | null;
}

export interface DeleteLikeVariables {
  postId: UUIDString;
  userId: string;
}

export interface DeletePostData {
  post_delete?: Post_Key | null;
}

export interface DeletePostVariables {
  id: UUIDString;
}

export interface GetCommentsForPostData {
  comments: ({
    id: UUIDString;
    postId: UUIDString;
    content: string;
    createdAt: TimestampString;
    user: {
      id: string;
      username: string;
      displayName?: string | null;
    } & User_Key;
  } & Comment_Key)[];
}

export interface GetCommentsForPostVariables {
  postId: UUIDString;
}

export interface GetLikesForPostData {
  likes: ({
    _id: {
    };
      postId: UUIDString;
      createdAt: TimestampString;
      user: {
        id: string;
        username: string;
        displayName?: string | null;
      } & User_Key;
  })[];
}

export interface GetLikesForPostVariables {
  postId: UUIDString;
}

export interface GetOutfitsData {
  outfitRecommendations: ({
    id: UUIDString;
    imageUrl: string;
    description?: string | null;
    weatherCondition: string;
    temperatureRange: string;
    clothingItems?: string[] | null;
    createdAt: TimestampString;
  } & OutfitRecommendation_Key)[];
}

export interface GetOutfitsVariables {
  userId: string;
}

export interface GetPostsByZipData {
  posts: ({
    id: UUIDString;
    content: string;
    imageUrl: string;
    locationTag?: string | null;
    zipCode?: string | null;
    isPublic: boolean;
    tops?: string[] | null;
    topMaterials?: string[] | null;
    bottoms?: string[] | null;
    bottomMaterials?: string[] | null;
    outerwear?: string[] | null;
    outerwearMaterials?: string[] | null;
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

export interface GetPostsByZipVariables {
  zipCode: string;
}

export interface GetTodayPostData {
  posts: ({
    id: UUIDString;
    createdAt: TimestampString;
  } & Post_Key)[];
}

export interface GetTodayPostVariables {
  userId: string;
}

export interface GetUserOutfitFeedbackData {
  outfitFeedbacks: ({
    id: UUIDString;
    rating: string;
    temperature?: number | null;
    weatherCondition?: string | null;
    createdAt: TimestampString;
    post: {
      id: UUIDString;
      content: string;
      imageUrl: string;
      locationTag?: string | null;
      zipCode?: string | null;
      tops?: string[] | null;
      topMaterials?: string[] | null;
      bottoms?: string[] | null;
      bottomMaterials?: string[] | null;
      outerwear?: string[] | null;
      outerwearMaterials?: string[] | null;
      wornAt?: TimestampString | null;
      createdAt: TimestampString;
    } & Post_Key;
  } & OutfitFeedback_Key)[];
}

export interface GetUserOutfitFeedbackVariables {
  userId: string;
}

export interface GetUserPostsData {
  posts: ({
    id: UUIDString;
    imageUrl: string;
    isPublic: boolean;
    createdAt: TimestampString;
  } & Post_Key)[];
}

export interface GetUserPostsVariables {
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
    isPublic: boolean;
    tops?: string[] | null;
    topMaterials?: string[] | null;
    bottoms?: string[] | null;
    bottomMaterials?: string[] | null;
    outerwear?: string[] | null;
    outerwearMaterials?: string[] | null;
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

export interface OutfitFeedback_Key {
  id: UUIDString;
  __typename?: 'OutfitFeedback_Key';
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
  id: string;
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

interface CreateLikeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLikeVariables): MutationRef<CreateLikeData, CreateLikeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateLikeVariables): MutationRef<CreateLikeData, CreateLikeVariables>;
  operationName: string;
}
export const createLikeRef: CreateLikeRef;

export function createLike(vars: CreateLikeVariables): MutationPromise<CreateLikeData, CreateLikeVariables>;
export function createLike(dc: DataConnect, vars: CreateLikeVariables): MutationPromise<CreateLikeData, CreateLikeVariables>;

interface DeleteLikeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLikeVariables): MutationRef<DeleteLikeData, DeleteLikeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteLikeVariables): MutationRef<DeleteLikeData, DeleteLikeVariables>;
  operationName: string;
}
export const deleteLikeRef: DeleteLikeRef;

export function deleteLike(vars: DeleteLikeVariables): MutationPromise<DeleteLikeData, DeleteLikeVariables>;
export function deleteLike(dc: DataConnect, vars: DeleteLikeVariables): MutationPromise<DeleteLikeData, DeleteLikeVariables>;

interface CreateCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  operationName: string;
}
export const createCommentRef: CreateCommentRef;

export function createComment(vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;
export function createComment(dc: DataConnect, vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface CreateOutfitFeedbackRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOutfitFeedbackVariables): MutationRef<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOutfitFeedbackVariables): MutationRef<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;
  operationName: string;
}
export const createOutfitFeedbackRef: CreateOutfitFeedbackRef;

export function createOutfitFeedback(vars: CreateOutfitFeedbackVariables): MutationPromise<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;
export function createOutfitFeedback(dc: DataConnect, vars: CreateOutfitFeedbackVariables): MutationPromise<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;

interface DeletePostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePostVariables): MutationRef<DeletePostData, DeletePostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePostVariables): MutationRef<DeletePostData, DeletePostVariables>;
  operationName: string;
}
export const deletePostRef: DeletePostRef;

export function deletePost(vars: DeletePostVariables): MutationPromise<DeletePostData, DeletePostVariables>;
export function deletePost(dc: DataConnect, vars: DeletePostVariables): MutationPromise<DeletePostData, DeletePostVariables>;

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

interface GetPostsByZipRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPostsByZipVariables): QueryRef<GetPostsByZipData, GetPostsByZipVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPostsByZipVariables): QueryRef<GetPostsByZipData, GetPostsByZipVariables>;
  operationName: string;
}
export const getPostsByZipRef: GetPostsByZipRef;

export function getPostsByZip(vars: GetPostsByZipVariables, options?: ExecuteQueryOptions): QueryPromise<GetPostsByZipData, GetPostsByZipVariables>;
export function getPostsByZip(dc: DataConnect, vars: GetPostsByZipVariables, options?: ExecuteQueryOptions): QueryPromise<GetPostsByZipData, GetPostsByZipVariables>;

interface GetUserPostsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPostsVariables): QueryRef<GetUserPostsData, GetUserPostsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserPostsVariables): QueryRef<GetUserPostsData, GetUserPostsVariables>;
  operationName: string;
}
export const getUserPostsRef: GetUserPostsRef;

export function getUserPosts(vars: GetUserPostsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserPostsData, GetUserPostsVariables>;
export function getUserPosts(dc: DataConnect, vars: GetUserPostsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserPostsData, GetUserPostsVariables>;

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

interface GetLikesForPostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLikesForPostVariables): QueryRef<GetLikesForPostData, GetLikesForPostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLikesForPostVariables): QueryRef<GetLikesForPostData, GetLikesForPostVariables>;
  operationName: string;
}
export const getLikesForPostRef: GetLikesForPostRef;

export function getLikesForPost(vars: GetLikesForPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetLikesForPostData, GetLikesForPostVariables>;
export function getLikesForPost(dc: DataConnect, vars: GetLikesForPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetLikesForPostData, GetLikesForPostVariables>;

interface GetCommentsForPostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommentsForPostVariables): QueryRef<GetCommentsForPostData, GetCommentsForPostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCommentsForPostVariables): QueryRef<GetCommentsForPostData, GetCommentsForPostVariables>;
  operationName: string;
}
export const getCommentsForPostRef: GetCommentsForPostRef;

export function getCommentsForPost(vars: GetCommentsForPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommentsForPostData, GetCommentsForPostVariables>;
export function getCommentsForPost(dc: DataConnect, vars: GetCommentsForPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommentsForPostData, GetCommentsForPostVariables>;

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

interface GetTodayPostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTodayPostVariables): QueryRef<GetTodayPostData, GetTodayPostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTodayPostVariables): QueryRef<GetTodayPostData, GetTodayPostVariables>;
  operationName: string;
}
export const getTodayPostRef: GetTodayPostRef;

export function getTodayPost(vars: GetTodayPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayPostData, GetTodayPostVariables>;
export function getTodayPost(dc: DataConnect, vars: GetTodayPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayPostData, GetTodayPostVariables>;

interface GetUserOutfitFeedbackRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserOutfitFeedbackVariables): QueryRef<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserOutfitFeedbackVariables): QueryRef<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;
  operationName: string;
}
export const getUserOutfitFeedbackRef: GetUserOutfitFeedbackRef;

export function getUserOutfitFeedback(vars: GetUserOutfitFeedbackVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;
export function getUserOutfitFeedback(dc: DataConnect, vars: GetUserOutfitFeedbackVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;


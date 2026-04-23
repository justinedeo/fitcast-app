import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AcceptFriendRequestData {
  friendRequest_update?: FriendRequest_Key | null;
}

export interface AcceptFriendRequestVariables {
  id: UUIDString;
}

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
  createdAt: TimestampString;
}

export interface CreateLikeData {
  like_insert: Like_Key;
}

export interface CreateLikeVariables {
  postId: UUIDString;
  userId: string;
  createdAt: TimestampString;
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
  id: string;
  username: string;
  email: string;
  displayName?: string | null;
}

export interface DeclineFriendRequestData {
  friendRequest_delete?: FriendRequest_Key | null;
}

export interface DeclineFriendRequestVariables {
  id: UUIDString;
}

export interface FriendRequest_Key {
  id: UUIDString;
  __typename?: 'FriendRequest_Key';
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

export interface GetFriendsData {
  friendRequests: ({
    id: UUIDString;
    fromUser: {
      id: string;
      username: string;
      displayName?: string | null;
      profilePictureUrl?: string | null;
    } & User_Key;
      toUser: {
        id: string;
        username: string;
        displayName?: string | null;
        profilePictureUrl?: string | null;
      } & User_Key;
  } & FriendRequest_Key)[];
}

export interface GetFriendsVariables {
  userId: string;
}

export interface GetIncomingRequestsData {
  friendRequests: ({
    id: UUIDString;
    fromUser: {
      id: string;
      username: string;
      displayName?: string | null;
    } & User_Key;
  } & FriendRequest_Key)[];
}

export interface GetIncomingRequestsVariables {
  userId: string;
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

export interface SendFriendRequestData {
  friendRequest_insert: FriendRequest_Key;
}

export interface SendFriendRequestVariables {
  fromUserId: string;
  toUserId: string;
  createdAt: TimestampString;
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

interface SendFriendRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendFriendRequestVariables): MutationRef<SendFriendRequestData, SendFriendRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SendFriendRequestVariables): MutationRef<SendFriendRequestData, SendFriendRequestVariables>;
  operationName: string;
}
export const sendFriendRequestRef: SendFriendRequestRef;

export function sendFriendRequest(vars: SendFriendRequestVariables): MutationPromise<SendFriendRequestData, SendFriendRequestVariables>;
export function sendFriendRequest(dc: DataConnect, vars: SendFriendRequestVariables): MutationPromise<SendFriendRequestData, SendFriendRequestVariables>;

interface AcceptFriendRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AcceptFriendRequestVariables): MutationRef<AcceptFriendRequestData, AcceptFriendRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AcceptFriendRequestVariables): MutationRef<AcceptFriendRequestData, AcceptFriendRequestVariables>;
  operationName: string;
}
export const acceptFriendRequestRef: AcceptFriendRequestRef;

export function acceptFriendRequest(vars: AcceptFriendRequestVariables): MutationPromise<AcceptFriendRequestData, AcceptFriendRequestVariables>;
export function acceptFriendRequest(dc: DataConnect, vars: AcceptFriendRequestVariables): MutationPromise<AcceptFriendRequestData, AcceptFriendRequestVariables>;

interface DeclineFriendRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeclineFriendRequestVariables): MutationRef<DeclineFriendRequestData, DeclineFriendRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeclineFriendRequestVariables): MutationRef<DeclineFriendRequestData, DeclineFriendRequestVariables>;
  operationName: string;
}
export const declineFriendRequestRef: DeclineFriendRequestRef;

export function declineFriendRequest(vars: DeclineFriendRequestVariables): MutationPromise<DeclineFriendRequestData, DeclineFriendRequestVariables>;
export function declineFriendRequest(dc: DataConnect, vars: DeclineFriendRequestVariables): MutationPromise<DeclineFriendRequestData, DeclineFriendRequestVariables>;

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

interface GetIncomingRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetIncomingRequestsVariables): QueryRef<GetIncomingRequestsData, GetIncomingRequestsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetIncomingRequestsVariables): QueryRef<GetIncomingRequestsData, GetIncomingRequestsVariables>;
  operationName: string;
}
export const getIncomingRequestsRef: GetIncomingRequestsRef;

export function getIncomingRequests(vars: GetIncomingRequestsVariables, options?: ExecuteQueryOptions): QueryPromise<GetIncomingRequestsData, GetIncomingRequestsVariables>;
export function getIncomingRequests(dc: DataConnect, vars: GetIncomingRequestsVariables, options?: ExecuteQueryOptions): QueryPromise<GetIncomingRequestsData, GetIncomingRequestsVariables>;

interface GetFriendsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFriendsVariables): QueryRef<GetFriendsData, GetFriendsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFriendsVariables): QueryRef<GetFriendsData, GetFriendsVariables>;
  operationName: string;
}
export const getFriendsRef: GetFriendsRef;

export function getFriends(vars: GetFriendsVariables, options?: ExecuteQueryOptions): QueryPromise<GetFriendsData, GetFriendsVariables>;
export function getFriends(dc: DataConnect, vars: GetFriendsVariables, options?: ExecuteQueryOptions): QueryPromise<GetFriendsData, GetFriendsVariables>;


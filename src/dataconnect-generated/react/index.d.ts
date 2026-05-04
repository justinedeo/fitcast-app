import { CreateUserData, CreateUserVariables, UpdateUserProfileData, UpdateUserProfileVariables, CreatePostData, CreatePostVariables, CreateLikeData, CreateLikeVariables, DeleteLikeData, DeleteLikeVariables, CreateCommentData, CreateCommentVariables, CreateOutfitFeedbackData, CreateOutfitFeedbackVariables, DeletePostData, DeletePostVariables, ListPostsData, GetPostsByZipData, GetPostsByZipVariables, GetUserPostsData, GetUserPostsVariables, GetOutfitsData, GetOutfitsVariables, ListAllUsersData, GetLikesForPostData, GetLikesForPostVariables, GetCommentsForPostData, GetCommentsForPostVariables, GetUserProfileData, GetUserProfileVariables, GetTodayPostData, GetTodayPostVariables, GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useUpdateUserProfile(options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;
export function useUpdateUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;

export function useCreatePost(options?: useDataConnectMutationOptions<CreatePostData, FirebaseError, CreatePostVariables>): UseDataConnectMutationResult<CreatePostData, CreatePostVariables>;
export function useCreatePost(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePostData, FirebaseError, CreatePostVariables>): UseDataConnectMutationResult<CreatePostData, CreatePostVariables>;

export function useCreateLike(options?: useDataConnectMutationOptions<CreateLikeData, FirebaseError, CreateLikeVariables>): UseDataConnectMutationResult<CreateLikeData, CreateLikeVariables>;
export function useCreateLike(dc: DataConnect, options?: useDataConnectMutationOptions<CreateLikeData, FirebaseError, CreateLikeVariables>): UseDataConnectMutationResult<CreateLikeData, CreateLikeVariables>;

export function useDeleteLike(options?: useDataConnectMutationOptions<DeleteLikeData, FirebaseError, DeleteLikeVariables>): UseDataConnectMutationResult<DeleteLikeData, DeleteLikeVariables>;
export function useDeleteLike(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteLikeData, FirebaseError, DeleteLikeVariables>): UseDataConnectMutationResult<DeleteLikeData, DeleteLikeVariables>;

export function useCreateComment(options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;
export function useCreateComment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;

export function useCreateOutfitFeedback(options?: useDataConnectMutationOptions<CreateOutfitFeedbackData, FirebaseError, CreateOutfitFeedbackVariables>): UseDataConnectMutationResult<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;
export function useCreateOutfitFeedback(dc: DataConnect, options?: useDataConnectMutationOptions<CreateOutfitFeedbackData, FirebaseError, CreateOutfitFeedbackVariables>): UseDataConnectMutationResult<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;

export function useDeletePost(options?: useDataConnectMutationOptions<DeletePostData, FirebaseError, DeletePostVariables>): UseDataConnectMutationResult<DeletePostData, DeletePostVariables>;
export function useDeletePost(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePostData, FirebaseError, DeletePostVariables>): UseDataConnectMutationResult<DeletePostData, DeletePostVariables>;

export function useListPosts(options?: useDataConnectQueryOptions<ListPostsData>): UseDataConnectQueryResult<ListPostsData, undefined>;
export function useListPosts(dc: DataConnect, options?: useDataConnectQueryOptions<ListPostsData>): UseDataConnectQueryResult<ListPostsData, undefined>;

export function useGetPostsByZip(vars: GetPostsByZipVariables, options?: useDataConnectQueryOptions<GetPostsByZipData>): UseDataConnectQueryResult<GetPostsByZipData, GetPostsByZipVariables>;
export function useGetPostsByZip(dc: DataConnect, vars: GetPostsByZipVariables, options?: useDataConnectQueryOptions<GetPostsByZipData>): UseDataConnectQueryResult<GetPostsByZipData, GetPostsByZipVariables>;

export function useGetUserPosts(vars: GetUserPostsVariables, options?: useDataConnectQueryOptions<GetUserPostsData>): UseDataConnectQueryResult<GetUserPostsData, GetUserPostsVariables>;
export function useGetUserPosts(dc: DataConnect, vars: GetUserPostsVariables, options?: useDataConnectQueryOptions<GetUserPostsData>): UseDataConnectQueryResult<GetUserPostsData, GetUserPostsVariables>;

export function useGetOutfits(vars: GetOutfitsVariables, options?: useDataConnectQueryOptions<GetOutfitsData>): UseDataConnectQueryResult<GetOutfitsData, GetOutfitsVariables>;
export function useGetOutfits(dc: DataConnect, vars: GetOutfitsVariables, options?: useDataConnectQueryOptions<GetOutfitsData>): UseDataConnectQueryResult<GetOutfitsData, GetOutfitsVariables>;

export function useListAllUsers(options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;
export function useListAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;

export function useGetLikesForPost(vars: GetLikesForPostVariables, options?: useDataConnectQueryOptions<GetLikesForPostData>): UseDataConnectQueryResult<GetLikesForPostData, GetLikesForPostVariables>;
export function useGetLikesForPost(dc: DataConnect, vars: GetLikesForPostVariables, options?: useDataConnectQueryOptions<GetLikesForPostData>): UseDataConnectQueryResult<GetLikesForPostData, GetLikesForPostVariables>;

export function useGetCommentsForPost(vars: GetCommentsForPostVariables, options?: useDataConnectQueryOptions<GetCommentsForPostData>): UseDataConnectQueryResult<GetCommentsForPostData, GetCommentsForPostVariables>;
export function useGetCommentsForPost(dc: DataConnect, vars: GetCommentsForPostVariables, options?: useDataConnectQueryOptions<GetCommentsForPostData>): UseDataConnectQueryResult<GetCommentsForPostData, GetCommentsForPostVariables>;

export function useGetUserProfile(vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;
export function useGetUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;

export function useGetTodayPost(vars: GetTodayPostVariables, options?: useDataConnectQueryOptions<GetTodayPostData>): UseDataConnectQueryResult<GetTodayPostData, GetTodayPostVariables>;
export function useGetTodayPost(dc: DataConnect, vars: GetTodayPostVariables, options?: useDataConnectQueryOptions<GetTodayPostData>): UseDataConnectQueryResult<GetTodayPostData, GetTodayPostVariables>;

export function useGetUserOutfitFeedback(vars: GetUserOutfitFeedbackVariables, options?: useDataConnectQueryOptions<GetUserOutfitFeedbackData>): UseDataConnectQueryResult<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;
export function useGetUserOutfitFeedback(dc: DataConnect, vars: GetUserOutfitFeedbackVariables, options?: useDataConnectQueryOptions<GetUserOutfitFeedbackData>): UseDataConnectQueryResult<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;

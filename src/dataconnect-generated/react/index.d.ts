import { CreateUserData, CreateUserVariables, UpdateUserProfileData, UpdateUserProfileVariables, CreatePostData, CreatePostVariables, ListPostsData, GetOutfitsData, GetOutfitsVariables, ListAllUsersData, GetUserProfileData, GetUserProfileVariables } from '../';
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

export function useListPosts(options?: useDataConnectQueryOptions<ListPostsData>): UseDataConnectQueryResult<ListPostsData, undefined>;
export function useListPosts(dc: DataConnect, options?: useDataConnectQueryOptions<ListPostsData>): UseDataConnectQueryResult<ListPostsData, undefined>;

export function useGetOutfits(vars: GetOutfitsVariables, options?: useDataConnectQueryOptions<GetOutfitsData>): UseDataConnectQueryResult<GetOutfitsData, GetOutfitsVariables>;
export function useGetOutfits(dc: DataConnect, vars: GetOutfitsVariables, options?: useDataConnectQueryOptions<GetOutfitsData>): UseDataConnectQueryResult<GetOutfitsData, GetOutfitsVariables>;

export function useListAllUsers(options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;
export function useListAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;

export function useGetUserProfile(vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;
export function useGetUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;

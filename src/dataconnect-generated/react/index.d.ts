import { CreateUserData, CreateUserVariables, ListPostsData, GetOutfitsData, GetOutfitsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useListPosts(options?: useDataConnectQueryOptions<ListPostsData>): UseDataConnectQueryResult<ListPostsData, undefined>;
export function useListPosts(dc: DataConnect, options?: useDataConnectQueryOptions<ListPostsData>): UseDataConnectQueryResult<ListPostsData, undefined>;

export function useGetOutfits(vars: GetOutfitsVariables, options?: useDataConnectQueryOptions<GetOutfitsData>): UseDataConnectQueryResult<GetOutfitsData, GetOutfitsVariables>;
export function useGetOutfits(dc: DataConnect, vars: GetOutfitsVariables, options?: useDataConnectQueryOptions<GetOutfitsData>): UseDataConnectQueryResult<GetOutfitsData, GetOutfitsVariables>;

# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*listPosts*](#listposts)
  - [*GetPostsByZip*](#getpostsbyzip)
  - [*GetUserPosts*](#getuserposts)
  - [*getOutfits*](#getoutfits)
  - [*listAllUsers*](#listallusers)
  - [*getLikesForPost*](#getlikesforpost)
  - [*getCommentsForPost*](#getcommentsforpost)
  - [*GetUserProfile*](#getuserprofile)
  - [*GetTodayPost*](#gettodaypost)
  - [*GetUserOutfitFeedback*](#getuseroutfitfeedback)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUserProfile*](#updateuserprofile)
  - [*CreatePost*](#createpost)
  - [*CreateLike*](#createlike)
  - [*DeleteLike*](#deletelike)
  - [*CreateComment*](#createcomment)
  - [*CreateOutfitFeedback*](#createoutfitfeedback)
  - [*DeletePost*](#deletepost)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@firebasegen/example-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/example-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/example-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## listPosts
You can execute the `listPosts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPosts(options?: ExecuteQueryOptions): QueryPromise<ListPostsData, undefined>;

interface ListPostsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPostsData, undefined>;
}
export const listPostsRef: ListPostsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPosts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPostsData, undefined>;

interface ListPostsRef {
  ...
  (dc: DataConnect): QueryRef<ListPostsData, undefined>;
}
export const listPostsRef: ListPostsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPostsRef:
```typescript
const name = listPostsRef.operationName;
console.log(name);
```

### Variables
The `listPosts` query has no variables.
### Return Type
Recall that executing the `listPosts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPostsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `listPosts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPosts } from '@firebasegen/example-connector';


// Call the `listPosts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPosts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPosts(dataConnect);

console.log(data.posts);

// Or, you can use the `Promise` API.
listPosts().then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

### Using `listPosts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPostsRef } from '@firebasegen/example-connector';


// Call the `listPostsRef()` function to get a reference to the query.
const ref = listPostsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPostsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

## GetPostsByZip
You can execute the `GetPostsByZip` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPostsByZip(vars: GetPostsByZipVariables, options?: ExecuteQueryOptions): QueryPromise<GetPostsByZipData, GetPostsByZipVariables>;

interface GetPostsByZipRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPostsByZipVariables): QueryRef<GetPostsByZipData, GetPostsByZipVariables>;
}
export const getPostsByZipRef: GetPostsByZipRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPostsByZip(dc: DataConnect, vars: GetPostsByZipVariables, options?: ExecuteQueryOptions): QueryPromise<GetPostsByZipData, GetPostsByZipVariables>;

interface GetPostsByZipRef {
  ...
  (dc: DataConnect, vars: GetPostsByZipVariables): QueryRef<GetPostsByZipData, GetPostsByZipVariables>;
}
export const getPostsByZipRef: GetPostsByZipRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPostsByZipRef:
```typescript
const name = getPostsByZipRef.operationName;
console.log(name);
```

### Variables
The `GetPostsByZip` query requires an argument of type `GetPostsByZipVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPostsByZipVariables {
  zipCode: string;
}
```
### Return Type
Recall that executing the `GetPostsByZip` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPostsByZipData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPostsByZip`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPostsByZip, GetPostsByZipVariables } from '@firebasegen/example-connector';

// The `GetPostsByZip` query requires an argument of type `GetPostsByZipVariables`:
const getPostsByZipVars: GetPostsByZipVariables = {
  zipCode: ..., 
};

// Call the `getPostsByZip()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPostsByZip(getPostsByZipVars);
// Variables can be defined inline as well.
const { data } = await getPostsByZip({ zipCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPostsByZip(dataConnect, getPostsByZipVars);

console.log(data.posts);

// Or, you can use the `Promise` API.
getPostsByZip(getPostsByZipVars).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

### Using `GetPostsByZip`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPostsByZipRef, GetPostsByZipVariables } from '@firebasegen/example-connector';

// The `GetPostsByZip` query requires an argument of type `GetPostsByZipVariables`:
const getPostsByZipVars: GetPostsByZipVariables = {
  zipCode: ..., 
};

// Call the `getPostsByZipRef()` function to get a reference to the query.
const ref = getPostsByZipRef(getPostsByZipVars);
// Variables can be defined inline as well.
const ref = getPostsByZipRef({ zipCode: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPostsByZipRef(dataConnect, getPostsByZipVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

## GetUserPosts
You can execute the `GetUserPosts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserPosts(vars: GetUserPostsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserPostsData, GetUserPostsVariables>;

interface GetUserPostsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPostsVariables): QueryRef<GetUserPostsData, GetUserPostsVariables>;
}
export const getUserPostsRef: GetUserPostsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserPosts(dc: DataConnect, vars: GetUserPostsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserPostsData, GetUserPostsVariables>;

interface GetUserPostsRef {
  ...
  (dc: DataConnect, vars: GetUserPostsVariables): QueryRef<GetUserPostsData, GetUserPostsVariables>;
}
export const getUserPostsRef: GetUserPostsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserPostsRef:
```typescript
const name = getUserPostsRef.operationName;
console.log(name);
```

### Variables
The `GetUserPosts` query requires an argument of type `GetUserPostsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserPostsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserPosts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserPostsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserPostsData {
  posts: ({
    id: UUIDString;
    imageUrl: string;
    isPublic: boolean;
    createdAt: TimestampString;
  } & Post_Key)[];
}
```
### Using `GetUserPosts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserPosts, GetUserPostsVariables } from '@firebasegen/example-connector';

// The `GetUserPosts` query requires an argument of type `GetUserPostsVariables`:
const getUserPostsVars: GetUserPostsVariables = {
  userId: ..., 
};

// Call the `getUserPosts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserPosts(getUserPostsVars);
// Variables can be defined inline as well.
const { data } = await getUserPosts({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserPosts(dataConnect, getUserPostsVars);

console.log(data.posts);

// Or, you can use the `Promise` API.
getUserPosts(getUserPostsVars).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

### Using `GetUserPosts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserPostsRef, GetUserPostsVariables } from '@firebasegen/example-connector';

// The `GetUserPosts` query requires an argument of type `GetUserPostsVariables`:
const getUserPostsVars: GetUserPostsVariables = {
  userId: ..., 
};

// Call the `getUserPostsRef()` function to get a reference to the query.
const ref = getUserPostsRef(getUserPostsVars);
// Variables can be defined inline as well.
const ref = getUserPostsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserPostsRef(dataConnect, getUserPostsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

## getOutfits
You can execute the `getOutfits` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getOutfits(vars: GetOutfitsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOutfitsData, GetOutfitsVariables>;

interface GetOutfitsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOutfitsVariables): QueryRef<GetOutfitsData, GetOutfitsVariables>;
}
export const getOutfitsRef: GetOutfitsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOutfits(dc: DataConnect, vars: GetOutfitsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOutfitsData, GetOutfitsVariables>;

interface GetOutfitsRef {
  ...
  (dc: DataConnect, vars: GetOutfitsVariables): QueryRef<GetOutfitsData, GetOutfitsVariables>;
}
export const getOutfitsRef: GetOutfitsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOutfitsRef:
```typescript
const name = getOutfitsRef.operationName;
console.log(name);
```

### Variables
The `getOutfits` query requires an argument of type `GetOutfitsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOutfitsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `getOutfits` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOutfitsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getOutfits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOutfits, GetOutfitsVariables } from '@firebasegen/example-connector';

// The `getOutfits` query requires an argument of type `GetOutfitsVariables`:
const getOutfitsVars: GetOutfitsVariables = {
  userId: ..., 
};

// Call the `getOutfits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOutfits(getOutfitsVars);
// Variables can be defined inline as well.
const { data } = await getOutfits({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOutfits(dataConnect, getOutfitsVars);

console.log(data.outfitRecommendations);

// Or, you can use the `Promise` API.
getOutfits(getOutfitsVars).then((response) => {
  const data = response.data;
  console.log(data.outfitRecommendations);
});
```

### Using `getOutfits`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOutfitsRef, GetOutfitsVariables } from '@firebasegen/example-connector';

// The `getOutfits` query requires an argument of type `GetOutfitsVariables`:
const getOutfitsVars: GetOutfitsVariables = {
  userId: ..., 
};

// Call the `getOutfitsRef()` function to get a reference to the query.
const ref = getOutfitsRef(getOutfitsVars);
// Variables can be defined inline as well.
const ref = getOutfitsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOutfitsRef(dataConnect, getOutfitsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.outfitRecommendations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.outfitRecommendations);
});
```

## listAllUsers
You can execute the `listAllUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllUsersRef:
```typescript
const name = listAllUsersRef.operationName;
console.log(name);
```

### Variables
The `listAllUsers` query has no variables.
### Return Type
Recall that executing the `listAllUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllUsersData {
  users: ({
    id: string;
    username: string;
    displayName?: string | null;
    profilePictureUrl?: string | null;
    location?: string | null;
  } & User_Key)[];
}
```
### Using `listAllUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllUsers } from '@firebasegen/example-connector';


// Call the `listAllUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listAllUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `listAllUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllUsersRef } from '@firebasegen/example-connector';


// Call the `listAllUsersRef()` function to get a reference to the query.
const ref = listAllUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## getLikesForPost
You can execute the `getLikesForPost` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getLikesForPost(vars: GetLikesForPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetLikesForPostData, GetLikesForPostVariables>;

interface GetLikesForPostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLikesForPostVariables): QueryRef<GetLikesForPostData, GetLikesForPostVariables>;
}
export const getLikesForPostRef: GetLikesForPostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLikesForPost(dc: DataConnect, vars: GetLikesForPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetLikesForPostData, GetLikesForPostVariables>;

interface GetLikesForPostRef {
  ...
  (dc: DataConnect, vars: GetLikesForPostVariables): QueryRef<GetLikesForPostData, GetLikesForPostVariables>;
}
export const getLikesForPostRef: GetLikesForPostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLikesForPostRef:
```typescript
const name = getLikesForPostRef.operationName;
console.log(name);
```

### Variables
The `getLikesForPost` query requires an argument of type `GetLikesForPostVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLikesForPostVariables {
  postId: UUIDString;
}
```
### Return Type
Recall that executing the `getLikesForPost` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLikesForPostData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getLikesForPost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLikesForPost, GetLikesForPostVariables } from '@firebasegen/example-connector';

// The `getLikesForPost` query requires an argument of type `GetLikesForPostVariables`:
const getLikesForPostVars: GetLikesForPostVariables = {
  postId: ..., 
};

// Call the `getLikesForPost()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLikesForPost(getLikesForPostVars);
// Variables can be defined inline as well.
const { data } = await getLikesForPost({ postId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLikesForPost(dataConnect, getLikesForPostVars);

console.log(data.likes);

// Or, you can use the `Promise` API.
getLikesForPost(getLikesForPostVars).then((response) => {
  const data = response.data;
  console.log(data.likes);
});
```

### Using `getLikesForPost`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLikesForPostRef, GetLikesForPostVariables } from '@firebasegen/example-connector';

// The `getLikesForPost` query requires an argument of type `GetLikesForPostVariables`:
const getLikesForPostVars: GetLikesForPostVariables = {
  postId: ..., 
};

// Call the `getLikesForPostRef()` function to get a reference to the query.
const ref = getLikesForPostRef(getLikesForPostVars);
// Variables can be defined inline as well.
const ref = getLikesForPostRef({ postId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLikesForPostRef(dataConnect, getLikesForPostVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.likes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.likes);
});
```

## getCommentsForPost
You can execute the `getCommentsForPost` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCommentsForPost(vars: GetCommentsForPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommentsForPostData, GetCommentsForPostVariables>;

interface GetCommentsForPostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommentsForPostVariables): QueryRef<GetCommentsForPostData, GetCommentsForPostVariables>;
}
export const getCommentsForPostRef: GetCommentsForPostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCommentsForPost(dc: DataConnect, vars: GetCommentsForPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommentsForPostData, GetCommentsForPostVariables>;

interface GetCommentsForPostRef {
  ...
  (dc: DataConnect, vars: GetCommentsForPostVariables): QueryRef<GetCommentsForPostData, GetCommentsForPostVariables>;
}
export const getCommentsForPostRef: GetCommentsForPostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCommentsForPostRef:
```typescript
const name = getCommentsForPostRef.operationName;
console.log(name);
```

### Variables
The `getCommentsForPost` query requires an argument of type `GetCommentsForPostVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCommentsForPostVariables {
  postId: UUIDString;
}
```
### Return Type
Recall that executing the `getCommentsForPost` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCommentsForPostData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getCommentsForPost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCommentsForPost, GetCommentsForPostVariables } from '@firebasegen/example-connector';

// The `getCommentsForPost` query requires an argument of type `GetCommentsForPostVariables`:
const getCommentsForPostVars: GetCommentsForPostVariables = {
  postId: ..., 
};

// Call the `getCommentsForPost()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCommentsForPost(getCommentsForPostVars);
// Variables can be defined inline as well.
const { data } = await getCommentsForPost({ postId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCommentsForPost(dataConnect, getCommentsForPostVars);

console.log(data.comments);

// Or, you can use the `Promise` API.
getCommentsForPost(getCommentsForPostVars).then((response) => {
  const data = response.data;
  console.log(data.comments);
});
```

### Using `getCommentsForPost`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCommentsForPostRef, GetCommentsForPostVariables } from '@firebasegen/example-connector';

// The `getCommentsForPost` query requires an argument of type `GetCommentsForPostVariables`:
const getCommentsForPostVars: GetCommentsForPostVariables = {
  postId: ..., 
};

// Call the `getCommentsForPostRef()` function to get a reference to the query.
const ref = getCommentsForPostRef(getCommentsForPostVars);
// Variables can be defined inline as well.
const ref = getCommentsForPostRef({ postId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCommentsForPostRef(dataConnect, getCommentsForPostVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comments);
});
```

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserProfileVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile, GetUserProfileVariables } from '@firebasegen/example-connector';

// The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  id: ..., 
};

// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile(getUserProfileVars);
// Variables can be defined inline as well.
const { data } = await getUserProfile({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect, getUserProfileVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserProfile(getUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef, GetUserProfileVariables } from '@firebasegen/example-connector';

// The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  id: ..., 
};

// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef(getUserProfileVars);
// Variables can be defined inline as well.
const ref = getUserProfileRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect, getUserProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetTodayPost
You can execute the `GetTodayPost` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTodayPost(vars: GetTodayPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayPostData, GetTodayPostVariables>;

interface GetTodayPostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTodayPostVariables): QueryRef<GetTodayPostData, GetTodayPostVariables>;
}
export const getTodayPostRef: GetTodayPostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTodayPost(dc: DataConnect, vars: GetTodayPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayPostData, GetTodayPostVariables>;

interface GetTodayPostRef {
  ...
  (dc: DataConnect, vars: GetTodayPostVariables): QueryRef<GetTodayPostData, GetTodayPostVariables>;
}
export const getTodayPostRef: GetTodayPostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTodayPostRef:
```typescript
const name = getTodayPostRef.operationName;
console.log(name);
```

### Variables
The `GetTodayPost` query requires an argument of type `GetTodayPostVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTodayPostVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetTodayPost` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTodayPostData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTodayPostData {
  posts: ({
    id: UUIDString;
    createdAt: TimestampString;
  } & Post_Key)[];
}
```
### Using `GetTodayPost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTodayPost, GetTodayPostVariables } from '@firebasegen/example-connector';

// The `GetTodayPost` query requires an argument of type `GetTodayPostVariables`:
const getTodayPostVars: GetTodayPostVariables = {
  userId: ..., 
};

// Call the `getTodayPost()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTodayPost(getTodayPostVars);
// Variables can be defined inline as well.
const { data } = await getTodayPost({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTodayPost(dataConnect, getTodayPostVars);

console.log(data.posts);

// Or, you can use the `Promise` API.
getTodayPost(getTodayPostVars).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

### Using `GetTodayPost`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTodayPostRef, GetTodayPostVariables } from '@firebasegen/example-connector';

// The `GetTodayPost` query requires an argument of type `GetTodayPostVariables`:
const getTodayPostVars: GetTodayPostVariables = {
  userId: ..., 
};

// Call the `getTodayPostRef()` function to get a reference to the query.
const ref = getTodayPostRef(getTodayPostVars);
// Variables can be defined inline as well.
const ref = getTodayPostRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTodayPostRef(dataConnect, getTodayPostVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

## GetUserOutfitFeedback
You can execute the `GetUserOutfitFeedback` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserOutfitFeedback(vars: GetUserOutfitFeedbackVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;

interface GetUserOutfitFeedbackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserOutfitFeedbackVariables): QueryRef<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;
}
export const getUserOutfitFeedbackRef: GetUserOutfitFeedbackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserOutfitFeedback(dc: DataConnect, vars: GetUserOutfitFeedbackVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;

interface GetUserOutfitFeedbackRef {
  ...
  (dc: DataConnect, vars: GetUserOutfitFeedbackVariables): QueryRef<GetUserOutfitFeedbackData, GetUserOutfitFeedbackVariables>;
}
export const getUserOutfitFeedbackRef: GetUserOutfitFeedbackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserOutfitFeedbackRef:
```typescript
const name = getUserOutfitFeedbackRef.operationName;
console.log(name);
```

### Variables
The `GetUserOutfitFeedback` query requires an argument of type `GetUserOutfitFeedbackVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserOutfitFeedbackVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserOutfitFeedback` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserOutfitFeedbackData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserOutfitFeedback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserOutfitFeedback, GetUserOutfitFeedbackVariables } from '@firebasegen/example-connector';

// The `GetUserOutfitFeedback` query requires an argument of type `GetUserOutfitFeedbackVariables`:
const getUserOutfitFeedbackVars: GetUserOutfitFeedbackVariables = {
  userId: ..., 
};

// Call the `getUserOutfitFeedback()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserOutfitFeedback(getUserOutfitFeedbackVars);
// Variables can be defined inline as well.
const { data } = await getUserOutfitFeedback({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserOutfitFeedback(dataConnect, getUserOutfitFeedbackVars);

console.log(data.outfitFeedbacks);

// Or, you can use the `Promise` API.
getUserOutfitFeedback(getUserOutfitFeedbackVars).then((response) => {
  const data = response.data;
  console.log(data.outfitFeedbacks);
});
```

### Using `GetUserOutfitFeedback`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserOutfitFeedbackRef, GetUserOutfitFeedbackVariables } from '@firebasegen/example-connector';

// The `GetUserOutfitFeedback` query requires an argument of type `GetUserOutfitFeedbackVariables`:
const getUserOutfitFeedbackVars: GetUserOutfitFeedbackVariables = {
  userId: ..., 
};

// Call the `getUserOutfitFeedbackRef()` function to get a reference to the query.
const ref = getUserOutfitFeedbackRef(getUserOutfitFeedbackVars);
// Variables can be defined inline as well.
const ref = getUserOutfitFeedbackRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserOutfitFeedbackRef(dataConnect, getUserOutfitFeedbackVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.outfitFeedbacks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.outfitFeedbacks);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  id: string;
  username: string;
  email: string;
  displayName?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@firebasegen/example-connector';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  username: ..., 
  email: ..., 
  displayName: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ id: ..., username: ..., email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@firebasegen/example-connector';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  username: ..., 
  email: ..., 
  displayName: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ id: ..., username: ..., email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUserProfile
You can execute the `UpdateUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserProfile(vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  (dc: DataConnect, vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserProfileRef:
```typescript
const name = updateUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserProfileVariables {
  id: string;
  username: string;
  email: string;
  displayName?: string | null;
  bio?: string | null;
  location?: string | null;
  profilePictureUrl?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserProfileData {
  user_upsert: User_Key;
}
```
### Using `UpdateUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserProfile, UpdateUserProfileVariables } from '@firebasegen/example-connector';

// The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  id: ..., 
  username: ..., 
  email: ..., 
  displayName: ..., // optional
  bio: ..., // optional
  location: ..., // optional
  profilePictureUrl: ..., // optional
};

// Call the `updateUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserProfile(updateUserProfileVars);
// Variables can be defined inline as well.
const { data } = await updateUserProfile({ id: ..., username: ..., email: ..., displayName: ..., bio: ..., location: ..., profilePictureUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserProfile(dataConnect, updateUserProfileVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
updateUserProfile(updateUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpdateUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserProfileRef, UpdateUserProfileVariables } from '@firebasegen/example-connector';

// The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  id: ..., 
  username: ..., 
  email: ..., 
  displayName: ..., // optional
  bio: ..., // optional
  location: ..., // optional
  profilePictureUrl: ..., // optional
};

// Call the `updateUserProfileRef()` function to get a reference to the mutation.
const ref = updateUserProfileRef(updateUserProfileVars);
// Variables can be defined inline as well.
const ref = updateUserProfileRef({ id: ..., username: ..., email: ..., displayName: ..., bio: ..., location: ..., profilePictureUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserProfileRef(dataConnect, updateUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreatePost
You can execute the `CreatePost` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPost(vars: CreatePostVariables): MutationPromise<CreatePostData, CreatePostVariables>;

interface CreatePostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePostVariables): MutationRef<CreatePostData, CreatePostVariables>;
}
export const createPostRef: CreatePostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPost(dc: DataConnect, vars: CreatePostVariables): MutationPromise<CreatePostData, CreatePostVariables>;

interface CreatePostRef {
  ...
  (dc: DataConnect, vars: CreatePostVariables): MutationRef<CreatePostData, CreatePostVariables>;
}
export const createPostRef: CreatePostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPostRef:
```typescript
const name = createPostRef.operationName;
console.log(name);
```

### Variables
The `CreatePost` mutation requires an argument of type `CreatePostVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreatePost` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePostData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePostData {
  post_insert: Post_Key;
}
```
### Using `CreatePost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPost, CreatePostVariables } from '@firebasegen/example-connector';

// The `CreatePost` mutation requires an argument of type `CreatePostVariables`:
const createPostVars: CreatePostVariables = {
  userId: ..., 
  content: ..., 
  imageUrl: ..., 
  locationTag: ..., // optional
  zipCode: ..., // optional
  tops: ..., // optional
  topMaterials: ..., // optional
  bottoms: ..., // optional
  bottomMaterials: ..., // optional
  outerwear: ..., // optional
  outerwearMaterials: ..., // optional
  wornAt: ..., // optional
  isPublic: ..., 
};

// Call the `createPost()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPost(createPostVars);
// Variables can be defined inline as well.
const { data } = await createPost({ userId: ..., content: ..., imageUrl: ..., locationTag: ..., zipCode: ..., tops: ..., topMaterials: ..., bottoms: ..., bottomMaterials: ..., outerwear: ..., outerwearMaterials: ..., wornAt: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPost(dataConnect, createPostVars);

console.log(data.post_insert);

// Or, you can use the `Promise` API.
createPost(createPostVars).then((response) => {
  const data = response.data;
  console.log(data.post_insert);
});
```

### Using `CreatePost`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPostRef, CreatePostVariables } from '@firebasegen/example-connector';

// The `CreatePost` mutation requires an argument of type `CreatePostVariables`:
const createPostVars: CreatePostVariables = {
  userId: ..., 
  content: ..., 
  imageUrl: ..., 
  locationTag: ..., // optional
  zipCode: ..., // optional
  tops: ..., // optional
  topMaterials: ..., // optional
  bottoms: ..., // optional
  bottomMaterials: ..., // optional
  outerwear: ..., // optional
  outerwearMaterials: ..., // optional
  wornAt: ..., // optional
  isPublic: ..., 
};

// Call the `createPostRef()` function to get a reference to the mutation.
const ref = createPostRef(createPostVars);
// Variables can be defined inline as well.
const ref = createPostRef({ userId: ..., content: ..., imageUrl: ..., locationTag: ..., zipCode: ..., tops: ..., topMaterials: ..., bottoms: ..., bottomMaterials: ..., outerwear: ..., outerwearMaterials: ..., wornAt: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPostRef(dataConnect, createPostVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.post_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.post_insert);
});
```

## CreateLike
You can execute the `CreateLike` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createLike(vars: CreateLikeVariables): MutationPromise<CreateLikeData, CreateLikeVariables>;

interface CreateLikeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLikeVariables): MutationRef<CreateLikeData, CreateLikeVariables>;
}
export const createLikeRef: CreateLikeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLike(dc: DataConnect, vars: CreateLikeVariables): MutationPromise<CreateLikeData, CreateLikeVariables>;

interface CreateLikeRef {
  ...
  (dc: DataConnect, vars: CreateLikeVariables): MutationRef<CreateLikeData, CreateLikeVariables>;
}
export const createLikeRef: CreateLikeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLikeRef:
```typescript
const name = createLikeRef.operationName;
console.log(name);
```

### Variables
The `CreateLike` mutation requires an argument of type `CreateLikeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateLikeVariables {
  postId: UUIDString;
  userId: string;
}
```
### Return Type
Recall that executing the `CreateLike` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLikeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLikeData {
  like_insert: Like_Key;
}
```
### Using `CreateLike`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLike, CreateLikeVariables } from '@firebasegen/example-connector';

// The `CreateLike` mutation requires an argument of type `CreateLikeVariables`:
const createLikeVars: CreateLikeVariables = {
  postId: ..., 
  userId: ..., 
};

// Call the `createLike()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLike(createLikeVars);
// Variables can be defined inline as well.
const { data } = await createLike({ postId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLike(dataConnect, createLikeVars);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
createLike(createLikeVars).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

### Using `CreateLike`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLikeRef, CreateLikeVariables } from '@firebasegen/example-connector';

// The `CreateLike` mutation requires an argument of type `CreateLikeVariables`:
const createLikeVars: CreateLikeVariables = {
  postId: ..., 
  userId: ..., 
};

// Call the `createLikeRef()` function to get a reference to the mutation.
const ref = createLikeRef(createLikeVars);
// Variables can be defined inline as well.
const ref = createLikeRef({ postId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLikeRef(dataConnect, createLikeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

## DeleteLike
You can execute the `DeleteLike` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteLike(vars: DeleteLikeVariables): MutationPromise<DeleteLikeData, DeleteLikeVariables>;

interface DeleteLikeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLikeVariables): MutationRef<DeleteLikeData, DeleteLikeVariables>;
}
export const deleteLikeRef: DeleteLikeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteLike(dc: DataConnect, vars: DeleteLikeVariables): MutationPromise<DeleteLikeData, DeleteLikeVariables>;

interface DeleteLikeRef {
  ...
  (dc: DataConnect, vars: DeleteLikeVariables): MutationRef<DeleteLikeData, DeleteLikeVariables>;
}
export const deleteLikeRef: DeleteLikeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteLikeRef:
```typescript
const name = deleteLikeRef.operationName;
console.log(name);
```

### Variables
The `DeleteLike` mutation requires an argument of type `DeleteLikeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteLikeVariables {
  postId: UUIDString;
  userId: string;
}
```
### Return Type
Recall that executing the `DeleteLike` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteLikeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteLikeData {
  like_delete?: Like_Key | null;
}
```
### Using `DeleteLike`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteLike, DeleteLikeVariables } from '@firebasegen/example-connector';

// The `DeleteLike` mutation requires an argument of type `DeleteLikeVariables`:
const deleteLikeVars: DeleteLikeVariables = {
  postId: ..., 
  userId: ..., 
};

// Call the `deleteLike()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteLike(deleteLikeVars);
// Variables can be defined inline as well.
const { data } = await deleteLike({ postId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteLike(dataConnect, deleteLikeVars);

console.log(data.like_delete);

// Or, you can use the `Promise` API.
deleteLike(deleteLikeVars).then((response) => {
  const data = response.data;
  console.log(data.like_delete);
});
```

### Using `DeleteLike`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteLikeRef, DeleteLikeVariables } from '@firebasegen/example-connector';

// The `DeleteLike` mutation requires an argument of type `DeleteLikeVariables`:
const deleteLikeVars: DeleteLikeVariables = {
  postId: ..., 
  userId: ..., 
};

// Call the `deleteLikeRef()` function to get a reference to the mutation.
const ref = deleteLikeRef(deleteLikeVars);
// Variables can be defined inline as well.
const ref = deleteLikeRef({ postId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteLikeRef(dataConnect, deleteLikeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.like_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.like_delete);
});
```

## CreateComment
You can execute the `CreateComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createComment(vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface CreateCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
}
export const createCommentRef: CreateCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createComment(dc: DataConnect, vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface CreateCommentRef {
  ...
  (dc: DataConnect, vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
}
export const createCommentRef: CreateCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCommentRef:
```typescript
const name = createCommentRef.operationName;
console.log(name);
```

### Variables
The `CreateComment` mutation requires an argument of type `CreateCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCommentVariables {
  postId: UUIDString;
  userId: string;
  content: string;
}
```
### Return Type
Recall that executing the `CreateComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCommentData {
  comment_insert: Comment_Key;
}
```
### Using `CreateComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createComment, CreateCommentVariables } from '@firebasegen/example-connector';

// The `CreateComment` mutation requires an argument of type `CreateCommentVariables`:
const createCommentVars: CreateCommentVariables = {
  postId: ..., 
  userId: ..., 
  content: ..., 
};

// Call the `createComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createComment(createCommentVars);
// Variables can be defined inline as well.
const { data } = await createComment({ postId: ..., userId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createComment(dataConnect, createCommentVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
createComment(createCommentVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `CreateComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCommentRef, CreateCommentVariables } from '@firebasegen/example-connector';

// The `CreateComment` mutation requires an argument of type `CreateCommentVariables`:
const createCommentVars: CreateCommentVariables = {
  postId: ..., 
  userId: ..., 
  content: ..., 
};

// Call the `createCommentRef()` function to get a reference to the mutation.
const ref = createCommentRef(createCommentVars);
// Variables can be defined inline as well.
const ref = createCommentRef({ postId: ..., userId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCommentRef(dataConnect, createCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

## CreateOutfitFeedback
You can execute the `CreateOutfitFeedback` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createOutfitFeedback(vars: CreateOutfitFeedbackVariables): MutationPromise<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;

interface CreateOutfitFeedbackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOutfitFeedbackVariables): MutationRef<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;
}
export const createOutfitFeedbackRef: CreateOutfitFeedbackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOutfitFeedback(dc: DataConnect, vars: CreateOutfitFeedbackVariables): MutationPromise<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;

interface CreateOutfitFeedbackRef {
  ...
  (dc: DataConnect, vars: CreateOutfitFeedbackVariables): MutationRef<CreateOutfitFeedbackData, CreateOutfitFeedbackVariables>;
}
export const createOutfitFeedbackRef: CreateOutfitFeedbackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOutfitFeedbackRef:
```typescript
const name = createOutfitFeedbackRef.operationName;
console.log(name);
```

### Variables
The `CreateOutfitFeedback` mutation requires an argument of type `CreateOutfitFeedbackVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateOutfitFeedbackVariables {
  userId: string;
  postId: UUIDString;
  rating: string;
  temperature?: number | null;
  weatherCondition?: string | null;
}
```
### Return Type
Recall that executing the `CreateOutfitFeedback` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOutfitFeedbackData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOutfitFeedbackData {
  outfitFeedback_insert: OutfitFeedback_Key;
}
```
### Using `CreateOutfitFeedback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOutfitFeedback, CreateOutfitFeedbackVariables } from '@firebasegen/example-connector';

// The `CreateOutfitFeedback` mutation requires an argument of type `CreateOutfitFeedbackVariables`:
const createOutfitFeedbackVars: CreateOutfitFeedbackVariables = {
  userId: ..., 
  postId: ..., 
  rating: ..., 
  temperature: ..., // optional
  weatherCondition: ..., // optional
};

// Call the `createOutfitFeedback()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOutfitFeedback(createOutfitFeedbackVars);
// Variables can be defined inline as well.
const { data } = await createOutfitFeedback({ userId: ..., postId: ..., rating: ..., temperature: ..., weatherCondition: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOutfitFeedback(dataConnect, createOutfitFeedbackVars);

console.log(data.outfitFeedback_insert);

// Or, you can use the `Promise` API.
createOutfitFeedback(createOutfitFeedbackVars).then((response) => {
  const data = response.data;
  console.log(data.outfitFeedback_insert);
});
```

### Using `CreateOutfitFeedback`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOutfitFeedbackRef, CreateOutfitFeedbackVariables } from '@firebasegen/example-connector';

// The `CreateOutfitFeedback` mutation requires an argument of type `CreateOutfitFeedbackVariables`:
const createOutfitFeedbackVars: CreateOutfitFeedbackVariables = {
  userId: ..., 
  postId: ..., 
  rating: ..., 
  temperature: ..., // optional
  weatherCondition: ..., // optional
};

// Call the `createOutfitFeedbackRef()` function to get a reference to the mutation.
const ref = createOutfitFeedbackRef(createOutfitFeedbackVars);
// Variables can be defined inline as well.
const ref = createOutfitFeedbackRef({ userId: ..., postId: ..., rating: ..., temperature: ..., weatherCondition: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOutfitFeedbackRef(dataConnect, createOutfitFeedbackVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.outfitFeedback_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.outfitFeedback_insert);
});
```

## DeletePost
You can execute the `DeletePost` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deletePost(vars: DeletePostVariables): MutationPromise<DeletePostData, DeletePostVariables>;

interface DeletePostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePostVariables): MutationRef<DeletePostData, DeletePostVariables>;
}
export const deletePostRef: DeletePostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePost(dc: DataConnect, vars: DeletePostVariables): MutationPromise<DeletePostData, DeletePostVariables>;

interface DeletePostRef {
  ...
  (dc: DataConnect, vars: DeletePostVariables): MutationRef<DeletePostData, DeletePostVariables>;
}
export const deletePostRef: DeletePostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePostRef:
```typescript
const name = deletePostRef.operationName;
console.log(name);
```

### Variables
The `DeletePost` mutation requires an argument of type `DeletePostVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePostVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePost` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePostData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePostData {
  post_delete?: Post_Key | null;
}
```
### Using `DeletePost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePost, DeletePostVariables } from '@firebasegen/example-connector';

// The `DeletePost` mutation requires an argument of type `DeletePostVariables`:
const deletePostVars: DeletePostVariables = {
  id: ..., 
};

// Call the `deletePost()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePost(deletePostVars);
// Variables can be defined inline as well.
const { data } = await deletePost({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePost(dataConnect, deletePostVars);

console.log(data.post_delete);

// Or, you can use the `Promise` API.
deletePost(deletePostVars).then((response) => {
  const data = response.data;
  console.log(data.post_delete);
});
```

### Using `DeletePost`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePostRef, DeletePostVariables } from '@firebasegen/example-connector';

// The `DeletePost` mutation requires an argument of type `DeletePostVariables`:
const deletePostVars: DeletePostVariables = {
  id: ..., 
};

// Call the `deletePostRef()` function to get a reference to the mutation.
const ref = deletePostRef(deletePostVars);
// Variables can be defined inline as well.
const ref = deletePostRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePostRef(dataConnect, deletePostVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.post_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.post_delete);
});
```


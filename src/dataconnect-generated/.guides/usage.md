# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useUpdateUserProfile, useCreatePost, useListPosts, useGetOutfits, useListAllUsers, useGetUserProfile } from '@firebasegen/example-connector/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUserProfile(updateUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useCreatePost(createPostVars);

const { data, isPending, isSuccess, isError, error } = useListPosts();

const { data, isPending, isSuccess, isError, error } = useGetOutfits(getOutfitsVars);

const { data, isPending, isSuccess, isError, error } = useListAllUsers();

const { data, isPending, isSuccess, isError, error } = useGetUserProfile(getUserProfileVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUserProfile, createPost, listPosts, getOutfits, listAllUsers, getUserProfile } from '@firebasegen/example-connector';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUserProfile:  For variables, look at type UpdateUserProfileVars in ../index.d.ts
const { data } = await UpdateUserProfile(dataConnect, updateUserProfileVars);

// Operation CreatePost:  For variables, look at type CreatePostVars in ../index.d.ts
const { data } = await CreatePost(dataConnect, createPostVars);

// Operation listPosts: 
const { data } = await ListPosts(dataConnect);

// Operation getOutfits:  For variables, look at type GetOutfitsVars in ../index.d.ts
const { data } = await GetOutfits(dataConnect, getOutfitsVars);

// Operation listAllUsers: 
const { data } = await ListAllUsers(dataConnect);

// Operation GetUserProfile:  For variables, look at type GetUserProfileVars in ../index.d.ts
const { data } = await GetUserProfile(dataConnect, getUserProfileVars);


```
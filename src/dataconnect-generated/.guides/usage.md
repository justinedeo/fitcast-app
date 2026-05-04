# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useUpdateUserProfile, useCreatePost, useCreateLike, useDeleteLike, useCreateComment, useCreateOutfitFeedback, useDeletePost, useListPosts, useGetPostsByZip } from '@firebasegen/example-connector/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUserProfile(updateUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useCreatePost(createPostVars);

const { data, isPending, isSuccess, isError, error } = useCreateLike(createLikeVars);

const { data, isPending, isSuccess, isError, error } = useDeleteLike(deleteLikeVars);

const { data, isPending, isSuccess, isError, error } = useCreateComment(createCommentVars);

const { data, isPending, isSuccess, isError, error } = useCreateOutfitFeedback(createOutfitFeedbackVars);

const { data, isPending, isSuccess, isError, error } = useDeletePost(deletePostVars);

const { data, isPending, isSuccess, isError, error } = useListPosts();

const { data, isPending, isSuccess, isError, error } = useGetPostsByZip(getPostsByZipVars);

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
import { createUser, updateUserProfile, createPost, createLike, deleteLike, createComment, createOutfitFeedback, deletePost, listPosts, getPostsByZip } from '@firebasegen/example-connector';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUserProfile:  For variables, look at type UpdateUserProfileVars in ../index.d.ts
const { data } = await UpdateUserProfile(dataConnect, updateUserProfileVars);

// Operation CreatePost:  For variables, look at type CreatePostVars in ../index.d.ts
const { data } = await CreatePost(dataConnect, createPostVars);

// Operation CreateLike:  For variables, look at type CreateLikeVars in ../index.d.ts
const { data } = await CreateLike(dataConnect, createLikeVars);

// Operation DeleteLike:  For variables, look at type DeleteLikeVars in ../index.d.ts
const { data } = await DeleteLike(dataConnect, deleteLikeVars);

// Operation CreateComment:  For variables, look at type CreateCommentVars in ../index.d.ts
const { data } = await CreateComment(dataConnect, createCommentVars);

// Operation CreateOutfitFeedback:  For variables, look at type CreateOutfitFeedbackVars in ../index.d.ts
const { data } = await CreateOutfitFeedback(dataConnect, createOutfitFeedbackVars);

// Operation DeletePost:  For variables, look at type DeletePostVars in ../index.d.ts
const { data } = await DeletePost(dataConnect, deletePostVars);

// Operation listPosts: 
const { data } = await ListPosts(dataConnect);

// Operation GetPostsByZip:  For variables, look at type GetPostsByZipVars in ../index.d.ts
const { data } = await GetPostsByZip(dataConnect, getPostsByZipVars);


```
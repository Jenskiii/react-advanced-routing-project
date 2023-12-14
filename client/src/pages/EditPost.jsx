import { redirect, useActionData, useLoaderData } from "react-router-dom";
import { PostForm, postFormValidator } from "../components/PostForm";
import { getUsers } from "../api/users";
import { getPost, updatePost } from "../api/posts";

function EditPost() {
  const { users, post } = useLoaderData();

  const errors = useActionData()

  return (
    <>
      <h1 className="page-title">Edit Post</h1>
      <PostForm users={users} defaultValues={post} errors={errors}/>
    </>
  );
}

//  load users data
// post id = used to get specific post
async function loader({ request: { signal }, params: { postId } }) {
  const post = getPost(postId, { signal });
  const users = getUsers({ signal });
  return { post: await post, users: await users };
}

//  must be async
async function action({ request, params: { postId } }) {
  const formData = await request.formData();

  // value we need to update post
  const title = formData.get("title");
  const body = formData.get("body");
  const userId = formData.get("userId");

  // error handeling
  const errors = postFormValidator({ title, body, userId });
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  // update post
  // postId is used to update related post
  // check updatePost at api/posts.js
  const post = await updatePost(
    postId,
    { title, body, userId },
    { signal: request.signal }
  );

  // redirects you to the created post page
  return redirect(`/posts/${post.id}`);
}

export const editPostRoute = {
  loader,
  action,
  element: <EditPost />,
};

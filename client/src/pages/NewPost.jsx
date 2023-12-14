import { useLoaderData, redirect, useActionData } from "react-router-dom";
import { getUsers } from "../api/users";
import { createPost } from "../api/posts";
import { PostForm, postFormValidator } from "../components/PostForm";

function NewPost() {
  // import users data
  const users = useLoaderData();

  // imported from actions function
  const errors = useActionData()

  return (
    <>
      <h1 className="page-title">New Post</h1>
      <PostForm users={users} errors={errors}/>
    </>
  );
}

//  must be async
async function action({ request }) {
  const formData = await request.formData();

  // value we need for the new post
  const title = formData.get("title");
  const body = formData.get("body");
  const userId = formData.get("userId");

  // error handeling
  const errors = postFormValidator({title,body, userId})
  if(Object.keys(errors).length > 0){
    return errors
  }

  // create post
  // check createPost at api/posts.js
  const post = await createPost(
    { title, body, userId },
    { signal: request.signal }
  );

  // redirects you to the created post page
  return redirect(`/posts/${post.id}`);
}

//  load users data
function loader({ request: { signal } }) {
  return getUsers({ signal });
}

export const newPostRoute = {
  loader,
  action,
  element: <NewPost />,
};

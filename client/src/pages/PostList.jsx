import { Link, useLoaderData, Form, useNavigation } from "react-router-dom";
import { getPosts } from "../api/posts";
import { PostCard } from "../components/PostCard";
import { useEffect, useRef } from "react";
import { getUsers } from "../api/users";
import { FormGroup } from "../components/FormGroup";

function PostList() {
  // imports posts + query value
  // default value added so it gets selected automaticly
  const {
    posts,
    users,
    searchParams: { query, userId},
  } = useLoaderData();

  // query input search value
  const queryRef = useRef();
  // auto updates url based on queryRef
  useEffect(() => {
    // if query not defined will be equal to empty string
    queryRef.current.value = query || "";
  }, [query]);

  // user id value of author
  const userIdRef = useRef();
  // auto update uses id value
  useEffect(() => {
    // if userId not defined will be equal to empty string
    userIdRef.current.value = userId || "";
  }, [userId]);

  // used for loading states
  const { state } = useNavigation();

  return (
    <>
      <h1 className="page-title">
        Posts
        <div className="title-btns">
          <Link className="btn btn-outline" to="new">
            New
          </Link>
        </div>
      </h1>

      <Form className="form mb-4">
        <div className="form-row">
          <FormGroup className="form-group">
            <label htmlFor="query">Query</label>
            <input type="search" name="query" id="query" ref={queryRef} />
          </FormGroup>
          <FormGroup className="form-group">
            <label htmlFor="userId">Author</label>
            <select type="search" name="userId" id="userId" ref={userIdRef}>
              <option value="">Any</option>
              {users.map((user) => {
                return (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                );
              })}
            </select>
          </FormGroup>
          <button disabled={state === "loading" ? true : false} className="btn">
            {state === "loading" ? "loading.." : "Filter"}
          </button>
        </div>
      </Form>

      <div className="card-grid">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </>
  );
}

async function loader({ request: { signal, url } }) {
  // searchParams + query is used to filter links
  const searchParams = new URL(url).searchParams;
  const query = searchParams.get("query");
  const filterParams = { q: query };

  // used to search based on selected user
  const userId = searchParams.get("userId");
  // if input contains update id
  if (userId !== "") filterParams.userId = userId;

  // import posts and users
  const posts = getPosts({ signal, params: filterParams });
  const users = getUsers({ signal });

  return {
    posts: await posts,
    users: await users,
    searchParams: { query, userId },
  };
}

export const postListRoute = {
  loader,
  element: <PostList />,
};

import { Form, Link, useNavigation } from "react-router-dom";
import { FormGroup } from "./FormGroup";

// turning prop into empty obj it has all default values
export function PostForm({ users, errors = {} , defaultValues = {}}) {
  // better to specify this inside parent with props 
  // so the components stays modular
  // and you can still use it, when you dont use react router dom
  const { state } = useNavigation;
  const isSubmitting = state === "submitting";
  return (
    <>
      {/* url redirect */}
      {/* actions is automaticly based on the page  */}
      <Form method="post" className="form">
        <div className="form-row">
          <FormGroup errorMessage={errors.title}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={defaultValues.title}
            />
          </FormGroup>
          <FormGroup errorMessage={errors.userId}>
            <label htmlFor="userId">Author</label>
            <select
              name="userId"
              id="userId"
              defaultValue={defaultValues.userId}
            >
              {users.map((user) => {
                return (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                );
              })}
            </select>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup errorMessage={errors.body}>
            <label htmlFor="body">Body</label>
            <textarea
              name="body"
              id="body"
              defaultValue={defaultValues.body}
            ></textarea>
          </FormGroup>
        </div>
        <div className="form-row form-btn-row">
          <Link className="btn btn-outline" to="..">
            Cancel
          </Link>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Saving.." : "save"}
          </button>
        </div>
      </Form>
    </>
  );
}

//  error handeling
export function postFormValidator({title,body,userId}){
  const errors = {}

  if( title === "") errors.title = "required"
  if( body === "") errors.body = "required"
  if( userId === "") errors.userId = "required"

  return errors
}
import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      // data.getPosts is read only now
    //   Original:
    //   data.getPosts = [result.data.createPost, ...data.getPosts];
    //   proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
    //   resolved: new variable 'posts'
        const posts = [result.data.createPost, ...data.getPosts];
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: posts } });
      
      values.body = '';
    }, onError(err) {
        // this is added by me
        return err
      },
  });

  function createPostCallback() {
    createPost();
  }

  // minor change: used textarea instead of input
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.TextArea
            placeholder="Enter your post here (。・∀・)ノ"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
            rows={5}
            cols={5}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      userName
      likes {
        id
        userName
        createdAt
      }
      likeCount
      comments {
        id
        body
        userName
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
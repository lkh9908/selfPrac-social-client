import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon, Popup } from 'semantic-ui-react';

// import MyPopup from '../util/MyPopup';

function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.userName === user.userName)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? (
      <Button color="teal" >
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Popup content = {liked ? 'Unlike this post...' : 'Like this post...'} trigger = {
      <Button as="div" labelPosition="right" onClick={likePost}>
      {/* <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup> */}
      {likeButton}
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
    }/>
  );
}

// Cache data may be lost when replacing the likes field of a Post object.
// Solved by editing ApolloProvider

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        userName
      }
      likeCount
    }
  }
`;

export default LikeButton;
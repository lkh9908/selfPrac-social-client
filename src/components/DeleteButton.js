import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql'

// import { FETCH_POSTS_QUERY } from '../util/graphql';
// import MyPopup from '../util/MyPopup';

function DeleteButton({ postId, commentId, callback }){
    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrMutation] = useMutation(mutation, {
      update(proxy){
        if(!commentId){
          setConfirmOpen (false)
          const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY
          })

          // added post as a transitional variable because return is read only now
          const posts = data.getPosts.filter(p => p.id !== postId)
          proxy.writeQuery({query: FETCH_POSTS_QUERY, data: { getPosts: posts }})
        }

        if (callback) callback()
    },
      variables: {postId, commentId}
    });
    
return (
    <>
        <Popup
          content = {commentId ? 'Delete comment...' : 'Delete post...'}
          trigger = {
            <Button 
            as = "div" 
            color = "youtube"
            floated = "right"
            onClick={()=>setConfirmOpen(true)} >
            <Icon name = "trash" style = {{margin: 0}}></Icon>
            </Button>
          }
        />
        <Confirm
            open= {confirmOpen}
            onCancel={()=>setConfirmOpen(false)}
            onConfirm={deletePostOrMutation}
        />
    </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
      deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        userName
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton
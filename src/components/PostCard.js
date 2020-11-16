import React, { useContext } from 'react'
import { Button, Card, Icon, Label, Image, Popup} from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

function PostCard ({post:{ body, createdAt, id, userName, likeCount, commentCount, likes }}) {
    const { user } = useContext(AuthContext)

    return (
        <Card fluid>
            <Card.Content as = {Link} to = {`/posts/${id}`}>
                <Image floated='right'size='small'src='https://i.pinimg.com/originals/d0/9e/2a/d09e2a6e3ab2e8113b672d304f3a6110.png'/>
                <Card.Header> {userName} </Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user = {user} post = {{ id, likes, likeCount}}/>

                <Popup
                    content = "Comment on this post..."
                    trigger={
                        <Button labelPosition='right' as = {Link} to = {`/posts/${id}`}>
                            <Button color='teal' basic>
                            <Icon name='comments' />
                            </Button>
                            <Label  basic color='teal' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                    }
                />
                {/* if it's the user's post */}
                {user && user.userName === userName && <DeleteButton postId={id} />}
            </Card.Content>
    </Card>
    )
}

export default PostCard
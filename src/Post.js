import React,{useState, useEffect} from 'react'
import './post.css'
import Avatar from "@material-ui/core/avatar"
import {db} from './firebase'
import { Button } from '@material-ui/core';
import firebase from 'firebase'

function Post({postId, userName, imageUrl, caption, user}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");


    useEffect(() => {
        let unSubscribe;
        if(postId){
            unSubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapShot) => {
                setComments(snapShot.docs.map((doc) => doc.data()))
            })
        }
        return () => {
            unSubscribe()
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        })
            setComment('');
    }
    return (
        <div className="post">
        <div className="post__header">
        
        <Avatar 
            className="post__avatar"
            alt="Goku"
            src="/static/images/avatar/1.jpg" 
        />
        <h5>{userName}</h5>
        </div>
        
            {/* header > avatar > username */}

        <img className="post__image" src={imageUrl} alt=""/>

        <h4 className="post__text"><strong>{userName}</strong> {caption}</h4>
        <div className="post__comments">
            {comments.map((comment) => (
                <p>
                    <strong>{comment.username}</strong> {comment.text}
                </p>
            ))}
        </div>
        {user && (
            <form class="post__commentbox">
        <input value={comment} onChange={(e) => setComment(e.target.value)} className="post__comment" type='text' placeholder="Add a comment..."></input>
       <Button color="primary" className="post__commentbtn" type="submit" disabled={!comment} onClick={postComment}>
           Post
       </Button>
        </form>
        )}
       
       
        </div>
    )
}

export default Post



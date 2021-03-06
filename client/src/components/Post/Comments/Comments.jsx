import axios from 'axios';
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from 'components/Button/Button';
import Comment from './Comment/Comment'
import UserProfileImage from 'components/UserProfileImage';
import { radius } from 'style';

const StyledComments = styled.div`
    border-top: 1px solid #a5a5a5;
    padding-top: 10px;
`
const CommentInput = styled.div`
    display: flex;

    > p {
        display: flex;
        align-items: center;
        border-radius: ${radius.primary};
        padding: 0 10px;
        width: 100%;
        background-color: #eef0f5;
        height: 45px;
        margin-left: 10px;
        color: grey;
    }

    > form {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        align-items: flex-end;
        margin-left: 10px;
        width: 100%;

        > textarea {
            background-color: #eef0f5;
            box-sizing: border-box;
            border-radius: ${radius.primary};
            width: 100%;
            padding: 10px;
        }
    }
`
const CommentToggle = styled.p`
    margin-top: 15px;
    color: #636363;

    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`

const Comments = ({ postId, commentInputMode, setCommentInputMode }) => {
    const user = JSON.parse(localStorage.getItem('user')) || undefined;

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState({
        user_id: user.id,
        post_id: postId,
        text: "",
        parent_id: null
    });

    // default number of comments to show
    const [commentsToShow, setCommentsToShow] = useState(4);

    const getComments = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/post/${postId}`, {
                headers: {
                    Authorization: (localStorage.getItem('token'))
                }
            });

            setComments(formatCommentsData(res.data));
        } catch (err) {
            console.log(err);
        }
    };

    // fetch post comments at component mount
    useEffect(() => {
        getComments();
    }, [])


    // Split comments from comments' replies and add a 'replies' field for each comment with the comment's replies
    const formatCommentsData = (rawCommentsData) => {
        let formattedComments = [];
        let index;

        /* 
        Data from db is in descending order, so by looping the array backwards
        i will always find the parent comment first and its replies after
        */
        for (let i = rawCommentsData.length - 1; i >= 0; i--) {

            // if parent_id field is null, element is a comment
            if (!rawCommentsData[i].parent_id) {
                formattedComments.unshift(rawCommentsData[i]);
            } else {
                // element is a reply because parent_id field contains parent comment's id

                // get index of parent comment
                index = formattedComments.findIndex(elem => elem.id == rawCommentsData[i].parent_id);

                // create replies array field if it doesn't exists
                if (!formattedComments[index].replies) {
                    formattedComments[index].replies = [];
                }

                // add reply into replies array field
                formattedComments[index].replies.unshift(rawCommentsData[i]);
            }
        };
        return formattedComments;
    };

    const createComment = async (commentData) => {
        setCommentInputMode(false);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/comments`, commentData, {
                headers: {
                    Authorization: (localStorage.getItem('token'))
                }
            });

            if (res.data.message === 'Comment created') {
                const newComment = res.data.comment;

                // add user's full name and profile image url to new comment
                newComment.full_name = user.full_name;
                newComment.profile_img_url = user.profile_img_url

                /* Check if it's a parent comment or a comment's reply
                (comment's replies have a parent_id field with the id of their parent comment). */
                if (!newComment.parent_id) {
                    // copy comments state array, add new comment and update the state array
                    setComments(oldComments => [newComment, ...oldComments])

                    // reset comment text
                    setComment({ ...comment, text: "" });

                    // reset 'show/hide more comments' button text
                    if (comments.length <= 5) {
                        setCommentsToShow(4)
                    };
                } else {
                    // copy state array 
                    let newComments = [...comments];

                    // find index of parent comment
                    let index = comments.findIndex(elem => elem.id == newComment.parent_id)

                    // create replies array field if it doesn't exists
                    if (!newComments[index].replies) {
                        newComments[index].replies = [];
                    }

                    // add the new reply to the beginning
                    newComments[index].replies.unshift(newComment);

                    // set the updated array as state array to trigger component update 
                    setComments(newComments);
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const updateComment = async (comment) => {
        const updatedComment = {
            text: comment.text,
            updated_at: new Date()
        };

        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/comments/${comment.id}`, updatedComment, {
                headers: {
                    Authorization: (localStorage.getItem('token'))
                }
            });

            if (res.data.message === "Comment updated") {
                // copy state array
                let newComments = [...comments];
                let index;

                /* Check if it's a parent comment or a comment's reply
                (comment's replies have a parent_id field with the id of their parent comment). */
                if (!comment.parent_id) {
                    // find index of the edited comment
                    index = comments.findIndex(elem => elem.id == comment.id);

                    // update edited comment
                    newComments[index] = comment;
                } else {
                    // find index of parent comment
                    index = comments.findIndex(elem => elem.id == comment.parent_id)

                    // find index of edited reply
                    let replyIndex = comments[index].replies.findIndex(elem => elem.id == comment.id)

                    // update edited reply
                    newComments[index].replies[replyIndex] = comment;
                }
                // set the updated comments array as state array to trigger component update 
                setComments(newComments);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteComment = async (comment) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}/comments/${comment.id}`, {
                headers: {
                    Authorization: (localStorage.getItem('token'))
                }
            });

            if (res.data.message === "Comment deleted") {
                /* Check if it's a parent comment or a comment's reply
                (comment's replies have a parent_id field with the id of their parent comment). */
                if (!comment.parent_id) {
                    // copy comments state array and remove deleted comment
                    setComments(oldComments => [...oldComments].filter(elem => elem.id != comment.id));
                } else {
                    // copy state array 
                    let newComments = [...comments];

                    // find index of parent comment
                    let index = comments.findIndex(elem => elem.id == comment.parent_id)

                    // remove deleted reply from comment's replies array
                    newComments[index].replies = newComments[index].replies.filter(elem => elem.id != comment.id)

                    // set the updated array as state array to trigger component update 
                    setComments(newComments);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    // handle new comment input
    const handleInput = (e) => {
        setComment({
            ...comment,
            text: e.target.value
        });
    };

    // toggle between showing all comments or only the last 4 (default option)
    const toggleAllComments = () => {
        commentsToShow === 4 ? setCommentsToShow(comments.length) : setCommentsToShow(4);
    };

    return (
        <StyledComments>
            <CommentInput>
                <UserProfileImage src={user.profile_img_url} />

                {commentInputMode ?
                    <form onSubmit={() => createComment(comment)}>
                        <textarea required autoFocus rows='2' value={comment.text} onChange={handleInput} />
                        <Button width='100px' primary>Confirm</Button>
                    </form>
                    :
                    <p onClick={() => setCommentInputMode(true)}>Write your comment...</p>
                }
            </CommentInput>

            {comments.map((comment, index) => {
                if (index < commentsToShow) {
                    return <Comment
                        comment={comment}
                        key={comment.id}
                        createComment={createComment}
                        updateComment={updateComment}
                        deleteComment={deleteComment}
                    />
                }
                return null;
            })}

            {/* 
                If comments are <= 4, hide button text.
                If comments are > 4 and user didn't click the button, display "Show all 'n' comments" text.
                If comments are > 4 and user clicked button, display "Hide comments" text
            */}
            {comments.length > 4 ?
                <CommentToggle onClick={toggleAllComments}>
                    {commentsToShow === 4 ?
                        `Show all ${comments.length} comments`
                        : "Hide comments"}
                </CommentToggle>
                : undefined
            }
        </StyledComments>
    )
};

export default Comments

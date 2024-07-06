import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import useUser from '../hooks/useUser';
import articles from './article-content';
 
const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: false });
    const { canUpvote } = articleInfo;
    const { articleId } = useParams();
    const { user, isLoading } = useUser();
 
    // useEffect(() => {
    //     const loadArticleInfo = async () => {
    //         const token = user && await user.getIdToken();
    //         const headers = token ? { authtoken: token } : {};
    //         const response = await axios.get(`/api/articles/${articleId}`, { headers });
    //         const newArticleInfo = response.data;
    //         setArticleInfo(newArticleInfo);

    //         try {
    //             const response = await axios.get('http://localhost:8000/api/articles/learn-react');
    //             console.log(response.data);
    //           } catch (error) {
    //             if (error.response) {
    //               // The request was made and the server responded with a status code
    //               // that falls out of the range of 2xx
    //               console.error('Server responded with an error:', error.response.data);
    //             } else if (error.request) {
    //               // The request was made but no response was received
    //               console.error('No response received:', error.request);
    //             } else {
    //               // Something happened in setting up the request that triggered an Error
    //               console.error('Error setting up request:', error.message);
    //             }
    //           }
    //     }
 
    //     if (!isLoading) {
    //         loadArticleInfo();
    //     }

    // }, [isLoading, user, articleId]);

    useEffect(() => {
        const loadArticleInfo = async () => {
            try {
                const token = user && await user.getIdToken();
                const headers = token ? { authtoken: token } : {};
                const response = await axios.get(`/api/articles/${articleId}`, { headers });
                const newArticleInfo = response.data;
                setArticleInfo(newArticleInfo);
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        };

        if (!isLoading) {
            loadArticleInfo();
        }
    }, [isLoading, user, articleId]);
 
    const article = articles.find(article => article.name === articleId);
    // const addUpvote = async () => {
    //     const token = user && await user.getIdToken();
    //     const headers = token ? { authtoken: token } : {};
    //     const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers });
    //     const updatedArticle = response.data;
    //     setArticleInfo(updatedArticle);
    // }

    const addUpvote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        try {
            const response = await axios.put(`http://localhost:8000/api/articles/${articleId}/upvote`, null, { headers });
            const updatedArticle = response.data;
            setArticleInfo(updatedArticle);
        } catch (error) {
            console.error('Failed to add upvote:', error);
        }
    };
 
    if (!article) {
        return <NotFoundPage />
    }
 
    return (
        <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            {user
                ? <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}</button>
                : <button>Log in to upvote</button>}
            <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>

        {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
        ))}

        {user
            ? <AddCommentForm
                articleName={articleId}
                onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
            : <button>Log in to add a comment</button>}
        <CommentsList comments={articleInfo.comments} />
        </>
    );

}

export default ArticlePage;
 
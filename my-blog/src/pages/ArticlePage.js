import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import articles from "./article-content";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: false});
    const { canUpvote } = articleInfo;
    const { articleId } = useParams();

    const {user, isLoading} = useUser();

    useEffect(() => {
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? {authtoken: token} : {};
            const respose = await axios.get(`/api/articles/${articleId}`, { headers });
            const NewArticleInfo = respose.data;
            setArticleInfo(NewArticleInfo);
        }

        if (!isLoading)  {
            loadArticleInfo();
        }
        }, [isLoading, user]);

 
    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? {authtoken: token} : {};
        const response = await axios.put(`/api/articles/${articleId}/upvote`,null,{ headers });
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if (!article) {
        return <NotFoundPage/>
    }

    return (
        <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
        {user
            ?<button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}</button>
            :<button>Log in to upvote</button>}
        </div>
        <p>This article has {articleInfo.upvotes} upvote(s) </p>        
        {article.content.map((paragraph, i)=> (
            <p key={i}>{paragraph}</p>
        ))}
        {user 
        ?<AddCommentForm
            articleName={articleId}
            onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
            :<button>Log in to comment</button>}
        <CommentsList comments={articleInfo.comments} />
        
        </>
    );
}

export default ArticlePage;
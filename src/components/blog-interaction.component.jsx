// import { useContext, useEffect } from "react"
// import { BlogContext } from "../pages/blog.page"
// import { Link } from "react-router-dom"
// import { UserContext } from "../App";
// import { Toaster, toast } from "react-hot-toast";
// import axios from "axios";

// const BlogInteraction = () => {

//     let { blog, blog: { _id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog, isLikedByUser, setIsLikedByUser, setCommentsWrapper } = useContext(BlogContext);

//     let { userAuth: { username, access_token } } = useContext(UserContext);

//     useEffect(() => {

//         if(access_token){

//             axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id }, { 
//                 headers: {
//                     'Authorization': `Bearer ${access_token}`
//                 }
//             })
//             .then(({ data: { result } }) => {
//                 setIsLikedByUser(Boolean(result))
//             })
//             .catch(err => {
//                 console.log(err);
//             })

//         }

//     },[])

//     const handleLike = () => {

//         if(access_token){

//             setIsLikedByUser(preVal => !preVal);

//             !isLikedByUser ? total_likes++ : total_likes--;

//             setBlog({ ...blog, activity: { ...activity, total_likes } })

//             axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser }, {
//                 headers: {
//                     'Authorization': `Bearer ${access_token}`
//                 }
//             })
//             .then(({ data }) => {
//                 console.log(data);
//             })
//             .catch(err => {
//                 console.log(err);
//             })

//         }
//         else{
//             toast.error('Please Login to like this blog')
//         }

//     }

//     return(
//         <>
//             <Toaster />
//             <hr className="border-grey my-2"/>

//             <div className="flex gap-6 justify-between">
//                 <div className="flex gap-3 items-center">

//                     <button
//                         onClick={handleLike}
//                         className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")}
//                     >
//                         <i className={"fi " + ( isLikedByUser ? "fi-ss-social-network" : "fi-rs-social-network" ) }></i>
//                     </button>
//                     <p className="text-xl text-dark-grey">{ total_likes }</p>

//                     <button
//                         onClick={() => setCommentsWrapper(preVal => !preVal)}
//                         className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
//                     >
//                         <i className="fi fi-rs-comment"></i>
//                     </button>
//                     <p className="text-xl text-dark-grey">{ total_comments }</p>
//                 </div>

//                 <div className="flex gap-6 items-center">

//                     {
//                         username == author_username ?
//                         <Link className="underline hover:text-purple" to={`/editor/${blog_id}`}>Edit</Link> : 
//                         ""
//                     }

//                     <Link to={ `https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}` }> <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i> </Link>

//                 </div>
//             </div>

//             <hr className="border-grey my-2"/>
//         </>
//     )
// }

// export default BlogInteraction


import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
    const { 
        blog, 
        setBlog, 
        isLikedByUser, 
        setIsLikedByUser, 
        setCommentsWrapper 
    } = useContext(BlogContext);

    const { userAuth } = useContext(UserContext);

    useEffect(() => {
        if (userAuth?.access_token && blog?._id) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id: blog._id }, { 
                headers: {
                    'Authorization': `Bearer ${userAuth.access_token}`
                }
            })
            .then(({ data: { result } }) => {
                setIsLikedByUser(Boolean(result));
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [userAuth?.access_token, blog?._id, setIsLikedByUser]);

    const handleLike = () => {
        if (userAuth?.access_token) {
            setIsLikedByUser(preVal => !preVal);

            const updatedLikes = isLikedByUser ? blog.activity.total_likes - 1 : blog.activity.total_likes + 1;

            setBlog({ 
                ...blog, 
                activity: { 
                    ...blog.activity, 
                    total_likes: updatedLikes 
                }
            });

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id: blog._id, isLikedByUser }, {
                headers: {
                    'Authorization': `Bearer ${userAuth.access_token}`
                }
            })
            .then(({ data }) => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });
        } else {
            toast.error('Please Login to like this blog');
        }
    };

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2"/>

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleLike}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isLikedByUser ? "text-red" : ""}`}
                    >
                        <i className={`fi ${isLikedByUser ? "fi-ss-social-network" : "fi-rs-social-network"}`}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{ blog.activity.total_likes }</p>

                    <button
                        onClick={() => setCommentsWrapper(preVal => !preVal)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:text-red"
                    >
                        <i className="fi fi-rs-comment"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{ blog.activity.total_comments }</p>
                </div>

                <div className="flex gap-6 items-center">
                    { userAuth?.username === blog.author?.personal_info?.username &&
                        <Link className="underline hover:text-purple" to={`/editor/${blog.blog_id}`}>Edit</Link>
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${blog.title}&url=${location.href}`}>
                        <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                    </Link>
                </div>
            </div>

            <hr className="border-grey my-2"/>
        </>
    );
};

export default BlogInteraction;

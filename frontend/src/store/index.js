import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
import axios from "axios";
// import post from "../../../Backend/models/post";
let ls = new SecureLS({ isCompression: false });

export default createStore({
    state: {
        user: [null], //!localStorage.getItem("userToken")
        users: null,
        post: null,
        posts: null,
        comment: null,
        // addPos : null,
    },
    getters: {
        user: (state) => {
            // Get current value of the user, which in this case user is null
            return state.user;
        },
        users: (state) => {
            // Get current value of the user, which in this case user is null
            return state.users;
        },
        post: (state) => {
            //  get current value of the post
            return state.post;
        },
        posts: (state) => {
            //  get current value of the post
            return state.posts;
        },
        comment: (state) => {
            //  get current value of the comment
            return state.comment;
        },
    },

    plugins: [
        createPersistedState({
            key: "keyname",
            paths: window.localStorage,
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.removeAll(key),
            expires: 1, // 24 heures
        }),
    ],

    actions: {
        login({ commit }, user) {
            const loginAPI = "api/auth/login";
            return new Promise((resolve, reject) => {
                axios.post(loginAPI, {
                    email: user.email,
                    password: user.password,
                })
                    .then((response) => {
                        console.log(response.data);
                        localStorage.setItem("userToken", response.data.token);
                        axios.defaults.headers.common["Authorization"] =
                            "Bearer " + response.data.token;

                        commit("user", response.data.user);
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },

        signup({ commit }, user) {
            const signUpAPI = "api/auth/signup";
            return new Promise((resolve, reject) => {
                axios
                    .post(signUpAPI, {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: user.userName,
                        email: user.email,
                        password: user.password,
                    })
                    .then((response) => {
                        commit("user", response.data.user);
                        // commit ('user', response.data.user)

                        console.log("response", response);

                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },
        // Creation du post
        createPost({ commit }, post) {
            console.log(post.postContent);
            let formData = new FormData();
            formData.append("image", post.image);
            formData.append("postContent", post.postContent);
            console.log("formData", formData);
            const createPost = "/api/message";
            return new Promise((resolve, reject) => {
                axios
                    .post(createPost, formData)
                    .then((response) => {
                        console.log("createPost");
                        commit("addPost", response.data.post);
                        console.log(response.data);
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },

        updatePost({ commit }, post) {
            let formData = new FormData();
            formData.append("image", post.image);
            formData.append("postContent", post.postContent);
            const createUpdatePost = `/api/message/${post.dynamicId}`;
            console.log(createUpdatePost);
            return new Promise((resolve, reject) => {
                axios
                    .put(createUpdatePost, formData)
                    .then((response) => {
                        console.log(response.data.post);
                        commit("updatePost", response.data.post);
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },

        // Impression de tous les posts
        getAllPost({ commit }) {
            const getAllPost = "api/message";
            return new Promise((resolve, reject) => {
                axios
                    .get(getAllPost)
                    .then((response) => {
                        console.log("GetAllPost");
                        console.log(response.data.posts);

                        commit("posts", response.data.posts);
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },

        // impression de mes posts
        getMyPosts({ commit }, dynamicId) {
            // const userIdDynamic = posts.DynamicId;
            const getMyPosts = `api/message/${dynamicId}`;
            return new Promise((resolve, reject) => {
                axios
                    .get(getMyPosts)
                    .then((response) => {
                        console.log(response);
                        // posts.thisMyPosts = response.data.myPost;
                        console.log("Recuperer mes posts");
                        console.log(response.data.myPosts);
                        commit("posts", response.data.myPosts);
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },

        deletePost({ commit }, post) {
            const confirmDelete = confirm(
                "Êtes vous sûr de vouloir supprimer ce post ?"
            );
            const deletePost = `api/message/${post.dynamicId}`;
            console.log("before promise", post.dynamicId);
            if (confirmDelete) {
                return new Promise((resolve, reject) => {
                    console.log("after promise");
                    axios
                        .delete(deletePost)
                        .then((response) => {
                            console.log("delete reponse: ", response.data.post);
                            commit("deletePost", response.data);
                            console.log("delete reponse");
                            resolve(response);
                        })
                        .catch((error) => {
                            // post
                            console.log(error);
                            reject(error);
                        });
                });
            }
        },

        // Pour pointer le modal de post, pour avoir le bon id
        post({ commit }, post) {
            commit("post", post);
        },

        createComment({ commit }, comment) {
            console.log("this.comment");
            let formData = new FormData();
            formData.append("image", comment.image);
            formData.append("comment", comment.commentaire);
            //console.log("formData", formData);
            const createComment = `api/comment/${comment.postId}`;
            return new Promise((resolve, reject) => {
                axios
                    .post(createComment, formData)
                    .then((response) => {
                        console.log("Hey::", response.data.comment);
                        commit("addComment", response.data.comment);
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },
        updateComment({ commit }, comment) {
            let formData = new FormData();
            formData.append("image", comment.image);
            formData.append("comment", comment.commentaire);
            const updateComment = `api/comment/${comment.dynamicId}`;
            console.log(updateComment);
            return new Promise((resolve, reject) => {
                axios
                    .put(updateComment, formData)
                    .then((response) => {
                        console.log(response.data);
                        commit("updateComment", response.data);
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },
        deleteComment({ commit }, comment) {
            const confirmDelete = confirm(
                "Êtes vous sûr de vouloir supprimer ce commentaire ?"
            );
            const deleteComment = `api/comment/${comment.dynamicId}`;
            if (confirmDelete) {
                return new Promise((resolve, reject) => {
                    axios
                        .delete(deleteComment)
                        .then((response) => {
                            console.log(response.data.comments);
                            commit("commentDelete", response.data);
                            resolve(response);
                        })
                        .catch((error) => {
                            console.log(error);
                            reject(error);
                        });
                });
            }
        },
        // userList n'as pas besoin de le mettre dans vuex

        // page profileInformation, getUserid pas la peine de passer par vuex

        updateProfil({ commit }, user) {
            const updateProfil = `api/user/account`;
            return new Promise((resolve, reject) => {
                axios
                    .patch(updateProfil, {
                        firstName: user.thisFirstName,
                        lastName: user.thisLastName,
                        userName: user.thisUserName,
                        email: user.thisEmail,
                        password: user.thisPassword,
                    })
                    .then((response) => {
                        commit("user", response.data.user);
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },

        deleteAccount({ commit }, user) {
            const deleteAccount = `api/user/account/${user.dynamicId}`;
            const confirmDelete = confirm(
                "Êtes vous sûr de vouloir supprimer votre compte ?"
            );
            if (confirmDelete) {
                // const clearToken = localStorage.clear("userToken");
                return new Promise((resolve, reject) => {
                    axios
                        .delete(deleteAccount)
                        .then((response) => {
                            //console.log(response);
                            if (response) {
                                localStorage.clear("userToken");
                                commit("users");
                                resolve(response);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            reject(error);
                        });
                });
            } else {
                localStorage.getItem("userToken");
            }
        },

        comment({ commit }, comment) {
            console.log(comment);
            commit("comment", comment);
        },

    },

    mutations: {
        // This is state.user is equal to actions,
        user(state, user) {
            state.user = user; //foncitonne
        },
        users(state, users) {
            state.user = users; //foncitonne
        },
        post(state, post) {
            state.post = post;
        },
        posts(state, posts) {
            state.posts = posts;
        },
        comment(state, comment) {
            console.log(comment);
            state.comment = comment;
        },
        addPost(state, post) {
            state.posts.unshift(post);
        },
        addComment(state, comment) {
            // parcourir state.posts (array/tableau de posts) pour trouver celui qui a le même id (postId) que comment.postId
            // rajouter le comment à ce post dans post.comments
            for (let postFind of state.posts) {
                if (postFind.id == comment.postId) {
                    postFind.comments.push(comment);
                }
            }
        },

        deletePost(state, post) {
            // Donc, l'action permet à faire une demande axios au backend, si la réponse la réponse est bon alors on efface les données dans le backend
            // quand le bouton effacer se déclanche (appuyer)
            // Ensuite, côté frontend
            let index = 0;
            for (let postFind of state.posts) {
                console.log(postFind);
                console.log(post.post.id, "==", postFind.id);
                if (postFind.id == post.post.id) {
                    state.posts.splice(index, 1);
                    // console.log(postFind.splice(post));
                }
                index++;
            }
        },

        commentDelete(state, comment) {
            // Faire une boucle pour trouver le post, ensuite je cherche le commentaire dans le commentaire de post
            // à partir de la, on peut supprimer le commentaire
            // let index = 0;
            console.log(state, comment);
            for (let postFind of state.posts) {
                console.log(postFind.comments);
                let index = 0; // L
                for (let commentFind of postFind.comments) {
                    console.log(commentFind.id, "==", comment.comments.id);
                    if (commentFind.id == comment.comments.id) {
                        postFind.comments.splice(index, 1);
                    }
                    index++;
                }
            }
        },
        updatePost(state, post) {
            // Boucle sur le tableau de la post
            for (let i = 0; i < state.posts.length; i++) {
                // Condition pour comparer l'id de la post existant et la nouvelle post
                if (state.posts[i].id == post.id) {
                    console.log(state.posts[i].postContent, "==", post.postContent);
                    // Si l'image existe, on n'efface pas l'image quand on écrit le texte, si le texte existe on efface pas le texte si on change l'image
                    // if (state.posts[i].postContent && state.posts[i].imageUrl) {
                    // }
                    //  Implementation de la logique update de bon post à partir de son Id
                    state.posts[i].postContent = post.postContent;
                    state.posts[i].imageUrl = post.imageUrl;
                    state.posts[i].updatedAt = post.updatedAt;

                    // state.posts[i] = post;
                }
            }
        },

        updateComment(state, comment) {
            console.log(state, comment.comments);
            // Boucle sur sur le tableau de la post
            for (let i = 0; i < state.posts.length; i++) {
                let statePost = state.posts[i];
                // boucle sur le tableau du comments à l'interieur de la post
                for (let i = 0; i < statePost.comments.length; i++) {
                    // Simplification du nom avec des variables de chaque boucle
                    let beforeUpdateComment = statePost.comments[i];
                    let afterUpdateComment = comment.comments;
                    console.log(beforeUpdateComment.id, "=", afterUpdateComment.id);
                    // Une condition pour comparer l'id de comments existant et nouvelle comments
                    if (beforeUpdateComment.id == afterUpdateComment.id) {
                        console.log("Do update");
                        console.log(
                            beforeUpdateComment.comment,
                            "==",
                            afterUpdateComment.comment
                        );
                        // Si l'image existe, on n'efface pas l'image quand on écrit le texte, si le texte existe on efface pas le texte si on change l'image
                        // if (beforeUpdateComment.imageUrl && beforeUpdateComment.comment) {
                        // }
                        // Implementation de la logique update commentaire, image et update at

                        console.log(
                            (beforeUpdateComment.comment = afterUpdateComment.comment)
                        );
                        console.log(
                            (beforeUpdateComment.imageUrl = afterUpdateComment.imageUrl)
                        );
                        // statePost.comments[i] = comment.comments
                    }
                }
            }
        },
    },
});
// Les codes à connaitre sont tous ce qui est parsing du tableau, la condition
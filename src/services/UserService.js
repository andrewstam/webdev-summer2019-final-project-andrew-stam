// Created by Andrew Stam
const BACKEND_URL = 'https://andrew-stam-final-project-java.herokuapp.com';
// http://localhost:8080 for local testing
// https://andrew-stam-final-project-java.herokuapp.com for deployed version

export default class UserService {
    static instance = null;

    // Singleton pattern
    static getInstance() {
        if (UserService.instance === null) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    // Send login info to backend and see if valid, then do the callback function
    validateLogin = (user, pass, fn) => {
        fetch(`${BACKEND_URL}/api/validate`, {
            method: 'POST',
            body: JSON.stringify([user, pass]),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Send new user data to backend to save as valid login, then do the callback function
    createUser = (id, user, pass, role, fn) => {
        fetch(`${BACKEND_URL}/api/users`, {
            method: 'POST',
            body: JSON.stringify([id, user, pass, role]),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Get the session attribute
    getSessionAttr = (attr, fn) => {
        fetch(`${BACKEND_URL}/api/session/get/${attr}`, {
            method: 'GET'
        })
        .then(response => fn(response))
    }

    // Find user by id, then call the callback
    findUserById = (id, fn) => {
        fetch(`${BACKEND_URL}/api/users/${id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find newest user, then run callback fn
    findNewestUser = fn => {
        fetch(`${BACKEND_URL}/api/users/new`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Update the given user
    updateUser = (user, id) => {
        fetch(`${BACKEND_URL}/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
    }

    // Add given user id to following list of user with ID in path
    addFollow = (userId, id) => {
        fetch(`${BACKEND_URL}/api/users/${id}/following`, {
            method: 'PUT',
            body: JSON.stringify(userId),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Remove given user id from following list of user with ID in path
    removeFollow = (userId, id) => {
        fetch(`${BACKEND_URL}/api/users/${id}/following`, {
            method: 'DELETE',
            body: JSON.stringify(userId),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Add given user id to follower list of user with ID in path
    addFollower = (userId, id) => {
        fetch(`${BACKEND_URL}/api/users/${id}/followers`, {
            method: 'PUT',
            body: JSON.stringify(userId),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Remove given user id from follower list of user with ID in path
    removeFollower = (userId, id) => {
        fetch(`${BACKEND_URL}/api/users/${id}/followers`, {
            method: 'DELETE',
            body: JSON.stringify(userId),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Add given move id to favorites list of user with ID in path
    addFavorite = (userId, movieId) => {
        fetch(`${BACKEND_URL}/api/users/${userId}/favorites`, {
            method: 'PUT',
            body: JSON.stringify(movieId),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Remove given movie id from favorites list of user with ID in path
    removeFavorite = (userId, movieId) => {
        fetch(`${BACKEND_URL}/api/users/${userId}/favorites`, {
            method: 'DELETE',
            body: JSON.stringify(movieId),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Find a user's following based on their id
    findFollowing = (id, fn) => {
        fetch(`${BACKEND_URL}/api/users/${id}/following`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find a user's followers based on their id
    findFollowers = (id, fn) => {
        fetch(`${BACKEND_URL}/api/users/${id}/followers`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find a user's favorites based on their id
    findFavorites = (id, fn) => {
        fetch(`${BACKEND_URL}/api/users/${id}/favorites`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find a user's average rating
    findStarAverage = (id, fn) => {
        fetch(`${BACKEND_URL}/api/reviews/${id}/avg`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Returns the review text for the given movie ID by the user with the given ID
    findReviewForMovie = (uid, mid, fn) => {
        fetch(`${BACKEND_URL}/api/reviews/${mid}/${uid}/text`, {
            method: 'GET'
        })
        .then(response => response.text())
        .then(json => {
            fn(json, mid);
        })
    }

    // Create a new review
    createReview = (uid, mid, stars, text, fn) => {
        fetch(`${BACKEND_URL}/api/reviews/${mid}/${uid}/${stars}`, {
            method: 'POST',
            body: JSON.stringify(text),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.text())
        .then(json => {
            fn(json, mid);
        })
    }

    // Delete the user's review for the given movie ID
    deleteReview = (uid, mid) => {
        fetch(`${BACKEND_URL}/api/reviews/${mid}/${uid}`, {
            method: 'DELETE'
        })
    }

    // Returns the review stars for the given movie ID by the user with the given ID
    findStarsForMovie = (uid, mid, fn) => {
        fetch(`${BACKEND_URL}/api/reviews/${mid}/${uid}/stars`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json, mid);
        })
    }

    // Edit the review text for the given movie ID by the user with the given ID
    editReviewForMovie = (uid, mid, text) => {
        fetch(`${BACKEND_URL}/api/reviews/${mid}/${uid}/text`, {
            method: 'PUT',
            body: JSON.stringify(text),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Edit the review stars for the given movie ID by the user with the given ID
    editStarsForMovie = (uid, mid, stars) => {
        fetch(`${BACKEND_URL}/api/reviews/${mid}/${uid}/stars`, {
            method: 'PUT',
            body: JSON.stringify(stars),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Returns the movie ids with reviews for the user with the given ID
    findReviewedMovies = (uid, fn) => {
        fetch(`${BACKEND_URL}/api/reviews/${uid}/movies`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Finds the user's groups
    findUserGroups = (uid, fn) => {
        fetch(`${BACKEND_URL}/api/users/${uid}/groups`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Finds a group by id
    findGroupById = (id, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find the member ids of a group
    findGroupMemberIds = (id, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${id}/members`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json, id);
        })
    }

    // Find the watch items associated with the group with the given ID
    findGroupWatchItems = (id, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${id}/watch`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find comments associated with the given watch item ID
    findItemComments = (wid, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${wid}/comments`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find the list of members attending a watch item
    findAttendingMembers = (wid, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${wid}/attending`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json, wid);
        })
    }

    // Find all reviews for the movie with the given ID
    findAllReviews = (mid, fn) => {
        fetch(`${BACKEND_URL}/api/reviews/${mid}/movie`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Add a member to the attending list of the given watch item
    addAttendingMember = (wid, uid) => {
        fetch(`${BACKEND_URL}/api/groups/${wid}/attending`, {
            method: 'PUT',
            body: JSON.stringify(uid),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Remove a member from the attending list of the given watch item
    removeAttendingMember = (wid, uid) => {
        fetch(`${BACKEND_URL}/api/groups/${wid}/attending`, {
            method: 'DELETE',
            body: JSON.stringify(uid),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Add a comment for the given watch item by the given user
    addComment = (text, uid, wid, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${wid}/comment/${uid}`, {
            method: 'PUT',
            body: JSON.stringify(text),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            fn(json, wid);
        })
    }

    // Remove a comment from the given watch item by the given user
    removeComment = (uid, wid, cid) => {
        fetch(`${BACKEND_URL}/api/groups/${wid}/comment/${uid}`, {
            method: 'DELETE',
            body: JSON.stringify(cid),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    // Create a new group with the given name and leader, run the callback
    createGroup = (uid, name, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${uid}`, {
            method: 'PUT',
            body: JSON.stringify(name),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(() => fn())
    }

    // Add a member with the given ID to the given group - backend validates the ID and that it's a member role
    addMember = (uid, gid, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${gid}/add`, {
            method: 'POST',
            body: JSON.stringify(uid),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(json => {
            fn(uid, gid, json);
        })
    }

    // Remove a member with the given ID from the given group
    removeMember = (uid, gid, fn) => {
        fetch(`${BACKEND_URL}/api/groups/${gid}`, {
            method: 'DELETE',
            body: JSON.stringify(uid),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(() => fn())
    }

    // Add a watch item to the given group
    addWatchItem = (gid, mid, date) => {
        fetch(`${BACKEND_URL}/api/groups/${gid}/watch/${mid}`, {
            method: 'PUT',
            body: JSON.stringify(date),
            headers: {
                'content-type': 'application/json'
            }
        })
    }
}

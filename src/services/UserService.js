// Created by Andrew Stam

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
        fetch("http://localhost:8080/api/validate", {
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
        fetch("http://localhost:8080/api/users", {
            method: 'PUT',
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
        fetch(`http://localhost:8080/api/session/get/${attr}`, {
            method: 'GET'
        })
        .then(response => fn(response))
    }

    // Find user by id, then call the callback
    findUserById = (id, fn) => {
        fetch(`http://localhost:8080/api/users/${id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find newest user, then run callback fn
    findNewestUser = fn => {
        fetch(`http://localhost:8080/api/users/new`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Update the given user
    updateUser = (user, id) => {
        fetch(`http://localhost:8080/api/users/${id}`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
    }

    // Add given user id to following list of user with ID in path
    addFollow = (userId, id) => {
        fetch(`http://localhost:8080/api/users/${id}/following`, {
            method: 'POST',
            body: JSON.stringify(userId),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
    }

    // Add given user id to follower list of user with ID in path
    addFollower = (userId, id) => {
        fetch(`http://localhost:8080/api/users/${id}/followers`, {
            method: 'POST',
            body: JSON.stringify(userId),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
    }

    // Add given user id to follower list of user with ID in path
    addFavorite = (userId, movieId) => {
        fetch(`http://localhost:8080/api/users/${userId}/favorites`, {
            method: 'POST',
            body: JSON.stringify(movieId),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
    }

    // Find a user's following based on their id
    findFollowing = (id, fn) => {
        fetch(`http://localhost:8080/api/users/${id}/following`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find a user's followers based on their id
    findFollowers = (id, fn) => {
        fetch(`http://localhost:8080/api/users/${id}/followers`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }

    // Find a user's favorites based on their id
    findFavorites = (id, fn) => {
        fetch(`http://localhost:8080/api/users/${id}/favorites`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => {
            fn(json);
        })
    }
}

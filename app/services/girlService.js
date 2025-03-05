import { useStore } from '../store/store'; // Ensure you import the correct store


export const getGirl = async (formData) => {
    const setGirl = useStore.getState().setGirl;
    const setLoadingGirl = useStore.getState().setLoadingGirl;

    try {
        const response = await fetch('/api/girl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            setGirl(data);
            setLoadingGirl(false);
            return data;
        } else {
            setLoadingGirl(false);
            console.log('errror')
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        setLoadingGirl(false);
        console.error(error.message);
        return null;
    }
};

export const getGirlTweet = async (formData) => {
    const addTweet = useStore.getState().addTweet;

    try {
        const response = await fetch('/api/tweets/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            addTweet(data);
            return data;
        } else {
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const uploadFileToS3 = async (file) => {
    // Request the pre-signed URL from our API route
    const res = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileType: file.type }),
    });
    const { signedUrl, key } = await res.json();

    // Use the signed URL to PUT the file directly to S3
    const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });

    if (!uploadRes.ok) {
        throw new Error('Failed to upload file to S3');
    }
    // Return the file key or URL for further use (e.g., saving in your post record)
    return key;
};


//girlService addPost
export const addPost = async (formData) => {
    const updatePost = useStore.getState().updatePost;
    try {
        const response = await fetch('/api/post/add', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};

export const addReel = async (formData) => {
    try {
        const response = await fetch('/api/reel/add', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};

export const addPicture = async (formData) => {
    const updatePost = useStore.getState().updatePost;
    try {
        const response = await fetch('/api/pictures/add', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};

export const updateGirl = async (formData) => {
    const updatePost = useStore.getState().updatePost;
    try {
        const response = await fetch('/api/girl/update', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};

export const addGirl = async (formData) => {
    const updatePost = useStore.getState().updatePost;
    try {
        const response = await fetch('/api/girl/add', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};

export const deleteGirl = async (formData) => {
    const removeGirl = useStore.getState().removeGirl;
    const clearGirl = useStore.getState().clearGirl;

    try {
        const response = await fetch('/api/girl/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            clearGirl()
            removeGirl(data.deletedGirlId);
            return data;
        } else {
            console.log('errror')
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const addTweetToGirl = async (formData) => {

    try {
        const response = await fetch('/api/tweets/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();

            return data;
        } else {
            console.log('errror')
            throw new Error('Failed to fetch the latest jornada');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const followGirl = async (formData) => {
    const updateFollowers = useStore.getState().updateFollowers;
    const removeFollower = useStore.getState().removeFollower;

    try {
        const response = await fetch('/api/girl/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();

            if (data.isFollowing) {
                // User is now following the girl
                updateFollowers(data.followers, data.followersCount);
            } else {
                // User has unfollowed the girl
                removeFollower(data.followers, data.followersCount);
            }

            return data;
        } else {
            console.log('error');
            throw new Error('Failed to update follow status');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

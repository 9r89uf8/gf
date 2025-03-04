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

// app/services/girlService.js
export const getS3PresignedUrl = async (fileType) => {
    try {
        const response = await fetch('/api/s3upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileType }),
        });

        if (!response.ok) {
            throw new Error('Failed to get pre-signed URL');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting pre-signed URL:', error);
        throw error;
    }
};

export const uploadToS3WithPresignedUrl = async (presignedUrl, file) => {
    try {
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to upload to S3');
        }

        return true;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};

export const addPost = async (postData, file) => {
    try {
        // 1. If there's a file, get a pre-signed URL and upload directly to S3
        let fileKey = null;
        let fileUrl = null;

        if (file) {
            // Get pre-signed URL for the file
            const { url, fileName, fileUrl: s3FileUrl } = await getS3PresignedUrl(file.type);

            // Upload the file directly to S3
            await uploadToS3WithPresignedUrl(url, file);

            fileKey = fileName;
            fileUrl = s3FileUrl;
        }

        // 2. Create the post in your database
        const formData = new FormData();
        formData.append('premium', postData.premium ? 'true' : 'false');
        formData.append('description', postData.description);
        formData.append('girlId', postData.girlId);

        if (fileKey) {
            // Just pass the file key, not the actual file
            formData.append('fileKey', fileKey);
            formData.append('fileUrl', fileUrl);
        }

        const response = await fetch('/api/post/add', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
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

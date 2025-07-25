import { useStore } from '../store/store'; // Ensure you import the correct store


export const getPosts = async () => {
    const setPosts = useStore.getState().setPosts;

    try {
        const response = await fetch(`/api/v2/posts/getAllPosts`);
        if (response.ok) {
            const data = await response.json();
            setPosts(data);
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

export const likeGirlPost = async (formData) => {
    const updatePost = useStore.getState().updatePost;
    const updateGirlPost = useStore.getState().updateGirlPost;
    try {
        const response = await fetch('/api/v2/post/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const updatedMessage = await response.json();
            updatePost(updatedMessage);
            updateGirlPost(updatedMessage);
            return updatedMessage;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error.message);
        return null;
    }
};

export const deleteGirlPost = async (formData) => {
    const removePost = useStore.getState().removePost;

    try {
        const response = await fetch('/api/v2/admin/post/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            removePost(data.deletedPostId);
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

export const deleteGirlPicture = async (formData) => {
    const removePicture = useStore.getState().removePicture;

    try {
        const response = await fetch('/api/v2/admin/pictures/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            removePicture(data.deletedPictureId);
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

export const deleteGirlVideo = async (formData) => {
    const removeVideo = useStore.getState().removeVideo;

    try {
        const response = await fetch('/api/v2/admin/pictures/deleteVideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();
            removeVideo(data.deletedVideoId);
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
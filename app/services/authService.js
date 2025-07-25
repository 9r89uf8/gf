// services/authService.js
import { useStore } from '../store/store'; // Ensure you import the correct store

export const loginUser = async (data) => {
    const setUser = useStore.getState().setUser;

    try {
        const response = await fetch('/api/v2/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            return { user: data.user, error: null };
        } else {
            const errorData = await response.json();
            return { user: null, error: errorData.error };
        }
    } catch (error) {
        return { user: null, error: error.message };
    }
};


export const registerUser = async (data) => {
    const setUser = useStore.getState().setUser;
    try {
        const response = await fetch('/api/v2/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            return { user: data.user, error: null };
        } else {
            const errorData = await response.json();
            return { user: null, error: errorData.error };
        }
    } catch (error) {
        return { user: null, error: error.message };
    }
};

export const passwordReset = async (data) => {
    try {
        const response = await fetch('/api/v2/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Password reset failed');
        }
    } catch (error) {
        console.error(error);
    }
};

export const logoutUser = async () => {
    const logout = useStore.getState().logout;
    const clearConversationsV2 = useStore.getState().clearConversationsV2;

    try {
        const response = await fetch('/api/v2/auth/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            logout(); // Call the logout action from userSlice
            clearConversationsV2(); // Clear all conversation data

            return data;
        } else {
            throw new Error('error');
        }
    } catch (error) {
        console.error(error);
    }
};


export const checkIfCookie = async () => {
    const logout = useStore.getState().logout;
    const clear = useStore.getState().clearAll;
    try {
        const response = await fetch('/api/v2/auth/verify', {
            method: 'GET',
        });

        const data = await response.json();
        if(data.isAuthenticated) {
            return data;
        }else {
            logout(); // Call the logout action from userSlice
            clear()
            return data;
        }

    } catch (error) {
        console.error(error);
    }
};


export const editUser = async (formData) => {
    const setUser = useStore.getState().setUser;
    try {
        const response = await fetch('/api/v2/auth/edit-user', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data)
            return data;
        } else {
            throw new Error('error');
        }
    } catch (error) {
        console.error(error);
    }
};

export const deleteUser = async () => {
    const logout = useStore.getState().logout;
    try {
        const response = await fetch('/api/v2/auth/delete', {
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.json();
            logout()
            return data;
        } else {
            throw new Error('error');
        }
    } catch (error) {
        console.error(error);
    }
};


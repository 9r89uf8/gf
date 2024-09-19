// services/authService.js
import { useStore } from '../store/store'; // Ensure you import the correct store

export const loginUser = async (email, password) => {
    const addNotification = useStore.getState().addNotification;
    const setUser = useStore.getState().setUser;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            addNotification({
                id: Date.now(),
                type: 'success',
                message: 'Inicio de sesión exitosa',
            });
            return { user: data.user, error: null };
        } else {
            addNotification({
                id: Date.now(),
                type: 'error',
                message: 'error de inicio de sesion',
            });
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
        const response = await fetch('/api/auth/register', {
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

export const passwordReset = async (email) => {
    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
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
    const clear = useStore.getState().clearAll;
    try {
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            logout(); // Call the logout action from userSlice
            clear()
            return data;
        } else {
            throw new Error('error');
        }
    } catch (error) {
        console.error(error);
    }
};


export const editUser = async (formData) => {
    const setUser = useStore.getState().setUser;
    try {
        const response = await fetch('/api/auth/edit-user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
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
        const response = await fetch('/api/auth/delete', {
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


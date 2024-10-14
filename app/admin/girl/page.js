// src/components/Philosophy/CreatePhilosophy.js
'use client'
import React from 'react';
import { useStore } from '@/app/store/store';
import { Box, TextField, Button, FormControl, FormLabel, Switch, FormControlLabel, MenuItem, Select, Avatar } from '@mui/material';
import {addGirl} from "@/app/services/girlService";


const AddGirl = () => {
    const priceOptions = Array.from({ length: 11 }, (_, i) => 5 + i);
    const ages = Array.from({ length: 11 }, (_, i) => 14 + i);

    // You might need to manage form state manually as MUI doesn't provide a form management system like Ant Design
    const [name, setName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [audioId, setAudioId] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [memberPrice, setMemberPrice] = React.useState(8);
    const [image, setImage] = React.useState(null);
    const [isPrivate, setIsPrivate] = React.useState(false);
    const [country, setCountry] = React.useState('');
    const [education, setEducation] = React.useState('');
    const [age, setAge] = React.useState(8);
    const user = useStore((state) => state.user);
    const onFinish = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('age', age);
        formData.append('private', isPrivate ? 'true' : 'false');
        formData.append('country', country);
        formData.append('education', education);
        formData.append('audioId', audioId);
        formData.append('user', user?user.uid:'');
        formData.append('memberPrice', memberPrice);
        formData.append('bio', bio);
        if (image) {
            formData.append('image', image);
        }

        try {
            await addGirl(formData); // Assuming addPost is an async action
            // Reset form fields
            setName('');
            setUsername('');
            setAge(15);
            setMemberPrice(8);
            setImage(null);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handlePrivateChange = (event) => {
        setIsPrivate(event.target.checked);
    };

    // Handling file change
    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto' }}>
            <h2>Create Girl</h2>
            <form onSubmit={onFinish}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="name"
                        multiline
                        rows={1}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="username"
                        multiline
                        rows={1}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <FormLabel>Age</FormLabel>
                    <Select
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        displayEmpty
                    >
                        {ages.map((ag) => (
                            <MenuItem key={ag} value={ag}>
                                {ag}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="country"
                        multiline
                        rows={1}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="education"
                        multiline
                        rows={1}
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Audio Id"
                        multiline
                        rows={1}
                        value={audioId}
                        onChange={(e) => setAudioId(e.target.value)}
                        required
                    />
                </FormControl>

                <FormControlLabel
                    control={
                        <Switch
                            checked={isPrivate}
                            onChange={handlePrivateChange}
                            color="secondary"
                        />
                    }
                    label="Private"
                />

                <FormControl fullWidth margin="normal">
                    <FormLabel>Member Price</FormLabel>
                    <Select
                        value={memberPrice}
                        onChange={(e) => setMemberPrice(e.target.value)}
                        displayEmpty
                    >
                        {priceOptions.map((price) => (
                            <MenuItem key={price} value={price}>
                                {price}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Bio"
                        multiline
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <FormLabel>Image</FormLabel>
                    <input
                        required
                        type="file"
                        onChange={handleFileChange}
                    />
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Create Girl
                </Button>
            </form>
        </Box>
    );
};


export default AddGirl;
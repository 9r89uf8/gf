// app/components/home/ClientSelector.js
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Creators.module.css';

const ClientSelector = ({ girls }) => {
    const [selectedGirl, setSelectedGirl] = useState(girls[0]?.username || '');

    const handleSelectChange = (e) => {
        setSelectedGirl(e.target.value);
    };

    const selectedData = girls.find(girl => girl.username === selectedGirl);

    // Show/hide the appropriate preview based on selection
    useEffect(() => {
        if (!selectedGirl) return;

        // Hide all previews first
        document.querySelectorAll('.girl-preview').forEach(preview => {
            preview.style.display = 'none';
        });

        // Show the selected preview
        const selectedPreview = document.getElementById(`preview-${selectedGirl}`);
        if (selectedPreview) {
            selectedPreview.style.display = 'block';

            // Show the container
            const container = document.getElementById('preview-container');
            if (container) {
                container.style.display = 'block';
            }
        }
    }, [selectedGirl]);

    return (
        <div className={styles.selectorContainer}>
            <select
                className={styles.girlSelector}
                value={selectedGirl}
                onChange={handleSelectChange}
            >
                <option value="">Selecciona una chica IA...</option>
                {girls.map(girl => (
                    <option key={girl.id} value={girl.username}>
                        {girl.username}
                    </option>
                ))}
            </select>
            {selectedGirl && selectedData && selectedData.texting && (
                <Link
                    href={`/chat/${selectedData.id}`}
                    className={styles.messageButton}
                >
                    Comenzar a Chatear Ahora
                </Link>
            )}
        </div>
    );
};

export default ClientSelector;


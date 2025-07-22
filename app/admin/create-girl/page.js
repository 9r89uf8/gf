'use client';
import React from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import AdminNavigation from '@/app/components/admin/AdminNavigation';
import CreateGirlForm from '@/app/components/admin/create-girl/CreateGirlForm';

export default function CreateGirlPage() {
    return (
        <AdminLayout title="Create New Girl">
            <AdminNavigation />
            <CreateGirlForm />
        </AdminLayout>
    );
}
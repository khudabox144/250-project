// app/tours/[id]/page.js
"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTourPlaceById } from "@/app/utils/TourPlace_CRUD"; 
import DetailView from "@/app/components/DetailView"; 

export default function TourDetailPage() {
    const params = useParams();
    const id = params.id;
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getTourPlaceById(id)
                .then(data => {
                    setItem(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching tour:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!item) return <div className="p-6">Tour not found</div>;

    return <DetailView item={item} type="tour" />;
}
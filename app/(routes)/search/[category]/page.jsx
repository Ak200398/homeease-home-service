"use client"
import BusinessList from '@/app/_components/BusinessList';
import GlobalApi from '@/app/_services/GlobalApi';
import React, { useEffect, useState } from 'react'

function BusinessByCategory({ params }) {
    const [businessList, setBusinessList] = useState([]);
    const [category, setCategory] = useState('');

    useEffect(() => {
        // Unwrap params using async/await
        (async () => {
            const resolvedParams = await params;
            setCategory(resolvedParams.category);
            getBusinessList(resolvedParams.category);
        })();
    }, [params]);

    const getBusinessList = (category) => {
        GlobalApi.getBusinessByCategory(category).then((resp) => {
            setBusinessList(resp?.businessLists || []);
        });
    };

    return (
        <div>
            <BusinessList
                title={category}
                businessList={businessList}
            />
        </div>
    );
}

export default BusinessByCategory;

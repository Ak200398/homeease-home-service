"use client";
import GlobalApi from "@/app/_services/GlobalApi";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import BusinessInfo from "../_components/BusinessInfo";
import SuggestedBusinessList from "../_components/SuggestedBusinessList";
import BusinessDescription from "../_components/BusinessDescription";

function BusinessDetail({ params }) {
    const { data, status } = useSession();
    const [business, setBusiness] = useState([]);
    const [businessId, setBusinessId] = useState(null);

    // Use React.use to unwrap params
    const unwrappedParams = React.use(params);

    useEffect(() => {
        // Set the businessId after unwrapping params
        if (unwrappedParams && unwrappedParams.businessId) {
            setBusinessId(unwrappedParams.businessId);
        }
    }, [unwrappedParams]);

    useEffect(() => {
        if (businessId) {
            getBusinessById();
        }
    }, [businessId]);

    useEffect(() => {
        checkUserAuth();
    }, []);

    const getBusinessById = () => {
        GlobalApi.getBusinessById(businessId).then((resp) => {
            setBusiness(resp.businessList);
        });
    };

    const checkUserAuth = () => {
        if (status === "loading") {
            return <p>Loading...</p>;
        }

        if (status === "unauthenticated") {
            signIn("descope");
        }
    };

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "unauthenticated") {
        return <p>Redirecting to login...</p>;
    }

    return (
        status === "authenticated" &&
        business && (
            <div className="py-8 md:py-20 px-10 md:px-36">
                <BusinessInfo business={business} />

                <div className="grid grid-cols-3 mt-16">
                    <div className="col-span-3 md:col-span-2 order-last md:order-first">
                        <BusinessDescription business={business} />
                    </div>
                    <div>
                        <SuggestedBusinessList business={business} />
                    </div>
                </div>
            </div>
        )
    );
}

export default BusinessDetail;

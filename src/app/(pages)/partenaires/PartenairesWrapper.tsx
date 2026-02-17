"use client";

import dynamic from "next/dynamic";

const PartenairesList = dynamic(
    () => import("@/app/components/partenaires/PartenairesList"),
    {
        ssr: false,
    }
);

export default function PartenairesWrapper() {
    return <PartenairesList />;
}

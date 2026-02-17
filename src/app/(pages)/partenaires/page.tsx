import { Suspense } from "react";
import PartenairesWrapper from "./PartenairesWrapper";

export default function PartenairesManagement() {
    return (
        <>
            <h1 className="text-xl font-bold">
                Gestion des partenaires
            </h1>

            <Suspense fallback={<p>Chargement...</p>}>
                <PartenairesWrapper />
            </Suspense>
        </>
    );
}

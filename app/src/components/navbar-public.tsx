"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderPublic from "@/components/header-public";
import MenuPublic from "@/components/menu-public";

export function NavbarPublic() {
    const router = useRouter();
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    return (
        <>
            <HeaderPublic
                onOpenMenu={() => setIsOpenMenu(true)}
                onGoToOnboarding={() => router.push("/onboarding")}
            />
            <MenuPublic open={isOpenMenu} onOpenChange={setIsOpenMenu} />
        </>
    );
}
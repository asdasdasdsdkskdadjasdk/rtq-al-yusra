// resources/js/Pages/Beranda.jsx

import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Hero from '@/Components/Page/Beranda/Hero';
import YouTubeFeed from "@/Components/Page/Beranda/YouTubeFeed";
import InfoBoxes from '@/Components/Page/Beranda/InfoBoxes';
import Testimonials from '@/Components/Page/Beranda/Testimonials';
import CallToAction from '@/Components/Page/Beranda/CallToAction';

export default function Beranda({ auth }) {
    return (
        <AppLayout auth={auth}> {/* <-- Teruskan ke AppLayout */}
            <Head title="Selamat Datang di RTQ Al-Yusra" />
            
            <Hero />
            <InfoBoxes />
            <CallToAction />
            <YouTubeFeed />
            <Testimonials />

        </AppLayout>
    );
}
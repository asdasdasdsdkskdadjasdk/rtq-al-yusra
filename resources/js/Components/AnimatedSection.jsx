// resources/js/Components/AnimatedSection.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; 

const AnimatedSection = ({ children, delay = 0, className = '' }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Animasikan hanya sekali
        threshold: 0.1,    // Animasikan saat 10% elemen terlihat
    });

    const variants = {
        hidden: { opacity: 0, y: 30 }, // Mulai transparan & 30px ke bawah
        visible: { opacity: 1, y: 0 },  // Menjadi terlihat & posisi normal
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'} // Animasikan jika 'inView' true
            variants={variants}
            transition={{ duration: 0.7, delay: delay }} // Durasi & delay
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;
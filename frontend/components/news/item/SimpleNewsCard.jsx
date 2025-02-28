import React from 'react';
import Image from 'next/image';

const SimpleNewsCard = () => {
    return (
        <div>
            <div className='group relative'>
                <div className='overflow-hidden'>
                    <div className='h-[250px] sm:h-[470px] w-full'>
                        <Image className='' layout='fill' src={'https://res.cloudinary.com/dh1e1yjer/image/upload/v1740555216/news_images/bzklchn6ogs9rnpkldga.jpg'} alt='images' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleNewsCard;
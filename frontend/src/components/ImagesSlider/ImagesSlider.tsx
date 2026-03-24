'use client';

import React, { useEffect, useState } from 'react';
import styles from './ImagesSlider.module.css';
import Image from 'next/image';
import { IAnnouncementPhoto } from '@/models/IAnnouncementPhoto';

interface Props {
    slides: Array<IAnnouncementPhoto>;
}

const ImagesSlider = ({ slides }: Props) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleSlideChange = (index: number) => {
        setCurrentSlide(index);
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    if (!slides || slides.length === 0) {
        return (
            <div className={styles.sliderContainer}>
                <div className={styles.slider}>
                    <div className={styles.slide}>
                        <div className={styles.imageWrapper}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5',
                                }}
                            >
                                Нет изображений
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sliderContainer}>
            <div
                className={styles.slider}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={slide.id} className={styles.slide}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={slide.urlToImage}
                                width={1000}
                                height={1000}
                                alt="Изображение квартиры"
                                // fill
                                // sizes="(max-width: 768px) 100vw, 1200px"
                                className="object-contain w-full h-full rounded-4xl"
                                priority={index === 0}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <>
                    <div className={styles.sliderNav}>
                        {slides.map((slide, index) => (
                            <button
                                key={`nav-${slide.id}`}
                                className={`${styles.navButton} ${currentSlide === index ? styles.active : ''}`}
                                onClick={() => handleSlideChange(index)}
                                aria-label={`Перейти к слайду ${index + 1}`}
                                aria-current={currentSlide === index}
                            />
                        ))}
                    </div>

                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.prevButton}
                            onClick={handlePrev}
                            aria-label="Предыдущий слайд"
                        >
                            ‹
                        </button>
                        <button
                            className={styles.nextButton}
                            onClick={handleNext}
                            aria-label="Следующий слайд"
                        >
                            ›
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ImagesSlider;

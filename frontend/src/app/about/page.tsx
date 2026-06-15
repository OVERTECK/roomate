function About() {
    return (
        <main className="bg-gray-50">
            <section
                className="relative h-[calc(100vh-6rem)] flex items-center border rounded-md"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 max-w-5xl mx-auto w-full px-8">
                    <h1 className="text-6xl font-bold text-white tracking-tight mb-4">
                        roomate
                    </h1>
                    <p className="text-xl text-gray-200 max-w-md leading-relaxed">
                        Сервис поиска людей для совместного проживания по всей России
                    </p>
                    <a
                        href="/choice_announcement"
                        className="mt-8 inline-block bg-[var(--main-color)] hover:bg-[var(--main-color-hover)] 
                        text-white font-medium px-7 py-3 rounded-lg transition-colors text-sm tracking-wide"
                    >
                        Начать поиск
                    </a>
                </div>
            </section>
        </main>
    )
}

export default About;

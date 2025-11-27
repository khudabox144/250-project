import Image from "next/image";
import HeroSliderClient from "./HeroSliderClient";

const tourData = [
    {
        imageUrl: "https://i0.wp.com/sylhettouristplaces.com/wp-content/uploads/2020/02/Bisnakandi-Sylhet.jpg",
        title: "Sylhet",
        saleText: "Nature"
    },
    {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Buddha_Dhatu_Jadi_06.jpg/1200px-Buddha_Dhatu_Jadi_06.jpg",
        title: "Bandarban",
        saleText: "Hiking"
    },
    {
        imageUrl: "https://speedholidays.com.bd/wp-content/uploads/2019/11/Coxs-Bazar-3.jpg",
        title: "Cox's Bazar",
        saleText: "Sea"
    },
    {
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8hafPnmptMQ_ifidNY_4wGeG_-RO54lZUIw&s",
        title: "Sundarbar",
        saleText: "Wild Life"
    },
    {
        imageUrl:"https://admin.expatica.com/jp/wp-content/uploads/sites/18/2023/11/tokyo-skyline-fuji.jpg",
        title: "Dhaka",
        saleText: "Exploration"
    }
];

export default function HeroServer() {
    return (
        <section className="relative bg-linear-to-b from-white to-slate-50 py-8 sm:py-12">
            <div className="w-11/12 m-auto flex flex-col items-center justify-center">
                {/* CLIENT SLIDER */}
                <HeroSliderClient tourData={tourData} />

                {/* Static cards section with header */}
                <div className="w-full mt-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center px-4">
                        Featured <span className="bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Destinations</span>
                    </h2>

                    {/* Cards Grid - Better Responsive */}
                    <div className="w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 px-4">
                        {tourData.map((tour, index) => (
                            <div key={index} className="flex flex-col items-center group">
                                <div className="relative w-full rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-40 sm:h-48 bg-gray-300">
                                    <img
                                        src={tour.imageUrl}
                                        alt={tour.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
                                    
                                    {/* Badge */}
                                    <span className="absolute top-2 left-2 bg-teal-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg hover:bg-teal-400 transition-colors duration-300">
                                        {tour.saleText}
                                    </span>
                                    
                                    {/* Title - Overlay at bottom */}
                                    <h3 className="absolute bottom-2 left-2 right-2 text-white text-xs sm:text-sm font-bold drop-shadow-lg">
                                        {tour.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

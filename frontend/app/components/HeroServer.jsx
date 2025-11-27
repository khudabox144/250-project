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
        saleText: "Pollution"
    }
];

export default function HeroServer() {
    return (
        <section className="w-11/12 m-auto flex flex-col items-center justify-center py-10">
            {/* CLIENT SLIDER */}
            <HeroSliderClient tourData={tourData} />

            {/* Static cards (still server-rendered) */}
            <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-[-4rem] z-10">
                {tourData.map((tour, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="relative w-full rounded-lg overflow-hidden shadow-lg">
                            <img
                                src={tour.imageUrl}
                                alt={tour.title}
                                className="w-full h-auto aspect-[4/3] object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded">
                                {tour.saleText}
                            </span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-center">{tour.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}

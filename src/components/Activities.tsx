
import { Anchor, Ship, Mountain, Utensils, Map, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivitiesProps = {
  className?: string;
};

const activities = [
  {
    id: 1,
    title: "Whale Watching",
    description: "Experience the awe-inspiring sight of humpback whales as they migrate through the waters off Puerto Lopez (June to September). Expert guides will take you to the best spots for observing these magnificent creatures in their natural habitat.",
    icon: Ship,
    image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: 2,
    title: "Ecological Trails",
    description: "Explore the diverse ecosystems of Machalilla National Park through well-maintained trails that wind through dry forests, cloud forests, and coastal regions. Spot endemic plants and wildlife while enjoying breathtaking views.",
    icon: Mountain,
    image: "https://images.unsplash.com/photo-1587559070757-b4efd8be928d?auto=format&fit=crop&q=80",
    color: "from-green-400 to-green-600"
  },
  {
    id: 3,
    title: "Local Cuisine",
    description: "Savor the authentic flavors of coastal Ecuador with fresh seafood dishes like ceviche, encocado, and pescado frito. Visit local restaurants and markets to experience culinary traditions passed down through generations.",
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1606545609115-f55737664c3b?auto=format&fit=crop&q=80",
    color: "from-amber-400 to-amber-600"
  },
  {
    id: 4,
    title: "Boat Excursions",
    description: "Set sail on unforgettable boat trips to islands, hidden beaches, and marine sanctuaries. From snorkeling adventures to peaceful coastal cruises, the waters around Puerto Lopez offer endless opportunities for exploration.",
    icon: Anchor,
    image: "https://images.unsplash.com/photo-1516715021267-d7c2873a369b?auto=format&fit=crop&q=80",
    color: "from-cyan-400 to-cyan-600"
  },
  {
    id: 5,
    title: "Cultural Experiences",
    description: "Connect with local communities and learn about ancient traditions that blend indigenous, colonial, and modern influences. Visit archaeological sites, participate in traditional crafts, and engage with the rich cultural heritage of the region.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80",
    color: "from-red-400 to-red-600"
  },
  {
    id: 6,
    title: "Guided Tours",
    description: "Join expert-led excursions that combine education, adventure, and comfort. Local guides share insights about the region's ecology, history, and culture while taking you to the most significant and scenic locations.",
    icon: Map,
    image: "https://images.unsplash.com/photo-1619468129361-605ebea04b44?auto=format&fit=crop&q=80",
    color: "from-purple-400 to-purple-600"
  }
];

const Activities = ({ className }: ActivitiesProps) => {
  return (
    <section id="activities" className={cn("py-20 bg-sand", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
            Unforgettable <span className="text-coral">Activities</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in the wonders of Puerto Lopez with these popular activities that showcase the region's natural beauty and cultural richness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div 
                  className={cn(
                    "absolute -bottom-12 group-hover:-bottom-2 right-4 w-20 h-20 rounded-full flex items-center justify-center text-white bg-gradient-to-br transition-all duration-300",
                    activity.color
                  )}
                >
                  <activity.icon size={32} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-ocean-dark mb-3">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full py-3 rounded-lg bg-ocean-light text-ocean-dark font-medium hover:bg-ocean hover:text-white transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Highlights */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-ocean-light/30 to-transparent transform -skew-x-12"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-ocean-dark mb-6">Activity Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center mr-4">
                  <Ship size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-ocean-dark mb-2">Whale Watching Season</h4>
                  <p className="text-gray-600">Best from June to September, with peak activity in July and August</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tropical text-white flex items-center justify-center mr-4">
                  <Mountain size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-ocean-dark mb-2">Hiking Difficulty</h4>
                  <p className="text-gray-600">Trails range from easy coastal walks to moderate forest hikes</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sunset text-white flex items-center justify-center mr-4">
                  <Utensils size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-ocean-dark mb-2">Culinary Experiences</h4>
                  <p className="text-gray-600">From beachside food stalls to upscale seafood restaurants</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-coral text-white flex items-center justify-center mr-4">
                  <Anchor size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-ocean-dark mb-2">Boat Tours</h4>
                  <p className="text-gray-600">Available year-round with special seasonal offerings</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean-dark text-white flex items-center justify-center mr-4">
                  <Heart size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-ocean-dark mb-2">Cultural Immersion</h4>
                  <p className="text-gray-600">Authentic interactions with local communities and traditions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-violet-500 text-white flex items-center justify-center mr-4">
                  <Map size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-ocean-dark mb-2">Guided Experiences</h4>
                  <p className="text-gray-600">Available in multiple languages with expert local guides</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Wedding images
import wedding1 from "@/assets/gallery/wedding-1.png";
import wedding2 from "@/assets/gallery/wedding-2.png";
import wedding3 from "@/assets/gallery/wedding-3.png";

// Corporate images
import corporate1 from "@/assets/gallery/corporate-1.png";
import corporate2 from "@/assets/gallery/corporate-2.png";
import corporate3 from "@/assets/gallery/corporate-3.png";
import corporate4 from "@/assets/gallery/corporate-4.png";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  description?: string;
}

interface GalleryCategory {
  id: string;
  name: string;
  icon: string;
  items: GalleryItem[];
}

const galleryData: GalleryCategory[] = [
  {
    id: "wedding",
    name: "Wedding",
    icon: "💒",
    items: [
      { id: "w1", src: wedding1, title: "Groom's Family Performance", description: "Sangeet night celebration" },
      { id: "w2", src: wedding2, title: "Groom & Bride Entry", description: "Grand wedding entrance" },
      { id: "w3", src: wedding3, title: "Sagai & Sangeet", description: "Engagement ceremony at Saharanpur" },
    ],
  },
  {
    id: "birthday",
    name: "Birthday Parties",
    icon: "🎂",
    items: [],
  },
  {
    id: "corporate",
    name: "Corporate Events",
    icon: "🏢",
    items: [
      { id: "c1", src: corporate1, title: "Jagran Film Festival", description: "Panel discussion session" },
      { id: "c2", src: corporate2, title: "Jagran Film Festival", description: "Celebrity interaction" },
      { id: "c3", src: corporate3, title: "Jagran Film Festival", description: "Media coverage" },
      { id: "c4", src: corporate4, title: "Jagran Film Festival", description: "Fan meet & greet" },
    ],
  },
  {
    id: "surprise",
    name: "Surprise Events",
    icon: "🎁",
    items: [],
  },
  {
    id: "concerts",
    name: "Concerts",
    icon: "🎤",
    items: [],
  },
  {
    id: "festivals",
    name: "Festivals & Cultural",
    icon: "🎭",
    items: [],
  },
];

const GalleryCard = ({ item, index }: { item: GalleryItem; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={item.src}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>
      <div
        className={`absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${
          isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <h3 className="text-lg font-display font-semibold text-foreground">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
};

const EmptyCategory = ({ categoryName }: { categoryName: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
      <span className="text-4xl opacity-50">📷</span>
    </div>
    <h3 className="text-xl font-display font-semibold text-foreground mb-2">
      Coming Soon
    </h3>
    <p className="text-muted-foreground max-w-md">
      We're working on adding amazing {categoryName.toLowerCase()} photos to our gallery. 
      Check back soon!
    </p>
  </div>
);

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("wedding");

  return (
    <>
      <Helmet>
        <title>Gallery | Toshan Event - Our Event Portfolio</title>
        <meta
          name="description"
          content="Explore our stunning event portfolio featuring weddings, corporate events, birthday parties, and more. See how Toshan Event creates unforgettable experiences."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
                Our Portfolio
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                <span className="text-gradient-gold">Event Gallery</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore our collection of beautifully crafted events. From grand weddings to 
                corporate celebrations, witness the magic we create.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Gallery Tabs */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-12">
                {galleryData.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="px-6 py-3 rounded-full border border-border bg-card/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary hover:border-primary/50 transition-all duration-300"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {galleryData.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  {category.items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {category.items.map((item, index) => (
                        <GalleryCard key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  ) : (
                    <EmptyCategory categoryName={category.name} />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-dark">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Want to be in our next gallery?
              </h2>
              <p className="text-muted-foreground mb-8">
                Let us create an unforgettable event for you that deserves a spot in our portfolio.
              </p>
              <a
                href="/request"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-gold transition-all duration-300 hover:scale-105"
              >
                Plan Your Event
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Gallery;

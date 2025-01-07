import Image from 'next/image';
import Link from 'next/link';

interface OfferCardProps {
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const OfferCard = ({ image, title, description, ctaText, ctaLink }: OfferCardProps) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        <Link 
          href={ctaLink}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm sm:text-base group-hover:gap-1.5 gap-1 transition-all"
        >
          {ctaText}
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
};

const NewsAndOffers = () => {
  const newsItems = [
    {
      title: "Travel requirements to the UK are changing",
      link: "#",
      isSpecial: false,
    },
    {
      title: "Have travel credit? Here's how to book",
      link: "#",
      isSpecial: false,
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* News Section */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              News and offers
            </h2>
            <div className="space-y-4">
              {newsItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {item.title} »
                </a>
              ))}
              <a
                href="#"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <span className="mr-1">⚡</span> More specials »
              </a>
            </div>
          </div>

          {/* Create Memories Section */}
          <div className="relative group">
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
              <Image
                src="/memories.jpg"
                alt="Family enjoying activities"
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create more memories
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Buy or gift miles for new adventures
              </p>
              <a
                href="#"
                className="inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                View your offer »
              </a>
            </div>
          </div>

          {/* Credit Card Offer Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <div className="aspect-[3/2] relative mb-4">
              <Image
                src="/card.jpg"
                alt="Credit Card Offer"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Earn 50,000 bonus miles
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Plus, first checked bag is free on domestic American Airlines itineraries. Terms apply.
            </p>
            <a
              href="#"
              className="inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Learn more »
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const TodaysOffers = () => {
  const offers = [
    {
      image: "/cruise.jpg",
      title: "Cruise into 2025 with 2X miles",
      description: "Don't miss your chance to earn 2 AAdvantage® miles per $1 spent on every sailing",
      ctaText: "Book a cruise today",
      ctaLink: "#",
    },
    {
      image: "/simple.jpg",
      title: "Earn miles with SimplyMiles®",
      description: "Activate your personalized offers to multiply your miles and earn Loyalty Points when you shop",
      ctaText: "Join today for free",
      ctaLink: "#",
    },
    {
      image: "/wifi.jpg",
      title: "Enhanced Wi-Fi on your flight",
      description: "Enjoy faster, more reliable Wi-Fi on all international and mainline domestic flights",
      ctaText: "Learn more and how to connect",
      ctaLink: "#",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Today offers
          </h2>
          <Link 
            href="#"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm sm:text-base mt-2 sm:mt-0"
          >
            View all offers →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {offers.map((offer, index) => (
            <OfferCard key={index} {...offer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TodaysOffers;
export { NewsAndOffers };
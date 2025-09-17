import { getRedisClient } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

// Default content structure matching the home page
const defaultContent = {
    hero: {
        title: "Vertical Gardens",
        subtitle: "Vibrant, sustainable, and grown in Devon",
        description: "Our living walls bring colour, texture, and vitality to any space — transforming the ordinary into a thriving, sustainable environment. Designed to evolve with the seasons, these biodiverse vertical gardens arrive ready to flourish.",
        ctaText: "Start Your Project",
        ctaLink: "/contact",
        image: "./images/home_page.jpg",
        imageAlt: "Tapestry Vertical Gardens - Lombolle Road Garden Installation"
    },
    whyVerticalGardens: {
        title: "Vertical Gardens: Beauty with Purpose",
        subtitle: "As cities grow ever denser, green space becomes increasingly precious. Vertical gardens transform barren walls into thriving ecosystems that support biodiversity, improve air quality, and create calming, restorative spaces — bringing nature back into the heart of urban life.",
        benefits: [
            {
                title: "Air Purification",
                description: "Living walls naturally filter air pollutants and increase oxygen levels, creating healthier indoor and outdoor environments."
            },
            {
                title: "Climate Control",
                description: "Vertical gardens provide natural insulation, reducing energy costs by moderating temperature and humidity levels."
            },
            {
                title: "Biodiversity",
                description: "Attract pollinators and create micro-ecosystems that support local wildlife while enhancing urban biodiversity."
            },
            {
                title: "Wellbeing",
                description: "Biophilic design reduces stress, boosts mood, and improves cognitive function through connection with nature."
            },
            {
                title: "Sound Reduction",
                description: "Natural sound barriers that absorb noise pollution, creating quieter, more peaceful environments."
            },
            {
                title: "Visual Impact",
                description: "Transform bland walls into stunning focal points that add beauty, texture, and life to any space."
            }
        ]
    },
    cta2: {
        title: "Ready to Transform Your Space?",
        description: "Contact us today for a free consultation and discover how a living wall can elevate your environment.",
        ctaText: "Book a Free Consultation",
        ctaLink: "/contact"
    },
    tapestryDifference: {
        title: "The Tapestry Difference",
        subtitle: "We transform walls into dynamic, living installations built to thrive and inspire for years.",
        features: [
            {
                title: "Plants First,<br />Hardware Second",
                description: "Many systems force plants to fit the hardware. We do the opposite. We start with the planting plan — light levels, exposure, texture, colour, seasonality — and build the system around it. The result is a living tapestry that looks natural and stays healthy."
            },
            {
                title: "Fuss-free",
                description: "Every garden is planted by hand and matured in our Devon nursery. We install established planting for immediate impact. Your vertical garden arrives ready to impress with minimal disruption on site — an average installation takes only 2 - 3 days."
            },
            {
                title: "Hydroponic Precision",
                description: "Our proprietary hydroponic approach delivers water and nutrients precisely where they are needed. Optional automation keeps maintenance low and reliability high, ensuring long-term success."
            }
        ]
    },
    livingSculpture: {
        title: "Living Sculpture",
        description: "We create more than flat walls. Living spheres, columns, and chandeliers transform greenery into sculpture. These installations become centrepieces for homes, offices, and events.",
        image: "./images/bio-sphere-living-sculpture.jpg",
        imageAlt: "Tapestry Vertical Gardens - Bio Sphere"
    },
    faqs: [
        {
            question: "How long does a vertical garden last?",
            answer: "With proper care and seasonal maintenance, your living wall can thrive for decades and mature beautifully over time."
        },
        {
            question: "Do vertical gardens require much maintenance?",
            answer: "Our hydroponic systems deliver efficient water and nutrients. We offer maintenance packages covering pruning, checks, and replanting where needed."
        },
        {
            question: "Can I have a vertical garden indoors?",
            answer: "Yes. Our clean, soil-free systems suit interiors. We can add lighting where natural light is limited."
        },
        {
            question: "How much does a vertical garden cost?",
            answer: "Costs depend on size, design, and plant selection. We provide a clear quotation after consultation."
        },
        {
            question: "How long does installation take?",
            answer: "Because we pre-grow in our Devon nursery, many projects install in days with immediate impact."
        },
        {
            question: "What if some plants fail?",
            answer: "As with any garden, occasional replacement is normal. Maintenance plans keep displays looking perfect."
        }
    ]
};

async function handler(req, res) {
    const redis = await getRedisClient();

    if (req.method === 'GET') {
        try {
            // Get content from Redis or return default content
            const storedContent = await redis.get('home:content');

            if (storedContent) {
                const content = JSON.parse(storedContent);
                res.status(200).json(content);
            } else {
                res.status(200).json(defaultContent);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(500).json({ message: 'Error fetching content' });
        }
    } else if (req.method === 'POST') {
        try {
            const content = req.body;

            // Validate content structure
            if (!content || typeof content !== 'object') {
                return res.status(400).json({ message: 'Invalid content format' });
            }

            // Store content in Redis
            await redis.set('home:content', JSON.stringify(content));

            res.status(200).json({ message: 'Content updated successfully', content });
        } catch (error) {
            console.error('Error updating content:', error);
            res.status(500).json({ message: 'Error updating content' });
        }
    } else if (req.method === 'DELETE') {
        try {
            // Reset to default content
            await redis.del('home:content');
            res.status(200).json({ message: 'Content reset to default', content: defaultContent });
        } catch (error) {
            console.error('Error resetting content:', error);
            res.status(500).json({ message: 'Error resetting content' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default requireAuth(handler);

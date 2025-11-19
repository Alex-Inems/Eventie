import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Initialize Firebase (you'll need to import your config)
// For now, we'll use a placeholder - you should import from your firebaseConfig
const firebaseConfig = {
    // Add your Firebase config here or import from firebaseConfig.ts
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// African cities for realistic locations
const cities = [
    'Lagos, Nigeria',
    'Nairobi, Kenya',
    'Accra, Ghana',
    'Cairo, Egypt',
    'Johannesburg, South Africa',
    'Cape Town, South Africa',
    'Abidjan, Ivory Coast',
    'Dar es Salaam, Tanzania',
    'Addis Ababa, Ethiopia',
    'Kampala, Uganda',
    'Dakar, Senegal',
    'Abuja, Nigeria',
    'Kigali, Rwanda',
    'Lusaka, Zambia',
    'Harare, Zimbabwe',
    'Maputo, Mozambique',
    'Windhoek, Namibia',
    'Gaborone, Botswana',
    'Porto-Novo, Benin',
    'Bamako, Mali',
];

// Event types and titles that will generate good slugs
const eventTemplates = [
    // Tech Events
    {
        category: 'tech', templates: [
            'Tech Summit', 'Developer Conference', 'AI Innovation Forum', 'Blockchain Workshop',
            'Startup Pitch Night', 'Data Science Meetup', 'Cybersecurity Summit', 'Mobile App Development',
            'Cloud Computing Workshop', 'DevOps Training', 'UI/UX Design Bootcamp', 'Product Management Masterclass',
            'Fintech Innovation Lab', 'EdTech Summit', 'AgriTech Conference', 'HealthTech Forum'
        ]
    },
    // Music & Entertainment
    {
        category: 'concerts', templates: [
            'Afrobeat Festival', 'Jazz Night Live', 'Hip Hop Concert', 'Reggae Vibes',
            'Electronic Music Festival', 'Acoustic Sessions', 'R&B Soul Night', 'Gospel Concert',
            'Traditional Music Showcase', 'Indie Music Festival', 'Rock Concert', 'Pop Music Night',
            'Dance Music Festival', 'World Music Celebration', 'Folk Music Gathering', 'Blues Night'
        ]
    },
    // Food & Drink
    {
        category: 'food', templates: [
            'Food & Wine Festival', 'Street Food Market', 'Chef Masterclass', 'Cocktail Making Workshop',
            'Wine Tasting Experience', 'Coffee Festival', 'Chocolate Workshop', 'BBQ & Grill Night',
            'Vegan Food Fair', 'Seafood Festival', 'Dessert Festival', 'Craft Beer Tasting',
            'African Cuisine Showcase', 'Farmers Market', 'Cooking Competition', 'Food Truck Festival'
        ]
    },
    // Workshops & Learning
    {
        category: 'workshops', templates: [
            'Photography Workshop', 'Creative Writing Masterclass', 'Digital Marketing Bootcamp',
            'Entrepreneurship Workshop', 'Leadership Training', 'Public Speaking Masterclass',
            'Financial Literacy Seminar', 'Real Estate Investment Forum', 'Career Development Workshop',
            'Language Learning Meetup', 'Art & Craft Workshop', 'Music Production Class',
            'Video Editing Workshop', 'Social Media Marketing', 'E-commerce Bootcamp', 'Content Creation Masterclass'
        ]
    },
    // Networking & Business
    {
        category: 'networking', templates: [
            'Business Networking Mixer', 'Entrepreneur Meetup', 'Investor Pitch Event',
            'Startup Founder Circle', 'Women in Business Summit', 'Young Professionals Network',
            'Industry Leaders Forum', 'Business Growth Summit', 'Innovation Hub Meetup',
            'Co-working Space Launch', 'Business Accelerator Program', 'Mentorship Program Launch',
            'Corporate Leadership Summit', 'Business Strategy Workshop', 'Partnership Building Event'
        ]
    },
    // Arts & Culture
    {
        category: 'culture', templates: [
            'Art Exhibition Opening', 'Film Screening Night', 'Theater Performance', 'Poetry Slam',
            'Comedy Night Live', 'Fashion Show', 'Dance Performance', 'Cultural Festival',
            'Heritage Celebration', 'Literature Festival', 'Photography Exhibition', 'Sculpture Showcase',
            'Traditional Dance Show', 'Storytelling Night', 'Artisan Market', 'Cultural Exchange Program'
        ]
    },
    // Sports & Fitness
    {
        category: 'sports', templates: [
            'Marathon Race', 'Basketball Tournament', 'Football Match', 'Yoga Retreat',
            'Fitness Bootcamp', 'Cycling Event', 'Swimming Competition', 'Tennis Tournament',
            'Boxing Match', 'Martial Arts Workshop', 'Running Club Meetup', 'CrossFit Challenge',
            'Dance Fitness Class', 'Pilates Workshop', 'Hiking Adventure', 'Sports Day Festival'
        ]
    },
    // Health & Wellness
    {
        category: 'wellness', templates: [
            'Wellness Retreat', 'Meditation Workshop', 'Mental Health Forum', 'Nutrition Seminar',
            'Yoga & Mindfulness', 'Holistic Health Fair', 'Stress Management Workshop', 'Sleep Wellness Seminar',
            'Fitness & Nutrition Expo', 'Wellness Coaching Session', 'Alternative Medicine Forum', 'Self-Care Workshop'
        ]
    }
];

// Generate realistic descriptions
const descriptions = [
    'Join us for an unforgettable experience featuring top industry leaders, interactive sessions, and networking opportunities.',
    'A curated event bringing together innovators, creators, and thought leaders for an inspiring day of learning and connection.',
    'Experience the best of what our community has to offer with live performances, workshops, and exclusive access.',
    'Connect with like-minded individuals, learn new skills, and be part of a growing community of passionate professionals.',
    'An immersive experience designed to inspire, educate, and empower participants through hands-on learning and collaboration.',
    'Join industry experts and enthusiasts for a day filled with insights, practical knowledge, and meaningful connections.',
    'A celebration of creativity, innovation, and community featuring workshops, performances, and networking opportunities.',
    'Discover new perspectives, build valuable connections, and take your skills to the next level at this exclusive event.',
];

// Generate organizers
function generateOrganizers(count: number) {
    const organizers = [];
    const firstNames = ['Amina', 'Kwame', 'Fatima', 'Oluwaseun', 'Thabo', 'Aisha', 'Kofi', 'Ngozi', 'Musa', 'Zainab', 'Tunde', 'Yemi', 'Bisi', 'Chidi', 'Funmi', 'Ike', 'Jumoke', 'Kemi', 'Lola', 'Moyo'];
    const lastNames = ['Adebayo', 'Okafor', 'Mensah', 'Nwosu', 'Kone', 'Diallo', 'Kamau', 'Mbeki', 'Okonkwo', 'Sow', 'Traore', 'Ndlovu', 'Mthembu', 'Osei', 'Bello', 'Ibrahim', 'Hassan', 'Mohammed', 'Ali', 'Abdullahi'];
    const companies = ['Events Co', 'Creative Hub', 'Innovation Lab', 'Community Space', 'Experience Design', 'Event Masters', 'Gathering Place', 'Connect Events', 'Vibe Collective', 'Experience Hub'];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];

        organizers.push({
            id: `org_${Date.now()}_${i}`,
            name: `${firstName} ${lastName}`,
            displayName: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s/g, '')}.com`,
            company,
            isVerified: Math.random() > 0.3, // 70% verified
            bio: `Passionate event organizer with ${Math.floor(Math.random() * 10) + 2} years of experience creating memorable experiences.`,
            location: cities[Math.floor(Math.random() * cities.length)],
            socialLinks: {
                twitter: `https://x.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
                linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`
            }
        });
    }

    return organizers;
}

// Generate events
function generateEvents(count: number, organizers: any[]) {
    const events = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const category = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const template = category.templates[Math.floor(Math.random() * category.templates.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const organizer = organizers[Math.floor(Math.random() * organizers.length)];

        // Generate date (between 30 days ago and 180 days in the future)
        const daysOffset = Math.floor(Math.random() * 210) - 30;
        const eventDate = new Date(now);
        eventDate.setDate(now.getDate() + daysOffset);

        // Generate time
        const hour = Math.floor(Math.random() * 12) + 9; // 9 AM to 8 PM
        const minute = Math.random() > 0.5 ? 0 : 30;
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = hour + Math.floor(Math.random() * 4) + 2; // 2-5 hours duration
        const endTime = `${Math.min(endHour, 23).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Generate tickets
        const ticketTypes = ['General Admission', 'VIP', 'Early Bird', 'Student'];
        const selectedTypes = ticketTypes.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 ticket types
        const tickets = selectedTypes.map(type => ({
            type,
            price: `$${Math.floor(Math.random() * 100) + 10}`,
            quantity: (Math.floor(Math.random() * 200) + 50).toString()
        }));

        // Generate speakers (optional)
        const speakerCount = Math.random() > 0.4 ? Math.floor(Math.random() * 5) + 1 : 0;
        const speakers = speakerCount > 0 ? Array.from({ length: speakerCount }, (_, idx) => ({
            name: `Speaker ${idx + 1}`,
            bio: `Expert in ${category.category} with years of experience.`
        })) : [];

        const title = `${template} ${city.split(',')[0]}`;
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];

        events.push({
            id: `event_${Date.now()}_${i}`,
            title,
            description,
            date: eventDate.toISOString(),
            time: startTime,
            endTime,
            location: `${city}`,
            imageUrl: `/images/slide${Math.floor(Math.random() * 4) + 1}.jpg`, // Use existing images
            organizerId: organizer.id,
            createdBy: organizer.name,
            tickets,
            ticketTypes: tickets.map(t => t.type),
            speakers,
            category: category.category
        });
    }

    return events;
}

// Main seed function
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...');

        // Generate organizers
        console.log('👥 Generating organizers...');
        const organizers = generateOrganizers(120); // Generate 120 to ensure we have enough

        // Save organizers to users collection
        console.log('💾 Saving organizers to database...');
        for (const organizer of organizers) {
            await set(ref(db, `users/${organizer.id}`), organizer);
        }
        console.log(`✅ Saved ${organizers.length} organizers`);

        // Generate events
        console.log('🎉 Generating events...');
        const events = generateEvents(180, organizers); // Generate 180 events

        // Save events
        console.log('💾 Saving events to database...');
        for (const event of events) {
            await set(ref(db, `events/${event.id}`), event);
        }
        console.log(`✅ Saved ${events.length} events`);

        console.log('🎊 Database seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Organizers: ${organizers.length}`);
        console.log(`   - Events: ${events.length}`);
        console.log(`   - Events by category:`);
        const categoryCounts: Record<string, number> = {};
        events.forEach(e => {
            categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
        });
        Object.entries(categoryCounts).forEach(([cat, count]) => {
            console.log(`     ${cat}: ${count}`);
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('✨ Seed script completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Seed script failed:', error);
            process.exit(1);
        });
}

export { seedDatabase, generateOrganizers, generateEvents };



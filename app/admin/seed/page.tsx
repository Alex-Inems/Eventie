'use client';

import { useState } from 'react';
import { ref, set, remove } from 'firebase/database';
import { realtimeDb } from '@/firebaseConfig';

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
    {
        category: 'tech', templates: [
            'Tech Summit', 'Developer Conference', 'AI Innovation Forum', 'Blockchain Workshop',
            'Startup Pitch Night', 'Data Science Meetup', 'Cybersecurity Summit', 'Mobile App Development',
            'Cloud Computing Workshop', 'DevOps Training', 'UI/UX Design Bootcamp', 'Product Management Masterclass',
            'Fintech Innovation Lab', 'EdTech Summit', 'AgriTech Conference', 'HealthTech Forum'
        ]
    },
    {
        category: 'concerts', templates: [
            'Afrobeat Festival', 'Jazz Night Live', 'Hip Hop Concert', 'Reggae Vibes',
            'Electronic Music Festival', 'Acoustic Sessions', 'R&B Soul Night', 'Gospel Concert',
            'Traditional Music Showcase', 'Indie Music Festival', 'Rock Concert', 'Pop Music Night',
            'Dance Music Festival', 'World Music Celebration', 'Folk Music Gathering', 'Blues Night'
        ]
    },
    {
        category: 'food', templates: [
            'Food & Wine Festival', 'Street Food Market', 'Chef Masterclass', 'Cocktail Making Workshop',
            'Wine Tasting Experience', 'Coffee Festival', 'Chocolate Workshop', 'BBQ & Grill Night',
            'Vegan Food Fair', 'Seafood Festival', 'Dessert Festival', 'Craft Beer Tasting',
            'African Cuisine Showcase', 'Farmers Market', 'Cooking Competition', 'Food Truck Festival'
        ]
    },
    {
        category: 'workshops', templates: [
            'Photography Workshop', 'Creative Writing Masterclass', 'Digital Marketing Bootcamp',
            'Entrepreneurship Workshop', 'Leadership Training', 'Public Speaking Masterclass',
            'Financial Literacy Seminar', 'Real Estate Investment Forum', 'Career Development Workshop',
            'Language Learning Meetup', 'Art & Craft Workshop', 'Music Production Class',
            'Video Editing Workshop', 'Social Media Marketing', 'E-commerce Bootcamp', 'Content Creation Masterclass'
        ]
    },
    {
        category: 'networking', templates: [
            'Business Networking Mixer', 'Entrepreneur Meetup', 'Investor Pitch Event',
            'Startup Founder Circle', 'Women in Business Summit', 'Young Professionals Network',
            'Industry Leaders Forum', 'Business Growth Summit', 'Innovation Hub Meetup',
            'Co-working Space Launch', 'Business Accelerator Program', 'Mentorship Program Launch',
            'Corporate Leadership Summit', 'Business Strategy Workshop', 'Partnership Building Event'
        ]
    },
    {
        category: 'culture', templates: [
            'Art Exhibition Opening', 'Film Screening Night', 'Theater Performance', 'Poetry Slam',
            'Comedy Night Live', 'Fashion Show', 'Dance Performance', 'Cultural Festival',
            'Heritage Celebration', 'Literature Festival', 'Photography Exhibition', 'Sculpture Showcase',
            'Traditional Dance Show', 'Storytelling Night', 'Artisan Market', 'Cultural Exchange Program'
        ]
    },
    {
        category: 'sports', templates: [
            'Marathon Race', 'Basketball Tournament', 'Football Match', 'Yoga Retreat',
            'Fitness Bootcamp', 'Cycling Event', 'Swimming Competition', 'Tennis Tournament',
            'Boxing Match', 'Martial Arts Workshop', 'Running Club Meetup', 'CrossFit Challenge',
            'Dance Fitness Class', 'Pilates Workshop', 'Hiking Adventure', 'Sports Day Festival'
        ]
    },
    {
        category: 'wellness', templates: [
            'Wellness Retreat', 'Meditation Workshop', 'Mental Health Forum', 'Nutrition Seminar',
            'Yoga & Mindfulness', 'Holistic Health Fair', 'Stress Management Workshop', 'Sleep Wellness Seminar',
            'Fitness & Nutrition Expo', 'Wellness Coaching Session', 'Alternative Medicine Forum', 'Self-Care Workshop'
        ]
    }
];

// Curated Unsplash photo IDs for African events
const africanEventImageIds = [
    '1511671782779-c97d3d27a1d4', // African festival
    '1521737604893-d14cc237f11d', // Conference/event
    '1544716278-ca5e3f4abd8c', // Art/culture
    '1600891964599-f61ba0e24092', // Food event
    '1511578314322-5b5d5e5b5b5b', // Music/concert
    '1506905925346-21bda4d32df4', // Tech event
    '1514525253161-7a46d19cd819', // Networking
    '1517248135467-4c7edcad34c4', // Workshop
    '1505373877841-8d25f7d46678', // Sports
    '1511795409834-ef04bbd61622', // Wellness
    '1506905925346-21bda4d32df4', // Festival
    '1511578314322-5b5d5e5b5b5b', // Cultural event
    '1521737604893-d14cc237f11d', // Conference
    '1544716278-ca5e3f4abd8c', // Art show
    '1600891964599-f61ba0e24092', // Food festival
    '1511671782779-c97d3d27a1d4', // Music festival
    '1505373877841-8d25f7d46678', // Sports event
    '1511795409834-ef04bbd61622', // Wellness retreat
    '1514525253161-7a46d19cd819', // Business event
    '1517248135467-4c7edcad34c4', // Workshop
    '1506905925346-21bda4d32df4', // Tech summit
    '1511578314322-5b5d5e5b5b5b', // Concert
    '1521737604893-d14cc237f11d', // Event
    '1544716278-ca5e3f4abd8c', // Culture
    '1600891964599-f61ba0e24092', // Food
    '1511671782779-c97d3d27a1d4', // Festival
    '1505373877841-8d25f7d46678', // Sports
    '1511795409834-ef04bbd61622', // Wellness
    '1514525253161-7a46d19cd819', // Networking
    '1517248135467-4c7edcad34c4'  // Workshop
];

// Curated Unsplash photo IDs for American events
const americanEventImageIds = [
    '1492684223066-81342ee5ff30', // NYC event
    '1511578314322-5b5d5e5b5b5b', // LA concert
    '1505373877841-8d25f7d46678', // Chicago tech
    '1511795409834-ef04bbd61622', // SF startup
    '1514525253161-7a46d19cd819', // Atlanta food
    '1517248135467-4c7edcad34c4', // Miami art
    '1506905925346-21bda4d32df4', // Seattle conference
    '1511671782779-c97d3d27a1d4', // Austin music
    '1521737604893-d14cc237f11d', // Boston networking
    '1544716278-ca5e3f4abd8c', // Denver wellness
    '1600891964599-f61ba0e24092', // New Orleans culture
    '1511578314322-5b5d5e5b5b5b', // Detroit sports
    '1505373877841-8d25f7d46678', // Houston expo
    '1511795409834-ef04bbd61622', // DC summit
    '1514525253161-7a46d19cd819', // Vegas convention
    '1517248135467-4c7edcad34c4', // Philly workshop
    '1506905925346-21bda4d32df4', // NYC tech
    '1511671782779-c97d3d27a1d4', // LA festival
    '1521737604893-d14cc237f11d', // Chicago event
    '1544716278-ca5e3f4abd8c', // SF conference
    '1600891964599-f61ba0e24092', // Atlanta music
    '1511578314322-5b5d5e5b5b5b', // Miami food
    '1505373877841-8d25f7d46678', // Seattle art
    '1511795409834-ef04bbd61622', // Austin tech
    '1514525253161-7a46d19cd819', // Boston event
    '1517248135467-4c7edcad34c4', // Denver festival
    '1506905925346-21bda4d32df4', // New Orleans
    '1511671782779-c97d3d27a1d4', // Detroit
    '1521737604893-d14cc237f11d', // Houston
    '1544716278-ca5e3f4abd8c'  // DC
];

interface Organizer {
    id: string;
    name: string;
    displayName: string;
    email: string;
    company: string;
    isVerified: boolean;
    bio: string;
    location: string;
    socialLinks: {
        twitter: string;
        linkedin: string;
    };
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    endTime: string;
    location: string;
    imageUrl: string;
    organizerId: string;
    createdBy: string;
    tickets: Array<{ type: string; price: string; quantity: string }>;
    ticketTypes: string[];
    speakers: Array<{ name: string; bio: string }>;
    category: string;
}

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

function generateOrganizers(count: number): Organizer[] {
    const organizers: Organizer[] = [];
    const firstNames = ['Amina', 'Kwame', 'Fatima', 'Oluwaseun', 'Thabo', 'Aisha', 'Kofi', 'Ngozi', 'Musa', 'Zainab', 'Tunde', 'Yemi', 'Bisi', 'Chidi', 'Funmi', 'Ike', 'Jumoke', 'Kemi', 'Lola', 'Moyo'];
    const lastNames = ['Adebayo', 'Okafor', 'Mensah', 'Nwosu', 'Kone', 'Diallo', 'Kamau', 'Mbeki', 'Okonkwo', 'Sow', 'Traore', 'Ndlovu', 'Mthembu', 'Osei', 'Bello', 'Ibrahim', 'Hassan', 'Mohammed', 'Ali', 'Abdullahi'];
    const companies = ['Events Co', 'Creative Hub', 'Innovation Lab', 'Community Space', 'Experience Design', 'Event Masters', 'Gathering Place', 'Connect Events', 'Vibe Collective', 'Experience Hub'];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];

        organizers.push({
            id: `org_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
            name: `${firstName} ${lastName}`,
            displayName: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s/g, '')}.com`,
            company,
            isVerified: Math.random() > 0.3,
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

function generateEvents(count: number, organizers: Organizer[]): Event[] {
    const events: Event[] = [];
    const now = new Date();

    // Track used image combinations to ensure no exact duplicates
    const usedCombinations = new Set<string>();
    
    const getEventImageUrl = (index: number): string => {
        // Alternate between African and American images
        const useAfricanImage = index % 2 === 0;
        const sourceArray = useAfricanImage ? africanEventImageIds : americanEventImageIds;
        
        // Calculate array index, cycling through available images
        let arrayIndex = Math.floor(index / 2) % sourceArray.length;
        let attempts = 0;
        const maxAttempts = sourceArray.length;
        
        // Find a unique combination
        while (attempts < maxAttempts) {
            const combination = `${useAfricanImage ? 'afr' : 'usa'}-${arrayIndex}`;
            if (!usedCombinations.has(combination)) {
                usedCombinations.add(combination);
                const photoId = sourceArray[arrayIndex];
                return `https://images.unsplash.com/photo-${photoId}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800`;
            }
            arrayIndex = (arrayIndex + 1) % sourceArray.length;
            attempts++;
        }
        
        // Fallback if all combinations used (shouldn't happen with 180 events and 30+ images per array)
        const photoId = sourceArray[index % sourceArray.length];
        return `https://images.unsplash.com/photo-${photoId}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800`;
    };

    for (let i = 0; i < count; i++) {
        const category = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const template = category.templates[Math.floor(Math.random() * category.templates.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const organizer = organizers[Math.floor(Math.random() * organizers.length)];

        const daysOffset = Math.floor(Math.random() * 210) - 30;
        const eventDate = new Date(now);
        eventDate.setDate(now.getDate() + daysOffset);

        const hour = Math.floor(Math.random() * 12) + 9;
        const minute = Math.random() > 0.5 ? 0 : 30;
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = hour + Math.floor(Math.random() * 4) + 2;
        const endTime = `${Math.min(endHour, 23).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        const ticketTypes = ['General Admission', 'VIP', 'Early Bird', 'Student'];
        const selectedTypes = ticketTypes.slice(0, Math.floor(Math.random() * 3) + 2);
        const tickets: Array<{ type: string; price: string; quantity: string }> = selectedTypes.map(type => ({
            type,
            price: `$${Math.floor(Math.random() * 100) + 10}`,
            quantity: (Math.floor(Math.random() * 200) + 50).toString()
        }));

        const speakerCount = Math.random() > 0.4 ? Math.floor(Math.random() * 5) + 1 : 0;
        const speakers = speakerCount > 0 ? Array.from({ length: speakerCount }, (_, idx) => ({
            name: `Speaker ${idx + 1}`,
            bio: `Expert in ${category.category} with years of experience.`
        })) : [];

        const title = `${template} ${city.split(',')[0]}`;
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];

        events.push({
            id: `event_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            description,
            date: eventDate.toISOString(),
            time: startTime,
            endTime,
            location: city,
            imageUrl: getEventImageUrl(i),
            organizerId: organizer.id,
            createdBy: organizer.name,
            tickets,
            ticketTypes: tickets.map((t) => t.type),
            speakers,
            category: category.category
        });
    }

    return events;
}

export default function SeedPage() {
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [progress, setProgress] = useState({ organizers: 0, events: 0, total: 0 });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteAllEvents = async () => {
        if (!confirm('⚠️ WARNING: This will delete ALL events from the database. This action cannot be undone. Continue?')) {
            return;
        }

        setDeleting(true);
        setError(null);
        setResult(null);

        try {
            const db = realtimeDb;
            const eventsRef = ref(db, 'events');
            await remove(eventsRef);

            setResult('✅ Successfully deleted all events from the database!');
        } catch (err) {
            setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setDeleting(false);
        }
    };

    const handleSeed = async () => {
        if (!confirm('This will add 120 organizers and 180 events to your database. Continue?')) {
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setProgress({ organizers: 0, events: 0, total: 0 });

        try {
            const db = realtimeDb;

            // Generate organizers
            const organizers = generateOrganizers(120);
            setProgress({ organizers: 0, events: 0, total: organizers.length });

            for (let i = 0; i < organizers.length; i++) {
                await set(ref(db, `users/${organizers[i].id}`), organizers[i]);
                setProgress({ organizers: i + 1, events: 0, total: organizers.length });
            }

            // Generate events
            const events = generateEvents(180, organizers);
            setProgress({ organizers: organizers.length, events: 0, total: organizers.length + events.length });

            for (let i = 0; i < events.length; i++) {
                await set(ref(db, `events/${events[i].id}`), events[i]);
                setProgress({ organizers: organizers.length, events: i + 1, total: organizers.length + events.length });
            }

            const categoryCounts: Record<string, number> = {};
            events.forEach((e) => {
                categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
            });

            const categorySummary = Object.entries(categoryCounts)
                .map(([cat, count]) => `${cat}: ${count}`)
                .join(', ');

            setResult(`✅ Successfully seeded database!\n\n📊 Summary:\n- Organizers: ${organizers.length}\n- Events: ${events.length}\n- Categories: ${categorySummary}`);

        } catch (err) {
            setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#040404] text-white p-8">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-8 text-4xl font-semibold">Database Seeder</h1>

                <div className="mb-8 rounded-3xl border border-white/10 bg-black/70 p-6">
                    <p className="mb-4 text-gray-300">
                        This tool will seed your database with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>120 organizers with realistic African names and profiles</li>
                        <li>180 events across 8 categories (tech, concerts, food, workshops, networking, culture, sports, wellness)</li>
                        <li>All events will have proper titles that generate SEO-friendly slugs</li>
                        <li>Events distributed across 20 African cities</li>
                    </ul>
                </div>

                {loading && (
                    <div className="mb-6 rounded-3xl border border-white/10 bg-black/70 p-6">
                        <p className="mb-4 text-gray-300">Seeding in progress...</p>
                        <div className="mb-2 flex justify-between text-sm text-gray-400">
                            <span>Organizers: {progress.organizers}</span>
                            <span>Events: {progress.events}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full bg-orange-200 transition-all duration-300"
                                style={{ width: `${progress.total > 0 ? ((progress.organizers + progress.events) / progress.total * 100) : 0}%` }}
                            />
                        </div>
                    </div>
                )}

                {result && (
                    <div className="mb-6 rounded-3xl border border-green-500/30 bg-green-500/10 p-6">
                        <pre className="whitespace-pre-wrap text-sm text-green-200">{result}</pre>
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
                        <p className="text-sm text-red-200">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleDeleteAllEvents}
                        disabled={loading || deleting}
                        className="w-full rounded-full border border-red-500/50 bg-red-500/10 px-8 py-4 text-base font-semibold text-red-200 transition hover:border-red-500 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {deleting ? 'Deleting All Events...' : '🗑️ Delete All Events'}
                    </button>

                <button
                    onClick={handleSeed}
                        disabled={loading || deleting}
                    className="w-full rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Seeding...' : 'Start Seeding Database'}
                </button>
                </div>
            </div>
        </div>
    );
}


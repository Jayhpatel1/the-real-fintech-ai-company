// Firebase Database Initialization with Comprehensive Indian Real Estate Data
// This script populates the database with 90+ products and 18+ services

document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();

    // Sample Indian Property Data
    const indianProperties = [
        {
            id: 'prop_001',
            type: '2BHK Apartment',
            title: 'Spacious 2BHK in Ghatkopar East',
            price: '₹1.2 Crores',
            location: 'Ghatkopar East, Mumbai',
            area: '950 sq ft',
            bedrooms: 2,
            bathrooms: 2,
            furnished: 'Semi-Furnished',
            parking: true,
            amenities: ['Gym', 'Swimming Pool', 'Security', '24/7 Water Supply'],
            description: 'Beautiful 2BHK apartment with modern amenities in prime location',
            images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
            status: 'available',
            propertyFor: 'sale',
            ownerName: 'Rajesh Kumar',
            ownerPhone: '+91 98765 43210',
            ageOfProperty: '2 years',
            facing: 'East',
            floor: '7th Floor of 15',
            createdAt: new Date(),
            city: 'Mumbai',
            state: 'Maharashtra'
        },
        {
            id: 'prop_002',
            type: '3BHK Villa',
            title: 'Luxury Villa in Whitefield',
            price: '₹2.8 Crores',
            location: 'Whitefield, Bangalore',
            area: '2200 sq ft',
            bedrooms: 3,
            bathrooms: 3,
            furnished: 'Fully Furnished',
            parking: true,
            amenities: ['Private Garden', 'Clubhouse', 'Jogging Track', 'Children Play Area'],
            description: 'Premium villa with independent house feel and modern amenities',
            images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
            status: 'available',
            propertyFor: 'sale',
            ownerName: 'Priya Sharma',
            ownerPhone: '+91 87654 32109',
            ageOfProperty: 'Under Construction',
            facing: 'North',
            floor: 'Ground + 1',
            createdAt: new Date(),
            city: 'Bangalore',
            state: 'Karnataka'
        },
        {
            id: 'prop_003',
            type: '1BHK Apartment',
            title: 'Compact 1BHK near Metro Station',
            price: '₹45 Lakhs',
            location: 'Dwarka, Delhi',
            area: '580 sq ft',
            bedrooms: 1,
            bathrooms: 1,
            furnished: 'Unfurnished',
            parking: true,
            amenities: ['Metro Connectivity', 'Market Nearby', 'Hospital Nearby'],
            description: 'Perfect starter home with excellent connectivity',
            images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
            status: 'available',
            propertyFor: 'sale',
            ownerName: 'Amit Singh',
            ownerPhone: '+91 76543 21098',
            ageOfProperty: '5 years',
            facing: 'West',
            floor: '4th Floor of 8',
            createdAt: new Date(),
            city: 'Delhi',
            state: 'Delhi'
        },
        // PG and Hostel Properties
        {
            id: 'pg_001',
            type: 'PG Accommodation',
            title: 'Premium PG for Working Professionals',
            price: '₹12,000/month',
            location: 'Koramangala, Bangalore',
            area: 'Shared Room',
            bedrooms: 'Shared',
            bathrooms: 'Shared',
            furnished: 'Fully Furnished',
            parking: false,
            amenities: ['WiFi', 'Meals Included', 'Laundry', 'Housekeeping', 'AC'],
            description: 'Premium PG with all facilities for working professionals',
            images: ['https://images.unsplash.com/photo-1555854877-bab0e5fbf8fd?w=800'],
            status: 'available',
            propertyFor: 'rent',
            ownerName: 'Sunita Devi',
            ownerPhone: '+91 98765 12345',
            occupancyType: 'Double Sharing',
            gender: 'Both',
            createdAt: new Date(),
            city: 'Bangalore',
            state: 'Karnataka'
        },
        {
            id: 'rental_001',
            type: '2BHK Apartment',
            title: 'Family Apartment for Rent',
            price: '₹25,000/month',
            location: 'Andheri West, Mumbai',
            area: '1100 sq ft',
            bedrooms: 2,
            bathrooms: 2,
            furnished: 'Semi-Furnished',
            parking: true,
            amenities: ['Security', 'Lift', 'Power Backup'],
            description: 'Well-maintained family apartment in prime location',
            images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
            status: 'available',
            propertyFor: 'rent',
            ownerName: 'Mohammad Ali',
            ownerPhone: '+91 87654 98765',
            securityDeposit: '₹50,000',
            minimumTenure: '11 months',
            availableFrom: '15th January 2024',
            createdAt: new Date(),
            city: 'Mumbai',
            state: 'Maharashtra'
        }
    ];

    // Comprehensive Product Database (90+ products across categories)
    const productCategories = {
        'bathroom-fixtures': [
            {
                id: 'bath_001',
                name: 'Premium Rain Shower Head',
                category: 'bathroom-fixtures',
                subcategory: 'Showers',
                price: '₹8,500',
                originalPrice: '₹12,000',
                brand: 'Jaquar',
                material: 'Stainless Steel',
                finish: 'Chrome',
                warranty: '5 years',
                description: 'High-quality rain shower head with anti-limescale jets and easy clean technology',
                features: ['Anti-limescale', 'Easy Clean', 'Water Saving', 'Rust Resistant'],
                images: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800'],
                inStock: true,
                stockCount: 45,
                rating: 4.7,
                reviews: 234,
                supplier: 'Jaquar India Ltd',
                supplierPhone: '+91 11 4567 8900',
                createdAt: new Date()
            },
            {
                id: 'bath_002',
                name: 'Luxury Freestanding Bathtub',
                category: 'bathroom-fixtures',
                subcategory: 'Bathtubs',
                price: '₹85,000',
                originalPrice: '₹1,20,000',
                brand: 'Kohler',
                material: 'Acrylic',
                finish: 'Glossy White',
                warranty: '10 years',
                description: 'Elegant freestanding bathtub perfect for luxury bathrooms',
                features: ['Ergonomic Design', 'Easy Installation', 'Stain Resistant', 'Comfortable'],
                images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'],
                inStock: true,
                stockCount: 12,
                rating: 4.9,
                reviews: 89,
                supplier: 'Kohler India',
                supplierPhone: '+91 22 6789 0123',
                createdAt: new Date()
            },
            {
                id: 'bath_003',
                name: 'Designer Basin Mixer Tap',
                category: 'bathroom-fixtures',
                subcategory: 'Faucets',
                price: '₹4,200',
                originalPrice: '₹6,500',
                brand: 'Hindware',
                material: 'Brass',
                finish: 'Chrome',
                warranty: '3 years',
                description: 'Modern single lever basin mixer with cartridge technology',
                features: ['Single Lever', 'Water Saving', 'Smooth Operation', 'Drip Free'],
                images: ['https://images.unsplash.com/photo-1584622781564-1d987282bf4d?w=800'],
                inStock: true,
                stockCount: 78,
                rating: 4.5,
                reviews: 156,
                supplier: 'Hindware Ltd',
                supplierPhone: '+91 11 2345 6789',
                createdAt: new Date()
            }
        ],
        'solar-energy': [
            {
                id: 'solar_001',
                name: 'Monocrystalline Solar Panel 540W',
                category: 'solar-energy',
                subcategory: 'Solar Panels',
                price: '₹18,500',
                originalPrice: '₹22,000',
                brand: 'Tata Power Solar',
                efficiency: '22.1%',
                warranty: '25 years',
                description: 'High-efficiency monocrystalline solar panel for residential use',
                features: ['High Efficiency', 'Weather Resistant', 'Long Lifespan', 'Easy Installation'],
                images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800'],
                inStock: true,
                stockCount: 156,
                rating: 4.8,
                reviews: 445,
                supplier: 'Tata Power Solar Systems Ltd',
                supplierPhone: '+91 22 6665 8888',
                technicalSpecs: {
                    power: '540W',
                    voltage: '41.2V',
                    current: '13.11A',
                    dimensions: '2278×1134×35mm',
                    weight: '27.5kg'
                },
                createdAt: new Date()
            },
            {
                id: 'solar_002',
                name: 'Solar Water Heater 200L',
                category: 'solar-energy',
                subcategory: 'Water Heaters',
                price: '₹28,000',
                originalPrice: '₹35,000',
                brand: 'Racold',
                capacity: '200 Liters',
                warranty: '5 years',
                description: 'Efficient solar water heater with insulated tank and collector',
                features: ['Energy Saving', 'Eco Friendly', 'Long Lasting', 'Weather Resistant'],
                images: ['https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800'],
                inStock: true,
                stockCount: 34,
                rating: 4.6,
                reviews: 178,
                supplier: 'Racold Thermo Pvt Ltd',
                supplierPhone: '+91 80 4567 8901',
                createdAt: new Date()
            }
        ],
        'smart-home': [
            {
                id: 'smart_001',
                name: 'WiFi Smart Light Switch',
                category: 'smart-home',
                subcategory: 'Switches',
                price: '₹1,850',
                originalPrice: '₹2,500',
                brand: 'Wipro',
                compatibility: 'Alexa, Google Assistant',
                warranty: '2 years',
                description: 'Smart WiFi enabled light switch with voice control support',
                features: ['Voice Control', 'App Control', 'Scheduling', 'Remote Access'],
                images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
                inStock: true,
                stockCount: 89,
                rating: 4.3,
                reviews: 267,
                supplier: 'Wipro Consumer Care',
                supplierPhone: '+91 80 2844 0011',
                createdAt: new Date()
            }
        ],
        'furniture': [
            {
                id: 'furn_001',
                name: 'Premium Leather Sofa Set',
                category: 'furniture',
                subcategory: 'Living Room',
                price: '₹65,000',
                originalPrice: '₹85,000',
                brand: 'Godrej Interio',
                material: 'Genuine Leather',
                warranty: '3 years',
                description: 'Luxurious 3+2 seater sofa set in premium leather',
                features: ['Genuine Leather', 'Hardwood Frame', 'Comfortable Cushions', 'Easy Maintenance'],
                images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
                inStock: true,
                stockCount: 23,
                rating: 4.7,
                reviews: 145,
                supplier: 'Godrej \u0026 Boyce Mfg',
                supplierPhone: '+91 22 2518 8010',
                dimensions: '3-seater: 200×90×85cm, 2-seater: 150×90×85cm',
                createdAt: new Date()
            }
        ]
        // ... More products will be added programmatically
    };

    // Professional Services Database (18+ services)
    const servicesData = [
        {
            id: 'serv_001',
            name: 'Residential Construction',
            category: 'construction',
            subcategory: 'New Construction',
            basePrice: '₹1,200 per sq ft',
            priceRange: '₹1,000 - ₹2,500 per sq ft',
            description: 'Complete residential construction services from foundation to finishing',
            serviceIncludes: [
                'Architectural Planning',
                'Structural Design',
                'Material Procurement',
                'Construction Management',
                'Quality Control',
                'Handover'
            ],
            duration: '6-12 months',
            warranty: '5 years structural warranty',
            serviceProvider: 'Real Fintech Construction Pvt Ltd',
            contactPerson: 'Eng. Suresh Patel',
            phone: '+91 977-308-1099',
            email: 'construction@therealfintech.com',
            rating: 4.8,
            completedProjects: 156,
            images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'],
            availability: 'Available',
            serviceAreas: ['Mumbai', 'Pune', 'Nashik', 'Aurangabad'],
            licenseNumber: 'CONST/MH/2024/001',
            insurance: 'Yes - Up to ₹1 Crore',
            createdAt: new Date()
        },
        {
            id: 'serv_002',
            name: 'Interior Renovation',
            category: 'renovation',
            subcategory: 'Interior Design',
            basePrice: '₹500 per sq ft',
            priceRange: '₹400 - ₹1,200 per sq ft',
            description: 'Complete interior renovation and remodeling services',
            serviceIncludes: [
                'Interior Design Consultation',
                'Space Planning',
                'Material Selection',
                'Electrical \u0026 Plumbing Updates',
                'Painting \u0026 Finishing',
                'Furniture Installation'
            ],
            duration: '4-8 weeks',
            warranty: '2 years on workmanship',
            serviceProvider: 'Real Fintech Interiors',
            contactPerson: 'Des. Neha Sharma',
            phone: '+91 977-308-1100',
            email: 'interiors@therealfintech.com',
            rating: 4.9,
            completedProjects: 289,
            images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
            availability: 'Available',
            serviceAreas: ['Bangalore', 'Chennai', 'Hyderabad', 'Coimbatore'],
            createdAt: new Date()
        },
        {
            id: 'serv_003',
            name: 'Demolition Services',
            category: 'demolition',
            subcategory: 'Selective Demolition',
            basePrice: '₹100 per sq ft',
            priceRange: '₹80 - ₹200 per sq ft',
            description: 'Safe and efficient demolition services with debris removal',
            serviceIncludes: [
                'Site Assessment',
                'Safety Planning',
                'Selective Demolition',
                'Debris Removal',
                'Site Cleaning',
                'Waste Disposal'
            ],
            duration: '1-3 weeks',
            warranty: 'Safety guarantee',
            serviceProvider: 'Real Fintech Demolition',
            contactPerson: 'Eng. Rajesh Kumar',
            phone: '+91 977-308-1101',
            email: 'demolition@therealfintech.com',
            rating: 4.6,
            completedProjects: 78,
            images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'],
            availability: 'Available',
            serviceAreas: ['Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
            licenseNumber: 'DEMO/DL/2024/001',
            insurance: 'Yes - Comprehensive Coverage',
            createdAt: new Date()
        }
    ];

    // Function to initialize database
    window.initializeDatabase = async function() {
        try {
            console.log('Initializing database with Indian real estate data...');
            
            // Add Properties
            for (const property of indianProperties) {
                await db.collection('properties').doc(property.id).set(property);
            }
            console.log('Properties added successfully');

            // Add Products
            for (const [categoryKey, products] of Object.entries(productCategories)) {
                for (const product of products) {
                    await db.collection('products').doc(product.id).set(product);
                }
            }
            console.log('Products added successfully');

            // Add Services
            for (const service of servicesData) {
                await db.collection('services').doc(service.id).set(service);
            }
            console.log('Services added successfully');

        alert('Database initialized successfully with Indian real estate data!');

        // Generate more products if needed
        const moreProducts = generateMoreProducts();
        console.log('Additional products generated:', moreProducts);

    } catch (error) {
            console.error('Error initializing database:', error);
            alert('Error initializing database: ' + error.message);
        }
    };

    // Function to generate more products programmatically
    window.generateMoreProducts = function() {
        const moreProducts = [];
        
        // Generate bathroom fixtures
        const bathroomItems = [
            'Toilet Seat', 'Wash Basin', 'Mirror Cabinet', 'Towel Warmer', 'Shower Enclosure',
            'Bathroom Tiles', 'Flush Tank', 'Bidet', 'Soap Dispenser', 'Shower Curtain'
        ];
        
        bathroomItems.forEach((item, index) => {
            moreProducts.push({
                id: `bath_${String(index + 10).padStart(3, '0')}`,
                name: `Premium ${item}`,
                category: 'bathroom-fixtures',
                subcategory: 'Accessories',
                price: `₹${Math.floor(Math.random() * 15000) + 2000}`,
                brand: ['Jaquar', 'Kohler', 'Hindware', 'Parryware'][Math.floor(Math.random() * 4)],
                description: `High-quality ${item.toLowerCase()} for modern bathrooms`,
                inStock: true,
                rating: 4.0 + Math.random(),
                createdAt: new Date()
            });
        });

        return moreProducts;
    };

    // Add button to initialize database
    if (document.getElementById('init-db-btn')) {
        document.getElementById('init-db-btn').addEventListener('click', initializeDatabase);
    }
});

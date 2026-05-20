const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co/rest/v1/brand_stories';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';

const stories = [
  {
    chapter_number: 1,
    chapter_subtitle: "Chapter I: The Founder's Vision",
    main_heading: "From A Pioneer's Vision To Your Family Table",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    paragraph_1: "Founded with a passionate drive to make premium, healthy, home-style traditional breads accessible, Eatsee Food Products has grown from a humble home recipe testing setup into a state-of-the-art packaging kitchen under the steering direction of Mr. Satheeshan.",
    paragraph_2: "Recognizing the hectic nature of modern life, our team perfected the art of pre-cooking delicate breads like flaky Porottas, paper-thin Pathiris, and steamed Noolputtus without using chemicals or artificial additives. We select only locally sourced premium flour and rice grains to produce meals that feel like they were made by your mother."
  },
  {
    chapter_number: 2,
    chapter_subtitle: "Chapter II: Legacy of Craftsmanship",
    main_heading: "Perfecting The Art of Traditional Flatbreads",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    paragraph_1: "We spent months perfecting the delicate textures and multi-layered flaky consistency of traditional Indian breads. Our chefs painstakingly hand-roll flaky Porottas, stretch thin soft Chappathis, and master the snow-white, delicate art of paper-thin Pathiri.",
    paragraph_2: "By pairing time-tested family recipes with advanced temperature-controlled proofing, we ensure that every single bread expands with identical fluffiness and natural, aromatic richness on your plate."
  },
  {
    chapter_number: 3,
    chapter_subtitle: "Chapter III: Our Uncompromising Standard",
    main_heading: "Surgical Purity & Preservative-Free Hygiene",
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    paragraph_1: "At Eatsee, hygiene is not just a regulatory compliance; it is a sacred brand pledge. Our state-of-the-art packaging kitchen maintains surgical-grade sanitation levels where every process is monitored under strict cleanliness guidelines.",
    paragraph_2: "We use 100% natural, locally sourced grains with zero artificial chemical preservatives, zero toxic flavor enhancers, and zero synthetic colors. Pure nature, pure taste, absolutely healthy for all ages."
  },
  {
    chapter_number: 4,
    chapter_subtitle: "Chapter IV: The Ready-To-Serve Innovation",
    main_heading: "Gourmet Dining Made Effortlessly Convenient",
    image_url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    paragraph_1: "We understand the fast pace of modern lifestyles. That's why we engineered the perfect pre-cooking and high-end vacuum seal system to lock in maximum moisture, elasticity, and natural home-cooked freshness.",
    paragraph_2: "No messy kneading, no strenuous rolling, and no flour-dusted counters. Simply place our pre-cooked bread on a pre-heated tawa for a quick 60 seconds on both sides, and serve piping hot fresh breads instantly."
  }
];

async function seed() {
  const response = await fetch(supabaseUrl, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(stories)
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('Successfully seeded:', data.length);
  } else {
    const err = await response.text();
    console.error('Failed to seed:', err);
  }
}

seed();

import type { Article } from "@/data/article-types";
import type { Tag } from "@/data/tags";

const IMG: Record<string, string> = {
  decks: "/images/hero-deck.jpg",
  porches: "/images/porch.jpg",
  kitchens: "/images/kitchen.jpg",
  baths: "/images/bathroom.jpg",
  garages: "/images/garage.jpg",
  additions: "/images/addition.jpg",
  basements: "/images/basement.jpg",
  commercial: "/images/commercial.jpg",
  "outdoor-living": "/images/porch.jpg",
  "peachtree-city": "/images/full-home.jpg",
  coweta: "/images/full-home.jpg",
  materials: "/images/hero-deck.jpg",
  "how-to": "/images/full-home.jpg",
};

function post(p: {
  href: string;
  title: string;
  date: string;
  excerpt: string;
  lede: string;
  tags: Tag[];
  sections: { heading: string; paragraphs: string[] }[];
  related: { href: string; label: string }[];
  image?: string;
}): Article {
  return {
    href: p.href,
    title: p.title,
    titleTag: p.title,
    date: p.date,
    excerpt: p.excerpt,
    description: p.excerpt,
    image: p.image ?? IMG[p.tags[0]] ?? "/images/full-home.jpg",
    imageAlt: p.title,
    h1: p.title,
    lede: p.lede,
    sections: p.sections,
    related: p.related,
    tags: p.tags,
  };
}

function s(heading: string, ...paragraphs: string[]) {
  return { heading, paragraphs };
}

export const CATALOG_ARTICLES: Article[] = [
  post({
    href: "/home-addition-vs-buying/",
    title: "Home Addition vs. Buying",
    date: "July 1, 2026",
    excerpt: "Stay in the neighborhood you like, or sell and buy bigger. Run the real math first.",
    lede: "Families in Peachtree City, Newnan, and Fayetteville outgrow a house and ask the same question: add on, or buy another one.",
    tags: ["additions", "how-to", "peachtree-city"],
    sections: [
      s("What the housing market is actually doing", "Fayette County appreciation is good if you already own. It is harder if you are selling to buy larger — the next house appreciated too, and the rate on the new loan is not the one you locked a decade ago. Selling costs, buying costs, and a premium for a bigger house add up. The case for staying and building is stronger than it has been in years. That does not mean buying always loses. It means you should look at both with real numbers."),
      s("The case for adding on", "You keep the neighborhood, the schools, and the people you already know. Money goes into an asset you own instead of realtor fees and a moving truck. You also control the layout — including an in-law suite that the market understands at resale."),
      s("The case for buying — and how to compare", "If the lot or the HOA will not take the addition, if the house has deferred structural trouble, or if the neighborhood is not where you want to stay, buying can be the cleaner path. Get a realtor’s comps and a mortgage number. Get a contractor who works here to walk the property. When people do that, the addition often wins on dollars. It always wins on control. We have been doing additions in Fayette and Coweta since 1997. That look is free."),
    ],
    related: [
      { href: "/home-addition-contractor/", label: "Home additions" },
      { href: "/in-law-additions/", label: "In-law additions" },
    ],
  }),
  post({
    href: "/bathroom-remodeling/",
    title: "Bathroom Remodeling",
    date: "June 28, 2026",
    excerpt: "A bath remodel is plumbing, tile, and a room you use twice a day — not a weekend vanity swap.",
    lede: "Most Fayette County baths we open were built for a different decade. The layout is the job.",
    tags: ["baths", "how-to"],
    sections: [
      s("What actually changes", "Walk-in showers, tile that will last, a vanity that holds real storage, and ventilation that does not leave the room wet. If the primary is the only bath with a tub, read the walk-in vs. tub note before you demo."),
      s("Permits and the rest of the house", "Licensed plumbing, a pan that will pass inspection, and finishes that match the hall. We take the job from layout through punch list in Fayette and Coweta."),
    ],
    related: [
      { href: "/bathroom-remodels/", label: "Bathroom remodels" },
      { href: "/walk-in-shower-vs-tub/", label: "Walk-in shower vs. tub" },
    ],
  }),
  post({
    href: "/kitchen-remodeling-2/",
    title: "Kitchen Remodeling",
    date: "June 24, 2026",
    excerpt: "Cabinets, counters, and a layout you will still like in ten years.",
    lede: "A kitchen remodel in Peachtree City is not a catalog. It is how the room works every morning.",
    tags: ["kitchens", "how-to"],
    sections: [
      s("Layout before finishes", "Move the sink or the range only if the structure and the venting allow it. An island needs clearance. Opening a wall into the family room is a beam conversation — see the open-concept kitchen article."),
      s("What we install", "Cabinets, quartz or granite, tile, lighting, and the punch list. Cost-plus so you see the numbers. The kitchens service page is the shop pitch; this is the decision."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchen remodels" },
      { href: "/open-concept-kitchen/", label: "Open concept kitchen" },
    ],
  }),
  post({
    href: "/wine-cellar/",
    title: "Wine Cellar",
    date: "June 20, 2026",
    excerpt: "Fifty-five degrees, a sealed envelope, and a room you can actually sit in — not a rack in a closet.",
    lede: "Storing a real collection takes mechanical work first and pretty racks second.",
    tags: ["additions", "how-to"],
    sections: [
      s("Environmental control", "Wine wants a steady 55° and about 60% humidity. That means a vapor barrier on the warm side of the studs, dense insulation, an exterior-grade sealed door, and a dedicated cooling unit — with a backup path for Georgia storms."),
      s("The room itself", "Standard drywall does not like that humidity. Cedar, brick, or stone, custom racks, low-heat LED, and optional glass so you can see the collection from the dining room without breaking the envelope. Spare rooms in Peachtree City and Tyrone houses take this well."),
    ],
    related: [
      { href: "/basement-remodels/", label: "Basement remodels" },
      { href: "/home-addition-contractor/", label: "Additions" },
    ],
  }),
  post({
    href: "/outdoor-pavilions/",
    title: "Outdoor Pavilions",
    date: "June 16, 2026",
    excerpt: "Shade without screening — a roof that belongs on the house, not a kit in the grass.",
    lede: "A pavilion is a covered outdoor room. It is not a screened porch and it is not a tent.",
    tags: ["outdoor-living", "porches"],
    sections: [
      s("When a pavilion is the right call", "You want shade and rain cover without enclosing the space. Pool houses, backyard dining, and golf-cart-side sitting in Peachtree City are the usual jobs. HOA review will have opinions about roof and posts."),
      s("Built like the house", "Footings, a roof that matches pitch and shingle, and electrical for fans and lights. See covered porches if you want screens. See outdoor kitchens if the pavilion is for cooking."),
    ],
    related: [
      { href: "/covered-porches-by-pfeifer/", label: "Covered porches" },
      { href: "/outdoor-kitchen/", label: "Outdoor kitchen" },
    ],
  }),
  post({
    href: "/the-modern-mudroom/",
    title: "The Modern Mudroom",
    date: "June 12, 2026",
    excerpt: "A place for shoes, bags, and wet dogs so they do not live in the kitchen.",
    lede: "Fayette County houses often dump the family in through the garage. That landing is a room, or it is a mess.",
    tags: ["additions", "how-to"],
    sections: [
      s("What the room needs", "A durable floor, a bench, hooks, and cubbies that actually fit backpacks. A sink if you have dogs. Tile or LVP — not leftover hardwood."),
      s("Where it comes from", "Steal a slice of the garage, a dead hall, or a small addition off the side door. The point is the path from the car to the kitchen."),
    ],
    related: [
      { href: "/home-addition-contractor/", label: "Additions" },
      { href: "/laundry-room-design/", label: "Laundry room design" },
    ],
  }),
  post({
    href: "/ultimate-home-gym/",
    title: "Ultimate Home Gym",
    date: "June 8, 2026",
    excerpt: "A floor that takes weights, HVAC that keeps up, and a door you will actually walk through.",
    lede: "A spare bedroom with a treadmill is not a gym. The structure has to take the load.",
    tags: ["basements", "additions"],
    sections: [
      s("Where it belongs", "Basements are the usual home for this in Fayette County — isolated and easier to sound-control. Rubber flooring, outlets, and cooling that runs when the house is asleep."),
      s("What we actually build", "Moisture first if it is below grade. Then layout and a bath nearby so the rest of the house does not become a locker room."),
    ],
    related: [
      { href: "/finished-basement/", label: "Finished basement" },
      { href: "/basement-remodels/", label: "Basement remodels" },
    ],
  }),
  post({
    href: "/master-closet/",
    title: "Master Closet",
    date: "May 18, 2026",
    excerpt: "A walk-in that uses the wall you have — not a reaching closet from 1994.",
    lede: "A lot of Peachtree City frustration is not the living room. It is the primary closet.",
    tags: ["additions", "how-to"],
    sections: [
      s("Make it a room", "Older Fayette County houses have reaching closets that cannot hold a modern wardrobe. A walk-in off the primary, or a small addition, changes the morning. Layout uses height, not just a rod."),
      s("Light, materials, resale", "Closets rarely have windows. Lighting and finishes do the work. Buyers in this market look for organized storage that feels like part of the suite."),
    ],
    related: [
      { href: "/home-addition-contractor/", label: "Additions" },
      { href: "/custom-cabinetry-shelving/", label: "Custom cabinetry" },
    ],
  }),
  post({
    href: "/historic-homes/",
    title: "Historic Homes",
    date: "April 24, 2026",
    excerpt: "Senoia and older Fayetteville houses need a contractor who will not fight the house.",
    lede: "Heritage architecture and a 2026 kitchen can live together. The house wins the argument about structure.",
    tags: ["how-to", "additions"],
    sections: [
      s("Respect the bones", "Older houses in Senoia, Fayetteville, and parts of Newnan were not framed like a 1990s spec. Open a wall and you will find surprises. We plan for that."),
      s("What we take", "Kitchens, baths, additions that match the exterior, and repairs that keep the character. Permits and historic-district rules if they apply."),
    ],
    related: [
      { href: "/senoia-ga/", label: "Senoia" },
      { href: "/fayetteville-ga/", label: "Fayetteville" },
      { href: "/full-home-remodels/", label: "Full-home remodels" },
    ],
  }),
  post({
    href: "/new-construction/",
    title: "New Construction",
    date: "April 18, 2026",
    excerpt: "Most of our work is improving houses that already exist. We still build when the lot and the use are a fit.",
    lede: "New construction here is usually a garage, a small commercial building, or a house that belongs on a lot we already know.",
    tags: ["commercial", "how-to"],
    sections: [
      s("What “new” means for this shop", "We are not a production builder putting up a subdivision. We take a new building when it is in Fayette or Coweta and the scope is honest — detached garages, commercial boxes, and the occasional custom house."),
      s("Start with the lot", "Setbacks, septic or sewer, and county review decide the footprint. Read the Autowerks project for a commercial example."),
    ],
    related: [
      { href: "/commercial-buildings/", label: "Commercial" },
      { href: "/detached-garages/", label: "Garages" },
    ],
  }),
  post({
    href: "/luxury-bathroom-transitions/",
    title: "Luxury Bathroom Transitions",
    date: "April 10, 2026",
    excerpt: "Curbless showers, a real drain plan, and tile that does not trip you.",
    lede: "A luxury bath is mostly waterproofing and a floor that meets the hall without a lip you hate.",
    tags: ["baths", "how-to"],
    sections: [
      s("What buyers photograph", "Frameless glass, large-format tile, a bench, and a rain head. The work you do not photograph is the pan, the slope, and the membrane. Skip those and the pretty tile fails."),
      s("Aging in place without looking like a hospital", "Curbless entries and a clear floor are easier to use and still look like a primary bath. We do this in Fayette and Coweta every month."),
    ],
    related: [
      { href: "/bathroom-remodels/", label: "Bathroom remodels" },
      { href: "/walk-in-shower-vs-tub/", label: "Walk-in vs. tub" },
    ],
  }),
  post({
    href: "/in-law-additions/",
    title: "In Law Additions",
    date: "March 28, 2026",
    excerpt: "A private suite with its own door, bath, and morning coffee — not a guest room with a hope.",
    lede: "Multi-generational living in Peachtree City only works if everyone has a boundary.",
    tags: ["additions", "how-to"],
    sections: [
      s("What the suite actually needs", "A separate entrance so people are not walking through the kitchen. A kitchenette. A bath with a walk-in shower and a door you can get a walker through. Its own thermostat. That is a small apartment attached to the house, not a bedroom."),
      s("Value later", "Match the siding and roof so it looks original. A suite today is an office or a rental later if the county allows it. We handle Fayette and Coweta permits."),
    ],
    related: [
      { href: "/home-addition-contractor/", label: "Home additions" },
      { href: "/guest-suite-additions/", label: "Guest suite additions" },
    ],
  }),
  post({
    href: "/functional-kitchen/",
    title: "Functional Kitchen",
    date: "March 22, 2026",
    excerpt: "A kitchen that works is storage, landing space, and a path — not more gadgets.",
    lede: "Pretty kitchens that fight the cook are a waste of quartz.",
    tags: ["kitchens", "how-to"],
    sections: [
      s("Function first", "Landing space next to the range and the fridge. A pantry you can stand in. A dishwasher that is not across the room from the sink. We start with how you cook, then pick doors."),
      s("Then the finishes", "Cabinets, counters, and light you can cook under. If the wall to the living room is coming out, that is a different article."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/walk-in-pantries/", label: "Walk-in pantries" },
    ],
  }),
  post({
    href: "/best-deck-materials/",
    title: "Best Deck Materials",
    date: "March 16, 2026",
    excerpt: "Wood, KDAT, or composite — pick based on maintenance, not a showroom sample in January.",
    lede: "The best board is the one you will still like after two Georgia summers.",
    tags: ["decks", "materials"],
    sections: [
      s("Wood and KDAT", "Pressure-treated is the value play. KDAT is straighter and takes stain more evenly. Both need maintenance. If you already hated the sander, say so."),
      s("Composite", "Trex and similar cost more up front and skip the yearly stain. We install the line that fits the HOA and the budget. Longer notes live on decking options."),
    ],
    related: [
      { href: "/decking-options/", label: "Decking options" },
      { href: "/decks-by-pfeifer/", label: "Decks" },
    ],
  }),
  post({
    href: "/perfect-detached-garage/",
    title: "Perfect Detached Garage",
    date: "March 10, 2026",
    excerpt: "Size the building to the lot, the door count, and whether anyone will live above it.",
    lede: "A perfect garage is the one that gets a certificate of occupancy and still matches the house.",
    tags: ["garages", "how-to"],
    sections: [
      s("Lot and occupancy", "Setbacks and HOA height rules kill a 24×36 that looked fine on a napkin. A bonus room with a bath is a small house over a garage — different permit."),
      s("The build", "Slab, framing, roof, doors, electrical, and paint as one job. We take it through C.O."),
    ],
    related: [
      { href: "/detached-garages/", label: "Detached garages" },
      { href: "/building-a-garage/", label: "Building a garage" },
    ],
  }),
  post({
    href: "/perfect-downstairs-living/",
    title: "Perfect Downstairs Living",
    date: "March 6, 2026",
    excerpt: "Moisture, egress, and a stair people will use — then the bar and the sofa.",
    lede: "A basement that nobody walks down is still a basement.",
    tags: ["basements", "how-to"],
    sections: [
      s("Start with water", "Slab moisture and drainage before LVP and a wet bar. Georgia basements that skip that sequence fail in year three."),
      s("Then the rooms", "Family room, bath, guest suite, gym. Ceiling height and a stair that does not feel like a punishment."),
    ],
    related: [
      { href: "/finished-basement/", label: "Finished basement" },
      { href: "/basement-remodels/", label: "Basement remodels" },
    ],
  }),
  post({
    href: "/the-modern-kitchen/",
    title: "The Modern Kitchen",
    date: "February 16, 2026",
    excerpt: "Clean lines, real storage, and a room that still works when the trend moves on.",
    lede: "Modern in Fayette County usually means quieter doors, better light, and less clutter — not a laboratory.",
    tags: ["kitchens", "how-to"],
    sections: [
      s("What holds up", "Flat or shaker doors, a counter you can maintain, and lighting that is not a single soffit bulb. Trends in slab doors come and go; the layout does not."),
      s("Open vs. closed", "Opening to the family room is a structure job. Keeping a pantry closed is how a modern kitchen stays looking modern. We do both."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/open-concept-kitchen/", label: "Open concept" },
    ],
  }),
  post({
    href: "/walk-in-pantries/",
    title: "Walk In Pantries",
    date: "January 24, 2026",
    excerpt: "A pantry you can walk into beats a cabinet you cannot see the back of.",
    lede: "The cheapest upgrade in a lot of kitchens is taking the food off the counters.",
    tags: ["kitchens", "how-to"],
    sections: [
      s("Steal the space honestly", "A slice of the garage, a dead corner, or a cabinet wall that was never useful. Shelves to the ceiling and a light that turns on with the door."),
      s("Built with the remodel", "Do not finish the kitchen and then invent a pantry. We plan it with the cabinets so the punch list is one list."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/smart-storage/", label: "Smart storage" },
    ],
  }),
  post({
    href: "/smart-storage/",
    title: "Smart Storage",
    date: "January 18, 2026",
    excerpt: "Built-ins, a pantry, and a mudroom beat buying more house for stuff.",
    lede: "Most houses we open are not short on square footage. They are short on a place to put things.",
    tags: ["how-to", "kitchens"],
    sections: [
      s("Where stuff actually lives", "Kitchens, mudrooms, primary closets, and the wall that wants a built-in. Custom cabinetry is worth it when the catalog box does not fit."),
      s("Do it once", "We would rather build storage into the remodel than watch you buy furniture that blocks the walkway."),
    ],
    related: [
      { href: "/custom-cabinetry-shelving/", label: "Custom cabinetry" },
      { href: "/the-modern-mudroom/", label: "Mudroom" },
    ],
  }),
  post({
    href: "/laundry-room-design/",
    title: "Laundry Room Design",
    date: "January 4, 2026",
    excerpt: "A laundry room is plumbing, a floor drain if you can get one, and a door that closes.",
    lede: "Hiding the machines in a hall closet was a 1990s idea. It still floods.",
    tags: ["how-to", "additions"],
    sections: [
      s("Make it a room", "Space for machines, a folding counter, a hanging rod, and ventilation. If it sits on a second floor, the pan and the shutoff matter more than the backsplash."),
      s("Location", "Near bedrooms saves stairs. Near the mudroom saves the rest of the house from wet dogs. Moving laundry is a plumbing job, not a weekend."),
    ],
    related: [
      { href: "/the-modern-mudroom/", label: "Mudroom" },
      { href: "/home-addition-contractor/", label: "Additions" },
    ],
  }),
  post({
    href: "/adding-a-pergola/",
    title: "Adding a Pergola",
    date: "December 28, 2025",
    excerpt: "Shade with an open roof — or a structure that is really a pavilion in disguise.",
    lede: "A pergola is posts and rafters. If you want to stay dry, you want a roof.",
    tags: ["outdoor-living", "porches"],
    sections: [
      s("Be honest about weather", "Open pergolas look good in photos and drip on the table in a Georgia storm. We build them when shade is the point. If rain is the point, read outdoor pavilions and covered porches."),
      s("Attached vs. freestanding", "Tied to the house, the ledger and flashing have to be right. Freestanding needs footings that will not walk. HOA review in Peachtree City applies either way."),
    ],
    related: [
      { href: "/outdoor-pavilions/", label: "Outdoor pavilions" },
      { href: "/covered-porches-by-pfeifer/", label: "Covered porches" },
    ],
  }),
  post({
    href: "/building-an-outdoor-kitchen/",
    title: "Building an Outdoor Kitchen",
    date: "December 22, 2025",
    excerpt: "Gas, power, a counter that survives weather, and usually a roof.",
    lede: "A grill on the patio is not a kitchen. The structure and the utilities are.",
    tags: ["outdoor-living", "kitchens"],
    sections: [
      s("The stack", "Cover or pavilion first, then gas, electrical, water if you want a sink, then masonry or stainless that will live outside. Materials that work indoors fail in Fayette County sun."),
      s("Built with the yard", "Most of these sit on a porch or next to a pool. HOA drawings before the island is set."),
    ],
    related: [
      { href: "/outdoor-kitchen/", label: "Outdoor kitchen" },
      { href: "/covered-porches-by-pfeifer/", label: "Covered porches" },
    ],
  }),
  post({
    href: "/lighting-design/",
    title: "Lighting Design",
    date: "December 16, 2025",
    excerpt: "Kitchens and baths fail in the dark even when the cabinets are right.",
    lede: "One soffit can light is how a remodel still feels like 1996.",
    tags: ["how-to", "kitchens"],
    sections: [
      s("Layers", "Ambient, task, and a little accent. Recessed where the ceiling can take it, pendants where you need them, and under-cabinet so you can see the knife. Dimmers are not a luxury in a kitchen."),
      s("Plan it with the electrician", "Moving lights after drywall is a tax. We rough lighting with the rest of the job."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/bathroom-remodels/", label: "Baths" },
    ],
  }),
  post({
    href: "/home-bar/",
    title: "Home Bar",
    date: "December 12, 2025",
    excerpt: "A bar that works has water, power, and a floor you can clean.",
    lede: "Basement bars are one of the most used rooms we finish — when they are not an afterthought.",
    tags: ["basements", "how-to"],
    sections: [
      s("Plumbing and the license", "A sink means plumbing. A dishwasher means more plumbing. We would rather rough it correctly than have a wet bar that cannot take water."),
      s("The room around it", "Seating, a TV outlet, and HVAC that can run when the rest of the house is quiet."),
    ],
    related: [
      { href: "/finished-basement/", label: "Finished basement" },
      { href: "/basement-remodels/", label: "Basement remodels" },
    ],
  }),
  post({
    href: "/master-bedroom/",
    title: "Master Bedroom",
    date: "December 8, 2025",
    excerpt: "A primary suite is a bedroom, a bath, and a closet that belong together.",
    lede: "Adding a primary suite is often why people stay instead of selling.",
    tags: ["additions", "how-to"],
    sections: [
      s("The suite, not just the bed", "Room for a real bed, a bath you do not share with guests, and a closet you can walk in. Second-story and rear additions are the usual paths in this market."),
      s("Quiet and light", "Windows that make sense, HVAC that can run separately, and a door that shuts."),
    ],
    related: [
      { href: "/home-addition-contractor/", label: "Additions" },
      { href: "/second-story-addition/", label: "Second story" },
      { href: "/master-closet/", label: "Master closet" },
    ],
  }),
  post({
    href: "/energy-efficient/",
    title: "Energy Efficient",
    date: "December 2, 2025",
    excerpt: "Insulation, glass, and HVAC sized for the house you have — not a sticker on a window.",
    lede: "Georgia summers punish a 1990s envelope. The cheap fix is usually not a gadget.",
    tags: ["how-to", "materials"],
    sections: [
      s("Where the money goes", "Attic insulation, air sealing, and windows that are not fogged. A sunroom or addition that is not insulated is a tax on the rest of the house."),
      s("We build it into the job", "New rooms get a real envelope. Old rooms get what the scope allows. We are not an energy-audit franchise. We are the GC that will not leave you a pretty leak."),
    ],
    related: [
      { href: "/home-addition-contractor/", label: "Additions" },
      { href: "/sunroom/", label: "Sunrooms" },
    ],
  }),
  post({
    href: "/home-addition/",
    title: "Home Addition",
    date: "November 28, 2025",
    excerpt: "More house on the lot you already own — if the setbacks and the foundation agree.",
    lede: "An addition is a small new house tied into an old one. Sequence matters.",
    tags: ["additions", "how-to"],
    sections: [
      s("What we add", "Rooms, suites, sunrooms, second stories, and the porch that becomes a room. Match the roof and siding or it will always look like a hat."),
      s("Start on site", "We walk the lot before we love a footprint. Permits in Fayette and Coweta are part of the job. The service page is the overview; this is the short version."),
    ],
    related: [
      { href: "/home-addition-contractor/", label: "Home additions" },
      { href: "/home-addition-vs-buying/", label: "Addition vs. buying" },
    ],
  }),
  post({
    href: "/building-a-detached-garage/",
    title: "Building a Detached Garage",
    date: "November 22, 2025",
    excerpt: "Detached keeps noise and fumes off the house. The lot has to allow it.",
    lede: "Attached is often cheaper. Detached is often the better shop.",
    tags: ["garages", "how-to"],
    sections: [
      s("Why detach", "Lifts, paint, and a bonus room you might use later. Fire separation and a walk through the rain are the trade. Setbacks decide if it is legal."),
      s("Through C.O.", "We take foundation through certificate of occupancy. Related: detached garages and building a garage."),
    ],
    related: [
      { href: "/detached-garages/", label: "Detached garages" },
      { href: "/building-a-garage/", label: "Building a garage" },
    ],
  }),
  post({
    href: "/the-right-flooring/",
    title: "The Right Flooring",
    date: "November 18, 2025",
    excerpt: "Pick the floor for water, dogs, and the room — not the sample under showroom lights.",
    lede: "Kitchens, baths, and mudrooms destroy the wrong product.",
    tags: ["materials", "how-to"],
    sections: [
      s("Wet rooms", "Tile and good LVP. Hardwood in a mudroom is a future invoice. Site-finished wood in a kitchen can work if you accept the maintenance."),
      s("Open plans", "When a wall comes out, the floors rarely match. Budget the whole field, not a reducer strip that looks like a scar."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/opening-up-your-living-space/", label: "Opening up living space" },
    ],
  }),
  post({
    href: "/open-floor-plan/",
    title: "Open Floor Plan",
    date: "November 14, 2025",
    excerpt: "Taking a wall out is engineering, flooring, and a ceiling line — not a sledgehammer.",
    lede: "1980s houses closed the cook off. Opening them is one of the jobs we take most.",
    tags: ["kitchens", "additions"],
    sections: [
      s("Is the wall bearing?", "Usually yes, between the kitchen and the living room. Beam, posts, permit. Utilities in that wall are not optional to ignore."),
      s("The rest of the room", "Flooring, ceiling, lights, HVAC. Read opening up your living space and open-concept kitchen for the longer versions."),
    ],
    related: [
      { href: "/open-concept-kitchen/", label: "Open concept kitchen" },
      { href: "/opening-up-your-living-space/", label: "Opening up living space" },
    ],
  }),
  post({
    href: "/exterior-siding/",
    title: "Exterior Siding",
    date: "November 10, 2025",
    excerpt: "Match the house, flash it correctly, and do not paint over rot.",
    lede: "Siding jobs fail at the corners and the windows, not in the middle of the field.",
    tags: ["materials", "how-to"],
    sections: [
      s("What we actually do", "Hardie and similar products, trim, and the flashing that keeps water out. If the wrap is gone, the siding is not the whole job."),
      s("Additions have to match", "A new wing with different siding looks like a different house. We would rather source to match than close enough."),
    ],
    related: [
      { href: "/full-home-remodels/", label: "Full-home remodels" },
      { href: "/home-addition-contractor/", label: "Additions" },
    ],
  }),
  post({
    href: "/durable-materials/",
    title: "Durable Materials",
    date: "November 6, 2025",
    excerpt: "Georgia sun, clay, and humidity — pick products that have already lived here.",
    lede: "A sample in a catalog has not been through August in Fayette County.",
    tags: ["materials", "how-to"],
    sections: [
      s("Outside", "KDAT, composite decking, Hardie, and flashings that belong in the South. Cheap paint on untreated wood is a two-year look."),
      s("Inside wet rooms", "Tile, quartz, and membranes. We use products we already install, not a one-off because a video said so."),
    ],
    related: [
      { href: "/decking-options/", label: "Decking options" },
      { href: "/category/suppliers/", label: "Suppliers" },
    ],
  }),
  post({
    href: "/deck-or-patio/",
    title: "Deck or Patio",
    date: "November 2, 2025",
    excerpt: "Wood or composite in the air, or concrete on the ground. They are different jobs.",
    lede: "A patio is not a cheap deck. A deck is not a patio with boards.",
    tags: ["decks", "outdoor-living"],
    sections: [
      s("When a deck is right", "The door is above grade, you want to walk out level, or the yard drops. Structure, footings, and a rail that passes inspection."),
      s("When a patio is right", "You are already on grade and you want masonry or an outdoor kitchen pad. We build decks every week. A patio is a different conversation. Say which one you want."),
    ],
    related: [
      { href: "/decks-by-pfeifer/", label: "Decks" },
      { href: "/outdoor-kitchen/", label: "Outdoor kitchen" },
    ],
  }),
  post({
    href: "/basement-finishing-ideas/",
    title: "Basement Finishing Ideas",
    date: "October 28, 2025",
    excerpt: "Family room, bath, gym, guest suite — after moisture and egress are honest.",
    lede: "Ideas are easy. A dry, legal basement is the work.",
    tags: ["basements", "how-to"],
    sections: [
      s("Rooms that belong downstairs", "Media, gym, bar, guest suite with a bath. Offices work if the stair is not a hike."),
      s("Sequence", "Water, then air, then pretty. Permits and egress are not optional."),
    ],
    related: [
      { href: "/finished-basement/", label: "Finished basement" },
      { href: "/basement-remodels/", label: "Basement remodels" },
    ],
  }),
  post({
    href: "/guest-suite-additions/",
    title: "Guest Suite Additions",
    date: "October 24, 2025",
    excerpt: "A bedroom, a bath, and a door — built so guests are not in your kitchen at 6 a.m.",
    lede: "A guest suite is a small in-law suite without pretending someone lives there forever.",
    tags: ["additions", "how-to"],
    sections: [
      s("The minimum that works", "A real bath, a closet, and a way in that does not cross the primary suite. Over a garage and off the back of the house are common in this market."),
      s("Flexible later", "Office, rental if legal, or the room you move into when the stairs get old. Match the house."),
    ],
    related: [
      { href: "/in-law-additions/", label: "In-law additions" },
      { href: "/home-addition-contractor/", label: "Additions" },
    ],
  }),
  post({
    href: "/choosing-paint-colors/",
    title: "Choosing Paint Colors",
    date: "October 20, 2025",
    excerpt: "Sample on the wall, in the room’s light — not on a phone at the store.",
    lede: "We will paint it. We would rather paint it once.",
    tags: ["how-to", "materials"],
    sections: [
      s("Light lies", "Peachtree City living rooms with golf-course west windows are not the same as a north bedroom. Sample large, look at night, look at noon."),
      s("The rest of the job", "Trim, ceilings, and whether the kitchen cabinets are staying. We will tell you if a color will fight the quartz you already bought."),
    ],
    related: [
      { href: "/full-home-remodels/", label: "Full-home remodels" },
      { href: "/kitchens/", label: "Kitchens" },
    ],
  }),
  post({
    href: "/kitchen-islands/",
    title: "Kitchen Islands",
    date: "October 16, 2025",
    excerpt: "An island needs clearance, power, and a reason — not just a slab in the middle.",
    lede: "Too many kitchens get an island because the last house had one.",
    tags: ["kitchens", "how-to"],
    sections: [
      s("Clearance", "If you cannot open the dishwasher and walk past, you do not have room. Seating overhang is extra depth, not a wish."),
      s("What goes in it", "Sink, range, or just storage. Each has venting and plumbing implications. We will tell you if the room wants a peninsula instead."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/functional-kitchen/", label: "Functional kitchen" },
    ],
  }),
  post({
    href: "/outdoor-living/",
    title: "Outdoor Living",
    date: "October 12, 2025",
    excerpt: "Porch, deck, pavilion, kitchen — pick the room, then the materials.",
    lede: "Outdoor living in Fayette County is how you use the yard after 6 p.m. without donating blood to gnats.",
    tags: ["outdoor-living", "porches"],
    sections: [
      s("The menu", "Screened porch, covered porch, pavilion, deck, outdoor kitchen. They stack. They are not one product."),
      s("HOA and the house", "Drawings for review. Roof and trim that match. We have built this in Kedron Hills, Planterra, and across PTC and Coweta."),
    ],
    related: [
      { href: "/covered-porches-by-pfeifer/", label: "Covered porches" },
      { href: "/decks-by-pfeifer/", label: "Decks" },
      { href: "/peachtree-city-homeowners-guide/", label: "PTC guide" },
    ],
  }),
  post({
    href: "/attached-vs-detached/",
    title: "Attached vs. Detached",
    date: "October 8, 2025",
    excerpt: "Same building type, different fire, noise, and setback conversation.",
    lede: "Most garage calls start with this fork. The lot usually answers it.",
    tags: ["garages", "how-to"],
    sections: [
      s("Attached", "Cheaper to heat, a dry walk to the kitchen, and a hole in a wall you already own. Fire separation and a door that is not an afterthought."),
      s("Detached", "Better for shops, lifts, and bonus rooms. Setbacks and a longer walk."),
    ],
    related: [
      { href: "/building-a-garage/", label: "Building a garage" },
      { href: "/detached-garages/", label: "Detached garages" },
    ],
  }),
  post({
    href: "/transparent-pricing/",
    title: "Transparent Pricing",
    date: "October 4, 2025",
    excerpt: "Cost-plus means you see the costs. Allowances are where surprise lives.",
    lede: "We use a cost-plus model so the numbers stay visible after the contract is signed.",
    tags: ["how-to"],
    sections: [
      s("What cost-plus is", "Labor, materials, and a fee you can see. Warranty stays with the work. No bait-and-switch allowances designed to win a bid and lose a friendship."),
      s("What it is not", "It is not a blank check. Scope is still a scope. If you want a number you can compare, we will walk the house and write it."),
    ],
    related: [
      { href: "/get-started/", label: "Get started" },
      { href: "/about/", label: "About" },
    ],
  }),
  post({
    href: "/why-hire-local/",
    title: "Why Hire Local?",
    date: "October 1, 2025",
    excerpt: "We live in the same counties. That is not a slogan. It is the warranty.",
    lede: "Hiring local is codes, clay, and the fact that we still shop at the same stores.",
    tags: ["how-to", "peachtree-city"],
    sections: [
      s("We already know the work", "Fayette and Coweta codes, soil, and August humidity. Fewer delays because we are not learning the county on your job."),
      s("Accountability", "We are not a crew that leaves town. $3 million in liability. Relationships that last past the punch list."),
    ],
    related: [
      { href: "/about/", label: "About" },
      { href: "/service-area/", label: "Service area" },
    ],
  }),
  post({
    href: "/commercial-projects/",
    title: "Commercial Projects",
    date: "September 30, 2025",
    excerpt: "Tenant buildouts and small commercial buildings in two counties — licensed for it.",
    lede: "Most people know the residential shop. Commercial is a different permit path.",
    tags: ["commercial", "how-to"],
    sections: [
      s("What we take", "Buildouts, modifications, and new boxes that fit Fayette and Coweta. Fire, ADA, and a landlord’s date. Ask for Brian."),
      s("Examples", "JB Autowerks in Tyrone is a current one. Read that page and the commercial service page. We will say if we are not a fit."),
    ],
    related: [
      { href: "/commercial-projects-by-pfeifer/", label: "Commercial projects by Pfeifer" },
      { href: "/jb-autowerks-in-tyrone/", label: "JB Autowerks" },
      { href: "/commercial-buildings/", label: "Commercial" },
    ],
  }),
  post({
    href: "/residential-remodeling/",
    title: "Residential Remodeling",
    date: "September 28, 2025",
    excerpt: "Kitchens, baths, additions, and the rest of the house — one GC.",
    lede: "Residential remodeling is most of the calendar. Commercial is the rest.",
    tags: ["how-to", "kitchens"],
    sections: [
      s("The work", "Decks, porches, kitchens, baths, garages, additions, basements, full-home. Cost-plus. Permits. A punch list that actually closes."),
      s("Where", "Fayette and Coweta only. If that is your house, start on get-started or call the office."),
    ],
    related: [
      { href: "/category/services/", label: "Services" },
      { href: "/get-started/", label: "Get started" },
    ],
  }),
  post({
    href: "/detached-garage/",
    title: "Detached Garage",
    date: "September 26, 2025",
    excerpt: "A building in the yard with its own permit and its own roof.",
    lede: "Short version of the detached-garage conversation we have every week.",
    tags: ["garages", "how-to"],
    sections: [
      s("The building", "Foundation, doors, electrical, and whether anyone lives above. Match the house. Take it through occupancy."),
      s("Longer reads", "Detached garages service page, building a garage, attached vs. detached. This slug exists because the old site used it."),
    ],
    related: [
      { href: "/detached-garages/", label: "Detached garages" },
      { href: "/attached-vs-detached/", label: "Attached vs. detached" },
    ],
  }),
  post({
    href: "/trusted-bathroom-installer/",
    title: "Trusted Bathroom Installer",
    date: "September 24, 2025",
    excerpt: "Licensed plumbing, a pan that will pass, and a crew that has done this in your zip code.",
    lede: "Trust in a bath job is waterproofing and showing up — not a slogan on a van.",
    tags: ["baths", "how-to"],
    sections: [
      s("Why people call us", "We have been in Fayette and Coweta since 1997. We pull permits. We carry $3 million in liability. The reviews are a fair picture of after the contract."),
      s("The work", "Showers, tile, vanities, and the layout. See bathroom remodels."),
    ],
    related: [
      { href: "/bathroom-remodels/", label: "Bathroom remodels" },
      { href: "/about/", label: "About" },
    ],
  }),
  post({
    href: "/kitchen-design/",
    title: "Kitchen Design",
    date: "September 22, 2025",
    excerpt: "Draw the work triangle and the storage before anyone picks a door style.",
    lede: "Design is the part that saves you from buying the wrong cabinets twice.",
    tags: ["kitchens", "how-to"],
    sections: [
      s("On paper first", "We produce drawings you can take to an HOA or just to a spouse. Layout, elevations, and a material list. Renderings when the job needs them."),
      s("Then build", "Same company. Not a designer who hands you a PDF and leaves."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/functional-kitchen/", label: "Functional kitchen" },
    ],
  }),
  post({
    href: "/starting-a-bathroom-remodel/",
    title: "Starting a Bathroom Remodel",
    date: "September 18, 2025",
    excerpt: "Measure, decide tub vs. shower, then demo. Not the other way around.",
    lede: "A bath remodel starts with how you use it and whether a tub has to live somewhere in the house.",
    tags: ["baths", "how-to"],
    sections: [
      s("Decisions before dust", "Keep the footprint or move plumbing. Walk-in or tub. Tile that can take water. A fan that actually vents out."),
      s("Then we schedule", "Permit, demo, waterproofing, finishes, punch. Call with photos. We will tell you if it is a vanity or a full gut."),
    ],
    related: [
      { href: "/bathroom-remodels/", label: "Bathroom remodels" },
      { href: "/walk-in-shower-vs-tub/", label: "Walk-in vs. tub" },
    ],
  }),
  post({
    href: "/kitchen-remodeling/",
    title: "Kitchen Remodeling",
    date: "September 12, 2025",
    excerpt: "The 2025 kitchen note — same shop, same counties, same punch list.",
    lede: "We have more than one kitchen article because people search more than one phrase. The job is the same.",
    tags: ["kitchens", "how-to"],
    sections: [
      s("What we do", "Cabinets, counters, tile, lighting, and opening a wall when the structure allows. Cost-plus. Fayette and Coweta."),
      s("Where to go next", "Kitchens service page, kitchen remodeling (2026), functional kitchen, islands. Pick the one that matches the question. Then call."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/kitchen-remodeling-2/", label: "Kitchen remodeling (2026)" },
    ],
  }),
  post({
    href: "/garage-with-room/",
    title: "Garage with Room",
    date: "September 11, 2025",
    excerpt: "Parking below, a room above — occupancy and stairs are the job.",
    lede: "A bonus room over a garage is not a loft you invent at the end.",
    tags: ["garages", "additions"],
    sections: [
      s("It is a small house", "Insulation, HVAC, a legal stair, and a bath if you want one. The garage below still needs fire separation and doors that work."),
      s("Permit path", "Different from an unfinished garage. We will say so up front."),
    ],
    related: [
      { href: "/building-a-garage/", label: "Building a garage" },
      { href: "/guest-suite-additions/", label: "Guest suites" },
    ],
  }),
  post({
    href: "/pfeifer-does-repairs/",
    title: "Pfeifer can repair your storm damage!",
    date: "April 8, 2025",
    excerpt: "Structural repairs, windows, siding, roof, and deck work — not only the pretty remodels.",
    lede: "People know the kitchens and porches. We also repair what the weather takes apart.",
    tags: ["how-to"],
    sections: [
      s("What we added", "Structural repairs, windows, siding, roof replacement, and deck refinishing — on top of kitchens, baths, porches, and additions. Almost 30 years in these two counties."),
      s("Call", "Next time you need a fast, professional repair, call 770-487-1380. We can handle most of what a house or a small office throws at you."),
    ],
    related: [
      { href: "/decks-by-pfeifer/", label: "Decks" },
      { href: "/contact/", label: "Contact" },
    ],
  }),
  post({
    href: "/basement-finishing-in-peachtree-city/",
    title: "Basement Finishing in Peachtree City",
    date: "March 15, 2025",
    excerpt: "PTC basements are unused square footage if they stay damp and unfinished.",
    lede: "Peachtree City houses often already have the room. They do not have the moisture plan.",
    tags: ["basements", "peachtree-city"],
    sections: [
      s("Local specifics", "HOA if the exterior changes. Egress. A stair people will use. We have finished lower levels across PTC — family rooms, bars, and guest suites."),
      s("Start here", "Finished basement article and the basement remodels page. Then call the Tyrone office with photos of what you have."),
    ],
    related: [
      { href: "/finished-basement/", label: "Finished basement" },
      { href: "/peachtree-city-ga/", label: "Peachtree City" },
    ],
  }),
  post({
    href: "/sunroom/",
    title: "Sunroom",
    date: "January 9, 2026",
    excerpt: "Three-season or four-season — say which one you want before we price glass.",
    lede: "A sunroom is a real room with a lot of glass. It is not a screened porch with better marketing.",
    tags: ["additions", "porches"],
    sections: [
      s("The short version", "Three-season rooms work spring through fall. Four-season rooms get insulation and HVAC. Foundation, roof, and orientation decide comfort. The sunroom page is the full service write-up."),
    ],
    related: [
      { href: "/modern-sunroom-addition/", label: "Modern sunroom addition" },
      { href: "/home-addition-contractor/", label: "Additions" },
    ],
  }),
  post({
    href: "/outdoor-kitchen/",
    title: "Outdoor Kitchen",
    date: "April 3, 2026",
    excerpt: "A culinary space in the yard — counters, utilities, and usually a roof.",
    lede: "Peachtree City backyards have moved past a grill on a pad. The kitchen has to live outside.",
    tags: ["outdoor-living", "kitchens"],
    sections: [
      s("What belongs in one", "Weather-rated equipment, a counter you can prep on, gas and power, and shade. We build these with porches and pavilions, not as a separate franchise."),
    ],
    related: [
      { href: "/building-an-outdoor-kitchen/", label: "Building an outdoor kitchen" },
      { href: "/covered-porches-by-pfeifer/", label: "Covered porches" },
    ],
  }),
  post({
    href: "/full-home-remodels/",
    title: "Full Home Remodels",
    date: "February 8, 2026",
    excerpt: "The whole house, in sequence, with one punch list.",
    lede: "A full-home remodel is several jobs that have to land as one house.",
    tags: ["how-to", "kitchens"],
    sections: [
      s("How we take it", "Kitchens, baths, floors, and the rooms that connect them — planned so you are not living in a jobsite forever. The service page is the main write-up."),
    ],
    related: [
      { href: "/kitchens/", label: "Kitchens" },
      { href: "/bathroom-remodels/", label: "Baths" },
    ],
  }),
  post({
    href: "/before-and-after/",
    title: "Before and After Photos",
    date: "October 22, 2025",
    excerpt: "Porches, decks, and garages — finished work in Fayette County.",
    lede: "Photos of jobs we actually closed. The gallery page has the pictures.",
    tags: ["how-to", "peachtree-city"],
    sections: [
      s("See the gallery", "Screened porches in Fayetteville, Trex decks and covered porches in Peachtree City, attached garages, and more. This post exists so the old blog URL still lists."),
    ],
    related: [
      { href: "/portfolio/", label: "Project gallery" },
      { href: "/covered-porches-by-pfeifer/", label: "Covered porches" },
    ],
  }),
];

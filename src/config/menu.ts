/**
 * THE MENU, AS DATA.
 * Edit names, descriptions, prices and reactions here. Nothing in /components needs touching.
 * Prices are plain numbers in naira; they only show on screen when `site.menu.showPrices` is true.
 */

export type CategoryId = 'starters' | 'mains' | 'desserts' | 'drinks';

/** Which little drawing a dish gets (see components/ui/DishIcons.tsx). */
export type DishIconName =
  | 'plantain' | 'springroll' | 'scotchegg' | 'meatpie' | 'prawn' | 'tacos'
  | 'burger' | 'waffle' | 'salmon' | 'espetada' | 'lamb' | 'steak'
  | 'noodles' | 'seafoodpasta' | 'rice' | 'friedrice' | 'salad'
  | 'brownie' | 'crepe' | 'cheesecake' | 'redvelvet'
  | 'coupe' | 'highball' | 'mocktail' | 'milkshake'
  | 'espresso' | 'latte' | 'tea' | 'water' | 'sparkling'
  | 'surprise' | 'decide';

export type Dish = {
  id: string;
  name: string;
  description?: string;
  /** Naira. */
  price: number;
  category: CategoryId;
  subcategory?: string;
  icon: DishIconName;
  /** The mascot's cheeky line when she picks this. Falls back to the subcategory / category default. */
  reaction?: string;
};

export type Category = {
  id: CategoryId;
  label: string;
  /** Short hint under the tab row, e.g. "Pick up to 2". */
  hint: string;
  /** Most items she can pick here. */
  limit: number;
  /** Used when a dish has no reaction of its own. */
  reaction: string;
  /** Overrides by subcategory name. */
  subReactions?: Record<string, string>;
};

export const categories: readonly Category[] = [
  { id: 'starters', label: 'Starters', hint: 'Pick up to 2', limit: 2, reaction: 'Good start. I like where this is going 😌' },
  {
    id: 'mains', label: 'Mains', hint: 'Pick 1', limit: 1, reaction: 'Strong choice. I approve ✅',
    subReactions: { Burgers: 'A burger girl. I knew it 🍔', Salads: 'Fresh and disciplined. I see you 🥗', Rice: 'Rice is always the right answer 🍚' },
  },
  { id: 'desserts', label: 'Desserts', hint: 'Pick 1', limit: 1, reaction: 'Always save room 🍰' },
  {
    id: 'drinks', label: 'Drinks', hint: 'Pick 1 or 2', limit: 2, reaction: 'Cheers in advance 🥂',
    subReactions: {
      Mocktails: 'Sober and sparkling. Love that 💫',
      Milkshakes: 'She came for the shakes 🥤',
      'Coffee & Tea': 'Caffeine and charm. Dangerous combo ☕',
      Water: 'Hydration queen 💧',
    },
  },
];

/** Notes shown under a subcategory heading. */
export const subcategoryNotes: Record<string, string> = {
  'From the Grill': 'Served with salad and potato wedges or mashed potatoes',
};

/** The two always-available choices in every category. */
export const specials = {
  surprise: { id: 'surprise', name: 'Surprise me 👀', description: 'Chika picks something you’ll love', icon: 'surprise' as DishIconName, reaction: 'Ooh, mysterious. I’ll pick something you’ll love 👀' },
  decide: { id: 'decide', name: 'I’ll decide there', description: 'Let’s see what we feel like', icon: 'decide' as DishIconName, reaction: 'Playing it cool. We’ll decide there 😌' },
} as const;

export const menu: readonly Dish[] = [
  /* ---------- STARTERS ---------- */
  { id: 'plantain-sticks', name: 'Plantain Sticks', price: 7000, category: 'starters', icon: 'plantain', reaction: 'Lagos girl approved ✅' },
  { id: 'suya-spring-roll', name: 'Suya Chicken Spring Roll', description: '2 pieces', price: 6000, category: 'starters', icon: 'springroll', reaction: 'Suya in a spring roll? Genius.' },
  { id: 'scotch-egg', name: 'Scotch Egg', price: 5000, category: 'starters', icon: 'scotchegg', reaction: 'An egg in a coat. Iconic.' },
  { id: 'mini-meat-pie', name: 'Mini Meat Pie', price: 4000, category: 'starters', icon: 'meatpie', reaction: 'The classic. Never wrong.' },
  { id: 'prawn-tempura', name: 'Prawn Tempura', description: '2 pieces', price: 11500, category: 'starters', icon: 'prawn', reaction: 'Crispy and elegant. Noted 🍤' },
  { id: 'pulled-duck-tacos', name: 'Pulled Duck Tacos', description: '2 pieces. Hoisin duck, pickled red cabbage, coriander, pineapple sweetcorn salsa', price: 12500, category: 'starters', icon: 'tacos', reaction: 'Duck tacos?! She’s adventurous 🦆' },

  /* ---------- MAINS ---------- */
  { id: 'mila-chicken-burger', name: 'Mila’s Chicken Burger', description: 'Crispy chicken, cheese, coleslaw, cucumber, fries', price: 18000, category: 'mains', subcategory: 'Burgers', icon: 'burger' },
  { id: 'beef-burger', name: 'Beef Burger', description: 'Juicy minced beef, cheese, coleslaw, tomatoes, fries', price: 18000, category: 'mains', subcategory: 'Burgers', icon: 'burger' },

  { id: 'golden-crunch', name: 'Mila Golden Crunch', description: 'Crispy fried chicken wings, golden toasted waffles, sweet syrup', price: 18000, category: 'mains', subcategory: 'From the Grill', icon: 'waffle', reaction: 'Chicken AND waffles? You’re dangerous 😏' },
  { id: 'grilled-salmon', name: 'Grilled Salmon', price: 35000, category: 'mains', subcategory: 'From the Grill', icon: 'salmon', reaction: 'Healthy and fancy. I see you 🐟' },
  { id: 'ram-espetada', name: 'Ram Meat Espetada', description: 'Herb rice or mashed potatoes', price: 26000, category: 'mains', subcategory: 'From the Grill', icon: 'espetada', reaction: 'Meat on a stick, but make it classy.' },
  { id: 'lamb-chops', name: 'Lamb Chops', price: 40000, category: 'mains', subcategory: 'From the Grill', icon: 'lamb', reaction: 'Okay, big spender 👑' },
  { id: 'steak', name: 'Steak', price: 45000, category: 'mains', subcategory: 'From the Grill', icon: 'steak', reaction: 'Ooh, fancy 😏' },

  { id: 'chow-mein', name: 'Chow Mein', description: 'Linguine, seasonal vegetables, soy-ginger sauce', price: 16500, category: 'mains', subcategory: 'Pasta & Noodles', icon: 'noodles', reaction: 'Noodle queen. Twirl away 🍜' },
  { id: 'seafood-stir-fry', name: 'Seafood Stir Fry', description: 'Linguine, tiger prawns, calamari, cherry tomatoes, chilli oil', price: 19000, category: 'mains', subcategory: 'Pasta & Noodles', icon: 'seafoodpasta', reaction: 'A little spicy. Of course 🌶️' },
  { id: 'seafood-creamy', name: 'Seafood Creamy', description: 'Linguine, tiger prawns, calamari, heavy cream, parmesan', price: 22000, category: 'mains', subcategory: 'Pasta & Noodles', icon: 'seafoodpasta', reaction: 'Creamy and extra. Just like you 😌' },

  { id: 'coconut-rice', name: 'Coconut Rice', description: 'Raisins, seasoned chicken', price: 18000, category: 'mains', subcategory: 'Rice', icon: 'rice' },
  { id: 'dirty-rice', name: 'Dirty Rice', description: 'Basmati, minced beef, minced chicken, tiger prawns', price: 18000, category: 'mains', subcategory: 'Rice', icon: 'rice', reaction: 'Dirty rice, clean choice 😌' },
  { id: 'wok-fried-rice', name: 'Wok-Fried Rice Bowl', description: 'Shredded beef, beef sauce, soy-ginger, fried egg, sesame', price: 18500, category: 'mains', subcategory: 'Rice', icon: 'friedrice' },

  { id: 'chicken-caesar', name: 'Chicken Caesar', description: 'Grilled chicken, romaine, parmesan, garlic croutons, Caesar dressing', price: 16500, category: 'mains', subcategory: 'Salads', icon: 'salad' },
  { id: 'prawn-avocado', name: 'Prawn & Avocado', description: 'Seared tiger prawns, avocado, mixed greens, vinaigrette', price: 18500, category: 'mains', subcategory: 'Salads', icon: 'salad', reaction: 'Fresh and glowing. I see you 🥑' },

  /* ---------- DESSERTS ---------- */
  { id: 'brownie-obsession', name: 'Brownie Obsession', description: 'Chocolate brownie, vanilla ice cream, chocolate sauce, whipped cream', price: 8500, category: 'desserts', icon: 'brownie', reaction: 'A woman of taste 🍫' },
  { id: 'strawberry-crepe', name: 'Strawberry Cream Crêpe', description: 'Whipped cream, strawberry, strawberry sauce, powdered sugar, chocolate drizzle', price: 12500, category: 'desserts', icon: 'crepe', reaction: 'Sweet AND pretty. Very you 🍓' },
  { id: 'strawberry-cheesecake', name: 'Strawberry Cheesecake', price: 12500, category: 'desserts', icon: 'cheesecake', reaction: 'Pink and decadent. Perfect.' },
  { id: 'red-velvet', name: 'Red Velvet', price: 12500, category: 'desserts', icon: 'redvelvet', reaction: 'Red velvet, of course ❤️' },

  /* ---------- DRINKS ---------- */
  { id: 'sun-room', name: 'The Sun Room', description: 'Vodka, elderflower, orange, pineapple, lemon', price: 14500, category: 'drinks', subcategory: 'Cocktails', icon: 'highball' },
  { id: 'eko-gold', name: 'Eko Gold', description: 'Cognac, orange, passionfruit, honey, orange liqueur', price: 14500, category: 'drinks', subcategory: 'Cocktails', icon: 'coupe', reaction: 'Eko Gold. Fancy and local 👑' },
  { id: 'the-terrace', name: 'The Terrace', description: 'Gin, strawberry, peach, lemonade', price: 13000, category: 'drinks', subcategory: 'Cocktails', icon: 'highball' },
  { id: 'silk-road', name: 'Silk Road', description: 'Whisky, lychee, ginger, lime', price: 13500, category: 'drinks', subcategory: 'Cocktails', icon: 'coupe' },
  { id: 'the-botanist', name: 'The Botanist', description: 'Gin, elderflower, cucumber, soda', price: 13000, category: 'drinks', subcategory: 'Cocktails', icon: 'highball' },
  { id: 'akoka-mule', name: 'Akoka Mule', description: 'Vodka, ginger, beer, hibiscus', price: 13000, category: 'drinks', subcategory: 'Cocktails', icon: 'highball', reaction: 'Local legend in a glass 🫶' },
  { id: 'the-penthouse', name: 'The Penthouse', description: 'Cognac, orange liqueur, cranberry, strawberry, lemon', price: 15000, category: 'drinks', subcategory: 'Cocktails', icon: 'coupe', reaction: 'The Penthouse? Aiming high 👑' },
  { id: 'ivory-gold', name: 'Ivory & Gold', description: 'Vodka, vanilla, coffee liqueur, Irish cream', price: 14500, category: 'drinks', subcategory: 'Cocktails', icon: 'coupe', reaction: 'Dessert in a glass. Noted.' },
  { id: 'mila-sunset', name: 'Mila Sunset', description: 'Campari, coconut rum, pineapple, strawberry, Prosecco', price: 14500, category: 'drinks', subcategory: 'Cocktails', icon: 'coupe' },
  { id: 'lagos-in-bloom', name: 'Lagos in Bloom', description: 'Gin, hibiscus tea, lemon, egg white, bitters', price: 14000, category: 'drinks', subcategory: 'Cocktails', icon: 'coupe', reaction: 'Pretty and a little dangerous 🌺' },
  { id: 'sun-kiss', name: 'Sun Kiss', description: 'Coconut rum, mango, pineapple', price: 13000, category: 'drinks', subcategory: 'Cocktails', icon: 'highball' },

  { id: 'coconut-cloud', name: 'Coconut Cloud', price: 12500, category: 'drinks', subcategory: 'Mocktails', icon: 'mocktail' },
  { id: 'hibiscus-ginger', name: 'Hibiscus & Ginger', price: 11000, category: 'drinks', subcategory: 'Mocktails', icon: 'mocktail' },
  { id: 'lychee-iced-tea', name: 'Lychee Iced Tea', price: 11500, category: 'drinks', subcategory: 'Mocktails', icon: 'mocktail' },
  { id: 'cucumber-mint-cooler', name: 'Cucumber Mint Cooler', price: 12000, category: 'drinks', subcategory: 'Mocktails', icon: 'mocktail' },

  { id: 'pink-obsession', name: 'Pink Obsession', price: 15000, category: 'drinks', subcategory: 'Milkshakes', icon: 'milkshake', reaction: 'Pink, obviously 💗' },
  { id: 'oreo-overload', name: 'Oreo Overload', price: 15000, category: 'drinks', subcategory: 'Milkshakes', icon: 'milkshake' },
  { id: 'brownie-blast', name: 'Chocolate Brownie Blast', price: 17000, category: 'drinks', subcategory: 'Milkshakes', icon: 'milkshake' },
  { id: 'milk-cookies', name: 'Milk & Cookies', price: 15000, category: 'drinks', subcategory: 'Milkshakes', icon: 'milkshake' },

  { id: 'espresso', name: 'Espresso', price: 4500, category: 'drinks', subcategory: 'Coffee & Tea', icon: 'espresso' },
  { id: 'americano', name: 'Americano', price: 5500, category: 'drinks', subcategory: 'Coffee & Tea', icon: 'espresso' },
  { id: 'latte-cappuccino', name: 'Latte / Cappuccino', price: 6500, category: 'drinks', subcategory: 'Coffee & Tea', icon: 'latte' },
  { id: 'hot-chocolate', name: 'Hot Chocolate', price: 7500, category: 'drinks', subcategory: 'Coffee & Tea', icon: 'latte' },
  { id: 'dirty-chai', name: 'Dirty Chai Latte', price: 8500, category: 'drinks', subcategory: 'Coffee & Tea', icon: 'latte' },
  { id: 'tea', name: 'Tea', description: 'Earl Grey, Chamomile, Green or English Breakfast', price: 5500, category: 'drinks', subcategory: 'Coffee & Tea', icon: 'tea' },

  { id: 'still-water', name: 'Still Water', price: 1000, category: 'drinks', subcategory: 'Water', icon: 'water' },
  { id: 'sparkling-water', name: 'Sparkling Water', price: 5000, category: 'drinks', subcategory: 'Water', icon: 'sparkling' },
];

/* ---------- helpers (no need to edit) ---------- */

/** Her order: category id -> item ids (real dishes, or 'surprise' / 'decide'). */
export type Order = Partial<Record<CategoryId, string[]>>;

export const dishById = new Map(menu.map((d) => [d.id, d]));
export const categoryById = new Map(categories.map((c) => [c.id, c]));

export function formatPrice(n: number): string {
  return `₦${n.toLocaleString('en-NG')}`;
}

/** Resolve an id from an order to something displayable. */
export function resolveItem(id: string): { id: string; name: string; icon: DishIconName; price: number; special: boolean } | null {
  if (id === 'surprise' || id === 'decide') {
    const s = specials[id];
    return { id, name: s.name, icon: s.icon, price: 0, special: true };
  }
  const d = dishById.get(id);
  return d ? { id, name: d.name, icon: d.icon, price: d.price, special: false } : null;
}

/** The mascot's line for picking `id` in `category`. */
export function reactionFor(category: CategoryId, id: string): string {
  if (id === 'surprise' || id === 'decide') return specials[id].reaction;
  const d = dishById.get(id);
  const cat = categoryById.get(category)!;
  return d?.reaction ?? (d?.subcategory && cat.subReactions?.[d.subcategory]) ?? cat.reaction;
}

export function orderCount(order: Order): number {
  return categories.reduce((n, c) => n + (order[c.id]?.length ?? 0), 0);
}

export type OrderGroup = { category: Category; items: { id: string; name: string; icon: DishIconName; price: number; special: boolean }[] };

/** Her picks grouped by category, in menu order. Empty categories are left out. */
export function orderGroups(order: Order): OrderGroup[] {
  return categories.flatMap((category) => {
    const items = (order[category.id] ?? []).flatMap((id) => {
      const r = resolveItem(id);
      return r ? [r] : [];
    });
    return items.length ? [{ category, items }] : [];
  });
}

export function orderTotal(order: Order): number {
  return orderGroups(order).reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.price, 0), 0);
}

/** Neat plain text for WhatsApp / the calendar: one line per category. */
export function orderText(order: Order): string {
  const strip = (s: string) => s.replace(/\s*👀\s*/g, '').trim();
  return orderGroups(order)
    .map((g) => `${g.category.label}: ${g.items.map((i) => strip(i.name)).join(', ')}`)
    .join('\n');
}

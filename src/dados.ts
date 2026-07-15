export interface Album {
  id: string;
  title: string;
  coverImage: string;
  photos: string[];
}

export const albuns: Album[] = [
  {
    id: 'album-1',
    title: 'Retratos Noturnos',
    coverImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'album-2',
    title: 'Eventos & Shows',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540039155733-5c8c9c8cb8eb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470229722913-7c090be5efae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'album-3',
    title: 'Ensaios Urbanos',
    coverImage: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop',
    photos: [
       'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1559534747-b6ea1cae1c88?q=80&w=800&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'album-4',
    title: 'Natureza & Paisagens',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=800&auto=format&fit=crop'
    ]
  }
];

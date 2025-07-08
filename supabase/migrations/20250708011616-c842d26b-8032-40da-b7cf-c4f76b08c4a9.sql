-- Initialize default travel guide points if they don't exist
INSERT INTO public.site_content (section_name, content)
SELECT 'travel_guide_points', jsonb_build_object(
  'points', jsonb_build_array(
    jsonb_build_object(
      'id', '1',
      'name', 'Avistamiento de Ballenas',
      'category', 'tours',
      'description', 'Experiencia única para observar ballenas jorobadas durante su migración anual.',
      'highlights', jsonb_build_array('Ballenas jorobadas', 'Delfines', 'Aves marinas', 'Fotografía'),
      'duration', '3-4 horas',
      'price', '$25-40',
      'bestTime', 'Junio - Septiembre',
      'difficulty', 'Fácil',
      'rating', 4.9,
      'image', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'coordinates', jsonb_build_object('lat', -1.5667, 'lng', -80.7833)
    ),
    jsonb_build_object(
      'id', '2',
      'name', 'Isla de la Plata',
      'category', 'tours',
      'description', 'Conocida como las "Galápagos Pobres", perfecta para snorkeling y observación de vida marina.',
      'highlights', jsonb_build_array('Snorkeling', 'Piqueros de patas azules', 'Fragatas', 'Tortugas marinas'),
      'duration', '6-8 horas',
      'price', '$35-50',
      'bestTime', 'Todo el año',
      'difficulty', 'Moderado',
      'rating', 4.8,
      'image', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'coordinates', jsonb_build_object('lat', -1.2833, 'lng', -81.0833)
    ),
    jsonb_build_object(
      'id', '3',
      'name', 'Playa Los Frailes',
      'category', 'playas',
      'description', 'Una de las playas más hermosas del Ecuador, con arena dorada y aguas cristalinas.',
      'highlights', jsonb_build_array('Arena dorada', 'Aguas cristalinas', 'Senderos naturales', 'Miradores'),
      'duration', '2-3 horas',
      'price', '$5 entrada',
      'bestTime', 'Todo el año',
      'difficulty', 'Fácil',
      'rating', 4.9,
      'image', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'coordinates', jsonb_build_object('lat', -1.5667, 'lng', -80.6833)
    ),
    jsonb_build_object(
      'id', '4',
      'name', 'Agua Blanca',
      'category', 'cultura',
      'description', 'Sitio arqueológico con aguas termales sulfurosas y museo de la cultura Manteña.',
      'highlights', jsonb_build_array('Museo arqueológico', 'Aguas termales', 'Cultura Manteña', 'Senderos'),
      'duration', '3-4 horas',
      'price', '$10-15',
      'bestTime', 'Todo el año',
      'difficulty', 'Fácil',
      'rating', 4.6,
      'image', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'coordinates', jsonb_build_object('lat', -1.5167, 'lng', -80.7167)
    ),
    jsonb_build_object(
      'id', '5',
      'name', 'Playa de Puerto López',
      'category', 'playas',
      'description', 'Playa principal del pueblo pesquero, perfecta para disfrutar de la puesta de sol.',
      'highlights', jsonb_build_array('Atardeceres', 'Restaurantes frente al mar', 'Pesca artesanal', 'Mercado de mariscos'),
      'duration', '1-2 horas',
      'price', 'Gratis',
      'bestTime', 'Todo el año',
      'difficulty', 'Muy Fácil',
      'rating', 4.7,
      'image', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'coordinates', jsonb_build_object('lat', -1.5667, 'lng', -80.7833)
    ),
    jsonb_build_object(
      'id', '6',
      'name', 'Sendero La Playita',
      'category', 'aventura',
      'description', 'Caminata costera que conecta varias playas vírgenes con vista panorámica al océano.',
      'highlights', jsonb_build_array('Playas vírgenes', 'Acantilados', 'Flora nativa', 'Vistas panorámicas'),
      'duration', '2-3 horas',
      'price', '$5 entrada',
      'bestTime', 'Mañana temprano',
      'difficulty', 'Moderado',
      'rating', 4.5,
      'image', 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'coordinates', jsonb_build_object('lat', -1.5500, 'lng', -80.6900)
    )
  )
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_content WHERE section_name = 'travel_guide_points'
);
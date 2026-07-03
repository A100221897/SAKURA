import { db } from './db.js'

const { n } = db.prepare('SELECT COUNT(*) as n FROM menu_items').get()
if (n > 0) {
  console.log('Menu already seeded.')
  process.exit(0)
}

const insert = db.prepare(
  'INSERT INTO menu_items (category, name, description, price) VALUES (?, ?, ?, ?)'
)

const items = [
  ['black',  'Pistonero Honey',             'Increíble Cold Brew de proceso honey que lo hace muy dulce. Achocolatado + notas de piloncillo + almendras tostadas.',          90.00],
  ['black',  'Long Black',                  '70% hot water + un Double Espresso que permite disfrutar la crema del café desde el primer sorbo.',                             60.00],
  ['black',  'Iced Cascara',                'Hecho con la cáscara de la cereza del café, contiene muy poca cafeína, sabor suave, frutal y ligeramente dulce.',               69.00],
  ['black',  'Ginger Lemonade with Coffee', 'Zumo de suave gengibre con limón + coffee.',                                                                                    85.00],
  ['black',  'Iced Filter',                 'La extracción de la elección del café del día, preparado con un método de filtrado mezclada con hielo.',                        74.00],
  ['tea',    'Matcha Orgánico',             'Nuestro matcha especialmente diseñado para ser combinado con leche. Pídelo si quieres tener una experiencia de matcha que volará tu mente.', 91.00],
  ['tea',    'Chai with Honey',             'Increíble concentrado de chai artesanal, fusionado con miel.',                                                                   91.00],
  ['tea',    'Earl Grey',                   'Combinación de té negro + aceite esencial de bergamota. Un té cítrico y amielado.',                                              59.00],
  ['tea',    'Yorokonda',                   'Té negro + mango verde + canela + clavo + cardamomo + caléndula + coco.',                                                        59.00],
  ['tea',    'Miwaku',                      'Té negro de la India + toque caramelo + mantequilla.',                                                                           59.00],
  ['tisana', 'Furutzu',                     'Arándano + carambola + guayaba mango + manzana + papaya + piña.',                                                               55.00],
  ['tisana', 'Doragonzu',                   'Mango + piña + dátil + hibisco + cártamo + escaramujo + caléndula + fruta de la pasión.',                                       55.00],
  ['tisana', 'Tsuki',                       'Rooibos + jengibre + canela + coco.',                                                                                           55.00],
]

const seedAll = db.transaction(() => {
  for (const [category, name, description, price] of items) {
    insert.run(category, name, description, price)
  }
})

seedAll()
console.log(`Menu seeded. ${items.length} items inserted.`)

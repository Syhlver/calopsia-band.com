// color      : couleur de la track (hex) — teinte le player et l'accent de la page
// docType    : type de document dans le lore (Déposition, Journal, Fragment, Édit, Rapport, Poème...)
// loreDate   : date fictive dans le calendrier du monde
// prose      : ton texte. Lorem ipsum en attendant.

const LOREM = `
  <p>Ceci… sera la dernière transmission de l’Arbre sacré STOP.</br>
  La Capitale est tombée sous la marée de boue humaine STOP.</br>
  Tous les autres Sages sont morts et ce sera bientôt mon tour STOP. Le sang des rouges a coloré le marbre blanc… ils sont tous tombés STOP.</br>
  Les terreux ont pris le contrôle de toute la ville STOP.</br>
  J’ignore s’il reste des survivants en ville STOP.</br>
  Les Hauts-quartiers ont suivi l’Académie, puis tous les lieux de pouvoir STOP.</br>
  Ils étaient mieux organisés et bien plus intelligents que nous le croyons STOP.</br>
  La formule de la pélamine restera accessible à qui saura la trouver STOP.</p>
  <p>Je salue ce monde que j’ai connu à son apogée, et je défie les générations futures de faire mieux que nous. STOP</p>
  <p>Fin de transmission</p>
`

export const tracks = [
  {
    id: 1,
    title: "The Unknown",
    color: "#22a6e3",
    docType: "Transmission",
    loreDate: "Année 639",
    subtitle: "Message radio – canal 9",
    cover: "./covers/the_unknown.jpg",
    spotifyId: "6xBiirF1x3Vri6uS8OV0sd",
    links: [2, 4],
    prose: LOREM
  },
]
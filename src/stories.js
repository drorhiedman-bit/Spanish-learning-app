// Built-in graded stories. level: 1=Inicial(A2) 2=Intermedio(B1) 3=Avanzado(B2)
// targets: words introduced as flashcards. es = form as shown in the card, match = surface forms in text.
const STORIES = [
{
  id: "s1", level: 1, title: "El hostal en Cusco", titleEn: "The hostel in Cusco",
  paragraphs: [
    { es: "Tomás llega a Cusco a las seis de la mañana. Está muy cansado porque el bus de Lima tardó veinte horas. Tiene una mochila grande y una mochila pequeña. Camina despacio por las calles porque la ciudad está muy alta y el aire es diferente.",
      en: "Tomás arrives in Cusco at six in the morning. He is very tired because the bus from Lima took twenty hours. He has a big backpack and a small backpack. He walks slowly through the streets because the city is very high and the air is different." },
    { es: "En el hostal, una chica en la recepción le da una llave. —Tu habitación está en el tercer piso —le dice—. La compartes con tres personas. Tomás tiene que subir muchas escaleras con la mochila. Cuando llega a la habitación, está todavía más cansado.",
      en: "At the hostel, a girl at reception gives him a key. \"Your room is on the third floor,\" she tells him. \"You share it with three people.\" Tomás has to climb a lot of stairs with the backpack. When he gets to the room, he is even more tired." },
    { es: "Mientras los otros duermen, Tomás deja la mochila debajo de la cama y se acuesta. Duerme tres horas. Cuando se despierta, tiene mucha hambre. Baja a la cocina y ve que el desayuno es gratis: pan, huevos, fruta y café.",
      en: "While the others sleep, Tomás leaves the backpack under the bed and lies down. He sleeps for three hours. When he wakes up, he is very hungry. He goes down to the kitchen and sees that breakfast is free: bread, eggs, fruit and coffee." },
    { es: "En la mesa hay una chica de Chile que se llama Valentina. —¿Vas a subir a Machu Picchu? —le pregunta. —Sí, pero primero voy a descansar un día —dice Tomás. Valentina se ríe. —Todos llegan cansados a Cusco. Mañana vas a estar mejor.",
      en: "At the table there is a girl from Chile called Valentina. \"Are you going to go up to Machu Picchu?\" she asks him. \"Yes, but first I'm going to rest for a day,\" says Tomás. Valentina laughs. \"Everyone arrives in Cusco tired. Tomorrow you'll feel better.\"" }
  ],
  targets: [
    { es: "llegar", en: "to arrive", match: ["llega", "llegan"] },
    { es: "cansado", en: "tired", match: ["cansado", "cansados"] },
    { es: "la mochila", en: "backpack", match: ["mochila"] },
    { es: "la llave", en: "key", match: ["llave"] },
    { es: "la habitación", en: "room (bedroom)", match: ["habitación"] },
    { es: "compartir", en: "to share", match: ["compartes"] },
    { es: "subir", en: "to go up, to climb", match: ["subir"] },
    { es: "mientras", en: "while", match: ["mientras"] },
    { es: "despertarse", en: "to wake up", match: ["despierta"] },
    { es: "el desayuno", en: "breakfast", match: ["desayuno"] },
    { es: "descansar", en: "to rest", match: ["descansar"] }
  ],
  questions: [
    { q: "¿Por qué está cansado Tomás?", options: ["Porque el bus tardó veinte horas", "Porque no le gusta Cusco", "Porque trabajó toda la noche"], answer: 0 },
    { q: "¿Con cuántas personas comparte la habitación?", options: ["Con una persona", "Con tres personas", "Con nadie"], answer: 1 },
    { q: "¿Qué va a hacer Tomás primero?", options: ["Subir a Machu Picchu", "Volver a Lima", "Descansar un día"], answer: 2 }
  ]
},
{
  id: "s2", level: 1, title: "El mercado de La Paz", titleEn: "The market in La Paz",
  paragraphs: [
    { es: "Hoy es sábado y Lucía quiere cocinar para sus amigos. Va al mercado con una bolsa grande. El mercado está lleno de gente, colores y olores. Hay frutas que Lucía no conoce y señoras que venden de todo.",
      en: "Today is Saturday and Lucía wants to cook for her friends. She goes to the market with a big bag. The market is full of people, colors and smells. There are fruits Lucía doesn't know and ladies who sell everything." },
    { es: "—¿Cuánto cuestan las papas? —pregunta Lucía. —Cinco bolivianos el kilo, señorita —dice una señora. Lucía compra dos kilos de papas, cebollas y tomates. Después busca carne, pero no la encuentra. Le pregunta a un niño y él le muestra el lugar.",
      en: "\"How much are the potatoes?\" Lucía asks. \"Five bolivianos a kilo, miss,\" says a lady. Lucía buys two kilos of potatoes, onions and tomatoes. Then she looks for meat, but she can't find it. She asks a boy and he shows her the place." },
    { es: "Al final, Lucía ve una fruta rara, verde por fuera y blanca por dentro. —Es chirimoya —dice el vendedor—. Pruébela. Lucía la prueba y le encanta. Es dulce y suave. Compra cuatro para el postre.",
      en: "At the end, Lucía sees a strange fruit, green on the outside and white on the inside. \"It's cherimoya,\" says the seller. \"Try it.\" Lucía tries it and loves it. It's sweet and soft. She buys four for dessert." },
    { es: "Cuando vuelve a casa, la bolsa pesa mucho, pero Lucía está contenta. Gastó solo cuarenta bolivianos. Esa noche cocina una sopa con las papas, y sus amigos dicen que la chirimoya es el mejor postre del mundo.",
      en: "When she gets back home, the bag is very heavy, but Lucía is happy. She spent only forty bolivianos. That night she cooks a soup with the potatoes, and her friends say the cherimoya is the best dessert in the world." }
  ],
  targets: [
    { es: "cocinar", en: "to cook", match: ["cocinar", "cocina"] },
    { es: "la bolsa", en: "bag", match: ["bolsa"] },
    { es: "lleno", en: "full", match: ["lleno"] },
    { es: "costar", en: "to cost", match: ["cuestan"] },
    { es: "buscar", en: "to look for", match: ["busca"] },
    { es: "encontrar", en: "to find", match: ["encuentra"] },
    { es: "mostrar", en: "to show", match: ["muestra"] },
    { es: "probar", en: "to try, to taste", match: ["pruébela", "prueba"] },
    { es: "dulce", en: "sweet", match: ["dulce"] },
    { es: "pesar", en: "to weigh", match: ["pesa"] },
    { es: "gastar", en: "to spend (money)", match: ["gastó"] }
  ],
  questions: [
    { q: "¿Para quién quiere cocinar Lucía?", options: ["Para su familia", "Para sus amigos", "Solo para ella"], answer: 1 },
    { q: "¿Qué no encuentra Lucía al principio?", options: ["La carne", "Las papas", "Los tomates"], answer: 0 },
    { q: "¿Cómo es la chirimoya?", options: ["Roja y ácida", "Verde por fuera y dulce", "Pequeña y salada"], answer: 1 }
  ]
},
{
  id: "s3", level: 1, title: "El bus de noche", titleEn: "The night bus",
  paragraphs: [
    { es: "Andrés tiene que viajar de Mendoza a Buenos Aires. El viaje dura catorce horas, así que compra un pasaje para el bus de noche. Elige un asiento al lado de la ventana porque quiere ver el paisaje antes de dormir.",
      en: "Andrés has to travel from Mendoza to Buenos Aires. The trip lasts fourteen hours, so he buys a ticket for the night bus. He chooses a seat next to the window because he wants to see the landscape before sleeping." },
    { es: "El bus sale a las ocho. Al lado de Andrés se sienta un señor mayor con un sombrero. El señor no habla mucho, pero le ofrece unas galletas. —Gracias —dice Andrés—. ¿Usted también va a Buenos Aires? —No, me bajo en Córdoba. Voy a visitar a mi hija.",
      en: "The bus leaves at eight. An older man with a hat sits down next to Andrés. The man doesn't talk much, but he offers him some cookies. \"Thanks,\" says Andrés. \"Are you also going to Buenos Aires?\" \"No, I get off in Córdoba. I'm going to visit my daughter.\"" },
    { es: "A medianoche, el bus para en una estación pequeña. Andrés baja para comprar agua. Hace frío y está muy oscuro. Cuando vuelve, no encuentra su celular. Lo busca en el asiento, debajo del asiento y en la mochila. Nada.",
      en: "At midnight, the bus stops at a small station. Andrés gets off to buy water. It's cold and very dark. When he comes back, he can't find his phone. He looks for it on the seat, under the seat and in the backpack. Nothing." },
    { es: "Entonces el señor del sombrero le toca el brazo y le muestra algo: es el celular. —Se le cayó cuando bajó —dice. Andrés le da las gracias muchas veces. Después duerme tranquilo hasta la mañana, cuando el sol ya entra por la ventana.",
      en: "Then the man with the hat touches his arm and shows him something: it's the phone. \"You dropped it when you got off,\" he says. Andrés thanks him many times. Then he sleeps peacefully until morning, when the sun is already coming in through the window." }
  ],
  targets: [
    { es: "viajar", en: "to travel", match: ["viajar"] },
    { es: "el pasaje", en: "ticket (bus/plane)", match: ["pasaje"] },
    { es: "elegir", en: "to choose", match: ["elige"] },
    { es: "el asiento", en: "seat", match: ["asiento"] },
    { es: "la ventana", en: "window", match: ["ventana"] },
    { es: "sentarse", en: "to sit down", match: ["sienta"] },
    { es: "ofrecer", en: "to offer", match: ["ofrece"] },
    { es: "bajarse", en: "to get off", match: ["bajo", "baja", "bajó"] },
    { es: "oscuro", en: "dark", match: ["oscuro"] },
    { es: "caerse", en: "to fall, to drop", match: ["cayó"] },
    { es: "tranquilo", en: "calm, peaceful", match: ["tranquilo"] }
  ],
  questions: [
    { q: "¿Por qué Andrés elige un asiento al lado de la ventana?", options: ["Para ver el paisaje", "Para dormir mejor", "Porque hace calor"], answer: 0 },
    { q: "¿Adónde va el señor del sombrero?", options: ["A Buenos Aires", "A Mendoza", "A Córdoba"], answer: 2 },
    { q: "¿Quién encuentra el celular de Andrés?", options: ["El chofer", "El señor del sombrero", "Nadie"], answer: 1 }
  ]
},
{
  id: "s4", level: 2, title: "Trabajo remoto en Medellín", titleEn: "Remote work in Medellín",
  paragraphs: [
    { es: "Cuando Camila vivía en Bogotá, trabajaba en una oficina gris desde las ocho hasta las seis. Siempre estaba cansada y casi nunca veía el sol. Hace un año, su empresa le permitió trabajar desde cualquier lugar, y ella decidió mudarse a Medellín.",
      en: "When Camila lived in Bogotá, she worked in a gray office from eight to six. She was always tired and almost never saw the sun. A year ago, her company allowed her to work from anywhere, and she decided to move to Medellín." },
    { es: "Al principio todo le parecía perfecto: el clima era agradable, la gente era amable y su apartamento tenía un balcón con vista a las montañas. Sin embargo, pronto se dio cuenta de que trabajar sola en casa también tenía desventajas. Extrañaba a sus compañeros y a veces se sentía aislada.",
      en: "At first everything seemed perfect to her: the weather was pleasant, people were kind and her apartment had a balcony with a view of the mountains. However, she soon realized that working alone at home also had disadvantages. She missed her coworkers and sometimes felt isolated." },
    { es: "Por eso empezó a ir a un café cerca de su casa. Allí conoció a otros trabajadores remotos: un programador argentino, una diseñadora mexicana y un traductor de Brasil. Ahora se reúnen todos los viernes para almorzar y hablar de sus proyectos.",
      en: "That's why she started going to a café near her home. There she met other remote workers: an Argentinian programmer, a Mexican designer and a translator from Brazil. Now they meet every Friday to have lunch and talk about their projects." },
    { es: "Este año Camila ha aprendido mucho, no solo sobre su trabajo, sino también sobre sí misma. Ha descubierto que necesita rutina y contacto con otras personas. El próximo mes viajará a Ecuador, pero esta vez no irá sola: sus nuevos amigos han decidido acompañarla.",
      en: "This year Camila has learned a lot, not only about her work but also about herself. She has discovered that she needs routine and contact with other people. Next month she will travel to Ecuador, but this time she won't go alone: her new friends have decided to go with her." }
  ],
  targets: [
    { es: "la empresa", en: "company", match: ["empresa"] },
    { es: "permitir", en: "to allow", match: ["permitió"] },
    { es: "mudarse", en: "to move (house)", match: ["mudarse"] },
    { es: "agradable", en: "pleasant", match: ["agradable"] },
    { es: "sin embargo", en: "however", match: ["embargo"] },
    { es: "darse cuenta (de)", en: "to realize", match: ["dio", "cuenta"] },
    { es: "extrañar", en: "to miss (someone/something)", match: ["extrañaba"] },
    { es: "aislado", en: "isolated", match: ["aislada"] },
    { es: "reunirse", en: "to meet, to get together", match: ["reúnen"] },
    { es: "descubrir", en: "to discover", match: ["descubierto"] },
    { es: "acompañar", en: "to accompany, to go with", match: ["acompañarla"] }
  ],
  questions: [
    { q: "¿Cómo se sentía Camila cuando trabajaba en Bogotá?", options: ["Siempre cansada", "Muy feliz", "Enferma"], answer: 0 },
    { q: "¿Cuál era el problema de trabajar en casa?", options: ["El clima", "Se sentía sola", "El apartamento era pequeño"], answer: 1 },
    { q: "¿Qué pasará el próximo mes?", options: ["Volverá a Bogotá", "Viajará a Ecuador con sus amigos", "Cambiará de trabajo"], answer: 1 }
  ]
},
{
  id: "s5", level: 2, title: "La tormenta en la Patagonia", titleEn: "The storm in Patagonia",
  paragraphs: [
    { es: "Mateo y su hermana Sofía habían planeado la caminata durante meses. Querían recorrer el circuito W en Torres del Paine, en la Patagonia chilena. El primer día hacía un tiempo increíble: el cielo estaba despejado y los lagos brillaban como espejos.",
      en: "Mateo and his sister Sofía had planned the hike for months. They wanted to walk the W circuit in Torres del Paine, in Chilean Patagonia. The first day the weather was incredible: the sky was clear and the lakes shone like mirrors." },
    { es: "El segundo día, sin embargo, el viento empezó a soplar con mucha fuerza. Un guardaparque les advirtió que se acercaba una tormenta. —Si siguen hasta el mirador, tengan cuidado —les dijo—. El camino se pone peligroso con la lluvia.",
      en: "On the second day, however, the wind started to blow very hard. A park ranger warned them that a storm was approaching. \"If you continue to the viewpoint, be careful,\" he told them. \"The trail gets dangerous in the rain.\"" },
    { es: "Sofía quería seguir, pero Mateo tenía dudas. Discutieron unos minutos y finalmente decidieron esperar en el refugio. Fue una buena decisión: una hora después, llovía tanto que no se veía nada. En el refugio había otros viajeros, y todos compartían té y chocolate.",
      en: "Sofía wanted to keep going, but Mateo had doubts. They argued for a few minutes and finally decided to wait in the shelter. It was a good decision: an hour later, it was raining so hard you couldn't see anything. In the shelter there were other travelers, and everyone was sharing tea and chocolate." },
    { es: "A la mañana siguiente, la tormenta había pasado. Salieron temprano y llegaron al mirador justo cuando salía el sol. Las tres torres de granito estaban rosadas por la luz. —Valió la pena esperar —dijo Sofía, y por primera vez en todo el viaje, Mateo estuvo de acuerdo con ella.",
      en: "The next morning, the storm had passed. They left early and reached the viewpoint just as the sun was rising. The three granite towers were pink in the light. \"It was worth waiting,\" said Sofía, and for the first time on the whole trip, Mateo agreed with her." }
  ],
  targets: [
    { es: "la caminata", en: "hike, walk", match: ["caminata"] },
    { es: "despejado", en: "clear (sky)", match: ["despejado"] },
    { es: "el viento", en: "wind", match: ["viento"] },
    { es: "advertir", en: "to warn", match: ["advirtió"] },
    { es: "acercarse", en: "to approach, to get closer", match: ["acercaba"] },
    { es: "peligroso", en: "dangerous", match: ["peligroso"] },
    { es: "la duda", en: "doubt", match: ["dudas"] },
    { es: "discutir", en: "to argue", match: ["discutieron"] },
    { es: "el refugio", en: "shelter, mountain hut", match: ["refugio"] },
    { es: "valer la pena", en: "to be worth it", match: ["valió", "pena"] },
    { es: "estar de acuerdo", en: "to agree", match: ["acuerdo"] }
  ],
  questions: [
    { q: "¿Qué pasó el segundo día?", options: ["Hizo mucho calor", "Empezó un viento muy fuerte", "Se perdieron en el bosque"], answer: 1 },
    { q: "¿Dónde esperaron mientras pasaba la tormenta?", options: ["En una carpa", "En el refugio", "En el auto"], answer: 1 },
    { q: "¿Cómo estaban las torres al final?", options: ["Rosadas por la luz", "Cubiertas de nieve", "Escondidas por la niebla"], answer: 0 }
  ]
},
{
  id: "s6", level: 2, title: "El mole de la abuela", titleEn: "Grandma's mole",
  paragraphs: [
    { es: "Todos los domingos, cuando Diego era niño, su familia comía en la casa de su abuela en Oaxaca. Ella preparaba mole negro, un plato que tardaba casi todo el día en cocinarse. Diego se sentaba en la cocina y la miraba mezclar chiles, chocolate y especias.",
      en: "Every Sunday, when Diego was a child, his family ate at his grandmother's house in Oaxaca. She made black mole, a dish that took almost the whole day to cook. Diego would sit in the kitchen and watch her mix chiles, chocolate and spices." },
    { es: "La abuela nunca usaba recetas escritas. —La receta está aquí —decía, y se tocaba el corazón. Diego le hacía preguntas, pero ella solo se reía y le daba una cuchara para probar la salsa.",
      en: "Grandma never used written recipes. \"The recipe is here,\" she would say, touching her heart. Diego would ask her questions, but she just laughed and gave him a spoon to taste the sauce." },
    { es: "Hace dos años la abuela se enfermó y ya no podía cocinar. Diego se dio cuenta de que nadie en la familia sabía hacer el mole. Entonces decidió aprender. Pasó muchas tardes con ella, anotando cada paso en un cuaderno mientras ella le explicaba con paciencia.",
      en: "Two years ago Grandma got sick and couldn't cook anymore. Diego realized that nobody in the family knew how to make the mole. So he decided to learn. He spent many afternoons with her, writing down each step in a notebook while she explained it to him patiently." },
    { es: "El domingo pasado, Diego preparó el mole por primera vez para toda la familia. Estaba nervioso, pero cuando su abuela lo probó, cerró los ojos y sonrió. —Te ha quedado igual que el mío —le dijo—. Ahora la receta también está en tu corazón.",
      en: "Last Sunday, Diego made the mole for the whole family for the first time. He was nervous, but when his grandmother tasted it, she closed her eyes and smiled. \"It came out just like mine,\" she told him. \"Now the recipe is in your heart too.\"" }
  ],
  targets: [
    { es: "preparar", en: "to prepare, to make", match: ["preparaba", "preparó"] },
    { es: "el plato", en: "dish, plate", match: ["plato"] },
    { es: "mezclar", en: "to mix", match: ["mezclar"] },
    { es: "la receta", en: "recipe", match: ["receta", "recetas"] },
    { es: "la cuchara", en: "spoon", match: ["cuchara"] },
    { es: "enfermarse", en: "to get sick", match: ["enfermó"] },
    { es: "anotar", en: "to write down, to note", match: ["anotando"] },
    { es: "el paso", en: "step", match: ["paso"] },
    { es: "explicar", en: "to explain", match: ["explicaba"] },
    { es: "la paciencia", en: "patience", match: ["paciencia"] },
    { es: "quedar (bien/igual)", en: "to turn out (a result)", match: ["quedado"] }
  ],
  questions: [
    { q: "¿Dónde comía la familia de Diego los domingos?", options: ["En un restaurante", "En la casa de la abuela", "En la casa de Diego"], answer: 1 },
    { q: "¿Por qué Diego decidió aprender a hacer mole?", options: ["Porque quería abrir un restaurante", "Porque nadie más sabía hacerlo", "Porque su madre se lo pidió"], answer: 1 },
    { q: "¿Qué hizo la abuela cuando probó el mole de Diego?", options: ["Dijo que estaba muy salado", "Cerró los ojos y sonrió", "No dijo nada"], answer: 1 }
  ]
},
{
  id: "s7", level: 3, title: "La tortuga de San Cristóbal", titleEn: "The tortoise of San Cristóbal",
  paragraphs: [
    { es: "Cuando Inés llegó a la isla San Cristóbal para trabajar como voluntaria, no se imaginaba que aquella experiencia le cambiaría la vida. La organización le había pedido que se encargara de contar las tortugas de una zona remota, una tarea que parecía sencilla pero que exigía una paciencia enorme.",
      en: "When Inés arrived on San Cristóbal island to work as a volunteer, she didn't imagine that the experience would change her life. The organization had asked her to take charge of counting the tortoises in a remote area, a task that seemed simple but required enormous patience." },
    { es: "Cada mañana, antes de que el sol calentara demasiado, recorría senderos llenos de piedras volcánicas. Era imprescindible que registrara cada tortuga con precisión: su tamaño, su ubicación y cualquier herida que tuviera. Al principio le costaba distinguirlas, pero poco a poco aprendió a reconocer a cada una.",
      en: "Every morning, before the sun got too hot, she walked along trails full of volcanic rocks. It was essential that she record each tortoise precisely: its size, its location and any injury it had. At first she found it hard to tell them apart, but little by little she learned to recognize each one." },
    { es: "Un día encontró una tortuga joven atrapada en una red de pesca. Aunque las normas exigían que avisara a los guardaparques sin intervenir, Inés temía que el animal no sobreviviera hasta que llegaran. Dudó unos segundos y, con mucho cuidado, cortó la red.",
      en: "One day she found a young tortoise trapped in a fishing net. Although the rules required her to notify the park rangers without intervening, Inés was afraid the animal wouldn't survive until they arrived. She hesitated for a few seconds and, very carefully, cut the net." },
    { es: "Más tarde, el coordinador le explicó que había actuado bien, pero le pidió que la próxima vez lo llamara antes. —Si todos actuáramos sin avisar, sería imposible proteger la isla —le dijo. Inés lo entendió. Hoy trabaja en conservación marina y suele decir que aquella tortuga le enseñó más que cualquier libro.",
      en: "Later, the coordinator told her she had acted well, but asked her to call him first next time. \"If we all acted without notifying anyone, it would be impossible to protect the island,\" he told her. Inés understood. Today she works in marine conservation and often says that tortoise taught her more than any book." }
  ],
  targets: [
    { es: "imaginarse", en: "to imagine", match: ["imaginaba"] },
    { es: "encargarse de", en: "to take charge of, to be in charge of", match: ["encargara"] },
    { es: "exigir", en: "to require, to demand", match: ["exigía", "exigían"] },
    { es: "sencillo", en: "simple, easy", match: ["sencilla"] },
    { es: "imprescindible", en: "essential, indispensable", match: ["imprescindible"] },
    { es: "distinguir", en: "to tell apart, to distinguish", match: ["distinguirlas"] },
    { es: "atrapado", en: "trapped", match: ["atrapada"] },
    { es: "avisar", en: "to notify, to let know", match: ["avisara", "avisar"] },
    { es: "temer", en: "to fear", match: ["temía"] },
    { es: "sobrevivir", en: "to survive", match: ["sobreviviera"] },
    { es: "proteger", en: "to protect", match: ["proteger"] },
    { es: "soler", en: "to usually (do)", match: ["suele"] }
  ],
  questions: [
    { q: "¿Cuál era la tarea de Inés en la isla?", options: ["Limpiar las playas", "Contar las tortugas", "Guiar a los turistas"], answer: 1 },
    { q: "¿Qué decían las normas que debía hacer?", options: ["Avisar a los guardaparques sin intervenir", "Cortar la red inmediatamente", "Llevar la tortuga al centro"], answer: 0 },
    { q: "¿Qué le pidió el coordinador?", options: ["Que se fuera de la isla", "Que lo llamara antes la próxima vez", "Que escribiera un libro"], answer: 1 }
  ]
},
{
  id: "s8", level: 3, title: "La entrevista", titleEn: "The interview",
  paragraphs: [
    { es: "Federico llevaba seis meses buscando trabajo cuando por fin lo llamaron de una empresa de tecnología en Montevideo. Le dijeron que la entrevista sería al día siguiente y que tendría que presentar un proyecto propio. Esa noche apenas durmió.",
      en: "Federico had been looking for work for six months when a tech company in Montevideo finally called him. They told him the interview would be the next day and that he would have to present a project of his own. That night he barely slept." },
    { es: "Por la mañana se puso su mejor camisa y salió con tiempo de sobra. Sin embargo, el ómnibus se descompuso a mitad de camino. Federico miró el reloj con angustia: si no conseguía un taxi enseguida, llegaría tarde. Ojalá hubiera salido aún más temprano, pensó.",
      en: "In the morning he put on his best shirt and left with plenty of time to spare. However, the bus broke down halfway there. Federico looked at his watch anxiously: if he didn't get a taxi right away, he would be late. If only I had left even earlier, he thought." },
    { es: "Llegó con diez minutos de retraso, sudando y sin aliento. Esperaba que lo rechazaran de inmediato, pero la entrevistadora le sonrió. —No se preocupe, a todos nos ha pasado alguna vez —le dijo—. Cuénteme sobre su proyecto.",
      en: "He arrived ten minutes late, sweating and out of breath. He expected them to reject him immediately, but the interviewer smiled at him. \"Don't worry, it has happened to all of us at some point,\" she said. \"Tell me about your project.\"" },
    { es: "Federico respiró hondo y explicó su idea: una aplicación que ayudara a pequeños agricultores a vender sus productos sin intermediarios. A medida que hablaba, se fue tranquilizando. Una semana después recibió la noticia: el puesto era suyo. Lo que más había valorado la empresa, le contaron, era que no se hubiera rendido a pesar de los problemas.",
      en: "Federico took a deep breath and explained his idea: an app that would help small farmers sell their products without middlemen. As he talked, he gradually calmed down. A week later he got the news: the job was his. What the company had valued most, they told him, was that he hadn't given up despite the problems." }
  ],
  targets: [
    { es: "apenas", en: "barely, hardly", match: ["apenas"] },
    { es: "de sobra", en: "to spare, more than enough", match: ["sobra"] },
    { es: "descomponerse", en: "to break down (machine)", match: ["descompuso"] },
    { es: "conseguir", en: "to get, to obtain", match: ["conseguía"] },
    { es: "enseguida", en: "right away", match: ["enseguida"] },
    { es: "el retraso", en: "delay", match: ["retraso"] },
    { es: "rechazar", en: "to reject", match: ["rechazaran"] },
    { es: "preocuparse", en: "to worry", match: ["preocupe"] },
    { es: "respirar hondo", en: "to take a deep breath", match: ["respiró", "hondo"] },
    { es: "a medida que", en: "as (gradually, while)", match: ["medida"] },
    { es: "el puesto", en: "position, job", match: ["puesto"] },
    { es: "rendirse", en: "to give up", match: ["rendido"] },
    { es: "a pesar de", en: "despite", match: ["pesar"] }
  ],
  questions: [
    { q: "¿Qué tenía que presentar Federico en la entrevista?", options: ["Su título universitario", "Un proyecto propio", "Cartas de recomendación"], answer: 1 },
    { q: "¿Por qué llegó tarde?", options: ["Se quedó dormido", "El ómnibus se descompuso", "Se equivocó de dirección"], answer: 1 },
    { q: "¿Qué valoró más la empresa?", options: ["Que fuera puntual", "Que no se hubiera rendido", "Que tuviera mucha experiencia"], answer: 1 }
  ]
},
{
  id: "s9", level: 3, title: "Entre dos ciudades", titleEn: "Between two cities",
  paragraphs: [
    { es: "Después de vivir ocho años en Madrid, Gabriela regresó a Lima convencida de que todo seguiría igual. Sin embargo, desde el primer día notó que algo había cambiado, aunque no sabía si había cambiado la ciudad o había cambiado ella.",
      en: "After living in Madrid for eight years, Gabriela returned to Lima convinced that everything would be the same. However, from the first day she noticed that something had changed, although she didn't know whether the city had changed or she had." },
    { es: "Sus amigos de la universidad se habían casado, algunos tenían hijos y otros se habían ido al extranjero. Las calles de su barrio estaban llenas de edificios nuevos. Incluso su manera de hablar le parecía extraña: sin darse cuenta, a veces decía «vale» en lugar de «ya», y su familia se burlaba de ella cariñosamente.",
      en: "Her university friends had gotten married, some had children and others had gone abroad. The streets of her neighborhood were full of new buildings. Even her way of speaking seemed strange to her: without realizing it, she sometimes said \"vale\" instead of \"ya\", and her family teased her affectionately." },
    { es: "Durante los primeros meses, se sentía como una extranjera en su propio país. Echaba de menos los paseos por el Retiro y los cafés tranquilos, pero cuando hablaba con sus amigas españolas, les decía que extrañaba el ceviche y el ruido de Lima. Era como si no perteneciera a ningún lugar.",
      en: "During the first months, she felt like a foreigner in her own country. She missed the walks in the Retiro park and the quiet cafés, but when she talked to her Spanish friends, she told them she missed ceviche and the noise of Lima. It was as if she didn't belong anywhere." },
    { es: "Con el tiempo, Gabriela comprendió que no tenía que elegir. Si alguien le preguntara hoy de dónde es, probablemente respondería que es de las dos ciudades. Ha aprendido que el hogar no es un lugar fijo, sino algo que uno construye, poco a poco, con las personas que quiere.",
      en: "Over time, Gabriela understood that she didn't have to choose. If someone asked her today where she's from, she would probably answer that she's from both cities. She has learned that home isn't a fixed place, but something you build, little by little, with the people you love." }
  ],
  targets: [
    { es: "regresar", en: "to return, to go back", match: ["regresó"] },
    { es: "convencido", en: "convinced", match: ["convencida"] },
    { es: "notar", en: "to notice", match: ["notó"] },
    { es: "el extranjero", en: "abroad / foreigner", match: ["extranjero", "extranjera"] },
    { es: "el barrio", en: "neighborhood", match: ["barrio"] },
    { es: "burlarse de", en: "to make fun of, to tease", match: ["burlaba"] },
    { es: "echar de menos", en: "to miss (someone/something)", match: ["echaba", "menos"] },
    { es: "pertenecer", en: "to belong", match: ["perteneciera"] },
    { es: "comprender", en: "to understand, to realize", match: ["comprendió"] },
    { es: "el hogar", en: "home", match: ["hogar"] },
    { es: "construir", en: "to build", match: ["construye"] },
    { es: "fijo", en: "fixed", match: ["fijo"] }
  ],
  questions: [
    { q: "¿Qué pensaba Gabriela antes de regresar a Lima?", options: ["Que todo seguiría igual", "Que no le gustaría la ciudad", "Que no tendría amigos"], answer: 0 },
    { q: "¿Por qué se burlaba su familia de ella?", options: ["Por su ropa", "Por su manera de hablar", "Porque no sabía cocinar"], answer: 1 },
    { q: "¿Qué comprendió Gabriela al final?", options: ["Que debía volver a Madrid", "Que el hogar no es un lugar fijo", "Que prefería Lima"], answer: 1 }
  ]
}
,{
  id: "s10", level: 1, region: "AR", title: "Un asado en Buenos Aires", titleEn: "An asado in Buenos Aires",
  paragraphs: [
    { es: "Martín vive en Buenos Aires y labura en un café de Palermo. El sábado, su amigo Nico lo llama por teléfono. —Che, Martín, ¿qué hacés? Mañana hacemos un asado en mi casa. ¿Venís? —¡Dale! —dice Martín—. ¿Qué llevo?",
      en: "Martín lives in Buenos Aires and works at a café in Palermo. On Saturday, his friend Nico calls him on the phone. \"Hey, Martín, what are you up to? Tomorrow we're having an asado at my place. Are you coming?\" \"Sure!\" says Martín. \"What should I bring?\"" },
    { es: "—Traé unas birras y pan, nada más. Va a venir la prima de Lucas, que es re copada. Martín se ríe. Al día siguiente, toma el bondi hasta la casa de Nico. El viaje es largo, pero Martín está de buena onda y escucha música todo el camino.",
      en: "\"Bring some beers and bread, that's all. Lucas's cousin is coming, and she's really cool.\" Martín laughs. The next day, he takes the bus to Nico's house. The trip is long, but Martín is in a good mood and listens to music the whole way." },
    { es: "En la casa de Nico hay mucha gente. El olor de la carne en la parrilla es increíble. Nico le presenta a Sofi, la prima de Lucas. —¿Vos sos el del café? —le pregunta ella—. Me encanta ese lugar. —Sí, ahí laburo todos los días —dice Martín.",
      en: "At Nico's house there are lots of people. The smell of the meat on the grill is incredible. Nico introduces him to Sofi, Lucas's cousin. \"Are you the guy from the café?\" she asks him. \"I love that place.\" \"Yes, I work there every day,\" says Martín." },
    { es: "Comen, toman y hablan hasta la noche. Cuando Martín se va, Sofi le dice: —Che, el lunes paso por el café, ¿dale? —Dale, te espero —responde él. En el bondi de vuelta, Martín sonríe todo el viaje. Fue un día re lindo.",
      en: "They eat, drink and talk until night. When Martín leaves, Sofi tells him: \"Hey, I'll stop by the café on Monday, okay?\" \"Sure, I'll be waiting for you,\" he answers. On the bus back, Martín smiles the whole ride. It was a really nice day." }
  ],
  targets: [
    { es: "laburar", en: "to work (Argentina)", match: ["labura", "laburo"] },
    { es: "che", en: "hey (Argentina)", match: ["che"] },
    { es: "¿qué hacés?", en: "what are you up to? (vos form)", match: ["hacés"], slang: true },
    { es: "¡dale!", en: "sure! OK!", match: ["dale"] },
    { es: "la birra", en: "beer (Argentina)", match: ["birras"] },
    { es: "re", en: "really, very (Argentina)", match: ["re"] },
    { es: "copado", en: "cool (Argentina)", match: ["copada"] },
    { es: "el bondi", en: "bus (Argentina)", match: ["bondi"] },
    { es: "buena onda", en: "good vibes, good mood", match: ["onda"] },
    { es: "vos sos", en: "you are (voseo of tú eres)", match: ["sos"], slang: true },
    { es: "traer", en: "to bring (traé = bring! vos)", match: ["traé"] },
    { es: "la parrilla", en: "grill", match: ["parrilla"] }
  ],
  questions: [
    { q: "¿Dónde labura Martín?", options: ["En un café de Palermo", "En un banco", "En una parrilla"], answer: 0 },
    { q: "¿Qué tiene que llevar Martín al asado?", options: ["Carne y vino", "Birras y pan", "Nada"], answer: 1 },
    { q: "¿Qué va a hacer Sofi el lunes?", options: ["Pasar por el café", "Ir a la playa", "Llamar a Nico"], answer: 0 }
  ]
},
{
  id: "s11", level: 1, region: "CO", title: "Parceros en Medellín", titleEn: "Buddies in Medellín",
  paragraphs: [
    { es: "Daniela llega a Medellín para estudiar español. El primer día, conoce a Julián, un vecino muy amable. —¡Hola, parce! ¿Qué más? —le dice él. Daniela no entiende nada. Julián se ríe y le explica: —«¿Qué más?» es como decir «¿cómo estás?».",
      en: "Daniela arrives in Medellín to study Spanish. On the first day, she meets Julián, a very friendly neighbor. \"Hi, buddy! What's up?\" he says. Daniela doesn't understand a thing. Julián laughs and explains: \"'¿Qué más?' is like saying 'how are you?'.\"" },
    { es: "Julián la invita a tomar un tinto en una tienda de la esquina. Daniela piensa que un tinto es vino, pero es un café negro pequeño. —¿Me regala dos tintos, por favor? —pide Julián. Daniela aprende que en Colombia «regalar» también sirve para pedir algo con cortesía.",
      en: "Julián invites her for a tinto at a little shop on the corner. Daniela thinks a tinto is wine, but it's a small black coffee. \"Could I have two tintos, please?\" Julián asks. Daniela learns that in Colombia \"regalar\" is also used to ask for something politely." },
    { es: "El viernes, Julián le dice: —Esta noche hay rumba en el centro. ¿Vamos? —¡De una! —responde Daniela, que ya aprendió la expresión. La fiesta es muy bacana: bailan salsa y reguetón hasta las tres de la mañana.",
      en: "On Friday, Julián tells her: \"Tonight there's a party downtown. Shall we go?\" \"Absolutely!\" answers Daniela, who has already learned the expression. The party is really awesome: they dance salsa and reggaeton until three in the morning." },
    { es: "El sábado, Daniela se despierta con un guayabo terrible. Le escribe a Julián: —Qué pena, pero hoy no puedo ir a caminar. Él le contesta: —Paila, parce. Tome mucha agua y descanse. ¡Mañana vamos!",
      en: "On Saturday, Daniela wakes up with a terrible hangover. She texts Julián: \"Sorry, but I can't go for a walk today.\" He replies: \"Too bad, buddy. Drink lots of water and rest. We'll go tomorrow!\"" }
  ],
  targets: [
    { es: "parce / parcero", en: "buddy (Colombia)", match: ["parce"] },
    { es: "¿qué más?", en: "what's up? (Colombia)", match: ["más"] },
    { es: "el tinto", en: "small black coffee (Colombia)", match: ["tinto", "tintos"] },
    { es: "regalar (para pedir)", en: "could I have… (polite request, Colombia)", match: ["regala"] },
    { es: "la esquina", en: "corner", match: ["esquina"] },
    { es: "rumbear / la rumba", en: "to party / party (Colombia)", match: ["rumba"] },
    { es: "¡de una!", en: "sure! absolutely! (Colombia)", match: ["una"] },
    { es: "bacano", en: "cool, awesome (Colombia)", match: ["bacana"] },
    { es: "el guayabo", en: "hangover (Colombia)", match: ["guayabo"] },
    { es: "¡qué pena!", en: "sorry! how embarrassing! (Colombia)", match: ["pena"] },
    { es: "paila", en: "too bad (Colombia)", match: ["paila"] },
    { es: "contestar", en: "to answer, to reply", match: ["contesta"] }
  ],
  questions: [
    { q: "¿Qué es un tinto en Colombia?", options: ["Un vino tinto", "Un café negro pequeño", "Un jugo"], answer: 1 },
    { q: "¿Qué significa «¡De una!»?", options: ["¡Claro, vamos!", "No, gracias", "Tal vez mañana"], answer: 0 },
    { q: "¿Por qué Daniela no puede caminar el sábado?", options: ["Porque llueve", "Porque tiene guayabo", "Porque trabaja"], answer: 1 }
  ]
}
];

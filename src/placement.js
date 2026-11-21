// Placement test bank. band: 1=A2, 2=B1, 3=B2. Vocab: word in *asterisks*, choose English meaning.
// Reading: short passage + question in Spanish.
const PLACEMENT = [
// ---- band 1 (A2)
{ band:1, s:"Tengo mucha *hambre*, ¿comemos algo?", opts:["hunger","sleep","cold","fear"], a:0, w:"el hambre" },
{ band:1, s:"Mi hermano *trabaja* en un banco.", opts:["lives","works","walks","waits"], a:1, w:"trabajar" },
{ band:1, s:"La tienda está *cerrada* los domingos.", opts:["open","full","closed","empty"], a:2, w:"cerrado" },
{ band:1, s:"¿Me *prestas* tu bolígrafo?", opts:["sell","show","lend","give back"], a:2, w:"prestar" },
{ band:1, s:"Ayer *llovió* todo el día.", opts:["it snowed","it rained","it was windy","it was sunny"], a:1, w:"llover" },
{ band:1, s:"El museo queda *lejos* del centro.", opts:["near","inside","far","behind"], a:2, w:"lejos" },
{ band:1, s:"Necesito *cambiar* dinero antes del viaje.", opts:["to save","to change","to spend","to find"], a:1, w:"cambiar" },
{ band:1, s:"Ella *siempre* llega tarde.", opts:["never","sometimes","always","already"], a:2, w:"siempre" },
{ band:1, s:"Voy a *alquilar* una bici para el fin de semana.", opts:["to rent","to fix","to buy","to ride"], a:0, w:"alquilar" },
{ band:1, s:"No *entiendo* lo que dices.", opts:["hear","understand","remember","believe"], a:1, w:"entender" },
{ band:1, r:true, p:"Hola, soy Marta. Vivo en Quito con mi perro, Toby. Trabajo en un hotel por las mañanas y por las tardes estudio inglés.", q:"¿Qué hace Marta por las tardes?", opts:["Trabaja en un hotel","Estudia inglés","Pasea al perro"], a:1 },
{ band:1, r:true, p:"El tren a Cuenca sale a las 9:15, pero hoy tiene un retraso de media hora.", q:"¿A qué hora va a salir el tren hoy?", opts:["A las 9:15","A las 9:45","A las 10:15"], a:1 },
// ---- band 2 (B1)
{ band:2, s:"Se me *olvidó* traer las llaves.", opts:["I lost","I forgot","I broke","I hid"], a:1, w:"olvidar" },
{ band:2, s:"Hay que *ahorrar* para el viaje.", opts:["to save (money)","to plan","to book","to pay"], a:0, w:"ahorrar" },
{ band:2, s:"Mi jefe es muy *exigente*.", opts:["generous","demanding","lazy","funny"], a:1, w:"exigente" },
{ band:2, s:"*Mientras* cocinaba, escuchaba la radio.", opts:["After","Before","While","Because"], a:2, w:"mientras" },
{ band:2, s:"La reunión fue *aburrida*.", opts:["boring","long","useful","tense"], a:0, w:"aburrido" },
{ band:2, s:"No pude *dormirme* por el ruido.", opts:["to wake up","to fall asleep","to concentrate","to relax"], a:1, w:"dormirse" },
{ band:2, s:"Me *di cuenta* de que había perdido el pasaporte.", opts:["I realized","I remembered","I worried","I accepted"], a:0, w:"darse cuenta" },
{ band:2, s:"Es *peligroso* nadar aquí.", opts:["forbidden","difficult","dangerous","cold"], a:2, w:"peligroso" },
{ band:2, s:"Tuvimos que *quedarnos* en el aeropuerto toda la noche.", opts:["to wait in line","to stay","to sleep","to complain"], a:1, w:"quedarse" },
{ band:2, s:"*Sin embargo*, decidió seguir adelante.", opts:["Therefore","However","Finally","Meanwhile"], a:1, w:"sin embargo" },
{ band:2, r:true, p:"Cuando era pequeño, Pablo pasaba los veranos en el campo con sus abuelos. Le encantaba ayudar con los animales, aunque odiaba levantarse temprano.", q:"¿Qué no le gustaba a Pablo?", opts:["Los animales","Levantarse temprano","Sus abuelos"], a:1 },
{ band:2, r:true, p:"Hemos cambiado el horario de la biblioteca. A partir del lunes, abriremos a las diez y cerraremos a las ocho, excepto los viernes, que cerraremos a las seis.", q:"¿A qué hora cierra la biblioteca los viernes?", opts:["A las seis","A las ocho","A las diez"], a:0 },
// ---- band 3 (B2)
{ band:3, s:"Es *imprescindible* llevar el pasaporte.", opts:["optional","recommended","essential","forbidden"], a:2, w:"imprescindible" },
{ band:3, s:"No quiero que te *rindas* ahora.", opts:["get angry","give up","leave","complain"], a:1, w:"rendirse" },
{ band:3, s:"*Apenas* tuvimos tiempo para comer.", opts:["Finally","Barely","Always","Almost never"], a:1, w:"apenas" },
{ band:3, s:"La empresa *rechazó* la propuesta.", opts:["accepted","reviewed","rejected","improved"], a:2, w:"rechazar" },
{ band:3, s:"*Echo de menos* a mi familia.", opts:["I worry about","I miss","I call","I visit"], a:1, w:"echar de menos" },
{ band:3, s:"*A pesar de* la lluvia, salimos a correr.", opts:["Because of","Instead of","Despite","Before"], a:2, w:"a pesar de" },
{ band:3, s:"El coche se *descompuso* en la carretera.", opts:["crashed","broke down","got lost","sped up"], a:1, w:"descomponerse" },
{ band:3, s:"Si lo hubiera sabido, te habría *avisado*.", opts:["helped","warned / let know","waited for","forgiven"], a:1, w:"avisar" },
{ band:3, s:"Ella *suele* desayunar en la oficina.", opts:["usually","never","wants to","refuses to"], a:0, w:"soler" },
{ band:3, s:"Me molesta que la gente se *burle* de los demás.", opts:["complains","lies to","makes fun of","forgets about"], a:2, w:"burlarse" },
{ band:3, r:true, p:"Aunque el gobierno había prometido que el puente estaría listo en marzo, las obras se retrasaron por falta de materiales. Los vecinos, cansados de esperar, exigen que se fije una fecha definitiva.", q:"¿Qué piden los vecinos?", opts:["Que se cancelen las obras","Una fecha final para terminar el puente","Más materiales para sus casas"], a:1 },
{ band:3, r:true, p:"De haber sabido lo difícil que sería adaptarse, quizá Lucas no se habría mudado tan rápido. Aun así, no se arrepiente: dice que lo que aprendió compensa todo lo que sufrió.", q:"¿Cómo se siente Lucas sobre su decisión?", opts:["Se arrepiente mucho","No se arrepiente","Quiere volver ya"], a:1 }
];

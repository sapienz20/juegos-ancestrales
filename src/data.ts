// Contenido de los cuatro juegos, tomado del prototipo de Figma.
// Lo marcado con "POR VALIDAR" se debe confirmar con la comunidad.

export type GameId = 'bodoquera' | 'trompo' | 'palmo' | 'zumbambico';

export type Step =
  | { kind: 'match'; instr: string; hint?: string; left: string[]; right: string[]; pairs: number[] }
  | { kind: 'order'; instr: string; items: string[] }
  | { kind: 'pick'; instr: string; hint?: string; title?: string; context?: string; question?: string; options: string[]; correct: number[]; trees?: boolean }
  | { kind: 'tf'; instr: string; hint?: string; items: { text: string; value: boolean }[] }
  | { kind: 'classify'; instr: string; hint?: string; columns: [string, string]; cards: { text: string; col: 0 | 1 }[] }
  | { kind: 'label'; instr: string; hint?: string; parts: string[] }
  | { kind: 'audio'; instr: string; hint?: string; count: number; correct: number }
  | { kind: 'open'; instr: string; question: string; context?: string; listen?: string; canto?: boolean }
  | { kind: 'mcq'; instr: string; title?: string; context?: string; question: string; options: string[]; correct: number }
  | { kind: 'create'; instr: string; question: string; prompt?: string; detail?: string }
  | { kind: 'wip'; instr: string; message: string };

export type Level = { n: number; name: string; title: string; steps: Step[] };

export type Game = {
  id: GameId;
  name: string;
  short: string;
  article: string; // "la bodoquera", "el trompo"
  theme: Record<string, string>;
  map: string;
  vivencia: string;
  origen: { title: string; text: string };
  creando: { title: string; text: string };
  vivenciaText: string;
  transitions: { mapa: string; origen: string; creando: string; vivencia: string; retosaberes: string };
  levels: Level[];
};

const NAMES = ['Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear'];

const VIVENCIA =
  'La práctica comunitaria de este juego representa una forma de medir y exhibir destrezas y habilidades, como la concentración y la precisión o puntería, de manera diferente a las que plantea la cultura dominante, pues con las actividades colectivas comunitarias, las semillas aprenden, comparten experiencias y se integran social y culturalmente.';

const PENDIENTE = (que: string) =>
  `Aquí irá ${que}. Este texto se está construyendo con los sabedores de la comunidad y se agregará junto con el video.`;

const MCQ = 'Lee, analiza y responde las preguntas de opción múltiple';

function mcqs(list: [string, string[], number][], instr = MCQ): Step[] {
  return list.map(([question, options, correct]) => ({ kind: 'mcq', instr, question, options, correct }));
}

function lv(names: string[], steps: Step[][]): Level[] {
  return steps.map((s, i) => ({ n: i + 1, name: NAMES[i], title: names[i], steps: s }));
}

export const GAMES: Game[] = [
  {
    id: 'bodoquera',
    name: 'Bodoquera',
    short: 'Bodoquera',
    article: 'la bodoquera',
    theme: { h1: '#1e7fe5', h2: '#7ba6eb', t1: '#5ea8f0', t2: '#a5bef0', acc: '#1e7fe5', accL: '#8db8f2', press: '#1a6fd0' },
    map: 'img/mapa.jpg',
    vivencia: 'img/vivencia_bodoquera.jpg',
    origen: { title: 'La historia del viento', text: PENDIENTE('la narración de la historia del viento y el origen de la bodoquera') },
    creando: { title: 'Construcción de la bodoquera', text: PENDIENTE('el paso a paso de la construcción de la bodoquera, con sus materiales') },
    vivenciaText: VIVENCIA,
    transitions: {
      mapa: 'Acompáñame a recorrer el territorio donde nace la bodoquera.',
      origen: 'Escucha la historia del viento y descubre de dónde viene la bodoquera.',
      creando: 'Mira cómo los mayores construyen la bodoquera, paso a paso.',
      vivencia: 'Conoce por qué y para qué se juega en comunidad.',
      retosaberes: 'Pon a prueba lo que aprendiste y gana saberes en cada nivel.',
    },
    levels: lv(
      ['Conecta los saberes', 'Proceso de construcción', 'Descubre los árboles', 'Situación problema', 'Preguntas de saberes', 'Diseña tu bodoquera'],
      [
        [
          {
            kind: 'match',
            instr: 'Elige un elemento y conecta con su pareja.',
            left: ['Bodoquera', 'Territorio', 'Mayores', 'Saberes propios', 'Nuevas generaciones', 'Comunidad'],
            // POR VALIDAR: parejas correctas. En el PDF "Nuevas generaciones" aparecía repetido en ambas columnas.
            right: ['Memoria', 'Identidad', 'Transmisión de conocimientos', 'Cuidado y relación con el territorio', 'Continuidad de la cultura', 'Juegos ancestrales'],
            pairs: [5, 3, 2, 1, 4, 0],
          },
        ],
        [
          {
            kind: 'order',
            instr: 'Ordena de acuerdo al proceso de construcción de la bodoquera',
            // POR VALIDAR: orden correcto.
            items: [
              'Corte de la madera en la luna adecuada',
              'Secado y preparación de la madera',
              'Tallado del conducto interior o canal',
              'Unión de las piezas',
              'Elaboración del barniz natural',
              'Elaboración de la flecha',
            ],
          },
        ],
        [
          {
            kind: 'pick',
            instr: 'Descubre cuáles árboles se usaban para elaborar la bodoquera',
            hint: 'Toca todos los que sean correctos',
            options: ['Eucalipto', 'Árbol frutal', 'Palma', 'Costillo'],
            correct: [2, 3], // POR VALIDAR
            trees: true,
          },
          {
            kind: 'open',
            instr: 'Responde a la siguiente pregunta:',
            question: '¿Qué podría ocurrir si se utilizan materiales inadecuados para fabricar la bodoquera?',
          },
        ],
        [
          {
            kind: 'pick',
            instr: 'Lee la situación problema y elige las respuestas correctas.',
            hint: 'Puede haber más de una respuesta correcta',
            title: 'Situación',
            context:
              'Imagina que en una comunidad cada vez son menos los jóvenes que conocen la bodoquera. Los mayores todavía conservan los conocimientos para construirla y utilizarla, pero estos saberes ya casi no se comparten.',
            question: '¿Qué podría perder la comunidad si este conocimiento deja de practicarse?',
            options: [
              'El conocimiento sobre los materiales y su elaboración',
              'Una práctica que hace parte de la memoria comunitaria',
              'La posibilidad de aprender de los mayores',
              'Una forma de relacionarse con los recursos del territorio',
              'Un conocimiento que puede fortalecer la identidad cultural',
              'Nada, porque los juegos ancestrales solo sirven para divertirse',
            ],
            correct: [0, 1, 2, 3, 4],
          },
        ],
        mcqs(
          [
            ['¿Para qué se utiliza principalmente la bodoquera?', ['Para cortar madera', 'Para transportar semillas', 'Para lanzar dardos mediante el soplo', 'Para producir sonidos musicales'], 2],
            ['¿Qué elemento puede utilizarse para elaborar los dardos de la bodoquera?', ['Semillas o materiales propios del territorio', 'Vidrio', 'Metal industrial', 'Papel'], 0],
            ['¿Qué habilidades puede fortalecer la práctica de la bodoquera?', ['Únicamente la fuerza física y la visión', 'La escritura y la lectura', 'La velocidad para tomar decisiones', 'La concentración, la precisión y la coordinación'], 3],
            ['¿Por qué es importante conocer los materiales utilizados tradicionalmente para elaborar la bodoquera?', ['Permite reconocer saberes relacionados con el territorio', 'Los materiales se reemplazan por materiales industriales', 'Solamente determina el valor económico del juego', 'Porque los materiales no tienen relación con la cultura'], 0],
            ['¿Por qué la bodoquera es más que un instrumento para jugar?', ['Porque es más costosa que otros juegos', 'Porque solamente puede utilizarse en competencias', 'Reúne conocimientos sobre materiales, territorio, práctica y transmisión cultural', 'Porque requiere materiales industriales'], 2],
          ],
          'Responde correctamente las preguntas de opción múltiple',
        ),
        [
          {
            kind: 'create',
            instr: '¡Ya conoces la historia y los saberes de la bodoquera. Ahora es tu turno de crear!',
            question: '¿Cómo representarías la bodoquera desde tu territorio y tu imaginación?',
            prompt: 'Diseña tu bodoquera partiendo de los siguientes elementos:',
            detail: 'Forma de la bodoquera, elementos del territorio, colores, figuras o símbolos. Inspírate en tu comunidad, ponle un nombre y comparte una foto de tu dibujo.',
          },
        ],
      ],
    ),
  },
  {
    id: 'trompo',
    name: 'Trompo de fuete',
    short: 'Trompo',
    article: 'el trompo de fuete',
    theme: { h1: '#3a9a71', h2: '#82a679', t1: '#3a9a71', t2: '#82a679', acc: '#3f9b72', accL: '#8dbf9a', press: '#2f7f5b' },
    map: 'img/mapa_trompo.jpg',
    vivencia: 'img/vivencia_trompo.jpg',
    origen: { title: 'La historia del rayo', text: PENDIENTE('la narración de la historia del rayo y el origen del trompo de fuete') },
    creando: { title: 'Construcción del trompo de fuete', text: PENDIENTE('el paso a paso del tallado del trompo y el trenzado del fuete de cabuya') },
    vivenciaText: VIVENCIA,
    transitions: {
      mapa: 'Acompáñame a recorrer el territorio donde gira el trompo de fuete.',
      origen: 'Escucha la historia del rayo y descubre de dónde viene el trompo.',
      creando: 'Mira cómo se talla el trompo y se trenza el fuete de cabuya.',
      vivencia: 'Conoce por qué y para qué se juega el trompo en comunidad.',
      retosaberes: 'Pon a prueba lo que aprendiste del trompo de fuete.',
    },
    levels: lv(
      ['Falso o verdadero', 'Une imagen y frase', 'Situaciones problema', 'Ordena la elaboración', 'Preguntas de saberes', 'Diseña tu trompo'],
      [
        [
          {
            kind: 'tf',
            instr: 'Responde falso (F) o verdadero (V)',
            hint: '¡Selecciona la respuesta correcta!',
            items: [
              { text: '¿Antes de cortar la madera para nuestro trompo, los abuelos nos enseñan que debemos visitar a la planta y saludarla con mucho respeto y cariño?', value: true },
              { text: '¿Para evitar desarmonías futuras con las semillas niñas, se hacen ritualidades?', value: true },
              { text: '¿Cuando tomamos un pedacito de rama o madera de la montaña, no es necesario pedir permiso a la naturaleza ni a la tierra?', value: false },
              { text: '¿La medicina ancestral nos ayuda a mantener nuestro cuerpo y espíritu sanos, previniendo que nos enfermemos o nos desarmonicemos?', value: true },
            ],
          },
        ],
        [
          {
            kind: 'match',
            instr: 'Une cada frase del relato con su imagen',
            hint: '¡Relaciona cada elemento con su pareja!',
            left: [
              '“Cada vez que lo hago girar sobre la tierra, siento cómo el trueno responde en el cielo.”',
              '“Los hilos de cabuya que lo impulsan son la voz del trueno que restaura el equilibrio.”',
              '“Hoy, las mujeres también participan en este juego.”',
              '“Ellas visitan la planta con la que se elabora el trompo, realizan actos de armonización junto a las semillas.”',
              '“El trompo simboliza las desarmonías que nacen de la pereza.”',
            ],
            right: ['Planta de cabuya', 'Trueno', 'Trompo desgastado', 'Hilos de cabuya', 'Mujeres y niñas jugando'],
            pairs: [1, 3, 4, 0, 2],
          },
        ],
        [
          {
            kind: 'mcq',
            instr: 'Lee con atención cada situación problema y selecciona la opción correcta.',
            title: 'La pereza en la minga',
            context: 'Durante una minga, algunos jóvenes prefieren quedarse mirando el celular sin participar en las tareas comunitarias. En el relato de origen se propone usar el trompo de fuete como recordatorio de responsabilidad.',
            question: '¿Qué representa el giro del trompo en esta situación?',
            options: ['Un simple entretenimiento para pasar del celular al juego del trompo.', 'Un símbolo de que la pereza rompe la armonía.', 'Una competencia para ver quién gana más puntos.', 'Un objeto decorativo de la comunidad.'],
            correct: 1,
          },
          {
            kind: 'mcq',
            instr: 'Lee con atención cada situación problema y selecciona la opción correcta.',
            title: 'El trueno y el fuete',
            context: 'En una práctica, el trompo gira poco tiempo porque el fuete no fue enrollado correctamente. El dinamizador explica que el trueno responde cuando el trompo danza con fuerza.',
            question: '¿Qué enseñanza transmite este hecho?',
            options: ['Que la técnica y la cultura deben estar en equilibrio.', 'Que el trueno solo aparece en días de lluvia.', 'Que el trompo es un juguete sin importancia.', 'Que el fuete sirve únicamente para decorar.'],
            correct: 0,
          },
          {
            kind: 'mcq',
            instr: 'Lee con atención cada situación problema y selecciona la opción correcta.',
            title: 'La participación de las mujeres',
            context: 'Antes se pensaba que las mujeres no debían jugar al trompo, pero ahora ellas participan en actos de armonización y enseñan a las niñas a usarlo con respeto.',
            question: '¿Qué valor se fortalece con esta inclusión?',
            options: ['La competencia entre géneros.', 'La armonía y el respeto compartido en la comunidad.', 'La rapidez en los lanzamientos.', 'La fuerza para lanzar el trompo.'],
            correct: 1,
          },
        ],
        [
          {
            kind: 'order',
            instr: 'Ordena el paso a paso para la elaboración del trompo de madera y fuete de cabuya.',
            // POR VALIDAR: orden correcto.
            items: ['Selección del árbol', 'Corte y tratamiento de la madera', 'Tallado del trompo', 'Corte de la cabuya', 'Raspado de la cabuya', 'Secado de la cabuya', 'Trenzado del fuete'],
          },
        ],
        mcqs([
          ['¿Cuál es el material tradicional con el que se elabora el trompo de fuete?', ['Plástico', 'Madera de roble o naranjo', 'Metal', 'Piedra'], 1],
          ['¿Con qué material se fabrica actualmente el fuete?', ['Cuerda de nylon', 'Cabuya', 'Algodón', 'Lana de oveja'], 1],
          ['¿Cuál es el objetivo principal del juego del trompo de fuete?', ['Hacerlo girar el mayor tiempo posible', 'Derribar otros trompos', 'Romper el fuete', 'Lanzarlo lo más lejos posible'], 0],
          ['¿Qué simboliza el fuete dentro del juego?', ['El viento', 'El espíritu del trueno', 'La fuerza del sol', 'La voz de los mayores'], 1],
          ['¿Qué representan las partes del trompo en su forma antropomórfica?', ['Cabeza, tronco y pies', 'Brazos y piernas', 'Ojos y boca', 'Alas y cola'], 0],
        ]),
        [
          {
            kind: 'create',
            instr: '¡Ya conoces la historia y los saberes del trompo de fuete. Ahora es tu turno de crear!',
            question: '¿Cómo sería tu propio trompo y su fuete?',
            prompt: 'Diseña un nuevo trompo y su fuete:',
            detail: 'Comparte una imagen de tu creación y explica brevemente el significado simbólico de tu diseño.',
          },
        ],
      ],
    ),
  },
  {
    id: 'palmo',
    name: 'Palmo o cacha',
    short: 'Palmo',
    article: 'el palmo o cacha',
    theme: { h1: '#8f7a2c', h2: '#c7b45c', t1: '#8f7a2c', t2: '#c7b45c', acc: '#b9a145', accL: '#e3d99a', press: '#9c8536' },
    map: 'img/mapa_trompo.jpg', // POR REEMPLAZAR: mapa propio del palmo
    vivencia: 'img/vivencia_palmo.jpg',
    origen: { title: 'La historia del palmo o cacha', text: PENDIENTE('la narración del origen del palmo o cacha') },
    creando: { title: 'Construcción del palmo y la cacha', text: PENDIENTE('el paso a paso para elaborar el palmo, la cacha y el hoyo') },
    vivenciaText: VIVENCIA,
    transitions: {
      mapa: 'Acompáñame a recorrer el territorio donde se juega el palmo o cacha.',
      origen: 'Escucha la historia del palmo y descubre de dónde viene este juego.',
      creando: 'Mira cómo se elaboran el palmo, la cacha y el hoyo.',
      vivencia: 'Conoce por qué y para qué se juega el palmo en comunidad.',
      retosaberes: 'Pon a prueba lo que aprendiste del palmo o cacha.',
    },
    levels: lv(
      ['Reglas y acuerdos', 'Clasifica las tarjetas', 'Situación de turnos', 'Situación problema', 'Preguntas de saberes', 'Diseña tu palmo'],
      [
        [
          {
            kind: 'pick',
            instr: 'Identifica las reglas y acuerdos generales correctos del juego',
            hint: 'Toca todas las que sean correctas',
            options: [
              'Insertar el palmo en el hoyo o acercarlo para puntuar',
              'Lanzar desde unos 12 pasos',
              'Lanzar las veces necesarias hasta insertar el palmo',
              'Colocarse generalmente arrodillado',
              'Lanzar con los ojos vendados',
              'Dos lanzamientos consecutivos por jugador',
              'Gana el equipo que alcance 24 puntos',
              'Dos rondas; si hay empate, una tercera',
            ],
            correct: [0, 1, 3, 5, 6, 7], // POR VALIDAR
          },
        ],
        [
          {
            kind: 'classify',
            instr: 'Clasifica cada tarjeta en la columna correcta',
            hint: 'Toca una tarjeta y luego la columna donde va',
            columns: ['Elementos del juego', 'Materiales para elaboración'],
            cards: [
              { text: 'Palo principal (50 cm)', col: 0 },
              { text: 'Palo de escoba, serrucho, regla', col: 1 },
              { text: 'Palo secundario (20 cm)', col: 0 },
              { text: 'Pintura, pincel, marcadores', col: 1 },
              { text: 'Agujero (hoyo)', col: 0 },
              { text: 'Algodón, trapo, pegamento', col: 1 },
              { text: 'Libreta y lápiz', col: 0 },
              { text: 'Discos metálicos o reciclados', col: 1 },
            ],
          },
        ],
        [
          {
            kind: 'pick',
            instr: 'Selecciona las reglas correctas que deben aplicarse',
            hint: 'Puede haber más de una respuesta correcta',
            title: 'Situación',
            context: 'Dos jugadores lanzan el disco hacia el hoyo. El primero logra encestar. El segundo reclama que el primero lanzó fuera de turno. El casero anota el resultado, pero no sabe qué regla aplicar.',
            options: [
              'Respetar turnos de lanzamiento',
              'Dar el punto a quien reclame más fuerte', // distractor agregado, POR VALIDAR
              'Registrar los puntajes de manera justa',
              'Aceptar acuerdos comunitarios para resolver conflictos',
              'Terminar el juego sin anotar el resultado', // distractor agregado, POR VALIDAR
            ],
            correct: [0, 2, 3],
          },
        ],
        [
          {
            kind: 'wip',
            instr: 'Lee con atención cada situación problema y selecciona la opción correcta.',
            message: 'Este nivel se está construyendo con la comunidad. ¡Pronto podrás jugarlo! Por ahora puedes continuar al siguiente nivel.',
          },
        ],
        mcqs([
          ['¿Por qué es importante respetar los turnos en el palmo o cacha?', ['Para evitar discusiones y mantener la armonía en el juego.', 'Para que el juego sea más rápido.', 'Porque permite que todos ganen al mismo tiempo.', 'Porque no tiene importancia en la tradición.'], 0],
          ['Si un jugador lanza dos piedras al mismo tiempo, según las reglas, ¿qué debería hacerse?', ['Se repite el turno.', 'Se anula el lanzamiento.', 'Se suman los puntos igual.', 'Se cambia de juego.'], 1],
          ['¿Qué tienen en común el tejo y el palmo o cacha?', ['Se juegan con cartas.', 'Usan discos o piedras pesadas.', 'No requieren reglas.', 'Son juegos únicamente individuales.'], 1],
          ['¿Cuál de estas prácticas fortalece más la identidad cultural en estos juegos?', ['Jugar en las mingas, el mercado y los espacios comunitarios.', 'Jugar sin respetar las reglas.', 'Ignorar las orientaciones espirituales.', 'No registrar los puntajes.'], 0],
          ['¿Cuál es el objetivo principal del juego de palmo o cacha?', ['Encestar el disco en el hoyo.', 'Golpear el palo secundario.', 'Dibujar figuras en la tierra.', 'Lanzar piedras al aire.'], 0],
          ['Si quisieras inventar una variante del palmo, ¿cuál sería la mejor propuesta?', ['Cambiar el disco por una pelota ligera.', 'Eliminar el hoyo del juego.', 'Jugar sin turnos ni reglas.', 'Usar materiales reciclados para crear nuevos discos.'], 3],
        ]),
        [
          {
            kind: 'create',
            instr: '¡Ya conoces la historia y los saberes del palmo o cacha. Ahora es tu turno de crear!',
            question: '¿Cómo sería tu propio juego de palmo o cacha?',
            prompt: 'Diseña tu palmo, tu cacha y el hoyo:',
            detail: 'Comparte una imagen de tu creación y explica brevemente el significado simbólico de tu diseño.',
          },
        ],
      ],
    ),
  },
  {
    id: 'zumbambico',
    name: 'Zumbambico',
    short: 'Zumbambico',
    article: 'el zumbambico',
    theme: { h1: '#8a5f30', h2: '#c39a62', t1: '#8a5f30', t2: '#c39a62', acc: '#b88a56', accL: '#e6cfa0', press: '#8f6534' },
    map: 'img/mapa_trompo.jpg', // POR REEMPLAZAR
    vivencia: 'img/vivencia_zumbambico.jpg',
    origen: { title: 'La historia del zumbambico', text: PENDIENTE('la narración de la historia del zumbambico y del espíritu del viento') },
    creando: { title: 'Construcción del zumbambico', text: PENDIENTE('el paso a paso para construir el zumbambico con semilla, guasca y guadua') },
    vivenciaText: VIVENCIA,
    transitions: {
      mapa: 'Acompáñame a recorrer el territorio donde el viento hace sonar el zumbambico.',
      origen: 'Escucha la historia del zumbambico y del espíritu del viento.',
      creando: 'Mira cómo se construye el zumbambico con semilla, guasca y guadua.',
      vivencia: 'Conoce por qué y para qué se juega el zumbambico en comunidad.',
      retosaberes: 'Pon a prueba lo que aprendiste del zumbambico.',
    },
    levels: lv(
      ['Partes del zumbambico', 'Ordena la construcción', 'Escucha el sonido', 'Historia y aporte cultural', 'Preguntas de saberes', 'Diseña tu zumbambico'],
      [
        [
          {
            kind: 'label',
            instr: 'Ubica el nombre de cada parte sobre la imagen correspondiente.',
            hint: 'Toca un nombre y luego el número donde va',
            parts: ['Semilla de yolombó o “pepo”', 'Base de madera', 'Guasca', 'Soporte de guadua'], // POR VALIDAR: ubicación de cada parte
          },
        ],
        [
          {
            kind: 'order',
            instr: 'Ordena de acuerdo al proceso de construcción del zumbambico',
            // POR VALIDAR: orden correcto.
            items: ['Armonización espiritual', 'Selección de la madera', 'Elaboración del zumbambico', 'Decoración y preparación', 'Prueba del sonido', 'Inicio del juego'],
          },
        ],
        [
          {
            kind: 'audio',
            instr: 'Toca cada ícono y escucha. ¿Cuál es el sonido del zumbambico?',
            hint: '¡Reproduce los sonidos las veces que lo requieras!',
            count: 4,
            correct: 2, // POR VALIDAR con los audios reales
          },
          { kind: 'open', instr: 'Responde las siguientes preguntas', question: '¿Por qué es importante que el zumbambico produzca su sonido?' },
          { kind: 'open', instr: 'Responde las siguientes preguntas', question: '¿Qué nos enseña este canto?', canto: true },
        ],
        [
          {
            kind: 'pick',
            instr: 'Problematiza el aporte cultural del zumbambico',
            hint: 'Toca todas las que sean correctas',
            title: 'Historia',
            context: '“En una comunidad los niños han dejado de jugar al zumbambico y los mayores están preocupados porque sus enseñanzas pueden desaparecer.”',
            question: '¿Qué se perdería si desaparece el juego?',
            options: [
              'La relación con el Espíritu del Viento',
              'Las enseñanzas de los abuelos',
              'Nada, porque es solo un juguete', // distractor agregado, POR VALIDAR
              'La lectura de las nubes y las aves',
              'La memoria cultural',
            ],
            correct: [0, 1, 3, 4],
          },
          { kind: 'open', instr: 'Lee, analiza y responde', question: '¿Qué harías para que el zumbambico se siga practicando en tu comunidad?' },
        ],
        mcqs([
          ['¿Qué habilidad se fortalece principalmente al jugar zumbambico?', ['Coordinación y movimiento', 'La lectura rápida', 'La escritura', 'La memorización de números'], 0],
          ['¿Por qué es importante conservar juegos como el zumbambico?', ['Reemplazan todas las actividades escolares', 'Solamente sirven para competir', 'Permiten mantener viva la memoria y los saberes propios', 'Son juegos exclusivamente individuales'], 2],
          ['¿Qué elemento natural está principalmente relacionado con el movimiento del zumbambico?', ['El fuego', 'El viento', 'La montaña', 'La luna'], 1],
          ['¿Qué puede aprender una nueva generación mediante el zumbambico?', ['Solamente a fabricar objetos', 'Saberes y prácticas culturales, como relacionarse con el territorio', 'Historias y reglas de competencia únicamente', 'Solamente conceptos matemáticos'], 1],
          ['Cuando el zumbambico gira impulsado por el viento, ¿qué saber puede reconocerse en esta relación?', ['La relación entre los elementos de la naturaleza y la vida comunitaria', 'La separación entre naturaleza y cultura', 'El dominio de la naturaleza por las personas', 'La relación entre los conocimientos prácticos y la vida'], 0],
        ]),
        [
          {
            kind: 'create',
            instr: '¡Ya conoces la historia y los saberes del zumbambico. Ahora es tu turno de crear!',
            question: 'Diseña tu propio zumbambico: ¿qué forma, colores y símbolos tendría?',
            detail: 'Cuéntalo, dibújalo y comparte una foto, o grábalo.',
          },
        ],
      ],
    ),
  },
];

export const gameById = (id: string) => GAMES.find((g) => g.id === id)!;

export const PUEBLOS = ['Nasa', 'Misak', 'Kokonuko', 'Totoró', 'Yanakuna', 'Polindara', 'Ambaló', 'Kishu', 'Inga', 'Eperara Siapidara', 'Otro pueblo'];
export const ROLES = ['Estudiante', 'Docente', 'Familia', 'Sabedor o sabedora']; // POR VALIDAR
export const NICKNAMES = ['Colibrí Azul', 'Semilla del Viento', 'Puntería Fina', 'Caminante del Río', 'Guardiana del Agua', 'Tejedor de Saberes', 'Sol de la Montaña', 'Viento del Páramo'];
export const AVATAR_COUNT = 21;
export const avatarSrc = (n: number) => `img/avatares/avatar_${String(n).padStart(2, '0')}.svg`;

export const SAMPLE_POSTS = [
  { id: 's1', author: 'Puntería Fina', pueblo: 'Misak', avatar: 6, text: 'Hoy jugamos bodoquera en la minga. Mi abuelo nos enseñó a escoger la madera.', game: 'Bodoquera', likes: 12 },
  { id: 's2', author: 'Semilla del Viento', pueblo: 'Nasa', avatar: 12, text: 'Trenzamos el fuete con cabuya. ¡El trompo bailó un buen rato!', game: 'Trompo de fuete', likes: 9 },
  { id: 's3', author: 'Guardiana del Agua', pueblo: 'Kokonuko', avatar: 19, text: 'Compartí mi dibujo del trompo con los colores de mi territorio.', game: 'Memoria', likes: 15 },
];

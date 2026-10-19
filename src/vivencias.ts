// Contenido de la sección Vivencia, tomado de la "Guía de reglas y acuerdos".
// null = contenido por definir con la comunidad.
import type { GameId } from './data';

export type Paso = { fase: string; items: string[] | null };

export type Guia = {
  proposito: string[];
  orientaciones: string[];
  rituales?: { intro: string; items: string[]; cierre: string };
  simbolos?: { cosa: string; significa: string }[];
  reglas: string[];
  necesitas: string[];
  pasos: Paso[];
  recomendaciones: string[] | null;
  porValidar?: string;
};

const ANTES = { fase: 'Antes de jugar', items: ['Respetar y vivenciar las orientaciones espirituales.'] };

export const GUIAS: Record<GameId, Guia> = {
  bodoquera: {
    proposito: [
      'La práctica comunitaria de este juego representa una forma de medir y exhibir destrezas y habilidades, como la concentración y la precisión o puntería, de manera diferente a las que plantea la cultura dominante, pues con las actividades colectivas comunitarias, las semillas aprenden, comparten experiencias y se integran social y culturalmente.',
    ],
    // POR VALIDAR: en la guía este texto es el mismo del zumbambico.
    orientaciones: [
      'Nuestros mayores lo utilizaban como forma de llamar al Espíritu Mayor del viento para que se llevara las malas energías de la persona, como a las nubes.',
      'A su paso toca con su cuerpo ligero árboles y pieles de hombres y animales, manifestándose como un espíritu juguetón.',
      'Desde hace mucho tiempo atrás ha sido una forma de relacionarnos con los seres que tenemos alrededor y, como práctica de herencia familiar, es un juego que dinamiza y fortalece los vínculos entre abuelos y nietos.',
    ],
    porValidar: 'Las orientaciones de la bodoquera se están revisando con la comunidad.',
    reglas: ['La bodoquera fue un instrumento para la cacería y para la defensa durante la invasión española; una forma de subsistencia que utilizaban los mayores.'],
    necesitas: ['Bodoquera', 'Dardos de palma', 'Blanco de tiro'],
    pasos: [
      ANTES,
      { fase: 'Organizar', items: ['Organizar equipos y acordar cuántos lanzamientos por turno.', 'Determinar el número de turnos por jugador u objetivos alcanzados por ronda.'] },
      { fase: 'Empezar a jugar', items: null },
      { fase: 'Puntaje y registro', items: null },
      { fase: 'Fin del juego', items: null },
    ],
    recomendaciones: null,
  },
  zumbambico: {
    proposito: [
      'Este juego mantiene viva la memoria y la relación con el espíritu del viento para armonizar el territorio y mantener el equilibrio.',
      'Con su práctica, los mayores enseñan a interpretar el significado de las nubes y el canto de las aves que auguran desarmonías para el territorio.',
    ],
    orientaciones: [
      'Nuestros mayores lo utilizaban como forma de llamar al Espíritu Mayor del viento para que se llevara las malas energías de la persona, como a las nubes, pues el zumbambico simboliza el cuerpo propio.',
      'A su paso toca con su cuerpo ligero árboles y pieles de hombres y animales, manifestándose como un espíritu juguetón.',
      'Desde hace mucho tiempo atrás ha sido una forma de relacionarnos con los seres que tenemos alrededor y, como práctica de herencia familiar, es un juego que dinamiza y fortalece los vínculos entre abuelos y nietos.',
    ],
    reglas: [
      'El objetivo de esta actividad es producir un sonido fuerte y agudo y, al mismo tiempo, mantener el zumbambico girando durante un tiempo prolongado.',
      'El juego contribuye a perfeccionar la claridad sonora de cada semilla y a mejorar la atención en público.',
    ],
    necesitas: ['Zumbambico', 'Soporte de carrizo de 15 cm', 'Guasca o cuerda delgada de 1 metro'],
    pasos: [
      ANTES,
      { fase: 'Organizar', items: ['Organizar equipos y acordar cuántos lanzamientos por turno.', 'Determinar el número de turnos por jugador u objetivos alcanzados por ronda.'] },
      { fase: '¿Cómo se juega?', items: ['Enrollar la guasca en el palo del zumbambico.', 'Apoyarse en una tabla.', 'Lanzar el zumbambico con fuerza desde una altura aproximada de 20 cm.'] },
      { fase: 'Observar', items: ['Observar el tiempo de giro, la estabilidad y el sonido producido.'] },
    ],
    recomendaciones: ['Es importante tomar nota atenta del tiempo de giro, la estabilidad y el sonido del zumbambico, hacer una tabla de puntuaciones y un tablero para llevar el registro.'],
  },
  trompo: {
    proposito: [
      'El trompo de fuete evoca en la memoria de los mayores la conexión con el mundo espiritual; simboliza las desarmonías provocadas por la pereza. Para restaurar el equilibrio, el espíritu del trueno resuena como un llamado de atención para aquellos que han descuidado sus responsabilidades.',
      'De este modo, el trompo representa a la persona perezosa, mientras que los hilos de cabuya encarnan el espíritu del trueno. Cada vez que se hace girar el trompo, se envía un mensaje simbólico a la comunidad: es momento de dejar de lado la pereza, o de lo contrario, enfrentarán las consecuencias del espíritu del trueno, que al retumbar en el cielo está instando a un comunero a actuar en alguna parte del territorio.',
      'La práctica comunitaria de este juego representa una forma de medir y exhibir destrezas y habilidades, como la concentración y la precisión o puntería, de manera diferente a las que plantea la cultura dominante, pues con las actividades colectivas comunitarias, las semillas aprenden, comparten experiencias y se integran social y culturalmente.',
    ],
    orientaciones: [
      'El trompo de fuete está profundamente vinculado a prácticas rituales que garantizan la armonía espiritual y el equilibrio dentro de la comunidad.',
      'En la tradición, las mujeres no participaban en este juego debido a su rol en la crianza, pues se consideraba que podían hacer un uso inadecuado del “remedio del fuete”. Sin embargo, en la actualidad esta situación ha cambiado mediante procesos de armonización que permiten su participación.',
    ],
    rituales: {
      intro: 'Los principales rituales incluyen:',
      items: [
        'Visita a la planta con la que se elaborará el trompo.',
        'Actos de armonización junto a las semillas.',
        'Solicitud de permiso a la naturaleza.',
        'Prácticas desde la medicina tradicional para prevenir desarmonías.',
      ],
      cierre: 'Una vez completados estos procesos, se hace entrega del trompo y el fuete, integrando a las niñas en la práctica de manera equilibrada y respetuosa.',
    },
    simbolos: [
      { cosa: 'El trompo', significa: 'representa a la persona perezosa' },
      { cosa: 'El fuete', significa: 'simboliza el espíritu del trueno' },
    ],
    reglas: [
      'El juego consiste en hacer bailar el trompo el mayor tiempo posible, manteniéndolo en movimiento mediante el uso del fuete de cabuya trenzada y desplazándose de un lugar a otro.',
      'Si el trompo deja de bailar, el participante debe reiniciar desde el punto de partida.',
    ],
    necesitas: ['Trompo de madera de roble, naranjo o galve', 'Fuete de cabuya trenzada'],
    pasos: [
      {
        fase: 'Antes de jugar',
        items: [
          'Golpear en la cabeza provoca la caída del trompo.',
          'Golpear en los pies también lo desestabiliza.',
          'Golpear en la parte media del cuerpo permite impulsarlo y sostener su movimiento.',
        ],
      },
      { fase: 'Cómo se juega', items: ['Determinar el número de turnos por jugador y objetivos alcanzados por ronda.', 'Definir los recorridos.'] },
      { fase: 'Empezar a jugar', items: ['Hacer bailar el trompo el mayor tiempo posible con el fuete de cabuya trenzada, desplazándose de un lugar a otro.', 'Si el trompo deja de bailar, reiniciar desde el punto de partida.'] },
      { fase: 'Fin del juego', items: ['Gana quien más tiempo haga bailar el trompo y complete los recorridos acordados.'] },
    ],
    recomendaciones: null,
  },
  palmo: {
    proposito: [
      'Fortalece la concentración, la comunicación y la interacción entre jugadores, la fuerza física, la puntería y la integración grupal.',
      'Cada jugador adquiere destrezas específicas durante el juego.',
    ],
    orientaciones: ['Se practica en diversos momentos y espacios comunitarios. Es habitual después de las mingas y en los días de mercado en los territorios.'],
    reglas: [],
    necesitas: [
      'Palmo: disco plano de piedra, metal o madera reciclada, de cerca de 1 libra',
      'Palo principal de 50 cm, enterrado en la tierra',
      'Palo secundario de 20 cm para medir distancias',
      'Hoyo excavado en el suelo',
      'Libreta y lápiz para registrar los puntos',
    ],
    pasos: [
      ANTES,
      {
        fase: '¿Cómo se juega?',
        items: [
          'Se forman equipos y se eligen capitanes.',
          'Cada jugador lanza el palmo hacia una línea marcada.',
          'Se busca acercarlo o embocarlo en el hoyo.',
          'Los equipos juegan por turnos; cada jugador realiza dos lanzamientos consecutivos.',
          'Se lanza desde una distancia aproximada de 12 pasos.',
        ],
      },
      {
        fase: 'Puntajes',
        items: [
          'Inicia el equipo cuyo palmo queda más cerca.',
          'Gana el equipo que alcanza 24 puntos.',
          'Se juegan dos rondas; si hay empate, se realiza una tercera.',
          'El casero registra los puntos en una libreta.',
        ],
      },
    ],
    recomendaciones: ['Los acuerdos pueden adaptarse según el contexto cultural de cada comunidad.'],
  },
};

import { LongCategory, CodeLanguage } from '../types';

export interface ShortQuote {
  id: string;
  author: string;
  category: 'wisdom' | 'technology' | 'philosophy' | 'motivation';
  text: string;
}

export interface LongPassage {
  id: string;
  title: string;
  category: LongCategory;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  approxWordCount: number;
  text: string;
  sourceOrAuthor: string;
}

export interface CodeExercise {
  id: string;
  title: string;
  language: CodeLanguage;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  code: string;
}

export const COMMON_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I',
  'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his', 'by',
  'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would',
  'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into',
  'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
  'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
  'most', 'us', 'great', 'between', 'need', 'large', 'under', 'never', 'life', 'always', 'speed',
  'finger', 'keyboard', 'screen', 'practice', 'focus', 'accuracy', 'steady', 'rhythm', 'master'
];

export const SHORT_QUOTES: ShortQuote[] = [
  {
    id: 'sq-1',
    author: 'Steve Jobs',
    category: 'technology',
    text: 'The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle.'
  },
  {
    id: 'sq-2',
    author: 'Albert Einstein',
    category: 'wisdom',
    text: 'Life is like riding a bicycle. To keep your balance, you must keep moving. Strive not to be a success, but rather to be of value.'
  },
  {
    id: 'sq-3',
    author: 'Marcus Aurelius',
    category: 'philosophy',
    text: 'You have power over your mind, not outside events. Realize this, and you will find strength. The soul becomes dyed with the color of its thoughts.'
  },
  {
    id: 'sq-4',
    author: 'Alan Kay',
    category: 'technology',
    text: 'The best way to predict the future is to invent it. Simple things should be simple, complex things should be possible.'
  },
  {
    id: 'sq-5',
    author: 'Aristotle',
    category: 'motivation',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit. Quality is not an act, it is a habit.'
  },
  {
    id: 'sq-6',
    author: 'Grace Hopper',
    category: 'technology',
    text: 'The most dangerous phrase in the language is, We have always done it this way. A ship in port is safe, but that is not what ships are built for.'
  },
  {
    id: 'sq-7',
    author: 'Seneca',
    category: 'philosophy',
    text: 'Luck is what happens when preparation meets opportunity. Difficulties strengthen the mind, as labor does the body.'
  },
  {
    id: 'sq-8',
    author: 'Linus Torvalds',
    category: 'technology',
    text: 'Talk is cheap. Show me the code. Most good programmers do programming not because they expect to get paid, but because it is fun to program.'
  }
];

export const LONG_PASSAGES: LongPassage[] = [
  {
    id: 'lp-tech-1',
    title: 'The Evolution of Computing & The Mechanical Keyboard',
    category: 'technology',
    difficulty: 'Medium',
    approxWordCount: 310,
    sourceOrAuthor: 'Tech Heritage Archives',
    text: `Before glowing high-resolution displays and thin glass touchscreens, computing was tactile, noisy, and physical. In the late nineteenth century, Christopher Latham Sholes patented the QWERTY typewriter layout to prevent physical metal mechanical typebars from colliding when neighboring keys were struck in rapid succession. As machines evolved into electronic terminals and desktop microcomputers, the tactile sensation of a physical key bottoming out against a spring became the heartbeat of human-machine interaction.

In modern times, touch typing is both an art form and a foundational digital superpower. Whether you are drafting a critical research paper, writing millions of lines of distributed systems code, or executing complex administrative tasks, typing with precision frees your conscious mind. Instead of scanning the keyboard with your eyes, your fingers rely entirely on muscle memory, instinctively resting upon the home row keys F and J with their subtle tactile bumps.

Practicing both short bursts and lengthy multi-page essays trains your nervous system in distinct ways. Short speed tests build raw neuromuscular velocity and peak fingerspeed, whereas extended long-form typing conditions stamina, mental endurance, and rhythm. Maintaining ninety-eight percent accuracy over thousands of consecutive words is the hallmark of a true master typist.`
  },
  {
    id: 'lp-sci-1',
    title: 'Neural Plasticity & The Science of Muscle Memory',
    category: 'science',
    difficulty: 'Advanced',
    approxWordCount: 295,
    sourceOrAuthor: 'Cognitive Neuroscience Review',
    text: `When an untrained individual sits before a computer keyboard, the brain engages heavy cognitive machinery. The visual cortex locates each key, the prefrontal cortex deliberately plans the motor response, and the motor cortex executes the physical finger stroke. This hunt-and-peck approach consumes excessive mental bandwidth and results in sluggish, inconsistent typing speeds under thirty words per minute.

However, continuous deliberate practice triggers neuroplastic adaptations. As the fingers repeat key combinations like the, and, ing, and tion, the cerebellum and basal ganglia take over movement execution. The motor sequences become consolidated into automatic motor chunks. Once a movement sequence reaches automaticity, it requires minimal conscious attention. The typist simply thinks the word, and their hands instinctively perform the intricate symphony of keystrokes.

Scientific studies reveal that top-tier touch typists exhibit lookahead behavior. While typing the current word, their eyes are already scanning several words ahead in the sentence. This predictive visual buffer enables seamless transitions between letters without pauses or abrupt deceleration, sustaining fluid cadence even through complex punctuation and uncommon vocabulary.`
  },
  {
    id: 'lp-lit-1',
    title: 'The Secret Room in the Old Lighthouse',
    category: 'story',
    difficulty: 'Easy',
    approxWordCount: 280,
    sourceOrAuthor: 'Original Narrative',
    text: `A salty coastal breeze swept across the jagged cliffs as dusk settled over the bay. For three generations, the old stone lighthouse had guided weathered fishing trawlers away from treacherous granite reefs. Arthur climbed the spiral iron staircase, his boots echoing rhythmically against the stone walls. At the lantern deck, an unusual draft brushed past his shoulder, coming not from the glass windows, but from beneath a weathered oak bookcase.

Curiosity piqued, Arthur pulled back the heavy pine shelf to reveal a brass door handle that had remained undisturbed for decades. Inside lay a compact study smelling of aged parchment, brass polishing oil, and cedarwood. On the mahogany desk rested an immaculate leather journal, beside a brass chronometer that was still ticking with rhythmic precision.

The handwritten entries detailed the untold adventures of sea captains who sailed across uncharted waters in pursuit of celestial constellations. As Arthur traced the elegant ink strokes across the yellowed pages, he realized that the keeper of the beacon had preserved not only the light for passing ships, but also the forgotten histories of maritime explorers.`
  },
  {
    id: 'lp-hist-1',
    title: 'The Apollo Moon Landing: One Giant Leap',
    category: 'history',
    difficulty: 'Medium',
    approxWordCount: 275,
    sourceOrAuthor: 'Historical Chronicles',
    text: `On July 20, 1969, hundreds of millions of people around the globe gathered around cathode-ray television sets to witness one of the most audacious milestones in human civilization. Four days after lifting off from the Kennedy Space Center atop the colossal Saturn V rocket, the lunar module Eagle detached from the command module and descended toward the Sea of Tranquility.

As the spacecraft approached the cratered lunar surface, alarms flashed on the computer display, warning of computational overload. With fuel reserves dwindling to less than a minute of burn time, commander Neil Armstrong took manual control, steering past a boulder-strewn crater to gently touch down upon the powdery gray regolith.

Armstrong announced to mission control in Houston, Texas, that the Eagle had landed. Hours later, he descended the ladder and placed his left boot upon the pristine surface, proclaiming words that will echo through centuries: That is one small step for man, one giant leap for mankind. The mission proved that human ingenuity, perseverance, and unity could conquer the most formidable frontiers of the cosmos.`
  },
  {
    id: 'lp-lit-2',
    title: 'Classic Literature: The Great Gatsby Excerpt',
    category: 'literature',
    difficulty: 'Advanced',
    approxWordCount: 260,
    sourceOrAuthor: 'F. Scott Fitzgerald (Public Domain)',
    text: `In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since. Whenever you feel like criticizing anyone, he told me, just remember that all the people in this world haven not had the advantages that you have had.

He didn not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I am inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.

The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men. Most of the confidences were unsought; frequently I have feigned sleep, preoccupation, or a hostile levity when I realized by some unmistakable sign that an intimate revelation was quivering on the horizon.`
  }
];

export const CODE_EXERCISES: CodeExercise[] = [
  {
    id: 'code-js-1',
    title: 'JavaScript: Debounce Function & Event Optimization',
    language: 'javascript',
    difficulty: 'Intermediate',
    code: `function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`
  },
  {
    id: 'code-py-1',
    title: 'Python: Binary Search Algorithm',
    language: 'python',
    difficulty: 'Beginner',
    code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
  },
  {
    id: 'code-ts-1',
    title: 'TypeScript: Generic Cache with TTL',
    language: 'typescript',
    difficulty: 'Advanced',
    code: `interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache<K extends string, V> {
  private store = new Map<K, CacheItem<V>>();

  set(key: K, value: V, ttlMs: number): void {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
  }

  get(key: K): V | null {
    const item = this.store.get(key);
    if (!item || Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }
}`
  },
  {
    id: 'code-html-1',
    title: 'HTML & CSS: Responsive Card Component',
    language: 'html',
    difficulty: 'Beginner',
    code: `<article class="card">
  <div class="card-header">
    <h3 class="title">Typing Mastery</h3>
    <span class="badge">Pro Level</span>
  </div>
  <p class="description">Elevate your typing velocity today.</p>
  <button type="button" class="btn-primary">Start Sprint</button>
</article>`
  }
];

export function generateRandomWords(count: number, includePunctuation: boolean = false, includeNumbers: boolean = false): string {
  const words: string[] = [];
  const punctuationMarks = ['.', ',', ';', '!', '?'];

  for (let i = 0; i < count; i++) {
    let word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];

    if (includeNumbers && Math.random() < 0.15) {
      word = String(Math.floor(Math.random() * 900) + 10);
    } else {
      if (includePunctuation && Math.random() < 0.2) {
        const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
        word += mark;
      }
      if (includePunctuation && (i === 0 || words[i - 1]?.endsWith('.'))) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
    }

    words.push(word);
  }

  return words.join(' ');
}

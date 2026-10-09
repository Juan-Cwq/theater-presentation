import type { Frame } from "./types";

/**
 * The script. Texts are taken verbatim from the chapter presentation
 * "From The Black Crook to Hamilton: The Story of the American Musical Theatre".
 * Durations target a 3–5 minute total run in auto-play mode.
 */
export const FRAMES: Frame[] = [
  {
    id: "frame-1",
    n: 1,
    year: "1866–2015",
    transition: "curtain",
    act: "overture",
    kicker: "Chapter 9 · Theatre Appreciation",
    title: "From The Black Crook to Hamilton",
    layout: "hero",
    milestone: "1866 → 2015",
    blocks: {
      subtitle: "The Story of the American Musical Theatre",
      presenter: "Juan Cors",
    },
    reveals: 2,
    duration: 16000,
    notes:
      "Welcome! My chapter is Chapter 9, The American Musical Theatre. In the next few minutes we'll travel from a sexy 1866 spectacle called The Black Crook all the way to Hamilton, and see how the musical grew from pure entertainment into one of America's most serious and most popular art forms.",
  },
  {
    id: "frame-2",
    n: 2,
    year: "2000s",
    transition: "rise",
    act: "overture",
    kicker: "The Paradox",
    title: "Nobody Bursts Into Song…",
    layout: "statement-stat",
    blocks: {
      statement:
        "Real people don't break into song mid-sentence, or dance in perfect unison down the street.",
      body: "The musical is completely antirealistic. Yet it's one of the most popular theatre forms on Earth, and America turned it into an art form all its own.",
      stat: {
        value: "80%",
        label:
          "of Broadway's box-office income has come from musicals over the past two decades",
      },
      subStat: "9 musicals have won the Pulitzer Prize",
    },
    reveals: 3,
    duration: 22000,
    notes:
      "Let's be honest: people don't suddenly burst into song in real life. The musical is totally antirealistic. And yet, over the past two decades, up to 80 percent of Broadway's box-office income has come from musicals alone, and nine musicals have even won the Pulitzer Prize. So how did we get here?",
  },
  {
    id: "frame-3",
    n: 3,
    year: "500 BC",
    transition: "iris",
    act: "act1",
    kicker: "2,500 Years of Song",
    title: "Theatre Has Always Sung",
    layout: "icon-cards",
    blocks: {
      cards: [
        {
          icon: "Landmark",
          label: "Greece",
          text: "Aristotle called music the fifth element of tragedy; the chorus danced to the aulos flute.",
        },
        {
          icon: "Feather",
          label: "Shakespeare",
          text: "25 of his 38 plays include singing. The Tempest alone has nine songs.",
        },
        {
          icon: "Crown",
          label: "Molière",
          text: "Wrote comédie-ballets for King Louis XIV, with mini-operas closing each act.",
        },
        {
          icon: "Globe",
          label: "Asia",
          text: "Virtually every major Asian dramatic form blends singing, dance, and music.",
        },
      ],
    },
    reveals: 4,
    duration: 22000,
    notes:
      "First, music isn't new to drama. Aristotle listed music as the fifth element of tragedy, and the Greek chorus sang and danced. Twenty-five of Shakespeare's thirty-eight plays include songs. Molière wrote comedy-ballets for Louis the Fourteenth, and nearly every major Asian theatre form is built on song and dance.",
  },
  {
    id: "frame-4",
    n: 4,
    year: "1866",
    transition: "leaves",
    act: "act1",
    kicker: "1860s – 1900s",
    title: "Broadway Is Born",
    layout: "timeline",
    milestone: "1866",
    blocks: {
      nodes: [
        {
          year: "1866",
          title: "The Black Crook",
          text: "A plain melodrama plus a stranded French dance troupe becomes America's first true musical.",
        },
        {
          year: "1879",
          title: "Pirates of Penzance",
          text: "Gilbert & Sullivan premiere it in New York, proving musicals can tell a story.",
        },
        {
          year: "1898",
          title: "Bob Cole's Black Musical",
          text: "A full-length comedy by African Americans draws mixed-race crowds.",
        },
        {
          year: "1904",
          title: "Little Johnny Jones",
          text: "George M. Cohan gives us \u201CGive My Regards to Broadway.\u201D",
        },
      ],
    },
    reveals: 4,
    duration: 26000,
    notes:
      "The Broadway musical has roots in nineteenth-century extravaganzas, vaudeville, and burlesque. In 1866, producers added a stranded French dance company to a dull melodrama called The Black Crook, and it became what we now call America's first true musical. Gilbert and Sullivan premiered The Pirates of Penzance in New York, Bob Cole's all-Black musical comedy packed mixed-race houses, and George M. Cohan gave us Give My Regards to Broadway.",
  },
  {
    id: "frame-5",
    n: 5,
    year: "1920s",
    transition: "shutter",
    act: "act2",
    kicker: "1900s – 1930s",
    title: "Musical Comedy Takes Over",
    layout: "wide-crimson",
    blocks: {
      wide: {
        title: "Midtown: The Hit Factory",
        names: "The Gershwins, Jerome Kern, Cole Porter, Rodgers & Hart",
        body: "Simple plots, chorus girls, and songs with little connection to the story. The shows were silly, but the songs, like \u201CEmbraceable You\u201D and \u201CThe Lady Is a Tramp,\u201D became jazz standards.",
      },
      crimson: {
        title: "Harlem's Heat",
        stat: {
          value: "500+",
          label:
            "performances for Shuffle Along (1921), the first Black musical to rule a whole Broadway season",
        },
        extra: "1923: Runnin' Wild sparks the national Charleston craze",
      },
    },
    reveals: 2,
    duration: 24000,
    notes:
      "In the 1920s and 30s, musical comedy ruled. The Gershwins, Cole Porter, and Rodgers and Hart wrote shows with simple plots and songs that barely connected to the story. But those songs became jazz standards. Meanwhile, Shuffle Along ran over five hundred performances in 1921, and Black musicals launched the Charleston craze across the country.",
  },
  {
    id: "frame-6",
    n: 6,
    year: "1927",
    transition: "unfold",
    act: "act2",
    kicker: "The Golden Age Begins",
    title: "The Musical Grows Up",
    layout: "year-columns",
    milestone: "1927",
    blocks: {
      columns: [
        {
          year: "1927",
          title: "Show Boat",
          text: "Kern & Hammerstein's serious story, carried by song, confronted race relations in America.",
        },
        {
          year: "1932",
          title: "Of Thee I Sing",
          text: "The Gershwins' political satire becomes the first musical to win the Pulitzer Prize.",
        },
        {
          year: "1943",
          title: "Oklahoma!",
          text: "Agnes de Mille's ballets moved the plot forward instead of just decorating it.",
        },
      ],
    },
    reveals: 3,
    duration: 24000,
    notes:
      "Then the musical grew up. Show Boat in 1927 told a serious story through its music and tackled race relations head-on. In 1932, Of Thee I Sing became the first musical to win the Pulitzer Prize. And in 1943, Oklahoma! used Agnes de Mille's choreography to actually move the plot forward. The golden age had arrived.",
  },
  {
    id: "frame-7",
    n: 7,
    year: "1943",
    transition: "flip",
    act: "act2",
    kicker: "1940s – 1960s",
    title: "Big Songs, Big Issues",
    layout: "flip-tiles",
    blocks: {
      tiles: [
        { name: "Carousel", issue: "Spousal abuse" },
        { name: "South Pacific", issue: "Racial prejudice" },
        { name: "The King and I", issue: "Gender prejudice" },
        { name: "The Sound of Music", issue: "The rise of Nazism" },
        { name: "West Side Story", issue: "Romeo & Juliet amid NYC gang rivalry" },
        { name: "Fiddler on the Roof", issue: "Jewish life in tsarist Russia" },
      ],
      footer:
        "Hits ran for years, tickets sold six months ahead, and Broadway tunes topped the radio hit parade.",
    },
    reveals: 2,
    duration: 26000,
    notes:
      "Rodgers and Hammerstein followed with hit after hit, each tackling a real issue: spousal abuse in Carousel, racial prejudice in South Pacific, the rise of Nazism in The Sound of Music. Bernstein and Sondheim's West Side Story reset Romeo and Juliet in New York. These shows ran for years, tickets sold six months in advance, and their songs topped the radio charts.",
  },
  {
    id: "frame-8",
    n: 8,
    year: "1975",
    transition: "zoom-focus",
    act: "act3",
    kicker: "The Choreographer-Directors",
    title: "Dance Takes Command",
    layout: "stat-panel-list",
    milestone: "1975",
    blocks: {
      stat: {
        value: "6,137",
        label:
          "performances of A Chorus Line (1975), a musical about musicals that ran 15 years",
      },
      list: [
        {
          name: "Jerome Robbins",
          text: "Street-rumble dances of West Side Story; directed Fiddler",
        },
        { name: "Bob Fosse", text: "Jerky-to-sinuous moves, bowler hats: Chicago" },
        {
          name: "Michael Bennett",
          text: "Conceived, staged, and choreographed A Chorus Line",
        },
        {
          name: "Susan Stroman",
          text: "The Producers, a record-shattering 12 Tony Awards",
        },
      ],
    },
    reveals: 5,
    duration: 26000,
    notes:
      "In the contemporary era, choreographers took the director's chair. Jerome Robbins created the street-fight dances of West Side Story. Bob Fosse's sharp, sultry style defined Chicago. Michael Bennett's A Chorus Line ran fifteen years and 6,137 performances. And Susan Stroman's The Producers won a record-shattering twelve Tony Awards.",
  },
  {
    id: "frame-9",
    n: 9,
    year: "1970",
    transition: "slide-left",
    act: "act3",
    kicker: "The Genre's Greatest Influence",
    title: "Sondheim Rewrites the Rules",
    layout: "playbill-chips",
    blocks: {
      intro:
        "He began as the lyricist for West Side Story (1957). From 1970 on, he invented a new kind of musical:",
      bullets: [
        "Disturbing plots and an ironic tone",
        "Adult, fiendishly clever rhymes",
        "Surprising new rhythms for popular music",
      ],
      chips: [
        { year: "1970", title: "Company", text: "Love and marriage in Manhattan" },
        {
          year: "1979",
          title: "Sweeney Todd",
          text: "A barber's revenge, now staged by opera houses",
        },
        {
          year: "1984",
          title: "Sunday in the Park with George",
          text: "Music that mimics Seurat's painted dots",
        },
        {
          year: "1986",
          title: "Into the Woods",
          text: "Fairy tales after \u201Chappily ever after\u201D",
        },
      ],
    },
    reveals: 3,
    duration: 28000,
    notes:
      "No one shaped the modern musical more than Stephen Sondheim. After writing the lyrics for West Side Story, he created a whole new style: ironic, sometimes dark, with brilliantly complex rhymes. Company looked at modern marriage, Sweeney Todd is a bloody revenge tale opera houses now perform, and Into the Woods asks what happens after happily ever after.",
  },
  {
    id: "frame-10",
    n: 10,
    year: "1986",
    transition: "sweep",
    act: "act3",
    kicker: "The Megamusical",
    title: "Spectacle Goes Global",
    layout: "stat-cards",
    blocks: {
      cards: [
        {
          value: "#1",
          title: "The Phantom of the Opera",
          text: "Lloyd Webber's longest-running musical in Broadway history",
        },
        {
          value: "Liftoff",
          title: "Miss Saigon",
          text: "A helicopter lands onstage to rescue fleeing diplomats",
        },
        {
          value: "$6.2B",
          title: "The Lion King",
          text: "Julie Taymor's staging became Broadway's highest grosser ever",
        },
      ],
      footer:
        "Mostly sung-through with no spoken dialogue, these shows need little translation, so they travel the world.",
    },
    reveals: 4,
    duration: 26000,
    notes:
      "Starting in 1970, Europe invaded Broadway. Andrew Lloyd Webber's Phantom of the Opera became the longest-running musical in Broadway history, and Miss Saigon literally landed a helicopter onstage. Because these shows are mostly sung-through, they travel easily. Then Disney arrived: The Lion King has earned over 6.2 billion dollars worldwide.",
  },
  {
    id: "frame-11",
    n: 11,
    year: "1921",
    transition: "split",
    act: "act3",
    kicker: "Crossover Audiences",
    title: "Black Musicals Lead the Way",
    layout: "tile-grid",
    blocks: {
      statement:
        "Musicals by, about, and starring African Americans drew Black and white audiences together, helping pave the way for integration across American life.",
      tiles: [
        { title: "Shuffle Along (1921)", text: "Broadway's first Black hit" },
        { title: "The Wiz", text: "The Wizard of Oz, reimagined" },
        { title: "Dreamgirls", text: "A Supremes-like group vs. racism" },
        {
          title: "Bring in 'Da Noise, Bring in 'Da Funk",
          text: "Racial history told through tap",
        },
        { title: "Fela! (2009)", text: "Afrobeat and Nigerian politics" },
        {
          title: "The Scottsboro Boys (2010)",
          text: "Injustice as an ironic minstrel show",
        },
      ],
    },
    reveals: 2,
    duration: 28000,
    notes:
      "Black musicals have been a driving force, too. From Shuffle Along in 1921 to The Wiz, Dreamgirls, and Bring in 'Da Noise, Bring in 'Da Funk, these shows drew crossover audiences, Black and white together, and helped pave the way for integration. More recent works like Fela! and The Scottsboro Boys celebrate, and criticize, how Black music and white culture interact.",
  },
  {
    id: "frame-12",
    n: 12,
    year: "2008",
    transition: "blur-in",
    act: "finale",
    kicker: "The 21st Century",
    title: "The Musical Gets Real",
    layout: "list-quote",
    milestone: "2015",
    blocks: {
      list: [
        {
          title: "Next to Normal",
          text: "Bipolar disorder in a family; 2010 Pulitzer Prize",
        },
        { title: "Spring Awakening", text: "Teens kept in the dark by adults" },
        { title: "In the Heights", text: "Barrio life in Washington Heights" },
        {
          title: "Fun Home",
          text: "Identity and family secrets; 2015 Best Musical",
        },
        { title: "Hamilton", text: "America's founders, told in hip-hop" },
      ],
      quote:
        "Even the darkest new musical shares the same theatrical DNA as the Ziegfeld Follies: it still wants to entertain, and we still feel the urge to clap.",
    },
    reveals: 2,
    duration: 28000,
    notes:
      "Today's musicals tackle real life: mental illness in Next to Normal, which won the Pulitzer, teenage confusion in Spring Awakening, identity and family in Fun Home, and America's founding in hip-hop with Hamilton. But even the darkest of them share the same DNA as the old Ziegfeld Follies. They still want to entertain, and we still want to clap.",
  },
  {
    id: "frame-13",
    n: 13,
    year: "2015",
    transition: "finale-bow",
    act: "finale",
    kicker: "The Final Bow",
    title: "A New Golden Age?",
    layout: "finale",
    blocks: {
      takeaways: [
        "Music has been part of drama since ancient Greece.",
        "America made it its own art form, from spectacle to serious story.",
        "Today's musicals face real life, and still make us want to clap.",
      ],
      prompt:
        "Your turn: which musical would you show someone who 'hates musicals'?",
      footer: "Source: Cohen, Theatre (11th ed.), Ch. 9",
    },
    reveals: 4,
    duration: 26000,
    notes:
      "So, three takeaways. Music has been part of drama since ancient Greece. America turned the musical into its own art form, evolving from spectacle to serious storytelling. And today's musicals face real life head-on while still making us want to clap. With Hamilton and Fun Home, the textbook suggests we may be heading into a new golden age. So, which musical would you show someone who says they hate musicals? Thanks for watching!",
  },
];

export const TOTAL_FRAMES = FRAMES.length;

export function frameByNumber(n: number): Frame {
  return FRAMES[Math.min(TOTAL_FRAMES, Math.max(1, n)) - 1];
}

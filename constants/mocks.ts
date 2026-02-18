export const MOCK_NEWS_VARIANTS = [
    [
        { story: "SpaceX successfully launches Starship on its fifth test flight, catching the booster with 'Mechazilla' arms.", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Starship_S24_on_suborbital_pad_A.jpg/200px-Starship_S24_on_suborbital_pad_A.jpg" } },
        { story: "The Nobel Prize in Physics is awarded to John Hopfield and Geoffrey Hinton for discoveries in artificial neural networks." }
    ],
    [
        { story: "NASA's Europa Clipper launches on a mission to study Jupiter's moon Europa for signs of habitability.", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Europa-moon-with-jupiter.jpg/200px-Europa-moon-with-jupiter.jpg" } },
        { story: "Han Kang becomes the first South Korean author to win the Nobel Prize in Literature." }
    ],
    [
        { story: "Hurricane Milton makes landfall in Florida as a Category 3 storm, causing widespread power outages.", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Hurricane_Isabel_from_ISS.jpg/200px-Hurricane_Isabel_from_ISS.jpg" } },
        { story: "Rafael Nadal announces his retirement from professional tennis after the Davis Cup finals." }
    ],
    [
        { story: "Researchers discover a new species of giant dinosaur in Patagonia.", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Argentinosaurus_reconstruction.jpg/200px-Argentinosaurus_reconstruction.jpg" } },
        { story: "Global tech summit announces breakthrough in quantum computing stability." }
    ]
];

export const MOCK_TFA_VARIANTS = [
    {
        title: "Wikipedia",
        displaytitle: "Web (Wikipedia)",
        extract: "The fundamental concept of Wikipedia is that anyone can edit it. This page is served from static fallback data because the live API connection failed.",
        thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/200px-Wikipedia-logo-v2.svg.png" }
    },
    {
        title: "React_Native",
        displaytitle: "React Native",
        extract: "React Native is an open-source UI software framework created by Meta Platforms, Inc. It is used to develop applications for Android, Android TV, iOS, macOS, tvOS, Web, Windows and UWP.",
        thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png" }
    },
    {
        title: "Capybara",
        displaytitle: "Capybara",
        extract: "The capybara is the largest living rodent in the world. Also called chigüire and carpincho, it is a member of the genus Hydrochoerus, of which the only other extant member is the lesser capybara.",
        thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Capybara_%28Hydrochoeris_hydrochaeris%29.jpg/200px-Capybara_%28Hydrochoeris_hydrochaeris%29.jpg" }
    }
];

export const MOCK_TOP_READ_VARIANTS = [
    [
        { title: "Taylor_Swift", displaytitle: "Taylor Swift", views: "105,230", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.jpg/200px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.jpg" } },
        { title: "Deaths_in_2024", displaytitle: "Deaths in 2024", views: "85,612" },
        { title: "Dune:_Part_Two", displaytitle: "Dune: Part Two", views: "78,901", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Dune_Part_Two_poster.jpeg/220px-Dune_Part_Two_poster.jpeg" } }
    ],
    [
        { title: "Academy_Awards", displaytitle: "Academy Awards", views: "210,555", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Academy_Award_trophy.jpg/200px-Academy_Award_trophy.jpg" } },
        { title: "Oppenheimer_(film)", displaytitle: "Oppenheimer (film)", views: "150,222", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg/220px-Oppenheimer_%28film%29.jpg" } },
        { title: "Cillian_Murphy", displaytitle: "Cillian Murphy", views: "98,765" }
    ],
    [
        { title: "Solar_eclipse_of_April_8,_2024", displaytitle: "Solar eclipse of April 8, 2024", views: "300,123", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Total_Solar_Eclipse_8-21-17.jpg/200px-Total_Solar_Eclipse_8-21-17.jpg" } },
        { title: "Elon_Musk", displaytitle: "Elon Musk", views: "65,432", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/200px-Elon_Musk_Royal_Society_%28crop2%29.jpg" } },
        { title: "ChatGPT", displaytitle: "ChatGPT", views: "54,321" }
    ]
];

export const MOCK_POTD_VARIANTS = [
    {
        title: "Milky Way",
        thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/640px-ESO-VLT-Laser-phot-33a-07.jpg" },
        description: { text: "The Milky Way over the VLT at Paranal Observatory." }
    },
    {
        title: "Malachite Kingfisher",
        thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Malachite_kingfisher_%28Corythornis_cristatus%29_male.jpg/640px-Malachite_kingfisher_%28Corythornis_cristatus%29_male.jpg" },
        description: { text: "A male malachite kingfisher in Pilanesberg National Park." }
    },
    {
        title: "Kyoto",
        thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Kinkaku-ji_2012.JPG/640px-Kinkaku-ji_2012.JPG" },
        description: { text: "Kinkaku-ji, the Golden Pavilion, in Kyoto, Japan." }
    }
];

export const MOCK_ON_THIS_DAY_VARIANTS = [
    [
        { year: 1969, text: "Apollo 11 lands on the Moon.", pages: [{ title: "Apollo_11", displaytitle: "Apollo 11", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/200px-Aldrin_Apollo_11_original.jpg" } }] }
    ],
    [
        { year: 1776, text: "The United States Declaration of Independence is adopted.", pages: [{ title: "United_States_Declaration_of_Independence", displaytitle: "Declaration of Independence", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Declaration_independence.jpg/200px-Declaration_independence.jpg" } }] }
    ],
    [
        { year: 1989, text: "The Berlin Wall falls, marking the end of the Cold War.", pages: [{ title: "Berlin_Wall", displaytitle: "Berlin Wall", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/BerlinWall-BrandenburgGate.jpg/200px-BerlinWall-BrandenburgGate.jpg" } }] }
    ]
];

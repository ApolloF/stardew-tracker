import { meta } from './meta.js';
import type { Fish } from './types.js';
import { BUNDLE_ROOMS } from './bundles.js';
const m=meta('Fish');
const data=[
    {
        "id":  "pufferfish",
        "gameId":  "128",
        "name":  "Pufferfish",
        "seasons":  [
                        "Summer"
                    ],
        "locations":  [
                          "Ocean",
                          "Ginger Island"
                      ],
        "time":  "12PM - 4PM",
        "weather":  "Sunny",
        "description":  "Difficulty: 80 floater"
    },
    {
        "id":  "anchovy",
        "gameId":  "129",
        "name":  "Anchovy",
        "seasons":  [
                        "Fall",
                        "Spring"
                    ],
        "locations":  [
                          "Ocean"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 30 dart"
    },
    {
        "id":  "tuna",
        "gameId":  "130",
        "name":  "Tuna",
        "seasons":  [
                        "Winter",
                        "Summer"
                    ],
        "locations":  [
                          "Ocean",
                          "Ginger Island"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 70 smooth"
    },
    {
        "id":  "sardine",
        "gameId":  "131",
        "name":  "Sardine",
        "seasons":  [
                        "Winter",
                        "Fall",
                        "Spring"
                    ],
        "locations":  [
                          "Ocean"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 30 dart"
    },
    {
        "id":  "bream",
        "gameId":  "132",
        "name":  "Bream",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "River"
                      ],
        "time":  "6PM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 35 smooth"
    },
    {
        "id":  "largemouth-bass",
        "gameId":  "136",
        "name":  "Largemouth Bass",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Mountain Lake",
                          "Wilderness Farm"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 50 mixed"
    },
    {
        "id":  "smallmouth-bass",
        "gameId":  "137",
        "name":  "Smallmouth Bass",
        "seasons":  [
                        "Fall",
                        "Spring"
                    ],
        "locations":  [
                          "Town River",
                          "Forest Pond"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 28 mixed"
    },
    {
        "id":  "rainbow-trout",
        "gameId":  "138",
        "name":  "Rainbow Trout",
        "seasons":  [
                        "Summer"
                    ],
        "locations":  [
                          "River",
                          "Mountain Lake"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Sunny",
        "description":  "Difficulty: 45 mixed"
    },
    {
        "id":  "salmon",
        "gameId":  "139",
        "name":  "Salmon",
        "seasons":  [
                        "Fall"
                    ],
        "locations":  [
                          "River",
                          "Waterfalls"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 50 mixed"
    },
    {
        "id":  "walleye",
        "gameId":  "140",
        "name":  "Walleye",
        "seasons":  [
                        "Winter",
                        "Fall"
                    ],
        "locations":  [
                          "River",
                          "Mountain Lake",
                          "Forest Pond",
                          "Forest Farm Pond"
                      ],
        "time":  "12PM - 2AM",
        "weather":  "Rain",
        "description":  "Difficulty: 45 smooth"
    },
    {
        "id":  "perch",
        "gameId":  "141",
        "name":  "Perch",
        "seasons":  [
                        "Winter"
                    ],
        "locations":  [
                          "River",
                          "Mountain Lake",
                          "Forest Pond"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 35 dart"
    },
    {
        "id":  "carp",
        "gameId":  "142",
        "name":  "Carp",
        "seasons":  [
                        "Summer",
                        "Fall",
                        "Spring"
                    ],
        "locations":  [
                          "Mountain Lake",
                          "Secret Woods",
                          "The Sewers",
                          "Mutant Bug Lair"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 15 mixed"
    },
    {
        "id":  "catfish",
        "gameId":  "143",
        "name":  "Catfish",
        "seasons":  [
                        "Winter",
                        "Fall",
                        "Spring"
                    ],
        "locations":  [
                          "River",
                          "Secret Woods",
                          "Witch\u0027s Swamp"
                      ],
        "time":  "6AM - 12AM",
        "weather":  "Rain",
        "description":  "Difficulty: 75 mixed"
    },
    {
        "id":  "pike",
        "gameId":  "144",
        "name":  "Pike",
        "seasons":  [
                        "Winter",
                        "Summer"
                    ],
        "locations":  [
                          "River",
                          "Forest Pond"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 60 dart"
    },
    {
        "id":  "sunfish",
        "gameId":  "145",
        "name":  "Sunfish",
        "seasons":  [
                        "Summer",
                        "Spring"
                    ],
        "locations":  [
                          "River"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Sunny",
        "description":  "Difficulty: 30 mixed"
    },
    {
        "id":  "red-mullet",
        "gameId":  "146",
        "name":  "Red Mullet",
        "seasons":  [
                        "Winter",
                        "Summer"
                    ],
        "locations":  [
                          "Ocean"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 55 smooth"
    },
    {
        "id":  "herring",
        "gameId":  "147",
        "name":  "Herring",
        "seasons":  [
                        "Winter",
                        "Spring"
                    ],
        "locations":  [
                          "Ocean"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 25 dart"
    },
    {
        "id":  "eel",
        "gameId":  "148",
        "name":  "Eel",
        "seasons":  [
                        "Fall",
                        "Spring"
                    ],
        "locations":  [
                          "Ocean"
                      ],
        "time":  "4PM - 2AM",
        "weather":  "Rain",
        "description":  "Difficulty: 70 smooth"
    },
    {
        "id":  "octopus",
        "gameId":  "149",
        "name":  "Octopus",
        "seasons":  [
                        "Summer",
                        "Winter"
                    ],
        "locations":  [
                          "Ocean",
                          "Ginger Island",
                          "Submarine at Night Market"
                      ],
        "time":  "6AM - 1PM",
        "weather":  "Any",
        "description":  "Difficulty: 95 sinker"
    },
    {
        "id":  "red-snapper",
        "gameId":  "150",
        "name":  "Red Snapper",
        "seasons":  [
                        "Winter",
                        "Fall",
                        "Summer"
                    ],
        "locations":  [
                          "Ocean",
                          "Beach Farm"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Rain",
        "description":  "Difficulty: 40 mixed"
    },
    {
        "id":  "squid",
        "gameId":  "151",
        "name":  "Squid",
        "seasons":  [
                        "Winter"
                    ],
        "locations":  [
                          "Ocean"
                      ],
        "time":  "6PM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 75 sinker"
    },
    {
        "id":  "seaweed",
        "gameId":  "152",
        "name":  "Seaweed",
        "seasons":  [
                        "Fall",
                        "Spring",
                        "Summer",
                        "Winter"
                    ],
        "locations":  [
                          "Fishing Pole: Ocean",
                          "Foraging: The Beach",
                          "Garbage Cans",
                          "Fish Pond",
                          "The \"Dangerous Mines\""
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 5 floater"
    },
    {
        "id":  "green-algae",
        "gameId":  "153",
        "name":  "Green Algae",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Fishing Pole: freshwater",
                          "Green Slimes",
                          "Garbage Cans",
                          "Fish Pond",
                          "Cat"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 5 floater"
    },
    {
        "id":  "sea-cucumber",
        "gameId":  "154",
        "name":  "Sea Cucumber",
        "seasons":  [
                        "Winter",
                        "Fall"
                    ],
        "locations":  [
                          "Ocean",
                          "Submarine at Night Market"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 40 sinker"
    },
    {
        "id":  "super-cucumber",
        "gameId":  "155",
        "name":  "Super Cucumber",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Winter"
                    ],
        "locations":  [
                          "Ocean",
                          "Ginger Island",
                          "Submarine at Night Market"
                      ],
        "time":  "6PM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 80 sinker"
    },
    {
        "id":  "ghostfish",
        "gameId":  "156",
        "name":  "Ghostfish",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "The Mines"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 50 mixed"
    },
    {
        "id":  "white-algae",
        "gameId":  "157",
        "name":  "White Algae",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Fishing Pole",
                          "Monster drops",
                          "Fish Pond (Ghostfish)"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 5 floater"
    },
    {
        "id":  "stonefish",
        "gameId":  "158",
        "name":  "Stonefish",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Floor 20 of The Mines"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 65 sinker"
    },
    {
        "id":  "crimsonfish",
        "gameId":  "159",
        "name":  "Crimsonfish",
        "seasons":  [
                        "Summer"
                    ],
        "locations":  [
                          "East Pier on The Beach"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 95 mixed"
    },
    {
        "id":  "angler",
        "gameId":  "160",
        "name":  "Angler",
        "seasons":  [
                        "Fall"
                    ],
        "locations":  [
                          "North of JojaMart on the wooden plank bridge"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 85 smooth"
    },
    {
        "id":  "ice-pip",
        "gameId":  "161",
        "name":  "Ice Pip",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "The Mines, Floor 60"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 85 dart"
    },
    {
        "id":  "lava-eel",
        "gameId":  "162",
        "name":  "Lava Eel",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Floor 100 of The Mines",
                          "Volcano Caldera"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 90 mixed"
    },
    {
        "id":  "legend",
        "gameId":  "163",
        "name":  "Legend",
        "seasons":  [
                        "Spring"
                    ],
        "locations":  [
                          "The Mountain Lake, near the log"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Rain",
        "description":  "Difficulty: 110 mixed"
    },
    {
        "id":  "sandfish",
        "gameId":  "164",
        "name":  "Sandfish",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "The Desert"
                      ],
        "time":  "6AM - 8PM",
        "weather":  "Any",
        "description":  "Difficulty: 65 mixed"
    },
    {
        "id":  "scorpion-carp",
        "gameId":  "165",
        "name":  "Scorpion Carp",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "The Desert"
                      ],
        "time":  "6AM - 8PM",
        "weather":  "Any",
        "description":  "Difficulty: 90 dart"
    },
    {
        "id":  "flounder",
        "gameId":  "267",
        "name":  "Flounder",
        "seasons":  [
                        "Summer",
                        "Spring"
                    ],
        "locations":  [
                          "Ocean",
                          "Ginger Island"
                      ],
        "time":  "6AM - 8PM",
        "weather":  "Any",
        "description":  "Difficulty: 50 sinker"
    },
    {
        "id":  "midnight-carp",
        "gameId":  "269",
        "name":  "Midnight Carp",
        "seasons":  [
                        "Winter",
                        "Fall"
                    ],
        "locations":  [
                          "Mountain Lake",
                          "Forest Pond",
                          "Ginger Island North \u0026 West (freshwater)"
                      ],
        "time":  "10PM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 55 mixed"
    },
    {
        "id":  "clam",
        "gameId":  "372",
        "name":  "Clam",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Saltwater",
                          "Foraging: The Beach",
                          "Turtle"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "mutant-carp",
        "gameId":  "682",
        "name":  "Mutant Carp",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "The Sewers"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 80 dart"
    },
    {
        "id":  "sturgeon",
        "gameId":  "698",
        "name":  "Sturgeon",
        "seasons":  [
                        "Winter",
                        "Summer"
                    ],
        "locations":  [
                          "Mountain Lake"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 78 mixed"
    },
    {
        "id":  "tiger-trout",
        "gameId":  "699",
        "name":  "Tiger Trout",
        "seasons":  [
                        "Winter",
                        "Fall"
                    ],
        "locations":  [
                          "River"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 60 dart"
    },
    {
        "id":  "bullhead",
        "gameId":  "700",
        "name":  "Bullhead",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Mountain Lake"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 46 smooth"
    },
    {
        "id":  "tilapia",
        "gameId":  "701",
        "name":  "Tilapia",
        "seasons":  [
                        "Fall",
                        "Summer"
                    ],
        "locations":  [
                          "Ocean",
                          "Ginger Island"
                      ],
        "time":  "6AM - 2PM",
        "weather":  "Any",
        "description":  "Difficulty: 50 mixed"
    },
    {
        "id":  "chub",
        "gameId":  "702",
        "name":  "Chub",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Mountain Lake",
                          "Forest River"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 35 dart"
    },
    {
        "id":  "dorado",
        "gameId":  "704",
        "name":  "Dorado",
        "seasons":  [
                        "Summer"
                    ],
        "locations":  [
                          "Forest River"
                      ],
        "time":  "6AM - 7PM",
        "weather":  "Any",
        "description":  "Difficulty: 78 mixed"
    },
    {
        "id":  "albacore",
        "gameId":  "705",
        "name":  "Albacore",
        "seasons":  [
                        "Winter",
                        "Fall"
                    ],
        "locations":  [
                          "Ocean"
                      ],
        "time":  "6AM - 11AM",
        "weather":  "Any",
        "description":  "Difficulty: 60 mixed"
    },
    {
        "id":  "shad",
        "gameId":  "706",
        "name":  "Shad",
        "seasons":  [
                        "Summer",
                        "Fall",
                        "Spring"
                    ],
        "locations":  [
                          "River"
                      ],
        "time":  "9AM - 2AM",
        "weather":  "Rain",
        "description":  "Difficulty: 45 smooth"
    },
    {
        "id":  "lingcod",
        "gameId":  "707",
        "name":  "Lingcod",
        "seasons":  [
                        "Winter"
                    ],
        "locations":  [
                          "River",
                          "Mountain Lake"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 85 mixed"
    },
    {
        "id":  "halibut",
        "gameId":  "708",
        "name":  "Halibut",
        "seasons":  [
                        "Winter",
                        "Summer",
                        "Spring"
                    ],
        "locations":  [
                          "Ocean"
                      ],
        "time":  "6AM - 11AM",
        "weather":  "Any",
        "description":  "Difficulty: 50 sinker"
    },
    {
        "id":  "lobster",
        "gameId":  "715",
        "name":  "Lobster",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Saltwater",
                          "Turtle",
                          "Statue of Endless Fortune"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "crayfish",
        "gameId":  "716",
        "name":  "Crayfish",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Freshwater",
                          "Turtle"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "crab",
        "gameId":  "717",
        "name":  "Crab",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Saltwater",
                          "Monster Drops: Rock Crab • Lava Crab",
                          "Turtle"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "cockle",
        "gameId":  "718",
        "name":  "Cockle",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Saltwater",
                          "Foraging: The Beach",
                          "Turtle"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "mussel",
        "gameId":  "719",
        "name":  "Mussel",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Saltwater",
                          "Foraging: The Beach",
                          "Mussel Node",
                          "Turtle"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "shrimp",
        "gameId":  "720",
        "name":  "Shrimp",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Saltwater"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "snail",
        "gameId":  "721",
        "name":  "Snail",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Freshwater"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "periwinkle",
        "gameId":  "722",
        "name":  "Periwinkle",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Freshwater"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "oyster",
        "gameId":  "723",
        "name":  "Oyster",
        "seasons":  [
                        "All"
                    ],
        "locations":  [
                          "Crab Pot: Saltwater",
                          "Foraging: The Beach"
                      ],
        "time":  "Any",
        "weather":  "Any",
        "description":  "Crab pot catch"
    },
    {
        "id":  "woodskip",
        "gameId":  "734",
        "name":  "Woodskip",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Secret Woods",
                          "Forest Farm"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 50 mixed"
    },
    {
        "id":  "glacierfish",
        "gameId":  "775",
        "name":  "Glacierfish",
        "seasons":  [
                        "Winter"
                    ],
        "locations":  [
                          "South end of Arrowhead Island in Cindersap Forest"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Sunny",
        "description":  "Difficulty: 100 mixed"
    },
    {
        "id":  "void-salmon",
        "gameId":  "795",
        "name":  "Void Salmon",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Witch\u0027s Swamp"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 80 mixed"
    },
    {
        "id":  "slimejack",
        "gameId":  "796",
        "name":  "Slimejack",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Mutant Bug Lair"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 55 dart"
    },
    {
        "id":  "midnight-squid",
        "gameId":  "798",
        "name":  "Midnight Squid",
        "seasons":  [
                        "Winter"
                    ],
        "locations":  [
                          "Submarine at Night Market"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 55 sinker"
    },
    {
        "id":  "spook-fish",
        "gameId":  "799",
        "name":  "Spook Fish",
        "seasons":  [
                        "Winter"
                    ],
        "locations":  [
                          "Submarine at Night Market"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 60 dart"
    },
    {
        "id":  "blobfish",
        "gameId":  "800",
        "name":  "Blobfish",
        "seasons":  [
                        "Winter"
                    ],
        "locations":  [
                          "Submarine at Night Market"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 75 floater"
    },
    {
        "id":  "stingray",
        "gameId":  "836",
        "name":  "Stingray",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Pirate Cove"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 80 sinker"
    },
    {
        "id":  "lionfish",
        "gameId":  "837",
        "name":  "Lionfish",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Ginger Island"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 50 smooth"
    },
    {
        "id":  "blue-discus",
        "gameId":  "838",
        "name":  "Blue Discus",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Ginger Island"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: 60 dart"
    },
    {
        "id":  "cave-jelly",
        "gameId":  "CaveJelly",
        "name":  "Cave Jelly",
        "seasons":  [
                        "Spring",
                        "Summer",
                        "Fall",
                        "Winter"
                    ],
        "locations":  [
                          "The Mines"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: None"
    },
    {
        "id":  "goby",
        "gameId":  "Goby",
        "name":  "Goby",
        "seasons":  [
                        "Fall",
                        "Summer",
                        "Spring",
                        "Winter"
                    ],
        "locations":  [
                          "Cindersap Forest Waterfalls"
                      ],
        "time":  "8AM - 6PM",
        "weather":  "Any",
        "description":  "Difficulty: 55 dart"
    },
    {
        "id":  "river-jelly",
        "gameId":  "RiverJelly",
        "name":  "River Jelly",
        "seasons":  [
                        "Spring",
                        "Summer",
                        "Fall",
                        "Winter"
                    ],
        "locations":  [
                          "River",
                          "Mountain Lake",
                          "Forest River",
                          "The Desert",
                          "Secret Woods",
                          "Ginger Island North \u0026 West (freshwater)"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: None"
    },
    {
        "id":  "sea-jelly",
        "gameId":  "SeaJelly",
        "name":  "Sea Jelly",
        "seasons":  [
                        "Spring",
                        "Summer",
                        "Fall",
                        "Winter"
                    ],
        "locations":  [
                          "Ocean",
                          "Ginger Island",
                          "Submarine at Night Market",
                          "Pirate Cove"
                      ],
        "time":  "6AM - 2AM",
        "weather":  "Any",
        "description":  "Difficulty: None"
    }
] as const;
const bundleByGameId=new Map(BUNDLE_ROOMS.flatMap(room=>room.bundles.flatMap(bundle=>bundle.items.filter(item=>item.gameId).map(item=>[item.gameId!,bundle.id]as const))));
export const FISH:Fish[]=data.map(row=>({...m,id:row.id,name:row.name,emoji:'',gameId:row.gameId,iconPath:`/game-icons/objects/${row.gameId}.webp`,seasons:[...row.seasons]as Fish['seasons'],locations:[...row.locations],time:row.time,weather:row.weather,bundle:bundleByGameId.get(row.gameId),description:row.description}));
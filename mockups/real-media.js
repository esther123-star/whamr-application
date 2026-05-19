/**
 * real-media.js — Whamr Mockup Media Injector v2
 * Catalog embedded inline — works with file:// AND http://.
 * Replaces picsum.photos placeholders with 220 real stickers + memes.
 */
(function () {

  var CATALOG = [
    {
        "id":  "2587e1d2d000",
        "tags":  [
                     "5000",
                     "naira",
                     "pawpaw"
                 ],
        "path":  "memes/naija/5000 naira pawpaw.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "5000 Naira Pawpaw"
    },
    {
        "id":  "091a0586e786",
        "tags":  [
                     "african",
                     "boy",
                     "crying",
                     "laughing"
                 ],
        "path":  "memes/naija/African boy crying then laughing meme😂.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "African Boy Crying Then Laughing Meme"
    },
    {
        "id":  "6161308f2e25",
        "tags":  [
                     "african",
                     "kid",
                     "crying"
                 ],
        "path":  "memes/naija/African kid crying meme.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "African Kid Crying Meme"
    },
    {
        "id":  "fe07d1840311",
        "tags":  [
                     "aki",
                     "iss"
                 ],
        "path":  "memes/naija/Aki Iss.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Aki Iss"
    },
    {
        "id":  "e3b4c385bf58",
        "tags":  "virgin",
        "path":  "memes/naija/are u a virgin.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Are U A Virgin"
    },
    {
        "id":  "b34f8b6d8467",
        "tags":  [
                     "big",
                     "laugh",
                     "jide",
                     "kosoko"
                 ],
        "path":  "memes/naija/Big Laugh Jide kosoko.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Big Laugh Jide Kosoko"
    },
    {
        "id":  "4b527129f6cb",
        "tags":  [
                     "bigger",
                     "screem",
                     "patience",
                     "ozokwo"
                 ],
        "path":  "memes/naija/Bigger screem patience ozokwo.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Bigger Screem Patience Ozokwo"
    },
    {
        "id":  "dcd02164c7e0",
        "tags":  [
                     "break",
                     "fowl"
                 ],
        "path":  "memes/random/break is like that of a fowl.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Break Is Like That Of A Fowl"
    },
    {
        "id":  "2033869efc3c",
        "tags":  [
                     "see",
                     "ibu"
                 ],
        "path":  "memes/naija/Can i see you Mr ibu.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Can I See You Mr Ibu"
    },
    {
        "id":  "8d8a94215aaf",
        "tags":  "come",
        "path":  "memes/naija/Come of that.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Come Of That"
    },
    {
        "id":  "082cfbfb986b",
        "tags":  [
                     "damn",
                     "bloody",
                     "fool"
                 ],
        "path":  "memes/random/damn bloody fool.mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Damn Bloody Fool"
    },
    {
        "id":  "ade080ca4581",
        "tags":  "ehn",
        "path":  "memes/naija/Ehn....mp4",
        "type":  "meme",
        "category":  "naija",
        "title":  "Ehn..."
    },
    {
        "id":  "ff9f8c8b9361",
        "tags":  [
                     "70th",
                     "annual",
                     "golden",
                     "globes",
                     "excited"
                 ],
        "path":  "memes/reactions/70th Annual Golden Globes Excited.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "70th Annual Golden Globes Excited"
    },
    {
        "id":  "164419ee8c1f",
        "tags":  [
                     "ahhhhh",
                     "screem"
                 ],
        "path":  "memes/naija/Ahhhhh Screem.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Ahhhhh Screem"
    },
    {
        "id":  "bdd54f8141d4",
        "tags":  [
                     "anchorman",
                     "rage"
                 ],
        "path":  "memes/reactions/Anchorman Rage.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Anchorman Rage"
    },
    {
        "id":  "a0cd525e840c",
        "tags":  [
                     "any",
                     "given",
                     "sunday",
                     "excited",
                     "game"
                 ],
        "path":  "memes/reactions/Any Given Sunday Excited for the game.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Any Given Sunday Excited For The Game"
    },
    {
        "id":  "c0c5618cbf43",
        "tags":  [
                     "archer",
                     "rampage"
                 ],
        "path":  "memes/reactions/Archer Rampage.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Archer Rampage"
    },
    {
        "id":  "fca253623c33",
        "tags":  [
                     "big",
                     "brother",
                     "scream",
                     "shake"
                 ],
        "path":  "memes/reactions/Big Brother Scream and Shake.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Big Brother Scream And Shake"
    },
    {
        "id":  "93d36d740f25",
        "tags":  [
                     "bobs",
                     "burgers",
                     "happy",
                     "star"
                 ],
        "path":  "memes/reactions/Bobs Burgers Happy Star.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Bobs Burgers Happy Star"
    },
    {
        "id":  "08fecf2c2389",
        "tags":  [
                     "bored",
                     "dog",
                     "snoring"
                 ],
        "path":  "memes/reactions/Bored Dog Snoring.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Bored Dog Snoring"
    },
    {
        "id":  "fc0b7a6b47cf",
        "tags":  [
                     "cop",
                     "out",
                     "hell"
                 ],
        "path":  "memes/random/Cop Out No no no hell no.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Cop Out No No No Hell No"
    },
    {
        "id":  "c17c58d6ceaa",
        "tags":  [
                     "postman",
                     "vine"
                 ],
        "path":  "memes/reactions/Mr Postman Vine.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Mr Postman Vine"
    },
    {
        "id":  "e5062b086e15",
        "tags":  [
                     "vine",
                     "sneeze",
                     "nice",
                     "ron"
                 ],
        "path":  "memes/reactions/Vine (Sneeze) Nice Ron.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Vine (Sneeze) Nice Ron"
    },
    {
        "id":  "4c5143ec4abb",
        "tags":  [
                     "vine",
                     "aaa",
                     "aaaaaaaaaaa"
                 ],
        "path":  "memes/reactions/Vine AA AAA AAAAAAAAAAA.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Vine AA AAA AAAAAAAAAAA"
    },
    {
        "id":  "1e8887599e38",
        "tags":  [
                     "vine",
                     "avocado"
                 ],
        "path":  "memes/reactions/Vine Avocado.mp4",
        "type":  "meme",
        "category":  "reactions",
        "title":  "Vine Avocado"
    },
    {
        "id":  "ba89c3fbb20a",
        "tags":  [
                     "madea",
                     "family",
                     "funeral"
                 ],
        "path":  "memes/laughing/A Madea Family Funeral Lol.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "A Madea Family Funeral Lol"
    },
    {
        "id":  "3b6608ed9d45",
        "tags":  [
                     "anchorman",
                     "hysterical",
                     "crying"
                 ],
        "path":  "memes/random/Anchorman Hysterical crying.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Anchorman Hysterical Crying"
    },
    {
        "id":  "fdb5992efac4",
        "tags":  [
                     "anchorman",
                     "news",
                     "crew",
                     "laughing"
                 ],
        "path":  "memes/laughing/Anchorman News crew laughing.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Anchorman News Crew Laughing"
    },
    {
        "id":  "86f271f05be6",
        "tags":  [
                     "annoying",
                     "orange",
                     "laugh"
                 ],
        "path":  "memes/laughing/Annoying Orange Annoying Orange Laugh.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Annoying Orange Annoying Orange Laugh"
    },
    {
        "id":  "ddb260e8400f",
        "tags":  [
                     "auntie",
                     "mame"
                 ],
        "path":  "memes/laughing/Auntie Mame LOL.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Auntie Mame LOL"
    },
    {
        "id":  "1877bc2b4211",
        "tags":  [
                     "bee",
                     "puppycat",
                     "laugh"
                 ],
        "path":  "memes/laughing/Bee and PuppyCat Laugh.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Bee And PuppyCat Laugh"
    },
    {
        "id":  "58f2110c4a55",
        "tags":  [
                     "bobs",
                     "burgers",
                     "maniacal",
                     "laugh"
                 ],
        "path":  "memes/laughing/Bobs Burgers Maniacal Laugh.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Bobs Burgers Maniacal Laugh"
    },
    {
        "id":  "4b4670111300",
        "tags":  [
                     "cardi",
                     "chuckles"
                 ],
        "path":  "memes/laughing/Cardi B Cardi B Chuckles.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Cardi B Cardi B Chuckles"
    },
    {
        "id":  "1b4f19de4f4f",
        "tags":  [
                     "chewbacca",
                     "mom"
                 ],
        "path":  "memes/laughing/Chewbacca Mom LOL.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Chewbacca Mom LOL"
    },
    {
        "id":  "7b590581963e",
        "tags":  [
                     "crazy",
                     "laughing",
                     "fox"
                 ],
        "path":  "memes/laughing/Crazy Laughing Fox LOL.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Crazy Laughing Fox LOL"
    },
    {
        "id":  "ceaa9cd22499",
        "tags":  [
                     "cute",
                     "animals",
                     "laughing",
                     "koala"
                 ],
        "path":  "memes/laughing/Cute Animals Laughing Koala.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Cute Animals Laughing Koala"
    },
    {
        "id":  "0f4ea0b316e4",
        "tags":  [
                     "dinner",
                     "schmucks",
                     "snorting",
                     "laugh"
                 ],
        "path":  "memes/random/Dinner for Schmucks Snorting laugh.mp4",
        "type":  "meme",
        "category":  "laughing",
        "title":  "Dinner For Schmucks Snorting Laugh"
    },
    {
        "id":  "9c015c42cec3",
        "tags":  [
                     "azonto",
                     "ghost",
                     "god",
                     "wow"
                 ],
        "path":  "memes/reactions/Azonto Ghost Oh my God Wow.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Azonto Ghost Oh My God Wow"
    },
    {
        "id":  "1c5bf1ed0ec1",
        "tags":  [
                     "billy",
                     "madison",
                     "dance"
                 ],
        "path":  "memes/dance/Billy Madison Dance.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Billy Madison Dance"
    },
    {
        "id":  "ccb671c688f1",
        "tags":  [
                     "bravest",
                     "warriors",
                     "dance",
                     "party"
                 ],
        "path":  "memes/dance/Bravest Warriors Dance Party.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Bravest Warriors Dance Party"
    },
    {
        "id":  "56a2c6b5ccff",
        "tags":  [
                     "broad",
                     "city",
                     "abbi",
                     "dancing"
                 ],
        "path":  "memes/dance/Broad City Abbi dancing.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Broad City Abbi Dancing"
    },
    {
        "id":  "432e40f7babd",
        "tags":  [
                     "caddyshack",
                     "gopher",
                     "dancing"
                 ],
        "path":  "memes/dance/Caddyshack Gopher dancing.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Caddyshack Gopher Dancing"
    },
    {
        "id":  "f2a933c18cb5",
        "tags":  [
                     "charlies",
                     "angels",
                     "dance"
                 ],
        "path":  "memes/dance/Charlies Angels Dance.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Charlies Angels Dance"
    },
    {
        "id":  "21c2fa7aa53e",
        "tags":  [
                     "coffin",
                     "dancers",
                     "mission",
                     "failed",
                     "well",
                     "get",
                     "next"
                 ],
        "path":  "memes/dance/Coffin Dancers Meme Mission failed Well get em next time.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Coffin Dancers Meme Mission Failed Well Get Em Next Time"
    },
    {
        "id":  "59434868ccf7",
        "tags":  [
                     "crazy",
                     "frog",
                     "robot",
                     "dance"
                 ],
        "path":  "memes/dance/Crazy Frog Robot dance.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Crazy Frog Robot Dance"
    },
    {
        "id":  "bb4f071f0de3",
        "tags":  [
                     "dancing",
                     "nathan",
                     "drunken",
                     "sailor"
                 ],
        "path":  "memes/dance/Dancing Nathan Drunken Sailor.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Dancing Nathan Drunken Sailor"
    },
    {
        "id":  "9d89e658db37",
        "tags":  [
                     "dancing",
                     "pallbearers",
                     "coffin",
                     "carry"
                 ],
        "path":  "memes/random/Dancing Pallbearers Coffin Carry.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Dancing Pallbearers Coffin Carry"
    },
    {
        "id":  "fc312cf2a4e0",
        "tags":  [
                     "dancing",
                     "pallbearers",
                     "funeral",
                     "dance"
                 ],
        "path":  "memes/random/Dancing Pallbearers Funeral dance.mp4",
        "type":  "meme",
        "category":  "dance",
        "title":  "Dancing Pallbearers Funeral Dance"
    },
    {
        "id":  "c29bc88e0ea8",
        "tags":  [
                     "cartman",
                     "mmm",
                     "tears",
                     "unfathomable",
                     "sadness"
                 ],
        "path":  "memes/sad/Cartman Mmm the tears of unfathomable sadness.mp4",
        "type":  "meme",
        "category":  "sad",
        "title":  "Cartman Mmm The Tears Of Unfathomable Sadness"
    },
    {
        "id":  "650a045ad865",
        "tags":  [
                     "children",
                     "men",
                     "sad",
                     "face"
                 ],
        "path":  "memes/sad/Children of Men Sad face.mp4",
        "type":  "meme",
        "category":  "sad",
        "title":  "Children Of Men Sad Face"
    },
    {
        "id":  "0066facd1347",
        "tags":  [
                     "community",
                     "crying",
                     "meltdown"
                 ],
        "path":  "memes/sad/Community Crying Meltdown.mp4",
        "type":  "meme",
        "category":  "sad",
        "title":  "Community Crying Meltdown"
    },
    {
        "id":  "5c02ab9edafc",
        "tags":  [
                     "community",
                     "sad",
                     "humming"
                 ],
        "path":  "memes/sad/Community Sad Humming.mp4",
        "type":  "meme",
        "category":  "sad",
        "title":  "Community Sad Humming"
    },
    {
        "id":  "2c2be1697845",
        "tags":  [
                     "cent",
                     "your",
                     "birthday"
                 ],
        "path":  "memes/birthday/50 Cent Its your birthday.mp4",
        "type":  "meme",
        "category":  "birthday",
        "title":  "50 Cent Its Your Birthday"
    },
    {
        "id":  "be92b24553d9",
        "tags":  [
                     "adam",
                     "sandler",
                     "happy",
                     "birthday"
                 ],
        "path":  "memes/birthday/Adam Sandler Happy Birthday to you.mp4",
        "type":  "meme",
        "category":  "birthday",
        "title":  "Adam Sandler Happy Birthday To You"
    },
    {
        "id":  "5c311689718c",
        "tags":  [
                     "alfalfa",
                     "somebodys",
                     "birthday"
                 ],
        "path":  "memes/birthday/Alfalfa Somebodys Birthday.mp4",
        "type":  "meme",
        "category":  "birthday",
        "title":  "Alfalfa Somebodys Birthday"
    },
    {
        "id":  "7d2b17909789",
        "tags":  [
                     "animation",
                     "happy",
                     "birthday",
                     "song"
                 ],
        "path":  "memes/birthday/Animation Happy Birthday Song.mp4",
        "type":  "meme",
        "category":  "birthday",
        "title":  "Animation Happy Birthday Song"
    },
    {
        "id":  "ca2c8d434ac5",
        "tags":  [
                     "beyonce",
                     "beautiful",
                     "birthday"
                 ],
        "path":  "memes/birthday/Beyonce A beautiful birthday.mp4",
        "type":  "meme",
        "category":  "birthday",
        "title":  "Beyonce A Beautiful Birthday"
    },
    {
        "id":  "e410603f03db",
        "tags":  [
                     "chiplettes",
                     "happy",
                     "birthday"
                 ],
        "path":  "memes/random/Chiplettes Happy birthday.mp4",
        "type":  "meme",
        "category":  "birthday",
        "title":  "Chiplettes Happy Birthday"
    },
    {
        "id":  "74c0190d3b52",
        "tags":  [
                     "things",
                     "hate",
                     "about",
                     "love",
                     "baby"
                 ],
        "path":  "memes/love/10 Things I Hate About You I love you baby.mp4",
        "type":  "meme",
        "category":  "love",
        "title":  "10 Things I Hate About You I Love You Baby"
    },
    {
        "id":  "4cab5d84a836",
        "tags":  [
                     "adventure",
                     "time",
                     "dreams",
                     "holding",
                     "hands"
                 ],
        "path":  "memes/love/Adventure Time In my dreams I am holding hands with you.mp4",
        "type":  "meme",
        "category":  "love",
        "title":  "Adventure Time In My Dreams I Am Holding Hands With You"
    },
    {
        "id":  "5d17c4679d3f",
        "tags":  [
                     "always",
                     "maybe",
                     "keanu",
                     "reeves",
                     "blowing",
                     "kiss"
                 ],
        "path":  "memes/love/Always Be My Maybe Keanu Reeves blowing kiss.mp4",
        "type":  "meme",
        "category":  "love",
        "title":  "Always Be My Maybe Keanu Reeves Blowing Kiss"
    },
    {
        "id":  "47a460a9f28c",
        "tags":  [
                     "anchorman",
                     "friggin",
                     "love"
                 ],
        "path":  "memes/love/Anchorman I friggin love you.mp4",
        "type":  "meme",
        "category":  "love",
        "title":  "Anchorman I Friggin Love You"
    },
    {
        "id":  "a13dff56edac",
        "tags":  [
                     "austin",
                     "powers",
                     "yeah",
                     "baby"
                 ],
        "path":  "memes/random/Austin Powers Yeah Baby Yeah.mp4",
        "type":  "meme",
        "category":  "love",
        "title":  "Austin Powers Yeah Baby Yeah"
    },
    {
        "id":  "b49c3a09a70e",
        "tags":  [
                     "baftas",
                     "brad",
                     "blows",
                     "kiss"
                 ],
        "path":  "memes/love/BAFTAS Brad blows a kiss.mp4",
        "type":  "meme",
        "category":  "love",
        "title":  "BAFTAS Brad Blows A Kiss"
    },
    {
        "id":  "45cdc0a52bfa",
        "tags":  [
                     "bruce",
                     "almighty",
                     "love"
                 ],
        "path":  "memes/random/Bruce Almighty Love me.mp4",
        "type":  "meme",
        "category":  "love",
        "title":  "Bruce Almighty Love Me"
    },
    {
        "id":  "6e665900c88a",
        "tags":  [
                     "cony",
                     "brown",
                     "draw",
                     "heart"
                 ],
        "path":  "memes/random/Cony and Brown Draw a Heart.mp4",
        "type":  "meme",
        "category":  "love",
        "title":  "Cony And Brown Draw A Heart"
    },
    {
        "id":  "394b6d605890",
        "tags":  [
                     "andy",
                     "reid",
                     "bout",
                     "those",
                     "chiefs"
                 ],
        "path":  "memes/sports/Andy Reid How bout those Chiefs.mp4",
        "type":  "meme",
        "category":  "sports",
        "title":  "Andy Reid How Bout Those Chiefs"
    },
    {
        "id":  "0a93eb4c259b",
        "tags":  [
                     "charles",
                     "barkley",
                     "thats",
                     "dumb",
                     "makes",
                     "mad"
                 ],
        "path":  "memes/reactions/Charles Barkley Thats so dumb it makes me mad.mp4",
        "type":  "meme",
        "category":  "sports",
        "title":  "Charles Barkley Thats So Dumb It Makes Me Mad"
    },
    {
        "id":  "d75eb2947e59",
        "tags":  [
                     "jimmy",
                     "garoppolo",
                     "feels",
                     "great",
                     "baby"
                 ],
        "path":  "memes/sports/Jimmy Garoppolo Feels great baby.mp4",
        "type":  "meme",
        "category":  "sports",
        "title":  "Jimmy Garoppolo Feels Great Baby"
    },
    {
        "id":  "b8c4f209f9e0",
        "tags":  [
                     "skip",
                     "bayless",
                     "back",
                     "baby"
                 ],
        "path":  "memes/sports/Skip Bayless I am back What it do baby.mp4",
        "type":  "meme",
        "category":  "sports",
        "title":  "Skip Bayless I Am Back What It Do Baby"
    },
    {
        "id":  "15f7ac0c7098",
        "tags":  [
                     "stephen",
                     "smith",
                     "dont",
                     "care"
                 ],
        "path":  "memes/sports/Stephen A Smith We dont care.mp4",
        "type":  "meme",
        "category":  "sports",
        "title":  "Stephen A Smith We Dont Care"
    },
    {
        "id":  "2228e269d0cc",
        "tags":  [
                     "tom",
                     "brady",
                     "going",
                     "anywhere"
                 ],
        "path":  "memes/sports/Tom Brady Im not going anywhere.mp4",
        "type":  "meme",
        "category":  "sports",
        "title":  "Tom Brady Im Not Going Anywhere"
    },
    {
        "id":  "f1ffd64f695b",
        "tags":  [
                     "clapp",
                     "regret",
                     "woman"
                 ],
        "path":  "memes/random/clapp of regret woman.mp4",
        "type":  "meme",
        "category":  "awkward",
        "title":  "Clapp Of Regret Woman"
    },
    {
        "id":  "cbb3c0c0f117",
        "tags":  "0724",
        "path":  "memes/naija/0724.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "0724"
    },
    {
        "id":  "6ca5c6cff898",
        "tags":  "0724",
        "path":  "memes/naija/0724(1).mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "0724(1)"
    },
    {
        "id":  "075a26a8e2ed",
        "tags":  "0724",
        "path":  "memes/random/0724(2).mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "0724(2)"
    },
    {
        "id":  "a1fbf5682c6f",
        "tags":  [
                     "ace",
                     "ventura",
                     "alrighty"
                 ],
        "path":  "memes/random/Ace Ventura Alrighty then.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Ace Ventura Alrighty Then"
    },
    {
        "id":  "974a89320401",
        "tags":  [
                     "adrien",
                     "broner",
                     "got",
                     "cooked"
                 ],
        "path":  "memes/random/Adrien Broner He got cooked.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Adrien Broner He Got Cooked"
    },
    {
        "id":  "15feeba96560",
        "tags":  [
                     "adventure",
                     "time",
                     "excessive",
                     "laughing"
                 ],
        "path":  "memes/random/Adventure Time Excessive Laughing.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Adventure Time Excessive Laughing"
    },
    {
        "id":  "a677ed7c8827",
        "tags":  {

                 },
        "path":  "memes/naija/ah ah ah ah.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Ah Ah Ah Ah"
    },
    {
        "id":  "34e59af70aec",
        "tags":  [
                     "alex",
                     "bregman",
                     "really",
                     "sorry",
                     "about",
                     "choices",
                     "made"
                 ],
        "path":  "memes/random/Alex Bregman Im really sorry about the choices that were made.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Alex Bregman Im Really Sorry About The Choices That Were Made"
    },
    {
        "id":  "999f560d47cc",
        "tags":  [
                     "along",
                     "came",
                     "polly",
                     "happy",
                     "hippo"
                 ],
        "path":  "memes/random/Along Came Polly Happy as a hippo.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Along Came Polly Happy As A Hippo"
    },
    {
        "id":  "dff5b7d736bd",
        "tags":  "rich",
        "path":  "memes/random/Am rich.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Am Rich"
    },
    {
        "id":  "1d4ad8c08bec",
        "tags":  [
                     "anchorman",
                     "great",
                     "story",
                     "compelling",
                     "rich"
                 ],
        "path":  "memes/random/Anchorman Great story compelling and rich.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Anchorman Great Story Compelling And Rich"
    },
    {
        "id":  "e8e609e519b6",
        "tags":  [
                     "andy",
                     "reid",
                     "next",
                     "year",
                     "coming",
                     "right",
                     "back"
                 ],
        "path":  "memes/random/Andy Reid Next year were coming right back here.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Andy Reid Next Year Were Coming Right Back Here"
    },
    {
        "id":  "efcae3a80cf4",
        "tags":  [
                     "ariana",
                     "grande",
                     "throwing",
                     "chair"
                 ],
        "path":  "memes/random/Ariana Grande Meme Throwing Chair.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Ariana Grande Meme Throwing Chair"
    },
    {
        "id":  "879d8f9d1d4a",
        "tags":  [
                     "benny",
                     "johnson",
                     "whos",
                     "ready",
                     "some",
                     "memes"
                 ],
        "path":  "memes/random/Benny Johnson Whos ready for some memes.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Benny Johnson Whos Ready For Some Memes"
    },
    {
        "id":  "6e053863434f",
        "tags":  [
                     "bill",
                     "belichick",
                     "patriots"
                 ],
        "path":  "memes/random/Bill Belichick Meme Patriots QB will be.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Bill Belichick Meme Patriots QB Will Be"
    },
    {
        "id":  "df371a3d2d99",
        "tags":  [
                     "bruce",
                     "almighty",
                     "caffeine",
                     "rush"
                 ],
        "path":  "memes/random/Bruce Almighty Caffeine rush.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Bruce Almighty Caffeine Rush"
    },
    {
        "id":  "23e80c94c4b3",
        "tags":  [
                     "business",
                     "grammer"
                 ],
        "path":  "memes/random/Business Grammer.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Business Grammer"
    },
    {
        "id":  "3a066e78045b",
        "tags":  [
                     "car",
                     "smashed",
                     "through"
                 ],
        "path":  "memes/random/Car smashed through.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Car Smashed Through"
    },
    {
        "id":  "4e52c6a13d95",
        "tags":  [
                     "cardi",
                     "chukles"
                 ],
        "path":  "memes/random/Cardi b chukles.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Cardi B Chukles"
    },
    {
        "id":  "bbe6e66da3b8",
        "tags":  [
                     "cardi",
                     "crying",
                     "laughing"
                 ],
        "path":  "memes/random/Cardi B crying n laughing.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Cardi B Crying N Laughing"
    },
    {
        "id":  "b5b5d83f0422",
        "tags":  [
                     "commercial",
                     "orangutan",
                     "moves"
                 ],
        "path":  "memes/random/Commercial Orangutan has moves.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Commercial Orangutan Has Moves"
    },
    {
        "id":  "5f541508eedf",
        "tags":  [
                     "community",
                     "emotions"
                 ],
        "path":  "memes/random/Community My Emotions.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Community My Emotions"
    },
    {
        "id":  "b3dd10191f6c",
        "tags":  [
                     "cybil",
                     "shepherd",
                     "fake",
                     "polite",
                     "clap"
                 ],
        "path":  "memes/random/Cybil Shepherd Fake polite clap.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Cybil Shepherd Fake Polite Clap"
    },
    {
        "id":  "84d91b5c7a18",
        "tags":  [
                     "deontay",
                     "wilder",
                     "google",
                     "dat",
                     "shit"
                 ],
        "path":  "memes/random/Deontay Wilder Go Google dat shit.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Deontay Wilder Go Google Dat Shit"
    },
    {
        "id":  "79fc3c7ed3d8",
        "tags":  [
                     "dont",
                     "ask",
                     "stupid",
                     "qtn"
                 ],
        "path":  "memes/naija/Dont ask me that stupid qtn.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Dont Ask Me That Stupid Qtn"
    },
    {
        "id":  "3e2de5cbb770",
        "tags":  "excuse",
        "path":  "memes/naija/Excuse me.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Excuse Me"
    },
    {
        "id":  "69c149c65179",
        "tags":  [
                     "rachel",
                     "olson",
                     "hey",
                     "want",
                     "famous"
                 ],
        "path":  "memes/reactions/Rachel Olson Hey I want to be famous.mp4",
        "type":  "meme",
        "category":  "random",
        "title":  "Rachel Olson Hey I Want To Be Famous"
    },
    {
        "id":  "20dc8530e602",
        "tags":  [
                     "20201221",
                     "wa0004"
                 ],
        "path":  "stickers/STK-20201221-WA0004.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20201221-WA0004"
    },
    {
        "id":  "f532b3b8ee41",
        "tags":  [
                     "20201221",
                     "wa0005"
                 ],
        "path":  "stickers/STK-20201221-WA0005.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20201221-WA0005"
    },
    {
        "id":  "718c1f6d5e32",
        "tags":  [
                     "20201221",
                     "wa0006"
                 ],
        "path":  "stickers/STK-20201221-WA0006.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20201221-WA0006"
    },
    {
        "id":  "accb6f83577a",
        "tags":  [
                     "20210116",
                     "wa0018"
                 ],
        "path":  "stickers/STK-20210116-WA0018.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210116-WA0018"
    },
    {
        "id":  "cf4f2785eae9",
        "tags":  [
                     "20210119",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20210119-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210119-WA0001"
    },
    {
        "id":  "37f1c77f38bc",
        "tags":  [
                     "20210121",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20210121-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210121-WA0000"
    },
    {
        "id":  "fd8b30dd9dfe",
        "tags":  [
                     "20210121",
                     "wa0008"
                 ],
        "path":  "stickers/STK-20210121-WA0008.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210121-WA0008"
    },
    {
        "id":  "4167868452ed",
        "tags":  [
                     "20210203",
                     "wa0018"
                 ],
        "path":  "stickers/STK-20210203-WA0018.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210203-WA0018"
    },
    {
        "id":  "6892f612132e",
        "tags":  [
                     "20210301",
                     "wa0005"
                 ],
        "path":  "stickers/STK-20210301-WA0005.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210301-WA0005"
    },
    {
        "id":  "127d692a5714",
        "tags":  [
                     "20210302",
                     "wa0003"
                 ],
        "path":  "stickers/STK-20210302-WA0003.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210302-WA0003"
    },
    {
        "id":  "cb8303bf3c99",
        "tags":  [
                     "20210307",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20210307-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210307-WA0000"
    },
    {
        "id":  "d8cc1bfbd80b",
        "tags":  [
                     "20210308",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20210308-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210308-WA0000"
    },
    {
        "id":  "2d4519fa00e9",
        "tags":  [
                     "20210308",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20210308-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210308-WA0001"
    },
    {
        "id":  "407e768a6c15",
        "tags":  [
                     "20210309",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20210309-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210309-WA0000"
    },
    {
        "id":  "858dd0f5c3b5",
        "tags":  [
                     "20210309",
                     "wa0002"
                 ],
        "path":  "stickers/STK-20210309-WA0002.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210309-WA0002"
    },
    {
        "id":  "17113bac7bd9",
        "tags":  [
                     "20210309",
                     "wa0004"
                 ],
        "path":  "stickers/STK-20210309-WA0004.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210309-WA0004"
    },
    {
        "id":  "bfebd55e1efd",
        "tags":  [
                     "20210309",
                     "wa0005"
                 ],
        "path":  "stickers/STK-20210309-WA0005.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210309-WA0005"
    },
    {
        "id":  "eb50f368a23a",
        "tags":  [
                     "20210309",
                     "wa0009"
                 ],
        "path":  "stickers/STK-20210309-WA0009.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210309-WA0009"
    },
    {
        "id":  "af4124d72832",
        "tags":  [
                     "20210309",
                     "wa0010"
                 ],
        "path":  "stickers/STK-20210309-WA0010.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210309-WA0010"
    },
    {
        "id":  "9f9e7406fb39",
        "tags":  [
                     "20210309",
                     "wa0012"
                 ],
        "path":  "stickers/STK-20210309-WA0012.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210309-WA0012"
    },
    {
        "id":  "1a11484d6523",
        "tags":  [
                     "20210316",
                     "wa0004"
                 ],
        "path":  "stickers/STK-20210316-WA0004.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0004"
    },
    {
        "id":  "222e6d113a73",
        "tags":  [
                     "20210316",
                     "wa0005"
                 ],
        "path":  "stickers/STK-20210316-WA0005.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0005"
    },
    {
        "id":  "348c1901abb1",
        "tags":  [
                     "20210316",
                     "wa0010"
                 ],
        "path":  "stickers/STK-20210316-WA0010.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0010"
    },
    {
        "id":  "f451c77a26d7",
        "tags":  [
                     "20210316",
                     "wa0026"
                 ],
        "path":  "stickers/STK-20210316-WA0026.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0026"
    },
    {
        "id":  "3747f853c6ec",
        "tags":  [
                     "20210316",
                     "wa0027"
                 ],
        "path":  "stickers/STK-20210316-WA0027.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0027"
    },
    {
        "id":  "618a48c7e12e",
        "tags":  [
                     "20210316",
                     "wa0028"
                 ],
        "path":  "stickers/STK-20210316-WA0028.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0028"
    },
    {
        "id":  "ef623bf2ea11",
        "tags":  [
                     "20210316",
                     "wa0029"
                 ],
        "path":  "stickers/STK-20210316-WA0029.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0029"
    },
    {
        "id":  "91fc26f0ad28",
        "tags":  [
                     "20210316",
                     "wa0044"
                 ],
        "path":  "stickers/STK-20210316-WA0044.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0044"
    },
    {
        "id":  "0032646c6bef",
        "tags":  [
                     "20210316",
                     "wa0047"
                 ],
        "path":  "stickers/STK-20210316-WA0047.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0047"
    },
    {
        "id":  "7085dd8b5139",
        "tags":  [
                     "20210316",
                     "wa0055"
                 ],
        "path":  "stickers/STK-20210316-WA0055.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0055"
    },
    {
        "id":  "ec0d91134b7b",
        "tags":  [
                     "20210316",
                     "wa0057"
                 ],
        "path":  "stickers/STK-20210316-WA0057.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0057"
    },
    {
        "id":  "9e7ab392fb59",
        "tags":  [
                     "20210316",
                     "wa0060"
                 ],
        "path":  "stickers/STK-20210316-WA0060.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0060"
    },
    {
        "id":  "e0c492279d7e",
        "tags":  [
                     "20210316",
                     "wa0061"
                 ],
        "path":  "stickers/STK-20210316-WA0061.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0061"
    },
    {
        "id":  "a6dc168fdf81",
        "tags":  [
                     "20210316",
                     "wa0062"
                 ],
        "path":  "stickers/STK-20210316-WA0062.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0062"
    },
    {
        "id":  "0daab3e936ae",
        "tags":  [
                     "20210316",
                     "wa0063"
                 ],
        "path":  "stickers/STK-20210316-WA0063.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0063"
    },
    {
        "id":  "331f2678931b",
        "tags":  [
                     "20210316",
                     "wa0064"
                 ],
        "path":  "stickers/STK-20210316-WA0064.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0064"
    },
    {
        "id":  "2c229d6de1d5",
        "tags":  [
                     "20210316",
                     "wa0065"
                 ],
        "path":  "stickers/STK-20210316-WA0065.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0065"
    },
    {
        "id":  "fbbecc455b29",
        "tags":  [
                     "20210316",
                     "wa0066"
                 ],
        "path":  "stickers/STK-20210316-WA0066.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0066"
    },
    {
        "id":  "637b65d54323",
        "tags":  [
                     "20210316",
                     "wa0067"
                 ],
        "path":  "stickers/STK-20210316-WA0067.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210316-WA0067"
    },
    {
        "id":  "f19751e48b61",
        "tags":  [
                     "20210320",
                     "wa0009"
                 ],
        "path":  "stickers/STK-20210320-WA0009.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20210320-WA0009"
    },
    {
        "id":  "56f1d3229f85",
        "tags":  [
                     "20211106",
                     "wa0003"
                 ],
        "path":  "stickers/STK-20211106-WA0003.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211106-WA0003"
    },
    {
        "id":  "158269257ee7",
        "tags":  [
                     "20211106",
                     "wa0004"
                 ],
        "path":  "stickers/STK-20211106-WA0004.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211106-WA0004"
    },
    {
        "id":  "237a5e43cf52",
        "tags":  [
                     "20211106",
                     "wa0016"
                 ],
        "path":  "stickers/STK-20211106-WA0016.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211106-WA0016"
    },
    {
        "id":  "721cda985b9d",
        "tags":  [
                     "20211107",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20211107-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211107-WA0000"
    },
    {
        "id":  "8bdb347b05a3",
        "tags":  [
                     "20211107",
                     "wa0004"
                 ],
        "path":  "stickers/STK-20211107-WA0004.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211107-WA0004"
    },
    {
        "id":  "917b09f44646",
        "tags":  [
                     "20211108",
                     "wa0003"
                 ],
        "path":  "stickers/STK-20211108-WA0003.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211108-WA0003"
    },
    {
        "id":  "5eb4ad831045",
        "tags":  [
                     "20211108",
                     "wa0011"
                 ],
        "path":  "stickers/STK-20211108-WA0011.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211108-WA0011"
    },
    {
        "id":  "6fb670af1d9a",
        "tags":  [
                     "20211111",
                     "wa0002"
                 ],
        "path":  "stickers/STK-20211111-WA0002.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211111-WA0002"
    },
    {
        "id":  "12d2fba382f9",
        "tags":  [
                     "20211111",
                     "wa0008"
                 ],
        "path":  "stickers/STK-20211111-WA0008.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211111-WA0008"
    },
    {
        "id":  "60b388004cc8",
        "tags":  [
                     "20211112",
                     "wa0016"
                 ],
        "path":  "stickers/STK-20211112-WA0016.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211112-WA0016"
    },
    {
        "id":  "e2b34035a2d4",
        "tags":  [
                     "20211112",
                     "wa0017"
                 ],
        "path":  "stickers/STK-20211112-WA0017.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211112-WA0017"
    },
    {
        "id":  "517f28a2e2a7",
        "tags":  [
                     "20211112",
                     "wa0021"
                 ],
        "path":  "stickers/STK-20211112-WA0021.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211112-WA0021"
    },
    {
        "id":  "ac275711849d",
        "tags":  [
                     "20211112",
                     "wa0026"
                 ],
        "path":  "stickers/STK-20211112-WA0026.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211112-WA0026"
    },
    {
        "id":  "904872d448ff",
        "tags":  [
                     "20211112",
                     "wa0029"
                 ],
        "path":  "stickers/STK-20211112-WA0029.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211112-WA0029"
    },
    {
        "id":  "9a515a1a5806",
        "tags":  [
                     "20211112",
                     "wa0030"
                 ],
        "path":  "stickers/STK-20211112-WA0030.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211112-WA0030"
    },
    {
        "id":  "5472f651dd01",
        "tags":  [
                     "20211112",
                     "wa0033"
                 ],
        "path":  "stickers/STK-20211112-WA0033.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211112-WA0033"
    },
    {
        "id":  "3bc318bc822f",
        "tags":  [
                     "20211113",
                     "wa0021"
                 ],
        "path":  "stickers/STK-20211113-WA0021.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211113-WA0021"
    },
    {
        "id":  "7ef9634174c5",
        "tags":  [
                     "20211114",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20211114-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211114-WA0001"
    },
    {
        "id":  "e40b64e591df",
        "tags":  [
                     "20211114",
                     "wa0003"
                 ],
        "path":  "stickers/STK-20211114-WA0003.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211114-WA0003"
    },
    {
        "id":  "bcc4745e86f7",
        "tags":  [
                     "20211115",
                     "wa0010"
                 ],
        "path":  "stickers/STK-20211115-WA0010.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211115-WA0010"
    },
    {
        "id":  "69c9b47c5814",
        "tags":  [
                     "20211115",
                     "wa0011"
                 ],
        "path":  "stickers/STK-20211115-WA0011.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211115-WA0011"
    },
    {
        "id":  "739b0fcb785a",
        "tags":  [
                     "20211115",
                     "wa0014"
                 ],
        "path":  "stickers/STK-20211115-WA0014.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211115-WA0014"
    },
    {
        "id":  "48aecdc98e88",
        "tags":  [
                     "20211115",
                     "wa0015"
                 ],
        "path":  "stickers/STK-20211115-WA0015.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211115-WA0015"
    },
    {
        "id":  "8a7564f080b3",
        "tags":  [
                     "20211115",
                     "wa0023"
                 ],
        "path":  "stickers/STK-20211115-WA0023.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211115-WA0023"
    },
    {
        "id":  "4983598842a7",
        "tags":  [
                     "20211115",
                     "wa0024"
                 ],
        "path":  "stickers/STK-20211115-WA0024.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211115-WA0024"
    },
    {
        "id":  "b34b407934a6",
        "tags":  [
                     "20211116",
                     "wa0031"
                 ],
        "path":  "stickers/STK-20211116-WA0031.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211116-WA0031"
    },
    {
        "id":  "ee851f1a87e1",
        "tags":  [
                     "20211118",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20211118-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211118-WA0000"
    },
    {
        "id":  "f232987ccf18",
        "tags":  [
                     "20211118",
                     "wa0010"
                 ],
        "path":  "stickers/STK-20211118-WA0010.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211118-WA0010"
    },
    {
        "id":  "abdf612d43d1",
        "tags":  [
                     "20211120",
                     "wa0009"
                 ],
        "path":  "stickers/STK-20211120-WA0009.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211120-WA0009"
    },
    {
        "id":  "cae9b2bd7bb5",
        "tags":  [
                     "20211122",
                     "wa0033"
                 ],
        "path":  "stickers/STK-20211122-WA0033.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211122-WA0033"
    },
    {
        "id":  "b3f52f1a6061",
        "tags":  [
                     "20211122",
                     "wa0034"
                 ],
        "path":  "stickers/STK-20211122-WA0034.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211122-WA0034"
    },
    {
        "id":  "b4963c198841",
        "tags":  [
                     "20211122",
                     "wa0035"
                 ],
        "path":  "stickers/STK-20211122-WA0035.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211122-WA0035"
    },
    {
        "id":  "1e3d4d21e74a",
        "tags":  [
                     "20211124",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20211124-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211124-WA0001"
    },
    {
        "id":  "3af95d818e4a",
        "tags":  [
                     "20211124",
                     "wa0002"
                 ],
        "path":  "stickers/STK-20211124-WA0002.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211124-WA0002"
    },
    {
        "id":  "a40533c1ee60",
        "tags":  [
                     "20211125",
                     "wa0024"
                 ],
        "path":  "stickers/STK-20211125-WA0024.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211125-WA0024"
    },
    {
        "id":  "f639b6042c69",
        "tags":  [
                     "20211125",
                     "wa0043"
                 ],
        "path":  "stickers/STK-20211125-WA0043.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211125-WA0043"
    },
    {
        "id":  "b2529be3ae80",
        "tags":  [
                     "20211125",
                     "wa0044"
                 ],
        "path":  "stickers/STK-20211125-WA0044.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211125-WA0044"
    },
    {
        "id":  "c1f49d5597cf",
        "tags":  [
                     "20211126",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20211126-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211126-WA0001"
    },
    {
        "id":  "58c5a3212044",
        "tags":  [
                     "20211126",
                     "wa0002"
                 ],
        "path":  "stickers/STK-20211126-WA0002.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211126-WA0002"
    },
    {
        "id":  "026aa4a2dcd0",
        "tags":  [
                     "20211126",
                     "wa0003"
                 ],
        "path":  "stickers/STK-20211126-WA0003.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20211126-WA0003"
    },
    {
        "id":  "a168932a8e32",
        "tags":  [
                     "20220517",
                     "wa0004"
                 ],
        "path":  "stickers/STK-20220517-WA0004.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220517-WA0004"
    },
    {
        "id":  "8ff11231975c",
        "tags":  [
                     "20220609",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20220609-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220609-WA0000"
    },
    {
        "id":  "2a4d4cc922fd",
        "tags":  [
                     "20220624",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20220624-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0000"
    },
    {
        "id":  "36172200ddc2",
        "tags":  [
                     "20220624",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20220624-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0001"
    },
    {
        "id":  "07ee4842bc78",
        "tags":  [
                     "20220624",
                     "wa0002"
                 ],
        "path":  "stickers/STK-20220624-WA0002.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0002"
    },
    {
        "id":  "0618dc0b79f1",
        "tags":  [
                     "20220624",
                     "wa0005"
                 ],
        "path":  "stickers/STK-20220624-WA0005.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0005"
    },
    {
        "id":  "dcf6aeca07dc",
        "tags":  [
                     "20220624",
                     "wa0006"
                 ],
        "path":  "stickers/STK-20220624-WA0006.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0006"
    },
    {
        "id":  "6eea65c577c7",
        "tags":  [
                     "20220624",
                     "wa0007"
                 ],
        "path":  "stickers/STK-20220624-WA0007.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0007"
    },
    {
        "id":  "6154d1d5bfbf",
        "tags":  [
                     "20220624",
                     "wa0022"
                 ],
        "path":  "stickers/STK-20220624-WA0022.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0022"
    },
    {
        "id":  "2e963a0162e3",
        "tags":  [
                     "20220624",
                     "wa0023"
                 ],
        "path":  "stickers/STK-20220624-WA0023.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0023"
    },
    {
        "id":  "2c2c4eee3499",
        "tags":  [
                     "20220624",
                     "wa0024"
                 ],
        "path":  "stickers/STK-20220624-WA0024.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0024"
    },
    {
        "id":  "e10804621a01",
        "tags":  [
                     "20220624",
                     "wa0025"
                 ],
        "path":  "stickers/STK-20220624-WA0025.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0025"
    },
    {
        "id":  "19c6a94124fc",
        "tags":  [
                     "20220624",
                     "wa0026"
                 ],
        "path":  "stickers/STK-20220624-WA0026.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0026"
    },
    {
        "id":  "61559eb779f8",
        "tags":  [
                     "20220624",
                     "wa0027"
                 ],
        "path":  "stickers/STK-20220624-WA0027.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0027"
    },
    {
        "id":  "10e5f582d4cc",
        "tags":  [
                     "20220624",
                     "wa0028"
                 ],
        "path":  "stickers/STK-20220624-WA0028.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0028"
    },
    {
        "id":  "d78395258943",
        "tags":  [
                     "20220624",
                     "wa0029"
                 ],
        "path":  "stickers/STK-20220624-WA0029.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0029"
    },
    {
        "id":  "ef6adff4dc0f",
        "tags":  [
                     "20220624",
                     "wa0030"
                 ],
        "path":  "stickers/STK-20220624-WA0030.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0030"
    },
    {
        "id":  "3c767352ed20",
        "tags":  [
                     "20220624",
                     "wa0034"
                 ],
        "path":  "stickers/STK-20220624-WA0034.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0034"
    },
    {
        "id":  "5fc4c4935acc",
        "tags":  [
                     "20220624",
                     "wa0035"
                 ],
        "path":  "stickers/STK-20220624-WA0035.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0035"
    },
    {
        "id":  "5ca146ac856a",
        "tags":  [
                     "20220624",
                     "wa0036"
                 ],
        "path":  "stickers/STK-20220624-WA0036.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0036"
    },
    {
        "id":  "d8bf488e68b1",
        "tags":  [
                     "20220624",
                     "wa0037"
                 ],
        "path":  "stickers/STK-20220624-WA0037.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0037"
    },
    {
        "id":  "79208c362357",
        "tags":  [
                     "20220624",
                     "wa0038"
                 ],
        "path":  "stickers/STK-20220624-WA0038.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0038"
    },
    {
        "id":  "c060a82721c5",
        "tags":  [
                     "20220624",
                     "wa0039"
                 ],
        "path":  "stickers/STK-20220624-WA0039.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0039"
    },
    {
        "id":  "84d4851ddd59",
        "tags":  [
                     "20220624",
                     "wa0050"
                 ],
        "path":  "stickers/STK-20220624-WA0050.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220624-WA0050"
    },
    {
        "id":  "a31c096fb223",
        "tags":  [
                     "20220719",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20220719-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220719-WA0001"
    },
    {
        "id":  "7d539aa0debb",
        "tags":  [
                     "20220728",
                     "wa0012"
                 ],
        "path":  "stickers/STK-20220728-WA0012.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220728-WA0012"
    },
    {
        "id":  "70d898481c82",
        "tags":  [
                     "20220805",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20220805-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220805-WA0001"
    },
    {
        "id":  "1fb42456d337",
        "tags":  [
                     "20220906",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20220906-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20220906-WA0000"
    },
    {
        "id":  "155a7a663ed1",
        "tags":  [
                     "20221005",
                     "wa0006"
                 ],
        "path":  "stickers/STK-20221005-WA0006.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20221005-WA0006"
    },
    {
        "id":  "a3bab96025f5",
        "tags":  [
                     "20221016",
                     "wa0002"
                 ],
        "path":  "stickers/STK-20221016-WA0002.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20221016-WA0002"
    },
    {
        "id":  "e5dac9bc3dfe",
        "tags":  [
                     "20221016",
                     "wa0003"
                 ],
        "path":  "stickers/STK-20221016-WA0003.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20221016-WA0003"
    },
    {
        "id":  "ac13f5e567ef",
        "tags":  [
                     "20221018",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20221018-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20221018-WA0001"
    },
    {
        "id":  "43737fc4b9fe",
        "tags":  [
                     "20221027",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20221027-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20221027-WA0000"
    },
    {
        "id":  "2ca510680be3",
        "tags":  [
                     "20221228",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20221228-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20221228-WA0000"
    },
    {
        "id":  "768729bf9fb9",
        "tags":  [
                     "20230125",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20230125-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20230125-WA0000"
    },
    {
        "id":  "99c7df309802",
        "tags":  [
                     "20230129",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20230129-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20230129-WA0000"
    },
    {
        "id":  "56a62315d285",
        "tags":  [
                     "20230129",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20230129-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20230129-WA0001"
    },
    {
        "id":  "d70f7aa7281c",
        "tags":  [
                     "20230201",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20230201-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20230201-WA0000"
    },
    {
        "id":  "b43f45447c00",
        "tags":  [
                     "20230516",
                     "wa0000"
                 ],
        "path":  "stickers/STK-20230516-WA0000.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20230516-WA0000"
    },
    {
        "id":  "6eb1ca5edc88",
        "tags":  [
                     "20230516",
                     "wa0001"
                 ],
        "path":  "stickers/STK-20230516-WA0001.webp",
        "type":  "sticker",
        "category":  "stickers",
        "title":  "STK-20230516-WA0001"
    }
];

  inject(CATALOG);

  function inject(catalog) {
    var stickers = catalog.filter(function(c){ return c.type === 'sticker'; });
    var memes    = catalog.filter(function(c){ return c.type === 'meme'; });
    var byCategory = {};
    memes.forEach(function(m){
      if (!byCategory[m.category]) byCategory[m.category] = [];
      byCategory[m.category].push(m);
    });

    var si = 0, mi = 0;
    function pickSticker() { return stickers[si++ % stickers.length]; }
    function pickMeme(cat) {
      var pool = (cat && byCategory[cat] && byCategory[cat].length) ? byCategory[cat] : memes;
      if (!pool.length) pool = stickers;
      return pool[mi++ % pool.length];
    }

    /* 1 — Replace every picsum <img> with a real sticker */
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function(img) {
      var src = img.getAttribute('src') || '';
      if (!src.includes('picsum.photos')) return;
      var item = pickSticker();
      img.src    = './media/' + item.path;
      img.alt    = item.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.objectFit  = 'cover';
      img.style.width  = img.style.width  || '100%';
      img.style.height = img.style.height || '100%';
      img.onerror = function(){ img.style.background='#FFF1EC'; img.removeAttribute('src'); };
    });

    /* 2 — Replace meme video slots with real <video> elements */
    var videoSlots = document.querySelectorAll(
      '.card-media-wrap,.meme-video-wrap,.featured-card,[data-meme-slot],.trending-item-media,.explore-card-media'
    );
    videoSlots.forEach(function(el) {
      var cat = (el.closest('[data-cat]') || {}).dataset && el.closest('[data-cat]').dataset.cat;
      var item = pickMeme(cat || null);
      if (!item) return;
      var vid = document.createElement('video');
      vid.src         = './media/' + item.path;
      vid.autoplay    = true;
      vid.loop        = true;
      vid.muted       = true;
      vid.playsInline = true;
      vid.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
      vid.onerror = function(){ vid.remove(); };
      el.innerHTML = '';
      el.appendChild(vid);
    });

    /* 3 — Patch visible card titles with real meme names */
    document.querySelectorAll('.card-title,.meme-card-title').forEach(function(el, i) {
      var item = memes[i % memes.length];
      if (item) el.textContent = item.title;
    });

    document.querySelectorAll('.card-subtitle,.card-cat,.meme-cat-label').forEach(function(el, i) {
      var item = memes[i % memes.length];
      if (item) el.textContent = item.category;
    });

    document.querySelectorAll('.card-tags,.meme-tags').forEach(function(el, i) {
      var item = memes[i % memes.length];
      if (!item) return;
      el.innerHTML = (item.tags || []).slice(0, 4).map(function(t){
        return '<span style="display:inline-block;background:#FFF1EC;color:#FF4500;font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;letter-spacing:.04em;margin:1px">' + t + '</span>';
      }).join('');
    });

    /* 4 — Console summary */
    console.log('[Whamr] Real media injected — ' + stickers.length + ' stickers + ' + memes.length + ' memes from local library');
  }

})();
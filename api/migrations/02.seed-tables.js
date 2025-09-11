/* eslint-disable no-unused-vars */
import { sequelize, Book, Genre, Status, User } from "../models/index.js";

// creation des listes
console.log("🌱 Creation des books...");




// Ajout des associations pour les nouveaux genres
// Horreur
const book1 = await Book.create({ title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", summary: "Il y a bien longtemps, dans les terres du Milieu, le Seigneur des Ténèbres Sauron forgea l'Anneau Unique, un artefact de pouvoir absolu capable de dominer tous les autres anneaux de pouvoir. Cependant, l'Anneau fut perdu lors d'une grande bataille et disparut pendant des siècles. Des années plus tard, il est retrouvé par un hobbit nommé Frodon Sacquet, qui se voit confier la mission périlleuse de détruire l'Anneau en le jetant dans les flammes de la Montagne du Destin, là où il a été forgé. Accompagné de ses fidèles amis Sam, Merry et Pippin, ainsi que d'un groupe hétéroclite comprenant Aragorn, Gandalf, Legolas, Gimli et Boromir, Frodon entreprend un voyage épique à travers des terres dangereuses et enchantées. Leur quête les mène à affronter des créatures terrifiantes telles que les Nazgûls, des serviteurs de Sauron, ainsi que des orcs et autres monstres. En chemin, ils rencontrent des alliés précieux comme les elfes de la Lothlórien et les hommes du Rohan. Cependant, la tentation de l'Anneau pèse lourdement sur Frodon, qui doit lutter contre son influence maléfique tout au long de leur périple. Le destin du monde repose sur leurs épaules alors qu'ils affrontent des épreuves inimaginables pour accomplir leur mission et sauver la Terre du Milieu du joug de Sauron.", image: "https://covers.openlibrary.org/b/id/8231856-M.jpg" });

const book2 = await Book.create({ title: "1984", author: "George Orwell", summary: "Année 1984 en Océanie. 1984 ? C'est en tout cas ce qu'il semble à Winston, qui ne saurait toutefois en jurer. Le passé a été réinventé, et les événements les plus récents sont susceptibles d'être modifiés. Winston est lui-même chargé de récrire les archives qui contredisent le présent et les promesses de Big Brother. Grâce à une technologie de pointe, ce dernier sait tout, voit tout. Liberté est Servitude. Ignorance est Puissance. Telles sont les devises du régime. ", image: "https://covers.openlibrary.org/b/id/966097-M.jpg" });
const book3 = await Book.create({ title: "Harry Potter à l'école des sorciers", author: "J.K. Rowling", summary: "Le jour de ses onze ans, Harry Potter, un orphelin élevé par un oncle et une tante qui le détestent, voit son existence bouleversée. Un géant vient le chercher pour l'emmener à Poudlard, une école de sorcellerie ! Voler en balai, jeter des sorts, combattre les trolls : Harry révèle de grands talents. Mais un mystère entoure sa naissance et l'effroyable V., le mage dont personne n'ose prononcer le nom. Titre recommandé par l'Éducation nationale en classe de 6e, 5e et 4e", image: "https://ia902309.us.archive.org/view_archive.php?archive=/20/items/l_covers_0008/l_covers_0008_49.zip&file=0008494529-L.jpg" });
const book4 = await Book.create({ title: "Naruto", author: "Masashi Kishimoto", summary: "Naruto est un garçon un peu spécial. Il est toujours tout seul et son caractère fougueux ne l'aide pas vraiment à se faire apprécier dans son village. Malgré cela, il garde au fond de lui une ambition: celle de devenir un maître Hokage, la plus haute distinction dans l'ordre des ninjas, et ainsi obtenir la reconnaissance de ses pairs.", image: "https://ia903200.us.archive.org/view_archive.php?archive=/23/items/m_covers_0009/m_covers_0009_34.zip&file=0009340715-M.jpg" });
const book5 = await Book.create({ title: "Dune", author: "Frank Herbert", summary: "Le chef-d'oeuvre absolu de la science-fiction. Il n'y a pas, dans tout l'Empire, de planète plus inhospitalière que Dune. Partout du sable, à perte de vue. Une seule richesse : l'épice de longue vie, née du désert et que l'univers tout entier convoite.", image: "https://covers.openlibrary.org/b/id/6451682-M.jpg" });
const book6 = await Book.create({ title: "L'Étranger", author: "Albert Camus", summary: "Quand la sonnerie a encore retenti, que la porte du box s'est ouverte, c'est le silence de la salle qui est monté vers moi, le silence, et cette singulière sensation que j'ai eue lorsque j'ai constaté que le jeune journaliste avait détourné les yeux. Je n'ai pas regardé du côté de Marie. Je n'en ai pas eu le temps parce que le président m'a dit dans une forme bizarre que j'aurais la tête tranchée sur une place publique au nom du peuple français...,", image: "https://images.epagine.fr/002/9782070212002_1_75.jpg" });
const book7 = await Book.create({ title: "Les Misérables", author: "Victor Hugo", summary: "« Je m'appelle Jean Valjean. Je suis un galérien. J'ai passé dix-neuf ans au bagne. Je suis libéré depuis quatre jours et en route pour Pontarlier qui est ma destination. Quatre jours que je marche depuis Toulon. Aujourd'hui j'ai fait douze lieues à pied. Ce soir en arrivant dans ce pays, j'ai été dans une auberge, on m'a renvoyé à cause de mon passeport jaune que j'avais montré à la mairie. J'ai été à une autre auberge. On m'a dit : - Va-t'en!  »", image: "https://covers.openlibrary.org/b/id/15003375-L.jpg" });
const book8 = await Book.create({ title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", summary: "J'ai ainsi vécu seul, sans personne avec qui parler véritablement, jusqu'à une panne dans le désert du Sahara, il y a six ans. Quelque chose s'était cassé dans mon moteur. Et comme je n'avais avec moi ni mécanicien, ni passagers, je me préparai à essayer de réussir, tout seul, une réparation difficile. C'était pour moi une question de vie ou de mort. J'avais à peine de l'eau à boire pour huit jours. Le premier soir je me suis donc endormi sur le sable à mille milles de toute terre habitée. ", image: "https://www.gallimard.fr/system/files/migrations/ouvrages/couvertures/A40850.jpg" });
const book9 = await Book.create({ title: "La Peste", author: "Albert Camus", summary: " - Naturellement, vous savez ce que c'est, Rieux ? - J'attends le résultat des analyses. - Moi, je le sais. Et je n'ai pas besoin d'analyses. J'ai fait une partie de ma carrière en Chine, et j'ai vu quelques cas à Paris, il y a une vingtaine d'années. Seulement, on n'a pas osé leur donner un nom, sur le moment... Et puis, comme disait un confrère : C'est impossible, tout le monde sait qu'elle a disparu de l'Occident.", image: "https://ia802309.us.archive.org/view_archive.php?archive=/20/items/l_covers_0008/l_covers_0008_29.zip&file=0008296472-L.jpg" });
const book10 = await Book.create({ title: "Le Comte de Monte-Cristo", author: "Alexandre Dumas", summary: "Comment devenir comte de Monte-Cristo quand on est simple marin ? Ce roman est le récit d'une transformation, de celles qui affectent les créatures acculées au changement : la métamorphose. Espérant modestement devenir capitaine, Edmond Dantès se heurtera pourtant à la conspiration la plus lâche. Dans les geôles du château d'If, où il a été injustement jeté, Edmond entame la mue d'un être rivé à la plus dévorante des passions : la vengeance. ", image: "https://m.media-amazon.com/images/I/71ZcP22phyL._UF1000,1000_QL80_.jpg" });
const book11 = await Book.create({ title: "Madame Bovary", author: "Gustave Flaubert", summary: "C'est l'histoire d'une femme mal mariée, de son médiocre époux, de ses amants égoïstes et vains, de ses rêves, de ses chimères, de sa mort. C'est l'histoire d'une province étroite, dévote et bourgeoise. C'est, aussi, l'histoire du roman français. Rien, dans ce tableau, n'avait de quoi choquer la société du Second Empire.", image: "https://ia600505.us.archive.org/view_archive.php?archive=/25/items/m_covers_0010/m_covers_0010_99.zip&file=0010998605-M.jpg" });
const book12 = await Book.create({ title: "Crime et Châtiment", author: "Fiodor Dostoïevski", summary: "A  Saint-Pétersbourg, en 1865, Raskolnikov, un jeune noble sombre et altier, renfermé mais aussi généreux, a interrompu ses études faute d’argent. Endetté auprès de sa logeuse qui lui loue une étroite mansarde, il se sent écrasé par sa pauvreté. Mais il se croit aussi appelé à un grand avenir et, dédaigneux de la loi morale, se pense fondé à commettre un crime : ce qu’il va faire bientôt – de manière crapuleuse. ", image: "https://covers.openlibrary.org/b/id/13643709-L.jpg" });
const book13 = await Book.create({ title: "Germinal", author: "Émile Zola", summary: "Voici, dans la France moderne et industrielle, les ' Misérables ' de Zola. Ce roman des mineurs, c'est aussi l'Enfer, dans un monde dantesque, où l'on ' voyage au bout de la nuit '. Mais à la fin du prodigieux itinéraire au centre de la terre, du fond du souterrain où il a vécu si longtemps écrasé, l'homme enfin se redresse et surgit dans une révolte pleine d'espoirs. ", image: "https://ia600703.us.archive.org/view_archive.php?archive=/4/items/m_covers_0008/m_covers_0008_23.zip&file=0008236934-M.jpg" });
const book14 = await Book.create({ title: "Don Quichotte", author: "Miguel de Cervantes", summary: "« Dans un village de la Manche dont je ne veux pas me rappeler le nom, vivait, il n’y a pas si longtemps, un de ces hidalgos à lance au râtelier, bouclier antique, maigre rosse et lévrier courant. Un pot-au-feu plus vache que mouton, du ragoût tous les soirs ou presque, des lentilles le vendredi, quelque pigeonneau le dimanche en plus de l’ordinaire consommaient les trois quarts de son bien.. »", image: "https://ia800502.us.archive.org/view_archive.php?archive=/31/items/m_covers_0013/m_covers_0013_34.zip&file=0013342356-M.jpg" });
const book15 = await Book.create({ title: "L'Odyssée", author: "Homère", summary: "À la fin de la guerre de Troie, le héros grec Ulysse s'apprête à regagner sa patrie, Ithaque, où l'attendent patiemment son épouse Pénélope et son fils Télémaque. Mais les dieux en ont décidé autrement. Errant sur la mer pendant dix ans, il va devoir essuyer de terribles tempêtes et affronter tour à tour des créatures monstrueuses ... Parviendra-t-il à surmonter ces épreuves et à rejoindre Ithaque ?", image: "https://static.fnac-static.com/multimedia/PE/Images/FR/NR/f4/c5/02/181748/1507-1/tsp20250820073211/L-Odyee.jpg" });
const book16 = await Book.create({ title: "Candide", author: "Voltaire", summary: "Un jeune homme, Candide, mené de malheurs en catastrophes, parcourt le monde et découvre la dure réalité derrière l'optimisme philosophique de son maître Pangloss.", image: "https://ia800100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_92.zip&file=0012922377-L.jpg" });
const book17 = await Book.create({ title: "Le Rouge et le Noir", author: "Stendhal", summary: "Julien Sorel, fils de charpentier, rêve de gloire et d'ascension sociale dans une France marquée par la Restauration. Son ambition le mènera à sa perte.", image: "https://covers.openlibrary.org/b/id/15050001-L.jpg" });
const book18 = await Book.create({ title: "Les Fleurs du mal", author: "Charles Baudelaire", summary: "Recueil de poèmes où Baudelaire explore la beauté, la mélancolie, l'amour, le spleen et l'idéal à travers des vers inoubliables.", image: "https://ia600100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_95.zip&file=0012953801-L.jpg" });
const book19 = await Book.create({ title: "Bel-Ami", author: "Guy de Maupassant", summary: "Georges Duroy, jeune homme ambitieux et séducteur, gravit les échelons de la société parisienne grâce à son charme et ses intrigues.", image: "https://ia801504.us.archive.org/view_archive.php?archive=/23/items/olcovers197/olcovers197-L.zip&file=1979391-L.jpg" });
const book20 = await Book.create({ title: "Le Vieil Homme et la Mer", author: "Ernest Hemingway", summary: "Un vieux pêcheur cubain lutte avec acharnement contre un gigantesque espadon au large de la mer des Caraïbes.", image: "https://ia803400.us.archive.org/view_archive.php?archive=/30/items/olcovers96/olcovers96-L.zip&file=968201-L.jpg" });
const book21 = await Book.create({ title: "Moby Dick", author: "Herman Melville", summary: "Le capitaine Achab poursuit sans relâche la gigantesque baleine blanche Moby Dick, symbole de sa vengeance obsessionnelle.", image: "https://ia600100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_62.zip&file=0012621992-L.jpg" });
const book22 = await Book.create({ title: "Frankenstein", author: "Mary Shelley", summary: "Le docteur Victor Frankenstein crée une créature artificielle qui lui échappe et sème la terreur.", image: "https://ia601400.us.archive.org/view_archive.php?archive=/17/items/olcovers490/olcovers490-L.zip&file=4902825-L.jpg" });
const book23 = await Book.create({ title: "Dracula", author: "Bram Stoker", summary: "Le comte Dracula, vampire de Transylvanie, tente d’étendre son influence en Angleterre, où il sera confronté à Van Helsing.", image: "https://ia800100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_62.zip&file=0012622155-L.jpg" });
const book24 = await Book.create({ title: "Le Nom de la Rose", author: "Umberto Eco", summary: "Enquête médiévale dans une abbaye bénédictine où les meurtres mystérieux s’enchaînent. Guillaume de Baskerville mène l’investigation.", image: "https://ia601400.us.archive.org/view_archive.php?archive=/0/items/olcovers97/olcovers97-L.zip&file=976764-L.jpg" });
const book25 = await Book.create({ title: "Les Trois Mousquetaires", author: "Alexandre Dumas", summary: "D’Artagnan et ses compagnons Athos, Porthos et Aramis défendent l’honneur de la reine de France contre les intrigues du cardinal de Richelieu.", image: "https://ia800505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_55.zip&file=0014556983-L.jpg" });
const book26 = await Book.create({ title: "Jane Eyre", author: "Charlotte Brontë", summary: "Une orpheline devenue gouvernante tombe amoureuse de son maître, le sombre et mystérieux Mr Rochester.", image: "https://ia800100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_75.zip&file=0012752089-L.jpg" });
const book27 = await Book.create({ title: "Orgueil et Préjugés", author: "Jane Austen", summary: "Elizabeth Bennet et M. Darcy s’affrontent dans un duel d’esprit, de fierté et de sentiments.", image: "https://ia600505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_53.zip&file=0014534647-L.jpg" });
const book28 = await Book.create({ title: "Les Hauts de Hurlevent", author: "Emily Brontë", summary: "L’histoire tragique et passionnée entre Heathcliff et Catherine, dans la lande anglaise.", image: "https://ia904605.us.archive.org/view_archive.php?archive=/14/items/l_covers_0011/l_covers_0011_10.zip&file=0011100586-L.jpg" });
const book29 = await Book.create({ title: "La Métamorphose", author: "Franz Kafka", summary: "Un matin, Gregor Samsa se réveille transformé en un énorme insecte, bouleversant sa vie et celle de sa famille.", image: "https://ia804605.us.archive.org/view_archive.php?archive=/14/items/l_covers_0011/l_covers_0011_66.zip&file=0011664004-L.jpg" });
const book30 = await Book.create({ title: "Le Procès", author: "Franz Kafka", summary: "Joseph K., arrêté sans explication, doit affronter un procès absurde dans une bureaucratie étouffante.", image: "https://ia800404.us.archive.org/view_archive.php?archive=/33/items/l_covers_0010/l_covers_0010_55.zip&file=0010557121-L.jpg" });
const book31 = await Book.create({ title: "Sur la route", author: "Jack Kerouac", summary: "Après un divorce, Sal Paradise, jeune écrivain de la côte Est, se lance dans un voyage à travers les États-Unis en quête d’expériences et d’aventure. Il traverse plusieurs villes où il fait des rencontres marquantes et explore la vie de bohème avec Dean Moriarty et leurs amis.", image: "https://ia803400.us.archive.org/view_archive.php?archive=/30/items/olcovers96/olcovers96-L.zip&file=968207-L.jpg" });
const book32 = await Book.create({ title: "De la Terre à la Lune", author: "Jules Verne", summary: "Après la guerre de Sécession, des passionnés de sciences conçoivent un gigantesque canon pour envoyer un projectile vers la Lune.", image: "https://ia800505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_45.zip&file=0014457349-L.jpg" });
const book33 = await Book.create({ title: "Vingt mille lieues sous les mers", author: "Jules Verne", summary: "Le capitaine Nemo entraîne ses passagers dans des explorations marines extraordinaires à bord du Nautilus.", image: "https://ia600100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_84.zip&file=0012840603-L.jpg" });
const book34 = await Book.create({ title: "Le Tour du monde en quatre-vingts jours", author: "Jules Verne", summary: "Phileas Fogg parie de faire le tour du monde en 80 jours avec son fidèle Passepartout.", image: "https://ia904605.us.archive.org/view_archive.php?archive=/14/items/l_covers_0011/l_covers_0011_28.zip&file=0011283511-L.jpg" });
const book35 = await Book.create({ title: "Les Enfants du capitaine Grant", author: "Jules Verne", summary: "À la recherche d’un père disparu, des explorateurs traversent mers et continents guidés par un message en bouteille.", image: "https://ia800507.us.archive.org/view_archive.php?archive=/8/items/l_covers_0009/l_covers_0009_94.zip&file=0009947937-L.jpg" });
const book36 = await Book.create({ title: "La Guerre des mondes", author: "H.G. Wells", summary: "L’invasion de la Terre par des Martiens redoutables, racontée avec réalisme et terreur.", image: "https://ia800404.us.archive.org/view_archive.php?archive=/33/items/l_covers_0010/l_covers_0010_77.zip&file=0010774345-L.jpg" });
const book37 = await Book.create({ title: "La Machine à explorer le temps", author: "H.G. Wells", summary: "Un scientifique invente une machine pour voyager à travers les âges, découvrant des civilisations étranges.", image: "https://ia600100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_62.zip&file=0012621679-L.jpg" });
const book38 = await Book.create({ title: "L’Homme invisible", author: "H.G. Wells", summary: "Un savant devient invisible grâce à une formule, mais sombre dans la folie et la criminalité.", image: "https://ia903203.us.archive.org/view_archive.php?archive=/5/items/olcovers213/olcovers213-L.zip&file=2132527-L.jpg" });
const book39 = await Book.create({ title: "Le Meilleur des mondes", author: "Aldous Huxley", summary: "Une dystopie où les humains sont conditionnés pour vivre heureux dans une société contrôlée.", image: "https://ia600507.us.archive.org/view_archive.php?archive=/8/items/l_covers_0009/l_covers_0009_38.zip&file=0009382676-L.jpg" });
const book40 = await Book.create({ title: "Fahrenheit 451", author: "Ray Bradbury", summary: "Dans un futur totalitaire, les livres sont interdits et brûlés par les pompiers. Montag commence à douter.", image: "https://covers.openlibrary.org/b/id/14860205-L.jpg" });
const book41 = await Book.create({ title: "Shining", author: "Stephen King", summary: "Jack Torrance accepte un emploi de gardien d’hôtel isolé en hiver. L’isolement et des forces maléfiques le font sombrer.", image: "https://covers.openlibrary.org/b/id/15090478-L.jpg" });
const book42 = await Book.create({ title: "Ça (It)", author: "Stephen King", summary: "Une créature maléfique revient tous les 27 ans hanter la petite ville de Derry, prenant souvent la forme d’un clown.", image: "https://ia600505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_65.zip&file=0014651795-L.jpg" });
const book43 = await Book.create({ title: "Le Fléau", author: "Stephen King", summary: "Une épidémie dévastatrice réduit l’humanité à néant et divise les survivants entre bien et mal.", image: "https://ia800505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_65.zip&file=0014657541-L.jpg" });
const book44 = await Book.create({ title: "American Gods", author: "Neil Gaiman", summary: "Shadow découvre que les anciens dieux affrontent les nouvelles divinités de la modernité dans un combat épique.", image: "https://ia800505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_42.zip&file=0014420908-L.jpg" });
const book45 = await Book.create({ title: "Coraline", author: "Neil Gaiman", summary: "Une fillette découvre une maison parallèle où tout semble parfait, mais cache un effroyable secret.", image: "https://covers.openlibrary.org/b/id/15096597-L.jpg" });
const book46 = await Book.create({ title: "Millénium : Les hommes qui n’aimaient pas les femmes", author: "Stieg Larsson", summary: "Le journaliste Mikael Blomkvist et la mystérieuse hackeuse Lisbeth Salander enquêtent sur une disparition vieille de quarante ans.", image: "https://ia800404.us.archive.org/view_archive.php?archive=/33/items/l_covers_0010/l_covers_0010_51.zip&file=0010518619-L.jpg" });
const book47 = await Book.create({ title: "Le Silence des agneaux", author: "Thomas Harris", summary: "L’agent du FBI Clarice Starling sollicite l’aide du brillant mais terrifiant Dr Hannibal Lecter pour traquer un tueur en série.", image: "https://ia800404.us.archive.org/view_archive.php?archive=/33/items/l_covers_0010/l_covers_0010_61.zip&file=0010612193-L.jpg" });
const book48 = await Book.create({ title: "Death Note", author: "Tsugumi Ohba & Takeshi Obata", summary: "Light Yagami découvre un cahier surnaturel qui permet de tuer quiconque dont on écrit le nom, ce qui attire l’attention du détective L.", image: "https://ia600701.us.archive.org/view_archive.php?archive=/6/items/olcovers639/olcovers639-L.zip&file=6390630-L.jpg" });
const book49 = await Book.create({ title: "One Piece", author: "Eiichiro Oda", summary: "Monkey D. Luffy rêve de devenir le roi des pirates et part à l’aventure pour trouver le légendaire trésor One Piece.", image: "https://covers.openlibrary.org/b/id/15108306-L.jpg" });
const book50 = await Book.create({ title: "Frieren", author: "Kanehito Yamada", summary: "L'histoire suit l'elfe magicienne Frieren, une ancienne membre du groupe d'aventuriers qui a vaincu le roi des démons et restauré l'harmonie du monde après une quête de 10 ans.", image: "https://ia600505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_65.zip&file=0014657020-L.jpg" });
const book51 = await Book.create({ title: "Steve Jobs", author: "Walter Isaacson", summary: "La biographie officielle de Steve Jobs, co-fondateur d'Apple, révélant sa personnalité complexe et son génie créatif qui ont révolutionné six industries : ordinateurs personnels, films d'animation, musique, téléphones, tablettes et édition numérique.", image: "https://ia800505.us.archive.org/view_archive.php?archive=/5/items/m_covers_0012/m_covers_0012_68.zip&file=0012680694-M.jpg" });
const book52 = await Book.create({ title: "Einstein : Sa vie, son œuvre", author: "Abraham Pais", summary: "Une biographie scientifique d'Albert Einstein, explorant sa révolution de la physique moderne, sa théorie de la relativité et son impact sur notre compréhension de l'univers.", image: "https://covers.openlibrary.org/b/id/87654321-L.jpg" });


console.log("✅ Books crées\n");

// creation des Genres
console.log("🌱 Creation des genres...");
const genre1 = await Genre.create({ label: "Fantasy" });
const genre2 = await Genre.create({ label: "Science-Fiction" });
const genre3 = await Genre.create({ label: "Jeunesse" });
const genre4 = await Genre.create({ label: "Manga" });
const genre5 = await Genre.create({ label: "Philosophie" });
const genre6 = await Genre.create({ label: "Classique" });
const genre7 = await Genre.create({ label: "Roman" });
const genre8 = await Genre.create({ label: "Épopée" });
const genre9 = await Genre.create({ label: "Horreur" });
const genre10 = await Genre.create({ label: "Policier" });
const genre11 = await Genre.create({ label: "Biographie" });


console.log("✅ Genres crées\n");



// creation des status
console.log("🌱 Creation des status...");
const status1 = await Status.create({ name: "Lu" });
const status2 = await Status.create({ name: "a_lire" });

console.log("✅ Status crées\n");

// creation des users
console.log("🌱 Creation des utilisateurs...");
const user1 = await User.create({ username: "Alice", email: "alice@hotmail.fr", role: "admin", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd
const user2 = await User.create({ username: "Bob", email: "bob@hotmail.fr", role: "member", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd
const user3 = await User.create({ username: "Charlie", email: "charlie@gmail.com", role: "member", status: "Inactif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd
const user4 = await User.create({ username: "Diana", email: "diana@gmail.com", role: "member", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd
const user5 = await User.create({ username: "Thomas", email: "Thomas@gmail.com", role: "admin", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd
const user6 = await User.create({ username: "Frank", email: "frank@gmail.com", role: "member", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd
const user7 = await User.create({ username: "Grace", email: "grace@gmail.com", role: "member", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd
const user8 = await User.create({ username: "Youssef", email: "Youssef@gmail.com", role: "admin", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd
const user9 = await User.create({ username: "ludo", email: "ludovic@got.gov", role: "admin", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$L7cuSyAvD7ebuXjNjDIEsA$j0R9AelNNMwX52gfb5PVhHkiCR02U+H/Z/fCtAlAGV0" }); // azerty1234
const user10 = await User.create({ username: "damien", email: "damien@got.gov", role: "admin", status: "Actif", password: "$argon2id$v=19$m=65536,t=3,p=4$A5k8hA5iedzpz29gkhaILQ$yxb2/F7f102YuwHYGxIYCPoGUj6Giz7oixzaMlpiLNM" }); // Passw0rd


console.log("✅ Nouveaux utilisateurs créés\n");

console.log("✅ Utilisateurs crées\n");



// association des users aux books
console.log("🌱 Association des users aux books...");
// on utilise les "specials methods" de sequelize pour ajouter des associations
await user1.addBook(book1, { through: { statusId: status1.id } }); // Alice a lu Le Seigneur des Anneaux
await user1.addBook(book2, { through: { statusId: status2.id } }); // Alice a à lire 1984
await user2.addBook(book2, { through: { statusId: status1.id } }); // Bob a lu 1984
await user3.addBook(book3, { through: { statusId: status1.id } }); // Charlie a lu Harry Potter
await user3.addBook(book4, { through: { statusId: status2.id } }); // Charlie a à lire Naruto
await user4.addBook(book5, { through: { statusId: status1.id } }); // Diana a lu Dune
await user4.addBook(book6, { through: { statusId: status2.id } }); // Diana a à lire L'Étranger
await user5.addBook(book7, { through: { statusId: status1.id } }); // Thomas a lu Les Misérables
await user5.addBook(book8, { through: { statusId: status2.id } }); // Thomas a à lire Le Petit Prince
await user6.addBook(book9, { through: { statusId: status1.id } }); // Frank a lu La Peste
await user6.addBook(book10, { through: { statusId: status2.id } }); // Frank a à lire Le Comte de Monte-Cristo
await user7.addBook(book11, { through: { statusId: status1.id } }); // Grace a lu Madame Bovary
await user7.addBook(book12, { through: { statusId: status2.id } }); // Grace a à lire Crime et Châtiment
await user8.addBook(book13, { through: { statusId: status1.id } }); // Youssef a lu Germinal
await user8.addBook(book14, { through: { statusId: status2.id } }); // Youssef a à lire Don Quichotte
await user1.addBook(book15, { through: { statusId: status1.id } }); // Alice a lu L'Odyssée

console.log("✅ Users associés aux books\n");

console.log("🌱 Association des genres aux books...")
// association des genres aux books
await book1.addGenre(genre1); // Le Seigneur des Anneaux est un livre de Fantasy
await book2.addGenre(genre2); // 1984 est un livre de Science-Fiction
await book3.addGenre(genre3); // Harry Potter est un livre de Jeunesse
await book4.addGenre(genre4); // Naruto est un livre de Manga
await book5.addGenre(genre2); // Dune est un livre de Science-Fiction
await book6.addGenre(genre5); // L'Étranger est un livre de Philosophie
await book7.addGenre(genre6); // Les Misérables est un livre Classique
await book8.addGenre(genre7); // Le Petit Prince est un Roman
await book9.addGenre(genre5); // La Peste est un livre de Philosophie
await book10.addGenre(genre6); // Le Comte de Monte-Cristo est un livre Classique
await book11.addGenre(genre7); // Madame Bovary est un Roman
await book12.addGenre(genre6); // Crime et Châtiment est un livre Classique
await book13.addGenre(genre6); // Germinal est un livre Classique
await book14.addGenre(genre6); // Don Quichotte est un livre Classique
await book15.addGenre(genre8); // L'Odyssée est une Épopée
await book16.addGenre(genre6); // Classique
await book17.addGenre(genre6); // Classique
await book18.addGenre(genre5); // Philosophie
await book19.addGenre(genre6); // Classique
await book20.addGenre(genre7); // Roman
await book21.addGenre(genre7); // Roman
await book22.addGenre(genre9); // Roman
await book23.addGenre(genre9); // Roman
await book24.addGenre(genre7); // Roman
await book25.addGenre(genre6); // Classique
await book26.addGenre(genre6); // Classique
await book27.addGenre(genre6); // Classique
await book28.addGenre(genre6); // Classique
await book29.addGenre(genre6); // Classique
await book30.addGenre(genre6); // Classique
await book31.addGenre(genre7); // Roman
await book32.addGenre(genre2); // Science-Fiction
await book33.addGenre(genre2); // Science-Fiction
await book34.addGenre(genre2); // Science-Fiction
await book35.addGenre(genre2); // Science-Fiction
await book36.addGenre(genre2); // Science-Fiction
await book37.addGenre(genre2); // Science-Fiction
await book38.addGenre(genre9); // Science-Fiction
await book39.addGenre(genre2); // Science-Fiction
await book40.addGenre(genre2); // Science-Fiction
await book41.addGenre(genre9); // Roman
await book42.addGenre(genre9); // Roman
await book43.addGenre(genre9); // Roman
await book44.addGenre(genre1); // Fantasy
await book45.addGenre(genre3); // Jeunesse
await book46.addGenre(genre10); // Roman
await book47.addGenre(genre10); // Roman
await book48.addGenre(genre4); // Manga
await book49.addGenre(genre4); // Manga
await book50.addGenre(genre4); // Manga
await book51.addGenre(genre11); // Steve Jobs
await book52.addGenre(genre11); // Einstein : Sa vie, son œuvre

console.log("✅ Genres associés aux books\n");



// ferme manuellement la connexion
await sequelize.close();
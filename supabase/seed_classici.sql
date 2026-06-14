-- Inserimento dei 14 itinerari classici (Toscana, Umbria, Marche) nel database.
-- Esegui in Supabase: SQL Editor -> New query -> incolla tutto -> Run.
-- Prerequisito: aver gia' eseguito migration_regioni.sql e migration_origine.sql.
-- Sicuro da rieseguire: cancella prima gli stessi slug, poi reinserisce.

delete from public.itinerari where slug in ('chianti-firenze-siena', 'val-d-orcia-amiata', 'passo-della-futa-raticosa', 'passo-del-muraglione', 'maremma-argentario', 'castelluccio-piani-grandi', 'valnerina-cascata-marmore', 'strada-del-sagrantino', 'anello-del-trasimeno', 'spoleto-monteluco', 'gola-del-furlo', 'frasassi-valle-esino', 'riviera-del-conero', 'san-bartolo-gabicce');

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('chianti-firenze-siena','Strada del Chianti','La Chiantigiana tra Firenze e Siena','La SR222 Chiantigiana e'' la cartolina della Toscana in moto: saliscendi continui tra vigneti e oliveti, curve dolci e ben disegnate, borghi come Greve, Panzano, Castellina e Radda uno dietro l''altro. Asfalto generalmente buono, traffico contenuto fuori stagione. Si presta a soste lunghe tra cantine e pievi. Primavera e autunno danno i colori migliori.','Chianti (FI-SI)',70,3,'facile','Aprile-Giugno e Settembre-Ottobre',false,
   '[[43.7696,11.2558], [43.5836,11.3157], [43.5471,11.3162], [43.4699,11.2837], [43.3188,11.3308]]'::jsonb, null, array['toscana'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('chianti-firenze-siena',1,'Firenze','partenza',43.7696,11.2558,'Si imbocca la SR222 da sud citta'''),
  ('chianti-firenze-siena',2,'Greve in Chianti','sosta',43.5836,11.3157,'Piazza Matteotti, cuore del Chianti'),
  ('chianti-firenze-siena',3,'Panzano','panorama',43.5471,11.3162,'Vista sulle colline'),
  ('chianti-firenze-siena',4,'Castellina in Chianti','sosta',43.4699,11.2837,null),
  ('chianti-firenze-siena',5,'Siena','arrivo',43.3188,11.3308,'La citta'' del Palio')
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('val-d-orcia-amiata','Val d''Orcia e Monte Amiata','Colline UNESCO e la salita all''Amiata','Uno dei paesaggi piu'' fotografati d''Italia: le crete della Val d''Orcia tra Pienza, San Quirico e Montalcino, poi la strada tutta curve che sale al Monte Amiata passando per l''Abbazia di Sant''Antimo. Tratti piu'' tecnici rispetto alle colline del Chianti, panorami amplissimi. Sosta classica alle terme di Bagno Vignoni.','Val d''Orcia (SI)',110,4,'medio','Aprile-Ottobre',false,
   '[[43.0576,11.4894], [43.0167,11.5167], [43.0289,11.6181], [43.0786,11.6789], [42.8886,11.6206]]'::jsonb, null, array['toscana'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('val-d-orcia-amiata',1,'Montalcino','partenza',43.0576,11.4894,'Terra del Brunello'),
  ('val-d-orcia-amiata',2,'Abbazia di Sant''Antimo','panorama',43.0167,11.5167,'Strada tutta curve verso l''abbazia'),
  ('val-d-orcia-amiata',3,'Bagno Vignoni','sosta',43.0289,11.6181,'Terme nella piazza-vasca'),
  ('val-d-orcia-amiata',4,'Pienza','sosta',43.0786,11.6789,'Borgo rinascimentale, pecorino'),
  ('val-d-orcia-amiata',5,'Monte Amiata','arrivo',42.8886,11.6206,'Salita panoramica al vulcano spento')
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('passo-della-futa-raticosa','Passo della Futa e Raticosa','I due passi-icona dell''Appennino','La SS65 della Futa collega Firenze a Bologna ed e'' uno dei valichi piu'' frequentati dai motociclisti del centro Italia: curve ampie, buon grip, ritrovo storico al valico. Si abbina alla Raticosa, piu'' stretta e tecnica. Nei weekend primaverili il traffico aumenta: meglio partire presto.','Appennino tosco-emiliano',60,2,'medio','Maggio-Ottobre',false,
   '[[43.9622,11.3247], [44.0731,11.3017], [44.1136,11.3361], [44.1242,11.3506]]'::jsonb, null, array['toscana','emilia-romagna'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('passo-della-futa-raticosa',1,'San Piero a Sieve','partenza',43.9622,11.3247,'Imbocco SS65 da sud'),
  ('passo-della-futa-raticosa',2,'Passo della Futa','panorama',44.0731,11.3017,'Valico a 903 m, punto di ritrovo'),
  ('passo-della-futa-raticosa',3,'Passo della Raticosa','panorama',44.1136,11.3361,'Piu'' stretto e tecnico, 968 m'),
  ('passo-della-futa-raticosa',4,'Pietramala','arrivo',44.1242,11.3506,null)
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('passo-del-muraglione','Passo del Muraglione','La SS67 tra Toscana e Romagna','La SS67 tra Pontassieve e Forli'' sale al Passo del Muraglione, piu'' tecnico della Futa: curve ravvicinate, variazioni di raggio, traffico turistico nelle belle giornate. Il valico, riconoscibile per il muro che lo protegge dal vento, e'' un ritrovo storico per motociclisti.','Appennino (FI-FC)',40,2,'medio','Maggio-Giugno e Settembre',false,
   '[[43.7758,11.4392], [43.9217,11.6217], [43.9544,11.6889], [44.0589,11.8444]]'::jsonb, null, array['toscana','emilia-romagna'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('passo-del-muraglione',1,'Pontassieve','partenza',43.7758,11.4392,null),
  ('passo-del-muraglione',2,'San Godenzo','sosta',43.9217,11.6217,null),
  ('passo-del-muraglione',3,'Passo del Muraglione','panorama',43.9544,11.6889,'Valico a 907 m'),
  ('passo-del-muraglione',4,'Rocca San Casciano','arrivo',44.0589,11.8444,null)
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('maremma-argentario','Maremma e Argentario','Colline selvagge e il giro del promontorio','La Maremma e'' la Toscana piu'' selvaggia: borghi come Pitigliano, Sorano e Manciano, le terme di Saturnia, poi la discesa al mare e il periplo del promontorio dell''Argentario con le curve a strapiombo su Porto Santo Stefano e Porto Ercole. Strade meno affollate dell''interno senese, paesaggi che cambiano in fretta.','Maremma (GR)',130,5,'medio','Marzo-Novembre',false,
   '[[42.6353,11.6694], [42.73,11.5044], [42.5878,11.5169], [42.4406,11.2206], [42.435,11.117]]'::jsonb, null, array['toscana'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('maremma-argentario',1,'Pitigliano','partenza',42.6353,11.6694,'Il paese del tufo'),
  ('maremma-argentario',2,'Saturnia','sosta',42.73,11.5044,'Cascate del Mulino'),
  ('maremma-argentario',3,'Manciano','sosta',42.5878,11.5169,null),
  ('maremma-argentario',4,'Orbetello','panorama',42.4406,11.2206,'La laguna e la diga'),
  ('maremma-argentario',5,'Monte Argentario','arrivo',42.435,11.117,'Periplo del promontorio')
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('castelluccio-piani-grandi','Castelluccio e i Piani Grandi','La fioritura e l''altopiano dei Sibillini','La salita a Castelluccio di Norcia attraverso i Piani Grandi e'' uno dei percorsi piu'' spettacolari dell''Appennino: lunghi rettilinei sull''altopiano, tornanti in salita, l''anfiteatro dei Monti Sibillini intorno. Tra fine maggio e luglio la fioritura della lenticchia colora la piana. Quota alta: attenzione al meteo e alle chiusure invernali.','Monti Sibillini (PG)',90,4,'medio','Giugno-Settembre',false,
   '[[42.7928,13.0961], [42.7544,13.1733], [42.8167,13.2], [42.8294,13.2103]]'::jsonb, null, array['umbria','marche'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('castelluccio-piani-grandi',1,'Norcia','partenza',42.7928,13.0961,'Citta'' di San Benedetto'),
  ('castelluccio-piani-grandi',2,'Forca Canapine','panorama',42.7544,13.1733,null),
  ('castelluccio-piani-grandi',3,'Piani Grandi','panorama',42.8167,13.2,'L''altopiano della fioritura'),
  ('castelluccio-piani-grandi',4,'Castelluccio di Norcia','arrivo',42.8294,13.2103,'Borgo a 1452 m')
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('valnerina-cascata-marmore','Valnerina e Cascata delle Marmore','Il Nera tra gole e abbazie','La Valnerina segue il corso del fiume Nera tra gole strette, abbazie e borghi appesi alla roccia: dalla Cascata delle Marmore si risale verso Ferentillo, Scheggino e Sant''Anatolia, fino a Norcia. Strada scorrevole con tratti tecnici nelle gole, sempre in mezzo al verde.','Valnerina (TR-PG)',80,3,'facile','Marzo-Novembre',false,
   '[[42.5511,12.715], [42.6258,12.7672], [42.7106,12.8311], [42.7928,13.0961]]'::jsonb, null, array['umbria'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('valnerina-cascata-marmore',1,'Cascata delle Marmore','partenza',42.5511,12.715,'La cascata piu'' alta d''Europa'),
  ('valnerina-cascata-marmore',2,'Ferentillo','sosta',42.6258,12.7672,null),
  ('valnerina-cascata-marmore',3,'Scheggino','sosta',42.7106,12.8311,null),
  ('valnerina-cascata-marmore',4,'Norcia','arrivo',42.7928,13.0961,null)
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('strada-del-sagrantino','Strada del Sagrantino','Colline di vino tra Montefalco e Spello','Un anello dolce tra le colline del Sagrantino: Montefalco la ringhiera dell''Umbria per i panorami, Bevagna e Spello tra i borghi piu'' belli d''Italia. Curve morbide, saliscendi, vigneti a perdita d''occhio. Giro corto e rilassante, perfetto da abbinare a una sosta enogastronomica.','Colline di Foligno (PG)',55,2,'facile','Tutto l''anno',false,
   '[[42.8917,12.6536], [42.9333,12.6097], [42.9919,12.6717]]'::jsonb, null, array['umbria'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('strada-del-sagrantino',1,'Montefalco','partenza',42.8917,12.6536,'La ringhiera dell''Umbria'),
  ('strada-del-sagrantino',2,'Bevagna','sosta',42.9333,12.6097,null),
  ('strada-del-sagrantino',3,'Spello','arrivo',42.9919,12.6717,'Vicoli fioriti')
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('anello-del-trasimeno','Anello del Trasimeno','Il lago, i borghi e i colli sopra Tuoro','Il giro del lago Trasimeno alterna lungolago e salite panoramiche: da Magione e Passignano si sale verso Castel Rigone e i colli sopra Tuoro, con vista aperta sul lago e le sue isole. Strade tranquille, tornanti nella parte alta, clima mite quasi tutto l''anno.','Lago Trasimeno (PG)',75,3,'facile','Marzo-Novembre',false,
   '[[43.1428,12.205], [43.185,12.1369], [43.205,12.1844], [43.2069,12.0772]]'::jsonb, null, array['umbria'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('anello-del-trasimeno',1,'Magione','partenza',43.1428,12.205,null),
  ('anello-del-trasimeno',2,'Passignano sul Trasimeno','sosta',43.185,12.1369,'Lungolago'),
  ('anello-del-trasimeno',3,'Castel Rigone','panorama',43.205,12.1844,'Vista sul lago'),
  ('anello-del-trasimeno',4,'Tuoro sul Trasimeno','arrivo',43.2069,12.0772,'Campo della battaglia di Annibale')
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('spoleto-monteluco','Spoleto e Monteluco','Tornanti nel bosco sacro sopra Spoleto','Da Spoleto, citta'' del Festival dei Due Mondi difesa dal Ponte delle Torri, si sale tra i tornanti al bosco sacro di Monteluco: faggi e lecci secolari, eremi, vista sulla valle. Salita breve ma tecnica, pochissimo traffico, da chiudere con i sapori dello spoletino.','Spoletino (PG)',50,2,'medio','Aprile-Ottobre',false,
   '[[42.7402,12.7386], [42.7256,12.76], [42.73,12.745]]'::jsonb, null, array['umbria'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('spoleto-monteluco',1,'Spoleto','partenza',42.7402,12.7386,'Il Ponte delle Torri'),
  ('spoleto-monteluco',2,'Monteluco','panorama',42.7256,12.76,'Il bosco sacro'),
  ('spoleto-monteluco',3,'San Pietro','arrivo',42.73,12.745,null)
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('gola-del-furlo','Gola del Furlo','La Flaminia che taglia la roccia','La Gola del Furlo e'' uno dei passaggi piu'' scenografici delle Marche: la vecchia Flaminia (SS3) si infila in una stretta gola scavata dal fiume Candigliano, tra pareti a strapiombo e una galleria di epoca romana. Tratto breve ma indimenticabile, da abbinare ai borghi dell''entroterra pesarese.','Gola del Furlo (PU)',50,2,'facile','Marzo-Novembre',false,
   '[[43.6175,12.6694], [43.6469,12.7144], [43.6781,12.6483]]'::jsonb, null, array['marche'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('gola-del-furlo',1,'Acqualagna','partenza',43.6175,12.6694,'Capitale del tartufo'),
  ('gola-del-furlo',2,'Gola del Furlo','panorama',43.6469,12.7144,'La galleria romana nella roccia'),
  ('gola-del-furlo',3,'Fermignano','arrivo',43.6781,12.6483,null)
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('frasassi-valle-esino','Frasassi e la Valle dell''Esino','Gole, grotte e l''eremo nella roccia','La Valle dell''Esino sale verso le Grotte di Frasassi e la Gola della Rossa, tra le aree calcaree piu'' spettacolari dell''Appennino. Curve nelle gole, l''eremo di Santa Maria infra Saxa incastonato nella parete, borghi come Genga e Arcevia. Strada varia e mai banale.','Gola della Rossa (AN)',70,3,'medio','Marzo-Novembre',false,
   '[[43.3358,12.905], [43.4017,12.9656], [43.4283,12.9444], [43.5006,12.9408]]'::jsonb, null, array['marche'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('frasassi-valle-esino',1,'Fabriano','partenza',43.3358,12.905,'Citta'' della carta'),
  ('frasassi-valle-esino',2,'Grotte di Frasassi','sosta',43.4017,12.9656,'Le grotte e l''eremo'),
  ('frasassi-valle-esino',3,'Genga','panorama',43.4283,12.9444,null),
  ('frasassi-valle-esino',4,'Arcevia','arrivo',43.5006,12.9408,null)
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('riviera-del-conero','Riviera del Conero','Il promontorio a picco sull''Adriatico','Il Monte Conero e'' l''unico promontorio dell''Adriatico tra Trieste e il Gargano: strade panoramiche tra la macchia mediterranea, scorci sulle spiagge bianche di Sirolo e Numana, salita al belvedere del Conero. Curve dolci e mare sempre in vista, ideale fuori dai mesi piu'' affollati.','Monte Conero (AN)',45,2,'facile','Aprile-Giugno e Settembre',false,
   '[[43.6158,13.5189], [43.5247,13.6189], [43.5106,13.6231], [43.555,13.6017]]'::jsonb, null, array['marche'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('riviera-del-conero',1,'Ancona','partenza',43.6158,13.5189,null),
  ('riviera-del-conero',2,'Sirolo','panorama',43.5247,13.6189,'Spiagge bianche del Conero'),
  ('riviera-del-conero',3,'Numana','sosta',43.5106,13.6231,null),
  ('riviera-del-conero',4,'Monte Conero','arrivo',43.555,13.6017,'Belvedere a picco sul mare')
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

with ins as (
  insert into public.itinerari
    (slug, titolo, sottotitolo, descrizione, zona, km, durata_ore, difficolta, periodo_ideale, is_premium, tracciato, gpx_url, regioni, origine)
  values
  ('san-bartolo-gabicce','Parco del San Bartolo','Da Gabicce a Pesaro sul mare','La strada panoramica del Parco del San Bartolo corre sul crinale a picco sull''Adriatico tra Gabicce Monte e Pesaro: tornanti stretti, vista continua sul mare, borghi come Casteldimezzo e Fiorenzuola di Focara. Breve ma intensa, una delle piu'' fotografate dell''alta costa marchigiana.','San Bartolo (PU)',35,2,'medio','Marzo-Novembre',false,
   '[[43.9683,12.76], [43.945,12.7889], [43.9347,12.8086], [43.9102,12.9133]]'::jsonb, null, array['marche'], 'classico')
  returning id, slug
)
insert into public.tappe (itinerario_id, ordine, nome, tipo, lat, lng, note)
select ins.id, t.ordine, t.nome, t.tipo, t.lat, t.lng, t.note
from ins
join (values
  ('san-bartolo-gabicce',1,'Gabicce Monte','partenza',43.9683,12.76,'Belvedere sulla riviera'),
  ('san-bartolo-gabicce',2,'Casteldimezzo','panorama',43.945,12.7889,null),
  ('san-bartolo-gabicce',3,'Fiorenzuola di Focara','sosta',43.9347,12.8086,null),
  ('san-bartolo-gabicce',4,'Pesaro','arrivo',43.9102,12.9133,'Il lungomare e la Sfera di Pomodoro')
) as t(slug,ordine,nome,tipo,lat,lng,note) on t.slug = ins.slug;

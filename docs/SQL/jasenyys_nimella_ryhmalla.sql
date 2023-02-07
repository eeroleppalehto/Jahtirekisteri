CREATE VIEW public.jasenyys_nimella_ryhmalla
 AS
SELECT (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS nimi,
    jasenyys.jasenyys_id,
    jasenyys.jasen_id,
    jasenyys.ryhma_id,
	jakoryhma.ryhman_nimi,
    jasenyys.liittyi,
    jasenyys.poistui,
    jasenyys.osuus
   FROM jasenyys
     JOIN jasen ON jasenyys.jasen_id = jasen.jasen_id
	 JOIN jakoryhma ON jakoryhma.ryhma_id = jasenyys.ryhma_id
  ORDER BY ((jasen.sukunimi::text || ' '::text) || jasen.etunimi::text);

ALTER TABLE public.jasenyys_nimella_ryhmalla
    OWNER TO postgres;
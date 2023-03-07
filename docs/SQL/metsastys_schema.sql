--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

-- Started on 2023-03-07 16:38:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 265 (class 1255 OID 29212)
-- Name: add_jakoryhma(integer, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying)
    LANGUAGE sql
    AS $$
INSERT INTO public.jakoryhma (seurue_id, ryhman_nimi) VALUES (seurue_id, ryhman_nimi);
$$;


ALTER PROCEDURE public.add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 29213)
-- Name: jasen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jasen (
    jasen_id integer NOT NULL,
    etunimi character varying(50) NOT NULL,
    sukunimi character varying(50) NOT NULL,
    jakeluosoite character varying(30) NOT NULL,
    postinumero character varying(10) NOT NULL,
    postitoimipaikka character varying(30) NOT NULL,
    tila character varying(20) DEFAULT 'aktiivinen'::character varying
);


ALTER TABLE public.jasen OWNER TO postgres;

--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE jasen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jasen IS 'Henkilö joka osallistuu metsästykseen tai lihanjakoon';


--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN jasen.tila; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jasen.tila IS 'Jäsenen tila, joka kertoo onko hän yhä mukana toiminnassa';


--
-- TOC entry 266 (class 1255 OID 29217)
-- Name: get_member(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_member(id integer) RETURNS SETOF public.jasen
    LANGUAGE sql
    AS $$
SELECT * FROM public.jasen WHERE jasen_id = id;
$$;


ALTER FUNCTION public.get_member(id integer) OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 29218)
-- Name: seurue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seurue (
    seurue_id integer NOT NULL,
    seura_id integer NOT NULL,
    seurueen_nimi character varying(50) NOT NULL,
    jasen_id integer NOT NULL
);


ALTER TABLE public.seurue OWNER TO postgres;

--
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE seurue; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seurue IS 'Metsästystä harjoittavan seurueen tiedot
';


--
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN seurue.jasen_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.seurue.jasen_id IS 'Seurueen johtajan tunniste';


--
-- TOC entry 267 (class 1255 OID 29221)
-- Name: get_party(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_party(id integer) RETURNS SETOF public.seurue
    LANGUAGE sql
    AS $$
SELECT * FROM public.seurue WHERE seurue_id = id;
$$;


ALTER FUNCTION public.get_party(id integer) OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 29222)
-- Name: jakoryhma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jakoryhma (
    ryhma_id integer NOT NULL,
    seurue_id integer NOT NULL,
    ryhman_nimi character varying(50) NOT NULL
);


ALTER TABLE public.jakoryhma OWNER TO postgres;

--
-- TOC entry 3598 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jakoryhma IS 'Ryhmä, jolle lihaa jaetaan';


--
-- TOC entry 212 (class 1259 OID 29225)
-- Name: jakotapahtuma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jakotapahtuma (
    tapahtuma_id integer NOT NULL,
    paiva date NOT NULL,
    ryhma_id integer NOT NULL,
    osnimitys character varying(20) NOT NULL,
    maara real NOT NULL,
    kaato_id integer
);


ALTER TABLE public.jakotapahtuma OWNER TO postgres;

--
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN jakotapahtuma.maara; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jakotapahtuma.maara IS 'Jaettu lihamäärä kiloina';


--
-- TOC entry 213 (class 1259 OID 29228)
-- Name: jasenyys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jasenyys (
    jasenyys_id integer NOT NULL,
    ryhma_id integer NOT NULL,
    jasen_id integer NOT NULL,
    liittyi date NOT NULL,
    poistui date,
    osuus integer DEFAULT 100 NOT NULL
);


ALTER TABLE public.jasenyys OWNER TO postgres;

--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN jasenyys.osuus; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jasenyys.osuus IS 'Muuta pakolliseksi (NOT NULL)';


--
-- TOC entry 214 (class 1259 OID 29232)
-- Name: seurue_lihat; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_lihat AS
 SELECT seurue.seurue_id,
    seurue.seurueen_nimi,
    sum(jakotapahtuma.maara) AS sum
   FROM ((public.seurue
     JOIN public.jakoryhma ON ((jakoryhma.seurue_id = seurue.seurue_id)))
     JOIN public.jakotapahtuma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
  GROUP BY seurue.seurue_id, seurue.seurueen_nimi;


ALTER TABLE public.seurue_lihat OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 29236)
-- Name: seurue_lihat_osuus; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_lihat_osuus AS
 SELECT seurue.seurue_id,
    seurue.seurueen_nimi,
    seurue_lihat.sum AS maara,
    ((sum(jasenyys.osuus))::real / (100)::real) AS osuus
   FROM (((public.seurue
     JOIN public.jakoryhma ON ((jakoryhma.seurue_id = seurue.seurue_id)))
     JOIN public.jasenyys ON ((jasenyys.ryhma_id = jakoryhma.ryhma_id)))
     JOIN public.seurue_lihat ON ((seurue_lihat.seurue_id = seurue.seurue_id)))
  GROUP BY seurue.seurue_id, seurue.seurueen_nimi, seurue_lihat.sum;


ALTER TABLE public.seurue_lihat_osuus OWNER TO postgres;

--
-- TOC entry 3605 (class 0 OID 0)
-- Dependencies: 215
-- Name: VIEW seurue_lihat_osuus; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.seurue_lihat_osuus IS 'Näkymä joka näyttää seurueen lihat sekä osuudet';


--
-- TOC entry 268 (class 1255 OID 29241)
-- Name: get_party_portion_amount(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_party_portion_amount(id integer) RETURNS SETOF public.seurue_lihat_osuus
    LANGUAGE sql
    AS $$
SELECT * FROM public.seurue_lihat_osuus WHERE seurue_id = id;
$$;


ALTER FUNCTION public.get_party_portion_amount(id integer) OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 29242)
-- Name: aikuinenvasa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aikuinenvasa (
    ikaluokka character varying(10) NOT NULL
);


ALTER TABLE public.aikuinenvasa OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 29245)
-- Name: aktiivijasenet; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.aktiivijasenet AS
 SELECT jasen.jasen_id,
    jasen.etunimi,
    jasen.sukunimi,
    jasen.jakeluosoite,
    jasen.postinumero,
    jasen.postitoimipaikka
   FROM public.jasen
  WHERE ((jasen.tila)::text = 'aktiivinen'::text);


ALTER TABLE public.aktiivijasenet OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 29249)
-- Name: elain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.elain (
    elaimen_nimi character varying(20) NOT NULL
);


ALTER TABLE public.elain OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 29252)
-- Name: kaato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kaato (
    kaato_id integer NOT NULL,
    jasen_id integer NOT NULL,
    kaatopaiva date NOT NULL,
    ruhopaino real NOT NULL,
    paikka_teksti character varying(100) NOT NULL,
    paikka_koordinaatti character varying(100),
    kasittelyid integer NOT NULL,
    elaimen_nimi character varying(20) NOT NULL,
    sukupuoli character varying(20) NOT NULL,
    ikaluokka character varying(10) NOT NULL,
    lisatieto character varying(255)
);


ALTER TABLE public.kaato OWNER TO postgres;

--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE kaato; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.kaato IS 'Ampumatapahtuman tiedot';


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN kaato.ruhopaino; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.ruhopaino IS 'paino kiloina';


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN kaato.paikka_koordinaatti; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.paikka_koordinaatti IS 'Tämän kentän tietotyyppi pitää oikeasti olla geometry (Postgis-tietotyyppi)';


--
-- TOC entry 220 (class 1259 OID 29257)
-- Name: kasittely; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kasittely (
    kasittelyid integer NOT NULL,
    kasittely_teksti character varying(50) NOT NULL
);


ALTER TABLE public.kasittely OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 29260)
-- Name: jaettavat_lihat; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaettavat_lihat AS
 SELECT kaato.kaato_id AS id,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS kaataja,
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS paikka,
    kaato.elaimen_nimi AS "eläin",
    kaato.ikaluokka AS "ikäryhmä",
    kaato.sukupuoli,
    kaato.ruhopaino AS paino
   FROM ((public.jasen
     JOIN public.kaato ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kasittely ON ((kaato.kasittelyid = kasittely.kasittelyid)))
  WHERE (kasittely.kasittelyid = 2)
  ORDER BY kaato.kaatopaiva DESC;


ALTER TABLE public.jaettavat_lihat OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 29265)
-- Name: jaetut_hirvi; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaetut_hirvi AS
 SELECT seurue.seurueen_nimi,
    jakoryhma.ryhman_nimi,
    sum(jakotapahtuma.maara) AS sum
   FROM (((public.seurue
     LEFT JOIN public.jakoryhma ON ((seurue.seurue_id = jakoryhma.seurue_id)))
     LEFT JOIN public.jakotapahtuma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
     LEFT JOIN public.kaato ON ((kaato.kaato_id = jakotapahtuma.kaato_id)))
  WHERE ((kaato.elaimen_nimi)::text = 'Hirvi'::text)
  GROUP BY seurue.seurueen_nimi, jakoryhma.ryhman_nimi
  ORDER BY seurue.seurueen_nimi;


ALTER TABLE public.jaetut_hirvi OWNER TO postgres;

--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 222
-- Name: VIEW jaetut_hirvi; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.jaetut_hirvi IS 'Näkymä joka näyttää ryhmille jaetut hirven lihat';


--
-- TOC entry 223 (class 1259 OID 29270)
-- Name: jaetut_lihat; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaetut_lihat AS
 SELECT jakoryhma.ryhman_nimi,
    sum(jakotapahtuma.maara) AS "kg yhteensä"
   FROM (public.jakoryhma
     LEFT JOIN public.jakotapahtuma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
  GROUP BY jakoryhma.ryhman_nimi
  ORDER BY jakoryhma.ryhman_nimi;


ALTER TABLE public.jaetut_lihat OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 29274)
-- Name: jaetut_ruhon_osat; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaetut_ruhon_osat AS
 SELECT kaato.kaato_id,
    kaato.elaimen_nimi,
    jakotapahtuma.osnimitys,
    jakotapahtuma.maara
   FROM (public.kaato
     JOIN public.jakotapahtuma ON ((jakotapahtuma.kaato_id = kaato.kaato_id)))
  ORDER BY kaato.kaato_id DESC;


ALTER TABLE public.jaetut_ruhon_osat OWNER TO postgres;

--
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 224
-- Name: VIEW jaetut_ruhon_osat; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.jaetut_ruhon_osat IS 'Näkymä joka näyttää jaetut ruhon osat';


--
-- TOC entry 225 (class 1259 OID 29278)
-- Name: jaetut_valkohantapeura; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaetut_valkohantapeura AS
 SELECT seurue.seurueen_nimi,
    jakoryhma.ryhman_nimi,
    sum(jakotapahtuma.maara) AS sum
   FROM (((public.seurue
     LEFT JOIN public.jakoryhma ON ((seurue.seurue_id = jakoryhma.seurue_id)))
     LEFT JOIN public.jakotapahtuma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
     LEFT JOIN public.kaato ON ((kaato.kaato_id = jakotapahtuma.kaato_id)))
  WHERE ((kaato.elaimen_nimi)::text = 'Valkohäntäpeura'::text)
  GROUP BY seurue.seurueen_nimi, jakoryhma.ryhman_nimi
  ORDER BY seurue.seurueen_nimi;


ALTER TABLE public.jaetut_valkohantapeura OWNER TO postgres;

--
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 225
-- Name: VIEW jaetut_valkohantapeura; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.jaetut_valkohantapeura IS 'Näkymä joka näyttää ryhmille jaetut valkohäntäpeurat';


--
-- TOC entry 226 (class 1259 OID 29283)
-- Name: jako_kaadot; Type: VIEW; Schema: public; Owner: application
--

CREATE VIEW public.jako_kaadot AS
 SELECT kaato.kaato_id AS kaatoid,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS kaataja,
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS paikka,
    kaato.elaimen_nimi AS "eläin",
    kaato.ikaluokka AS "ikaryhmä",
    kaato.sukupuoli,
    kasittely.kasittely_teksti AS "käyttö",
    kaato.ruhopaino AS paino
   FROM ((public.jasen
     JOIN public.kaato ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kasittely ON ((kaato.kasittelyid = kasittely.kasittelyid)))
  WHERE (kaato.kasittelyid = 2)
  ORDER BY kaato.kaato_id DESC;


ALTER TABLE public.jako_kaadot OWNER TO application;

--
-- TOC entry 227 (class 1259 OID 29288)
-- Name: jakoryhma_liitokset; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jakoryhma_liitokset AS
 SELECT jakotapahtuma.ryhma_id
   FROM public.jakotapahtuma
UNION
 SELECT jasenyys.ryhma_id
   FROM public.jasenyys;


ALTER TABLE public.jakoryhma_liitokset OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 29292)
-- Name: ryhmien_osuudet; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.ryhmien_osuudet AS
 SELECT jasenyys.ryhma_id,
    ((sum(jasenyys.osuus))::double precision / (100)::real) AS jakokerroin
   FROM public.jasenyys
  GROUP BY jasenyys.ryhma_id
  ORDER BY jasenyys.ryhma_id;


ALTER TABLE public.ryhmien_osuudet OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 29296)
-- Name: jakoryhma_osuus_maara; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jakoryhma_osuus_maara AS
 SELECT jakoryhma.ryhma_id,
    jakoryhma.ryhman_nimi,
    jakoryhma.seurue_id,
    ryhmien_osuudet.jakokerroin AS osuus,
    sum(jakotapahtuma.maara) AS maara
   FROM ((public.jakoryhma
     LEFT JOIN public.jakotapahtuma ON ((jakoryhma.ryhma_id = jakotapahtuma.ryhma_id)))
     LEFT JOIN public.ryhmien_osuudet ON ((jakoryhma.ryhma_id = ryhmien_osuudet.ryhma_id)))
  GROUP BY jakoryhma.ryhma_id, jakoryhma.ryhman_nimi, jakoryhma.seurue_id, ryhmien_osuudet.jakokerroin
  ORDER BY jakoryhma.ryhma_id;


ALTER TABLE public.jakoryhma_osuus_maara OWNER TO postgres;

--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 229
-- Name: VIEW jakoryhma_osuus_maara; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.jakoryhma_osuus_maara IS 'Näkymä joka näyttää ryhmän seura_id:n, osuudet, ja liha määrän';


--
-- TOC entry 230 (class 1259 OID 29301)
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jakoryhma_ryhma_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jakoryhma_ryhma_id_seq OWNER TO postgres;

--
-- TOC entry 3628 (class 0 OID 0)
-- Dependencies: 230
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakoryhma_ryhma_id_seq OWNED BY public.jakoryhma.ryhma_id;


--
-- TOC entry 231 (class 1259 OID 29302)
-- Name: jakoryhma_seurueen_nimella; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jakoryhma_seurueen_nimella AS
 SELECT jakoryhma.ryhma_id,
    jakoryhma.ryhman_nimi,
    jakoryhma.seurue_id,
    seurue.seurueen_nimi
   FROM (public.seurue
     JOIN public.jakoryhma ON ((jakoryhma.seurue_id = seurue.seurue_id)))
  ORDER BY jakoryhma.ryhma_id;


ALTER TABLE public.jakoryhma_seurueen_nimella OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 29306)
-- Name: jakoryhma_yhteenveto; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jakoryhma_yhteenveto AS
 SELECT jakoryhma.ryhman_nimi AS "ryhmä",
    count(jasenyys.jasen_id) AS "jäseniä",
    ((sum(jasenyys.osuus))::double precision / (100)::real) AS jakokerroin
   FROM (public.jakoryhma
     LEFT JOIN public.jasenyys ON ((jasenyys.ryhma_id = jakoryhma.ryhma_id)))
  GROUP BY jakoryhma.ryhman_nimi
  ORDER BY jakoryhma.ryhman_nimi;


ALTER TABLE public.jakoryhma_yhteenveto OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 29310)
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jakotapahtuma_tapahtuma_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jakotapahtuma_tapahtuma_id_seq OWNER TO postgres;

--
-- TOC entry 3632 (class 0 OID 0)
-- Dependencies: 233
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakotapahtuma_tapahtuma_id_seq OWNED BY public.jakotapahtuma.tapahtuma_id;


--
-- TOC entry 234 (class 1259 OID 29311)
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jasen_jasen_id_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jasen_jasen_id_seq_1 OWNER TO postgres;

--
-- TOC entry 3634 (class 0 OID 0)
-- Dependencies: 234
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasen_jasen_id_seq_1 OWNED BY public.jasen.jasen_id;


--
-- TOC entry 235 (class 1259 OID 29312)
-- Name: jasen_liitokset; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jasen_liitokset AS
 SELECT jasenyys.jasen_id
   FROM public.jasenyys
UNION
 SELECT seurue.jasen_id
   FROM public.seurue
UNION
 SELECT kaato.jasen_id
   FROM public.kaato;


ALTER TABLE public.jasen_liitokset OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 29316)
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jasenyys_jasenyys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jasenyys_jasenyys_id_seq OWNER TO postgres;

--
-- TOC entry 3637 (class 0 OID 0)
-- Dependencies: 236
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasenyys_jasenyys_id_seq OWNED BY public.jasenyys.jasenyys_id;


--
-- TOC entry 237 (class 1259 OID 29317)
-- Name: jasenyys_nimella; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jasenyys_nimella AS
 SELECT (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS nimi,
    jasenyys.jasenyys_id,
    jasenyys.jasen_id,
    jasenyys.ryhma_id,
    jasenyys.liittyi,
    jasenyys.poistui,
    jasenyys.osuus
   FROM (public.jasenyys
     JOIN public.jasen ON ((jasenyys.jasen_id = jasen.jasen_id)))
  ORDER BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER TABLE public.jasenyys_nimella OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 29322)
-- Name: jasenyys_nimella_ryhmalla; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jasenyys_nimella_ryhmalla AS
 SELECT (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS nimi,
    jasenyys.jasenyys_id,
    jasenyys.jasen_id,
    jasenyys.ryhma_id,
    jakoryhma.ryhman_nimi,
    jasenyys.liittyi,
    jasenyys.poistui,
    jasenyys.osuus
   FROM ((public.jasenyys
     JOIN public.jasen ON ((jasenyys.jasen_id = jasen.jasen_id)))
     JOIN public.jakoryhma ON ((jakoryhma.ryhma_id = jasenyys.ryhma_id)))
  ORDER BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER TABLE public.jasenyys_nimella_ryhmalla OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 29327)
-- Name: kaadot_ampujittain; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.kaadot_ampujittain AS
 SELECT kaato.jasen_id AS "Kaataja",
    kaato.elaimen_nimi AS "Eläin",
    count(kaato.elaimen_nimi) AS kaatoja,
    sum(kaato.ruhopaino) AS "Kokonaispaino"
   FROM public.kaato
  GROUP BY kaato.jasen_id, kaato.elaimen_nimi
  ORDER BY kaato.jasen_id;


ALTER TABLE public.kaadot_ampujittain OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 29331)
-- Name: kaadot_elaimittain; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.kaadot_elaimittain AS
 SELECT kaato.elaimen_nimi AS "Eläin",
    count(kaato.elaimen_nimi) AS kpl,
    sum(kaato.ruhopaino) AS "Kokonaispaino(kg)"
   FROM public.kaato
  GROUP BY kaato.elaimen_nimi
  ORDER BY kaato.elaimen_nimi;


ALTER TABLE public.kaadot_elaimittain OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 29335)
-- Name: kaato_kaato_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kaato_kaato_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kaato_kaato_id_seq OWNER TO postgres;

--
-- TOC entry 3643 (class 0 OID 0)
-- Dependencies: 241
-- Name: kaato_kaato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kaato_kaato_id_seq OWNED BY public.kaato.kaato_id;


--
-- TOC entry 242 (class 1259 OID 29336)
-- Name: kaatoluettelo; Type: VIEW; Schema: public; Owner: application
--

CREATE VIEW public.kaatoluettelo AS
 SELECT (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS kaataja,
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS paikka,
    kaato.elaimen_nimi AS "eläin",
    kaato.ikaluokka AS "ikaryhmä",
    kaato.sukupuoli,
    kasittely.kasittely_teksti AS "käyttö",
    kaato.ruhopaino AS paino
   FROM ((public.jasen
     JOIN public.kaato ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kasittely ON ((kaato.kasittelyid = kasittely.kasittelyid)))
  ORDER BY kaato.kaato_id DESC;


ALTER TABLE public.kaatoluettelo OWNER TO application;

--
-- TOC entry 243 (class 1259 OID 29341)
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kasittely_kasittelyid_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kasittely_kasittelyid_seq_1 OWNER TO postgres;

--
-- TOC entry 3645 (class 0 OID 0)
-- Dependencies: 243
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kasittely_kasittelyid_seq_1 OWNED BY public.kasittely.kasittelyid;


--
-- TOC entry 244 (class 1259 OID 29342)
-- Name: kaytto_ryhmille; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.kaytto_ryhmille AS
 SELECT kasittely.kasittely_teksti AS source,
    jakoryhma.ryhman_nimi AS target,
    sum(jakotapahtuma.maara) AS value
   FROM (((public.kasittely
     JOIN public.kaato ON ((kasittely.kasittelyid = kaato.kasittelyid)))
     JOIN public.jakotapahtuma ON ((kaato.kaato_id = jakotapahtuma.kaato_id)))
     JOIN public.jakoryhma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
  WHERE (kaato.kasittelyid = 2)
  GROUP BY kasittely.kasittely_teksti, jakoryhma.ryhman_nimi;


ALTER TABLE public.kaytto_ryhmille OWNER TO postgres;

--
-- TOC entry 3647 (class 0 OID 0)
-- Dependencies: 244
-- Name: VIEW kaytto_ryhmille; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.kaytto_ryhmille IS 'Näkymä, joka kertoo, paljonko lihaa on annettu ryhmille, kun käyttönä on seurueelle';


--
-- TOC entry 245 (class 1259 OID 29347)
-- Name: lihan_kaytto; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.lihan_kaytto AS
 SELECT kaato.elaimen_nimi AS source,
    kasittely.kasittely_teksti AS target,
    sum(kaato.ruhopaino) AS value
   FROM (public.kaato
     JOIN public.kasittely ON ((kaato.kasittelyid = kasittely.kasittelyid)))
  GROUP BY kaato.elaimen_nimi, kasittely.kasittely_teksti;


ALTER TABLE public.lihan_kaytto OWNER TO postgres;

--
-- TOC entry 3649 (class 0 OID 0)
-- Dependencies: 245
-- Name: VIEW lihan_kaytto; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.lihan_kaytto IS 'Kertoo, miten liha on haluttu käyttää: seurueelle, seuralle, myyntiin tai hävitykseen';


--
-- TOC entry 246 (class 1259 OID 29351)
-- Name: lupa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lupa (
    luparivi_id integer NOT NULL,
    seura_id integer NOT NULL,
    lupavuosi character varying(4) NOT NULL,
    elaimen_nimi character varying(20) NOT NULL,
    sukupuoli character varying(20) NOT NULL,
    ikaluokka character varying(10) NOT NULL,
    maara integer NOT NULL
);


ALTER TABLE public.lupa OWNER TO postgres;

--
-- TOC entry 3651 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE lupa; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.lupa IS 'Vuosittaiset kaatoluvat';


--
-- TOC entry 247 (class 1259 OID 29354)
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lupa_luparivi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lupa_luparivi_id_seq OWNER TO postgres;

--
-- TOC entry 3653 (class 0 OID 0)
-- Dependencies: 247
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lupa_luparivi_id_seq OWNED BY public.lupa.luparivi_id;


--
-- TOC entry 248 (class 1259 OID 29355)
-- Name: luvat_kayttamatta_kpl; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.luvat_kayttamatta_kpl AS
 SELECT (lupa.maara - count(kaato.kaato_id)) AS "Lupia jäljellä",
    lupa.elaimen_nimi AS "Eläin",
    lupa.sukupuoli AS "Sukupuoli",
    lupa.ikaluokka AS "Ikäluokka"
   FROM (public.lupa
     LEFT JOIN public.kaato ON ((((lupa.sukupuoli)::text = (kaato.sukupuoli)::text) AND ((lupa.ikaluokka)::text = (kaato.ikaluokka)::text) AND ((kaato.elaimen_nimi)::text = (lupa.elaimen_nimi)::text))))
  GROUP BY lupa.elaimen_nimi, lupa.maara, lupa.sukupuoli, lupa.ikaluokka
  ORDER BY lupa.elaimen_nimi;


ALTER TABLE public.luvat_kayttamatta_kpl OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 29360)
-- Name: luvat_kayttamatta_kpl_pros; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.luvat_kayttamatta_kpl_pros AS
 SELECT (lupa.maara - count(kaato.kaato_id)) AS "Lupia jäljellä",
    (round((((100 * (lupa.maara - count(kaato.kaato_id))))::double precision / (lupa.maara)::double precision)))::integer AS "Lupia jäljellä(%)",
    lupa.elaimen_nimi AS "Eläin",
    lupa.sukupuoli AS "Sukupuoli",
    lupa.ikaluokka AS "Ikäluokka"
   FROM (public.lupa
     LEFT JOIN public.kaato ON ((((lupa.sukupuoli)::text = (kaato.sukupuoli)::text) AND ((lupa.ikaluokka)::text = (kaato.ikaluokka)::text) AND ((kaato.elaimen_nimi)::text = (lupa.elaimen_nimi)::text))))
  GROUP BY lupa.elaimen_nimi, lupa.maara, lupa.sukupuoli, lupa.ikaluokka
  ORDER BY lupa.elaimen_nimi;


ALTER TABLE public.luvat_kayttamatta_kpl_pros OWNER TO postgres;

--
-- TOC entry 3656 (class 0 OID 0)
-- Dependencies: 249
-- Name: VIEW luvat_kayttamatta_kpl_pros; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.luvat_kayttamatta_kpl_pros IS 'Näkymä joka näyttää käyttämättä olevat luvat eläimen, sukupuolen ja iän mukaan sekä kappaleina että prosentteina';


--
-- TOC entry 250 (class 1259 OID 29365)
-- Name: luvat_kayttamatta_pros; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.luvat_kayttamatta_pros AS
 SELECT (((100 * (lupa.maara - count(kaato.kaato_id))))::double precision / (lupa.maara)::double precision) AS "Lupia jäljellä",
    lupa.elaimen_nimi AS "Eläin",
    lupa.sukupuoli AS "Sukupuoli",
    lupa.ikaluokka AS "Ikäluokka"
   FROM (public.lupa
     LEFT JOIN public.kaato ON ((((lupa.sukupuoli)::text = (kaato.sukupuoli)::text) AND ((lupa.ikaluokka)::text = (kaato.ikaluokka)::text) AND ((kaato.elaimen_nimi)::text = (lupa.elaimen_nimi)::text))))
  GROUP BY lupa.elaimen_nimi, lupa.maara, lupa.sukupuoli, lupa.ikaluokka
  ORDER BY lupa.elaimen_nimi;


ALTER TABLE public.luvat_kayttamatta_pros OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 29370)
-- Name: nimivalinta; Type: VIEW; Schema: public; Owner: application
--

CREATE VIEW public.nimivalinta AS
 SELECT jasen.jasen_id,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS kokonimi
   FROM public.jasen
  WHERE ((jasen.tila)::text = 'aktiivinen'::text)
  ORDER BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER TABLE public.nimivalinta OWNER TO application;

--
-- TOC entry 252 (class 1259 OID 29374)
-- Name: ruhonosa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ruhonosa (
    osnimitys character varying(20) NOT NULL
);


ALTER TABLE public.ruhonosa OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 29377)
-- Name: sankey_data; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sankey_data AS
 SELECT lihan_kaytto.source,
    lihan_kaytto.target,
    lihan_kaytto.value
   FROM public.lihan_kaytto
UNION
 SELECT kaytto_ryhmille.source,
    kaytto_ryhmille.target,
    kaytto_ryhmille.value
   FROM public.kaytto_ryhmille;


ALTER TABLE public.sankey_data OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 29381)
-- Name: seurue_sankey; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_sankey AS
 SELECT kasittely.kasittely_teksti AS source,
    seurue.seurueen_nimi AS target,
    sum(jakotapahtuma.maara) AS sum
   FROM ((((public.kasittely
     JOIN public.kaato ON ((kasittely.kasittelyid = kaato.kasittelyid)))
     JOIN public.jakotapahtuma ON ((kaato.kaato_id = jakotapahtuma.kaato_id)))
     JOIN public.jakoryhma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
     JOIN public.seurue ON ((jakoryhma.seurue_id = seurue.seurue_id)))
  WHERE (kaato.kasittelyid = 2)
  GROUP BY kasittely.kasittely_teksti, seurue.seurueen_nimi;


ALTER TABLE public.seurue_sankey OWNER TO postgres;

--
-- TOC entry 3661 (class 0 OID 0)
-- Dependencies: 254
-- Name: VIEW seurue_sankey; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.seurue_sankey IS 'Näkymä joka näyttää Seurueelle>Seurue>lihamaara';


--
-- TOC entry 255 (class 1259 OID 29386)
-- Name: sankey_elain_kasittely_seurue; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sankey_elain_kasittely_seurue AS
 SELECT lihan_kaytto.source,
    lihan_kaytto.target,
    lihan_kaytto.value
   FROM public.lihan_kaytto
UNION
 SELECT seurue_sankey.source,
    seurue_sankey.target,
    seurue_sankey.sum AS value
   FROM public.seurue_sankey;


ALTER TABLE public.sankey_elain_kasittely_seurue OWNER TO postgres;

--
-- TOC entry 3663 (class 0 OID 0)
-- Dependencies: 255
-- Name: VIEW sankey_elain_kasittely_seurue; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.sankey_elain_kasittely_seurue IS 'Näkymä joka näyttää Eläin>Kasittely(>Seurue>Seura)';


--
-- TOC entry 256 (class 1259 OID 29390)
-- Name: seura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seura (
    seura_id integer NOT NULL,
    seuran_nimi character varying(50) NOT NULL,
    jakeluosoite character varying(30) NOT NULL,
    postinumero character varying(10) NOT NULL,
    postitoimipaikka character varying(30) NOT NULL
);


ALTER TABLE public.seura OWNER TO postgres;

--
-- TOC entry 3665 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE seura; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seura IS 'Metsästysseuran tiedot';


--
-- TOC entry 257 (class 1259 OID 29393)
-- Name: seura_seura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seura_seura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seura_seura_id_seq OWNER TO postgres;

--
-- TOC entry 3667 (class 0 OID 0)
-- Dependencies: 257
-- Name: seura_seura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seura_seura_id_seq OWNED BY public.seura.seura_id;


--
-- TOC entry 258 (class 1259 OID 29394)
-- Name: seurue_jasen_nimella; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_jasen_nimella AS
 SELECT seurue.seurue_id,
    seurue.seurueen_nimi,
    seurue.jasen_id,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS seurueenjohtaja
   FROM (public.seurue
     JOIN public.jasen ON ((seurue.jasen_id = jasen.jasen_id)))
  ORDER BY seurue.seurue_id;


ALTER TABLE public.seurue_jasen_nimella OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 29398)
-- Name: seurue_liitokset; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_liitokset AS
 SELECT jakoryhma.seurue_id
   FROM public.jakoryhma;


ALTER TABLE public.seurue_liitokset OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 29402)
-- Name: seurue_ryhma_lihat; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_ryhma_lihat AS
 SELECT seurue.seurueen_nimi,
    jakoryhma.ryhman_nimi,
    sum(jakotapahtuma.maara) AS sum
   FROM (((public.seurue
     LEFT JOIN public.jakoryhma ON ((seurue.seurue_id = jakoryhma.seurue_id)))
     LEFT JOIN public.jakotapahtuma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
     LEFT JOIN public.kaato ON ((kaato.kaato_id = jakotapahtuma.kaato_id)))
  GROUP BY seurue.seurueen_nimi, jakoryhma.ryhman_nimi
  ORDER BY seurue.seurueen_nimi;


ALTER TABLE public.seurue_ryhma_lihat OWNER TO postgres;

--
-- TOC entry 3671 (class 0 OID 0)
-- Dependencies: 260
-- Name: VIEW seurue_ryhma_lihat; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.seurue_ryhma_lihat IS 'Näyttää seuruettain ryhmät ja näiden saamat lihat';


--
-- TOC entry 261 (class 1259 OID 29407)
-- Name: seurue_seurue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seurue_seurue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seurue_seurue_id_seq OWNER TO postgres;

--
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 261
-- Name: seurue_seurue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seurue_seurue_id_seq OWNED BY public.seurue.seurue_id;


--
-- TOC entry 262 (class 1259 OID 29408)
-- Name: simple_sankey; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.simple_sankey AS
 SELECT kaato.elaimen_nimi AS source,
    jakoryhma.ryhman_nimi AS target,
    sum(jakotapahtuma.maara) AS value
   FROM ((public.kaato
     JOIN public.jakotapahtuma ON ((kaato.kaato_id = jakotapahtuma.kaato_id)))
     JOIN public.jakoryhma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
  GROUP BY kaato.elaimen_nimi, jakoryhma.ryhman_nimi;


ALTER TABLE public.simple_sankey OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 29413)
-- Name: sukupuoli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sukupuoli (
    sukupuoli character varying(20) NOT NULL
);


ALTER TABLE public.sukupuoli OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 29416)
-- Name: testi_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.testi_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.testi_seq OWNER TO postgres;

--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 264
-- Name: testi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.testi_seq OWNED BY public.jakoryhma.ryhma_id;


--
-- TOC entry 3360 (class 2604 OID 29417)
-- Name: jakoryhma ryhma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma ALTER COLUMN ryhma_id SET DEFAULT nextval('public.jakoryhma_ryhma_id_seq'::regclass);


--
-- TOC entry 3361 (class 2604 OID 29418)
-- Name: jakotapahtuma tapahtuma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma ALTER COLUMN tapahtuma_id SET DEFAULT nextval('public.jakotapahtuma_tapahtuma_id_seq'::regclass);


--
-- TOC entry 3358 (class 2604 OID 29419)
-- Name: jasen jasen_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen ALTER COLUMN jasen_id SET DEFAULT nextval('public.jasen_jasen_id_seq_1'::regclass);


--
-- TOC entry 3363 (class 2604 OID 29420)
-- Name: jasenyys jasenyys_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys ALTER COLUMN jasenyys_id SET DEFAULT nextval('public.jasenyys_jasenyys_id_seq'::regclass);


--
-- TOC entry 3364 (class 2604 OID 29421)
-- Name: kaato kaato_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato ALTER COLUMN kaato_id SET DEFAULT nextval('public.kaato_kaato_id_seq'::regclass);


--
-- TOC entry 3365 (class 2604 OID 29422)
-- Name: kasittely kasittelyid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely ALTER COLUMN kasittelyid SET DEFAULT nextval('public.kasittely_kasittelyid_seq_1'::regclass);


--
-- TOC entry 3366 (class 2604 OID 29423)
-- Name: lupa luparivi_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa ALTER COLUMN luparivi_id SET DEFAULT nextval('public.lupa_luparivi_id_seq'::regclass);


--
-- TOC entry 3367 (class 2604 OID 29424)
-- Name: seura seura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura ALTER COLUMN seura_id SET DEFAULT nextval('public.seura_seura_id_seq'::regclass);


--
-- TOC entry 3359 (class 2604 OID 29425)
-- Name: seurue seurue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue ALTER COLUMN seurue_id SET DEFAULT nextval('public.seurue_seurue_id_seq'::regclass);


--
-- TOC entry 3379 (class 2606 OID 29427)
-- Name: aikuinenvasa aikuinenvasa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aikuinenvasa
    ADD CONSTRAINT aikuinenvasa_pk PRIMARY KEY (ikaluokka);


--
-- TOC entry 3381 (class 2606 OID 29429)
-- Name: elain elain_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elain
    ADD CONSTRAINT elain_pk PRIMARY KEY (elaimen_nimi);


--
-- TOC entry 3373 (class 2606 OID 29431)
-- Name: jakoryhma jakoryhma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT jakoryhma_pk PRIMARY KEY (ryhma_id);


--
-- TOC entry 3375 (class 2606 OID 29433)
-- Name: jakotapahtuma jakotapahtuma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT jakotapahtuma_pk PRIMARY KEY (tapahtuma_id);


--
-- TOC entry 3369 (class 2606 OID 29435)
-- Name: jasen jasen_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen
    ADD CONSTRAINT jasen_pk PRIMARY KEY (jasen_id);


--
-- TOC entry 3377 (class 2606 OID 29437)
-- Name: jasenyys jasenyys_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasenyys_pk PRIMARY KEY (jasenyys_id);


--
-- TOC entry 3383 (class 2606 OID 29439)
-- Name: kaato kaato_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT kaato_pk PRIMARY KEY (kaato_id);


--
-- TOC entry 3385 (class 2606 OID 29441)
-- Name: kasittely kasittely_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely
    ADD CONSTRAINT kasittely_pk PRIMARY KEY (kasittelyid);


--
-- TOC entry 3387 (class 2606 OID 29443)
-- Name: lupa lupa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT lupa_pk PRIMARY KEY (luparivi_id);


--
-- TOC entry 3389 (class 2606 OID 29445)
-- Name: ruhonosa ruhonosa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruhonosa
    ADD CONSTRAINT ruhonosa_pk PRIMARY KEY (osnimitys);


--
-- TOC entry 3391 (class 2606 OID 29447)
-- Name: seura seura_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura
    ADD CONSTRAINT seura_pk PRIMARY KEY (seura_id);


--
-- TOC entry 3371 (class 2606 OID 29449)
-- Name: seurue seurue_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seurue_pk PRIMARY KEY (seurue_id);


--
-- TOC entry 3393 (class 2606 OID 29451)
-- Name: sukupuoli sukupuoli_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sukupuoli
    ADD CONSTRAINT sukupuoli_pk PRIMARY KEY (sukupuoli);


--
-- TOC entry 3402 (class 2606 OID 29452)
-- Name: kaato aikuinen_vasa_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT aikuinen_vasa_kaato_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3407 (class 2606 OID 29457)
-- Name: lupa aikuinen_vasa_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT aikuinen_vasa_lupa_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3403 (class 2606 OID 29462)
-- Name: kaato elain_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT elain_kaato_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3408 (class 2606 OID 29467)
-- Name: lupa elain_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT elain_lupa_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3400 (class 2606 OID 29472)
-- Name: jasenyys jasen_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasen_jasenyys_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3404 (class 2606 OID 29477)
-- Name: kaato jasen_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT jasen_kaato_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3394 (class 2606 OID 29482)
-- Name: seurue jasen_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT jasen_seurue_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3397 (class 2606 OID 29487)
-- Name: jakotapahtuma kaato_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT kaato_jakotapahtuma_fk FOREIGN KEY (kaato_id) REFERENCES public.kaato(kaato_id) NOT VALID;


--
-- TOC entry 3405 (class 2606 OID 29492)
-- Name: kaato kasittely_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT kasittely_kaato_fk FOREIGN KEY (kasittelyid) REFERENCES public.kasittely(kasittelyid);


--
-- TOC entry 3398 (class 2606 OID 29497)
-- Name: jakotapahtuma ruhonosa_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ruhonosa_jakotapahtuma_fk FOREIGN KEY (osnimitys) REFERENCES public.ruhonosa(osnimitys);


--
-- TOC entry 3399 (class 2606 OID 29502)
-- Name: jakotapahtuma ryhma_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ryhma_jakotapahtuma_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3401 (class 2606 OID 29507)
-- Name: jasenyys ryhma_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT ryhma_jasenyys_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3409 (class 2606 OID 29512)
-- Name: lupa seura_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT seura_lupa_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3395 (class 2606 OID 29517)
-- Name: seurue seura_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seura_seurue_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3396 (class 2606 OID 29522)
-- Name: jakoryhma seurue_ryhma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT seurue_ryhma_fk FOREIGN KEY (seurue_id) REFERENCES public.seurue(seurue_id);


--
-- TOC entry 3406 (class 2606 OID 29527)
-- Name: kaato sukupuoli_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT sukupuoli_kaato_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3410 (class 2606 OID 29532)
-- Name: lupa sukupuoli_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT sukupuoli_lupa_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO application;


--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 265
-- Name: PROCEDURE add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON PROCEDURE public.add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying) FROM postgres;
GRANT ALL ON PROCEDURE public.add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying) TO postgres WITH GRANT OPTION;
GRANT ALL ON PROCEDURE public.add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying) TO application;


--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE jasen; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jasen FROM postgres;
GRANT ALL ON TABLE public.jasen TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jasen TO application;


--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 266
-- Name: FUNCTION get_member(id integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.get_member(id integer) FROM postgres;
GRANT ALL ON FUNCTION public.get_member(id integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION public.get_member(id integer) TO application;


--
-- TOC entry 3596 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE seurue; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.seurue FROM postgres;
GRANT ALL ON TABLE public.seurue TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.seurue TO application;


--
-- TOC entry 3597 (class 0 OID 0)
-- Dependencies: 267
-- Name: FUNCTION get_party(id integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.get_party(id integer) FROM postgres;
GRANT ALL ON FUNCTION public.get_party(id integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION public.get_party(id integer) TO application;


--
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jakoryhma FROM postgres;
GRANT ALL ON TABLE public.jakoryhma TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jakoryhma TO application;


--
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE jakotapahtuma; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jakotapahtuma FROM postgres;
GRANT ALL ON TABLE public.jakotapahtuma TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jakotapahtuma TO application;


--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE jasenyys; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jasenyys FROM postgres;
GRANT ALL ON TABLE public.jasenyys TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jasenyys TO application;


--
-- TOC entry 3604 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE seurue_lihat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_lihat TO application;


--
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE seurue_lihat_osuus; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_lihat_osuus TO application;


--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 268
-- Name: FUNCTION get_party_portion_amount(id integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.get_party_portion_amount(id integer) FROM postgres;
GRANT ALL ON FUNCTION public.get_party_portion_amount(id integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION public.get_party_portion_amount(id integer) TO application;


--
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE aikuinenvasa; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.aikuinenvasa FROM postgres;
GRANT ALL ON TABLE public.aikuinenvasa TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.aikuinenvasa TO application;


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE aktiivijasenet; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.aktiivijasenet TO application;


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE elain; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.elain FROM postgres;
GRANT ALL ON TABLE public.elain TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.elain TO application;


--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE kaato; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.kaato FROM postgres;
GRANT ALL ON TABLE public.kaato TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.kaato TO application;


--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE kasittely; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.kasittely FROM postgres;
GRANT ALL ON TABLE public.kasittely TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.kasittely TO application;


--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE jaettavat_lihat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaettavat_lihat TO application;


--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE jaetut_hirvi; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaetut_hirvi TO application;


--
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE jaetut_lihat; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jaetut_lihat FROM postgres;
GRANT ALL ON TABLE public.jaetut_lihat TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jaetut_lihat TO application;


--
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE jaetut_ruhon_osat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaetut_ruhon_osat TO application;


--
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE jaetut_valkohantapeura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaetut_valkohantapeura TO application;


--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE jakoryhma_liitokset; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_liitokset TO application;


--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE ryhmien_osuudet; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.ryhmien_osuudet FROM postgres;
GRANT ALL ON TABLE public.ryhmien_osuudet TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.ryhmien_osuudet TO application;


--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE jakoryhma_osuus_maara; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_osuus_maara TO application;


--
-- TOC entry 3629 (class 0 OID 0)
-- Dependencies: 230
-- Name: SEQUENCE jakoryhma_ryhma_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.jakoryhma_ryhma_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.jakoryhma_ryhma_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.jakoryhma_ryhma_id_seq TO application;


--
-- TOC entry 3630 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE jakoryhma_seurueen_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_seurueen_nimella TO application;


--
-- TOC entry 3631 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE jakoryhma_yhteenveto; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jakoryhma_yhteenveto FROM postgres;
GRANT ALL ON TABLE public.jakoryhma_yhteenveto TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jakoryhma_yhteenveto TO application;


--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 233
-- Name: SEQUENCE jakotapahtuma_tapahtuma_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.jakotapahtuma_tapahtuma_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.jakotapahtuma_tapahtuma_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.jakotapahtuma_tapahtuma_id_seq TO application;


--
-- TOC entry 3635 (class 0 OID 0)
-- Dependencies: 234
-- Name: SEQUENCE jasen_jasen_id_seq_1; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.jasen_jasen_id_seq_1 FROM postgres;
GRANT ALL ON SEQUENCE public.jasen_jasen_id_seq_1 TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.jasen_jasen_id_seq_1 TO application;


--
-- TOC entry 3636 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE jasen_liitokset; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasen_liitokset TO application;


--
-- TOC entry 3638 (class 0 OID 0)
-- Dependencies: 236
-- Name: SEQUENCE jasenyys_jasenyys_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.jasenyys_jasenyys_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.jasenyys_jasenyys_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.jasenyys_jasenyys_id_seq TO application;


--
-- TOC entry 3639 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE jasenyys_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasenyys_nimella TO application;


--
-- TOC entry 3640 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE jasenyys_nimella_ryhmalla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasenyys_nimella_ryhmalla TO application;


--
-- TOC entry 3641 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE kaadot_ampujittain; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.kaadot_ampujittain FROM postgres;
GRANT ALL ON TABLE public.kaadot_ampujittain TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.kaadot_ampujittain TO application;


--
-- TOC entry 3642 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE kaadot_elaimittain; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.kaadot_elaimittain FROM postgres;
GRANT ALL ON TABLE public.kaadot_elaimittain TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.kaadot_elaimittain TO application;


--
-- TOC entry 3644 (class 0 OID 0)
-- Dependencies: 241
-- Name: SEQUENCE kaato_kaato_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.kaato_kaato_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.kaato_kaato_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.kaato_kaato_id_seq TO application;


--
-- TOC entry 3646 (class 0 OID 0)
-- Dependencies: 243
-- Name: SEQUENCE kasittely_kasittelyid_seq_1; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.kasittely_kasittelyid_seq_1 FROM postgres;
GRANT ALL ON SEQUENCE public.kasittely_kasittelyid_seq_1 TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.kasittely_kasittelyid_seq_1 TO application;


--
-- TOC entry 3648 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE kaytto_ryhmille; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaytto_ryhmille TO application;


--
-- TOC entry 3650 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE lihan_kaytto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lihan_kaytto TO application;


--
-- TOC entry 3652 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE lupa; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.lupa FROM postgres;
GRANT ALL ON TABLE public.lupa TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.lupa TO application;


--
-- TOC entry 3654 (class 0 OID 0)
-- Dependencies: 247
-- Name: SEQUENCE lupa_luparivi_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.lupa_luparivi_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.lupa_luparivi_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.lupa_luparivi_id_seq TO application;


--
-- TOC entry 3655 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE luvat_kayttamatta_kpl; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.luvat_kayttamatta_kpl FROM postgres;
GRANT ALL ON TABLE public.luvat_kayttamatta_kpl TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.luvat_kayttamatta_kpl TO application;


--
-- TOC entry 3657 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE luvat_kayttamatta_kpl_pros; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.luvat_kayttamatta_kpl_pros TO application;


--
-- TOC entry 3658 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE luvat_kayttamatta_pros; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.luvat_kayttamatta_pros FROM postgres;
GRANT ALL ON TABLE public.luvat_kayttamatta_pros TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.luvat_kayttamatta_pros TO application;


--
-- TOC entry 3659 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE ruhonosa; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.ruhonosa FROM postgres;
GRANT ALL ON TABLE public.ruhonosa TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.ruhonosa TO application;


--
-- TOC entry 3660 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE sankey_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sankey_data TO application;


--
-- TOC entry 3662 (class 0 OID 0)
-- Dependencies: 254
-- Name: TABLE seurue_sankey; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_sankey TO application;


--
-- TOC entry 3664 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE sankey_elain_kasittely_seurue; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sankey_elain_kasittely_seurue TO application;


--
-- TOC entry 3666 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE seura; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.seura FROM postgres;
GRANT ALL ON TABLE public.seura TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.seura TO application;


--
-- TOC entry 3668 (class 0 OID 0)
-- Dependencies: 257
-- Name: SEQUENCE seura_seura_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.seura_seura_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.seura_seura_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.seura_seura_id_seq TO application;


--
-- TOC entry 3669 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE seurue_jasen_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_jasen_nimella TO application;


--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE seurue_liitokset; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_liitokset TO application;


--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE seurue_ryhma_lihat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_ryhma_lihat TO application;


--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 261
-- Name: SEQUENCE seurue_seurue_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.seurue_seurue_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.seurue_seurue_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.seurue_seurue_id_seq TO application;


--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE simple_sankey; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.simple_sankey TO application;


--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE sukupuoli; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.sukupuoli FROM postgres;
GRANT ALL ON TABLE public.sukupuoli TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.sukupuoli TO application;


--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 264
-- Name: SEQUENCE testi_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.testi_seq FROM postgres;
GRANT ALL ON SEQUENCE public.testi_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.testi_seq TO application;


-- Completed on 2023-03-07 16:38:54

--
-- PostgreSQL database dump complete
--


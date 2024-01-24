--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Debian 14.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.0

-- Started on 2024-01-24 10:55:27

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 277 (class 1255 OID 49506)
-- Name: get_used_licences(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_used_licences(license_year integer) RETURNS TABLE("Lupia jäljellä" bigint, "Lupia jäljellä(%)" integer, "Eläin" character varying, "Sukupuoli" character varying, "Ikäluokka" character varying)
    LANGUAGE sql
    AS $$SELECT lupa.maara - COUNT(kaato.kaato_id) AS "Lupia jäljellä",
    ROUND((100 * (lupa.maara - COUNT(kaato.kaato_id)))::double precision / lupa.maara::double precision)::integer AS "Lupia jäljellä(%)",
    lupa.elaimen_nimi AS "Eläin",
    lupa.sukupuoli AS "Sukupuoli",
    lupa.ikaluokka AS "Ikäluokka"
FROM lupa
LEFT JOIN kaato ON lupa.sukupuoli::text = kaato.sukupuoli::text
    AND lupa.ikaluokka::text = kaato.ikaluokka::text
    AND kaato.elaimen_nimi::text = lupa.elaimen_nimi::text
    AND kaato.kaatopaiva BETWEEN (license_year::text || '-07-1')::date AND ((license_year + 1)::text || '-06-30')::date
WHERE lupa.lupavuosi = license_year::text
GROUP BY lupa.elaimen_nimi, lupa.maara, lupa.sukupuoli, lupa.ikaluokka;$$;


ALTER FUNCTION public.get_used_licences(license_year integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 49507)
-- Name: aikuinenvasa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aikuinenvasa (
    ikaluokka character varying(20) NOT NULL
);


ALTER TABLE public.aikuinenvasa OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 49510)
-- Name: elain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.elain (
    elaimen_nimi character varying(20) NOT NULL
);


ALTER TABLE public.elain OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 49513)
-- Name: jakoryhma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jakoryhma (
    ryhma_id integer NOT NULL,
    seurue_id integer NOT NULL,
    ryhman_nimi character varying(50) NOT NULL
);


ALTER TABLE public.jakoryhma OWNER TO postgres;

--
-- TOC entry 3664 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jakoryhma IS 'Ryhmä, jolle lihaa jaetaan';


--
-- TOC entry 212 (class 1259 OID 49516)
-- Name: jakotapahtuma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jakotapahtuma (
    tapahtuma_id integer NOT NULL,
    paiva date NOT NULL,
    ryhma_id integer NOT NULL,
    osnimitys character varying(20) NOT NULL,
    kaadon_kasittely_id integer NOT NULL,
    maara real NOT NULL
);


ALTER TABLE public.jakotapahtuma OWNER TO postgres;

--
-- TOC entry 3666 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN jakotapahtuma.maara; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jakotapahtuma.maara IS 'Jaettu lihamäärä kiloina';


--
-- TOC entry 213 (class 1259 OID 49519)
-- Name: jaetut_lihat; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaetut_lihat AS
 SELECT jakoryhma.ryhman_nimi AS "Ryhmän Nimi",
    sum(jakotapahtuma.maara) AS "Kg Yhteensä"
   FROM (public.jakoryhma
     LEFT JOIN public.jakotapahtuma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
  GROUP BY jakoryhma.ryhman_nimi
  ORDER BY jakoryhma.ryhman_nimi;


ALTER VIEW public.jaetut_lihat OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 49523)
-- Name: kaadon_kasittely; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kaadon_kasittely (
    kaadon_kasittely_id integer NOT NULL,
    kasittelyid integer NOT NULL,
    kaato_id integer NOT NULL,
    kasittely_maara integer NOT NULL
);


ALTER TABLE public.kaadon_kasittely OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 49526)
-- Name: kaato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kaato (
    kaato_id integer NOT NULL,
    jasen_id integer NOT NULL,
    kaatopaiva date NOT NULL,
    ruhopaino real NOT NULL,
    paikka_teksti character varying(100) NOT NULL,
    paikka_koordinaatti character varying(100),
    elaimen_nimi character varying(20) NOT NULL,
    sukupuoli character varying(20) NOT NULL,
    ikaluokka character varying(20) NOT NULL,
    lisatieto character varying(255)
);


ALTER TABLE public.kaato OWNER TO postgres;

--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE kaato; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.kaato IS 'Ampumatapahtuman tiedot';


--
-- TOC entry 3671 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN kaato.ruhopaino; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.ruhopaino IS 'paino kiloina';


--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN kaato.paikka_koordinaatti; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.paikka_koordinaatti IS 'Tämän kentän tietotyyppi pitää oikeasti olla geometry (Postgis-tietotyyppi)';


--
-- TOC entry 216 (class 1259 OID 49531)
-- Name: jaetut_ruhon_osat; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaetut_ruhon_osat AS
 SELECT kaato.kaato_id AS "KaatoID",
    kaato.elaimen_nimi AS "Eläin",
    jakotapahtuma.osnimitys AS "Ruhon osa",
    jakotapahtuma.maara AS "Määrä",
    kaadon_kasittely.kasittely_maara AS "Käsittelyn Määrä"
   FROM ((public.kaato
     JOIN public.kaadon_kasittely ON ((kaadon_kasittely.kaato_id = kaato.kaato_id)))
     JOIN public.jakotapahtuma ON ((jakotapahtuma.kaadon_kasittely_id = kaadon_kasittely.kaadon_kasittely_id)))
  ORDER BY kaato.kaato_id DESC;


ALTER VIEW public.jaetut_ruhon_osat OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 49536)
-- Name: jakotapahtuma_jasen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jakotapahtuma_jasen (
    tapahtuma_jasen_id integer NOT NULL,
    paiva date NOT NULL,
    kaadon_kasittely_id integer NOT NULL,
    osnimitys character varying(20) NOT NULL,
    maara real NOT NULL,
    jasenyys_id integer NOT NULL
);


ALTER TABLE public.jakotapahtuma_jasen OWNER TO postgres;

--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE jakotapahtuma_jasen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jakotapahtuma_jasen IS 'Table for storing shares given straight to members';


--
-- TOC entry 218 (class 1259 OID 49539)
-- Name: jaetut_ruhon_osat_jasenille; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaetut_ruhon_osat_jasenille AS
 SELECT kaato.kaato_id AS "KaatoID",
    kaato.elaimen_nimi AS "Eläin",
    jakotapahtuma_jasen.osnimitys AS "Ruhon osa",
    jakotapahtuma_jasen.maara AS "Määrä",
    kaadon_kasittely.kasittely_maara AS "Käsittelyn Määrä"
   FROM ((public.kaato
     JOIN public.kaadon_kasittely ON ((kaadon_kasittely.kaato_id = kaato.kaato_id)))
     JOIN public.jakotapahtuma_jasen ON ((jakotapahtuma_jasen.kaadon_kasittely_id = kaadon_kasittely.kaadon_kasittely_id)))
  ORDER BY kaato.kaato_id DESC;


ALTER VIEW public.jaetut_ruhon_osat_jasenille OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 49544)
-- Name: jasen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jasen (
    jasen_id integer NOT NULL,
    etunimi character varying(50) NOT NULL,
    sukunimi character varying(50) NOT NULL,
    jakeluosoite character varying(30),
    postinumero character varying(10),
    postitoimipaikka character varying(30),
    tila character varying(20) DEFAULT 'aktiivinen'::character varying NOT NULL,
    puhelinnumero character varying(15)
);


ALTER TABLE public.jasen OWNER TO postgres;

--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE jasen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jasen IS 'Henkilö joka osallistuu metsästykseen tai lihanjakoon';


--
-- TOC entry 220 (class 1259 OID 49548)
-- Name: kasittely; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kasittely (
    kasittelyid integer NOT NULL,
    kasittely_teksti character varying(50) NOT NULL
);


ALTER TABLE public.kasittely OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 49551)
-- Name: ruhonosa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ruhonosa (
    osnimitys character varying(20) NOT NULL,
    osnimitys_suhdeluku real
);


ALTER TABLE public.ruhonosa OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 49554)
-- Name: jako_kaadot; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jako_kaadot AS
 SELECT kaadon_kasittely.kaato_id AS "KaatoID",
    kaadon_kasittely.kasittely_maara AS "Jako Määrä(%)",
    ((sum(ruhonosa.osnimitys_suhdeluku) * (10000)::double precision) / (kaadon_kasittely.kasittely_maara)::double precision) AS "Jaettu (%)",
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Kaataja",
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS "Paikka",
    kaato.elaimen_nimi AS "Eläin",
    kaato.ikaluokka AS "Ikäluokka",
    kaato.sukupuoli AS "Sukupuoli",
    kasittely.kasittely_teksti AS "Käyttö",
    kaato.ruhopaino AS "Paino",
    kaadon_kasittely.kaadon_kasittely_id
   FROM (((((public.jasen
     JOIN public.kaato ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kaadon_kasittely ON ((kaadon_kasittely.kaato_id = kaato.kaato_id)))
     JOIN public.kasittely ON ((kaadon_kasittely.kasittelyid = kasittely.kasittelyid)))
     LEFT JOIN public.jakotapahtuma ON ((jakotapahtuma.kaadon_kasittely_id = kaadon_kasittely.kaadon_kasittely_id)))
     LEFT JOIN public.ruhonosa ON (((ruhonosa.osnimitys)::text = (jakotapahtuma.osnimitys)::text)))
  WHERE (kaadon_kasittely.kasittelyid = 2)
  GROUP BY kaadon_kasittely.kaato_id, kaadon_kasittely.kasittely_maara, (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text), kaato.kaatopaiva, kaato.paikka_teksti, kaato.elaimen_nimi, kaato.ikaluokka, kaato.sukupuoli, kasittely.kasittely_teksti, kaato.ruhopaino, kaadon_kasittely.kaadon_kasittely_id
  ORDER BY kaadon_kasittely.kaato_id DESC;


ALTER VIEW public.jako_kaadot OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 49559)
-- Name: jako_kaadot_jasenille; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jako_kaadot_jasenille AS
 SELECT kaadon_kasittely.kaato_id AS "KaatoID",
    kaadon_kasittely.kasittely_maara AS "Jako Määrä(%)",
    ((sum(ruhonosa.osnimitys_suhdeluku) * (10000)::double precision) / (kaadon_kasittely.kasittely_maara)::double precision) AS "Jaettu (%)",
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Kaataja",
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS "Paikka",
    kaato.elaimen_nimi AS "Eläin",
    kaato.ikaluokka AS "Ikäluokka",
    kaato.sukupuoli AS "Sukupuoli",
    kasittely.kasittely_teksti AS "Käyttö",
    kaato.ruhopaino AS "Paino",
    kaadon_kasittely.kaadon_kasittely_id
   FROM (((((public.jasen
     JOIN public.kaato ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kaadon_kasittely ON ((kaadon_kasittely.kaato_id = kaato.kaato_id)))
     JOIN public.kasittely ON ((kaadon_kasittely.kasittelyid = kasittely.kasittelyid)))
     LEFT JOIN public.jakotapahtuma_jasen ON ((jakotapahtuma_jasen.kaadon_kasittely_id = kaadon_kasittely.kaadon_kasittely_id)))
     LEFT JOIN public.ruhonosa ON (((ruhonosa.osnimitys)::text = (jakotapahtuma_jasen.osnimitys)::text)))
  WHERE (kaadon_kasittely.kasittelyid = 5)
  GROUP BY kaadon_kasittely.kaato_id, kaadon_kasittely.kasittely_maara, (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text), kaato.kaatopaiva, kaato.paikka_teksti, kaato.elaimen_nimi, kaato.ikaluokka, kaato.sukupuoli, kasittely.kasittely_teksti, kaato.ruhopaino, kaadon_kasittely.kaadon_kasittely_id
  ORDER BY kaadon_kasittely.kaato_id DESC;


ALTER VIEW public.jako_kaadot_jasenille OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 49564)
-- Name: jasenyys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jasenyys (
    jasenyys_id integer NOT NULL,
    ryhma_id integer,
    jasen_id integer NOT NULL,
    osuus integer NOT NULL,
    liittyi date NOT NULL,
    poistui date,
    seurue_id integer NOT NULL
);


ALTER TABLE public.jasenyys OWNER TO postgres;

--
-- TOC entry 3684 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN jasenyys.osuus; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jasenyys.osuus IS 'Lihaosuus prosentteina';


--
-- TOC entry 225 (class 1259 OID 49567)
-- Name: ryhmien_osuudet; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.ryhmien_osuudet AS
 SELECT jasenyys.ryhma_id,
    ((sum(jasenyys.osuus))::double precision / (100)::real) AS jakokerroin
   FROM public.jasenyys
  WHERE (jasenyys.poistui IS NULL)
  GROUP BY jasenyys.ryhma_id
  ORDER BY jasenyys.ryhma_id;


ALTER VIEW public.ryhmien_osuudet OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 49571)
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


ALTER VIEW public.jakoryhma_osuus_maara OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 49576)
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jakoryhma_ryhma_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jakoryhma_ryhma_id_seq OWNER TO postgres;

--
-- TOC entry 3688 (class 0 OID 0)
-- Dependencies: 227
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakoryhma_ryhma_id_seq OWNED BY public.jakoryhma.ryhma_id;


--
-- TOC entry 228 (class 1259 OID 49577)
-- Name: seurue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seurue (
    seurue_id integer NOT NULL,
    seura_id integer NOT NULL,
    seurueen_nimi character varying(50) NOT NULL,
    jasen_id integer NOT NULL,
    seurue_tyyppi_id integer NOT NULL
);


ALTER TABLE public.seurue OWNER TO postgres;

--
-- TOC entry 3690 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE seurue; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seurue IS 'Metsästystä harjoittavan seurueen tiedot';


--
-- TOC entry 3691 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN seurue.jasen_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.seurue.jasen_id IS 'Seurueen johtajan tunniste';


--
-- TOC entry 229 (class 1259 OID 49580)
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


ALTER VIEW public.jakoryhma_seurueen_nimella OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 49584)
-- Name: jakoryhma_yhteenveto; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jakoryhma_yhteenveto AS
 SELECT jakoryhma.ryhman_nimi AS "Ryhmä",
    count(jasenyys.jasen_id) AS "Jäseniä",
    ((sum(jasenyys.osuus))::double precision / (100)::real) AS "Osuus Summa"
   FROM (public.jakoryhma
     LEFT JOIN public.jasenyys ON ((jasenyys.ryhma_id = jakoryhma.ryhma_id)))
  WHERE (jasenyys.poistui IS NULL)
  GROUP BY jakoryhma.ryhman_nimi
  ORDER BY jakoryhma.ryhman_nimi;


ALTER VIEW public.jakoryhma_yhteenveto OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 49589)
-- Name: nimivalinta; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.nimivalinta AS
 SELECT jasen.jasen_id,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS kokonimi
   FROM public.jasen
  WHERE ((jasen.tila)::text = 'aktiivinen'::text)
  ORDER BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER VIEW public.nimivalinta OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 49593)
-- Name: jakotapahtuma_jasen_jasen_nimella; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jakotapahtuma_jasen_jasen_nimella AS
 SELECT jakotapahtuma_jasen.tapahtuma_jasen_id AS "Jako",
    jakotapahtuma_jasen.paiva AS pvm,
    jasenyys.jasenyys_id AS "Jäsenyys ID",
    nimivalinta.kokonimi AS "Nimi",
    jakotapahtuma_jasen.osnimitys AS "Ruhonosa",
    jakotapahtuma_jasen.kaadon_kasittely_id AS "Kaadon kasittely ID",
    jakotapahtuma_jasen.maara AS "Paino",
    kaadon_kasittely.kaato_id AS "Kaato ID",
    seurue.seurue_id AS "Seurue ID"
   FROM ((((public.jakotapahtuma_jasen
     JOIN public.jasenyys ON ((jasenyys.jasenyys_id = jakotapahtuma_jasen.jasenyys_id)))
     JOIN public.nimivalinta ON ((jasenyys.jasen_id = nimivalinta.jasen_id)))
     JOIN public.kaadon_kasittely ON ((kaadon_kasittely.kaadon_kasittely_id = jakotapahtuma_jasen.kaadon_kasittely_id)))
     JOIN public.seurue ON ((seurue.seurue_id = jasenyys.seurue_id)));


ALTER VIEW public.jakotapahtuma_jasen_jasen_nimella OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 49598)
-- Name: jakotapahtuma_jasen_tapahtuma_jasen_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq OWNER TO postgres;

--
-- TOC entry 3697 (class 0 OID 0)
-- Dependencies: 233
-- Name: jakotapahtuma_jasen_tapahtuma_jasen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq OWNED BY public.jakotapahtuma_jasen.tapahtuma_jasen_id;


--
-- TOC entry 234 (class 1259 OID 49599)
-- Name: jakotapahtuma_ryhman_nimella; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jakotapahtuma_ryhman_nimella AS
 SELECT jakotapahtuma.tapahtuma_id AS "Jako",
    jakotapahtuma.paiva AS pvm,
    jakotapahtuma.ryhma_id AS "Ryhmä ID",
    jakoryhma.ryhman_nimi AS "Ryhmän Nimi",
    jakotapahtuma.osnimitys AS "Ruhonosa",
    jakotapahtuma.kaadon_kasittely_id AS "Kaadon kasittely ID",
    jakotapahtuma.maara AS "Paino",
    kaadon_kasittely.kaato_id AS "Kaato ID"
   FROM ((public.jakotapahtuma
     JOIN public.jakoryhma ON ((jakoryhma.ryhma_id = jakotapahtuma.ryhma_id)))
     JOIN public.kaadon_kasittely ON ((kaadon_kasittely.kaadon_kasittely_id = jakotapahtuma.kaadon_kasittely_id)));


ALTER VIEW public.jakotapahtuma_ryhman_nimella OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 49603)
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jakotapahtuma_tapahtuma_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jakotapahtuma_tapahtuma_id_seq OWNER TO postgres;

--
-- TOC entry 3700 (class 0 OID 0)
-- Dependencies: 235
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakotapahtuma_tapahtuma_id_seq OWNED BY public.jakotapahtuma.tapahtuma_id;


--
-- TOC entry 236 (class 1259 OID 49604)
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jasen_jasen_id_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jasen_jasen_id_seq_1 OWNER TO postgres;

--
-- TOC entry 3702 (class 0 OID 0)
-- Dependencies: 236
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasen_jasen_id_seq_1 OWNED BY public.jasen.jasen_id;


--
-- TOC entry 237 (class 1259 OID 49605)
-- Name: jasen_tila; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jasen_tila AS
 SELECT (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Nimi",
    jasen.jakeluosoite AS "Osoite",
    jasen.postinumero AS "Postinumero",
    jasen.postitoimipaikka AS "Postitoimipaikka",
    jasen.tila AS "Tila"
   FROM public.jasen
  ORDER BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER VIEW public.jasen_tila OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 49609)
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jasenyys_jasenyys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jasenyys_jasenyys_id_seq OWNER TO postgres;

--
-- TOC entry 3705 (class 0 OID 0)
-- Dependencies: 238
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasenyys_jasenyys_id_seq OWNED BY public.jasenyys.jasenyys_id;


--
-- TOC entry 239 (class 1259 OID 49610)
-- Name: jasenyys_nimella; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jasenyys_nimella AS
 SELECT jasenyys.jasenyys_id,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS kokonimi,
    jasenyys.seurue_id
   FROM (public.jasenyys
     JOIN public.jasen ON ((jasen.jasen_id = jasenyys.jasen_id)));


ALTER VIEW public.jasenyys_nimella OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 49614)
-- Name: seurue_tyyppi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seurue_tyyppi (
    seurue_tyyppi_id integer NOT NULL,
    seurue_tyyppi_nimi character varying(20) NOT NULL
);


ALTER TABLE public.seurue_tyyppi OWNER TO postgres;

--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE seurue_tyyppi; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seurue_tyyppi IS 'Taulu, jonka tarkoitus on rajata tyyppi tietueen arvot seurue taulussa';


--
-- TOC entry 241 (class 1259 OID 49617)
-- Name: jasenyys_nimella_ryhmalla; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jasenyys_nimella_ryhmalla AS
 SELECT (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Nimi",
    jasenyys.jasenyys_id AS "JäsenyysID",
    jasenyys.jasen_id AS "JäsenID",
    jasenyys.ryhma_id AS "RyhmäID",
    jakoryhma.ryhman_nimi AS "Ryhmän Nimi",
    jasenyys.liittyi AS "Liittyi",
    jasenyys.poistui AS "Poistui",
    jasenyys.osuus AS "Osuus",
    jasenyys.seurue_id AS "SeurueID",
    seurue.seurueen_nimi AS "Seurueen Nimi",
    seurue.seurue_tyyppi_id AS "Seurueen Tyyppi ID",
    seurue_tyyppi.seurue_tyyppi_nimi AS "Seurueen Tyyppi"
   FROM ((((public.jasenyys
     JOIN public.jasen ON ((jasenyys.jasen_id = jasen.jasen_id)))
     LEFT JOIN public.jakoryhma ON ((jasenyys.ryhma_id = jakoryhma.ryhma_id)))
     JOIN public.seurue ON ((jasenyys.seurue_id = seurue.seurue_id)))
     JOIN public.seurue_tyyppi ON ((seurue_tyyppi.seurue_tyyppi_id = seurue.seurue_tyyppi_id)))
  ORDER BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER VIEW public.jasenyys_nimella_ryhmalla OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 49622)
-- Name: kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kaadon_kasittely_kaadon_kasittely_id_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kaadon_kasittely_kaadon_kasittely_id_seq_1 OWNER TO postgres;

--
-- TOC entry 3711 (class 0 OID 0)
-- Dependencies: 242
-- Name: kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kaadon_kasittely_kaadon_kasittely_id_seq_1 OWNED BY public.kaadon_kasittely.kaadon_kasittely_id;


--
-- TOC entry 243 (class 1259 OID 49623)
-- Name: kaato_kaato_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kaato_kaato_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kaato_kaato_id_seq OWNER TO postgres;

--
-- TOC entry 3713 (class 0 OID 0)
-- Dependencies: 243
-- Name: kaato_kaato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kaato_kaato_id_seq OWNED BY public.kaato.kaato_id;


--
-- TOC entry 244 (class 1259 OID 49624)
-- Name: kaatoluettelo; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.kaatoluettelo AS
 SELECT (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Kaataja",
    kaato.kaatopaiva AS "Kaatopäivä",
    kaato.paikka_teksti AS "Paikka",
    kaato.elaimen_nimi AS "Eläin",
    kaato.ikaluokka AS "Ikäluokka",
    kaato.sukupuoli AS "Sukupuoli",
    kaato.ruhopaino AS "Paino",
    kaato.kaato_id AS "Kaato ID",
    count(kaadon_kasittely.kaato_id) AS "Käsittelyt"
   FROM ((public.kaato
     JOIN public.jasen ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kaadon_kasittely ON ((kaato.kaato_id = kaadon_kasittely.kaato_id)))
  GROUP BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text), kaato.kaatopaiva, kaato.paikka_teksti, kaato.elaimen_nimi, kaato.ikaluokka, kaato.sukupuoli, kaato.ruhopaino, kaato.kaato_id
  ORDER BY kaato.kaato_id DESC;


ALTER VIEW public.kaatoluettelo OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 49629)
-- Name: kaatoluettelo_indeksilla; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.kaatoluettelo_indeksilla AS
 SELECT jasen.jasen_id AS "JäsenID",
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Kaataja",
    kaato.kaatopaiva AS "Kaatopäivä",
    kaato.paikka_teksti AS "Paikka",
    kaato.elaimen_nimi AS "Eläin",
    kaato.ikaluokka AS "Ikaluokka",
    kaato.sukupuoli AS "Sukupuoli",
    kaato.ruhopaino AS "Paino",
    kaato.lisatieto AS "Lisätieto",
    kaato.kaato_id AS "KaatoID"
   FROM (public.jasen
     JOIN public.kaato ON ((jasen.jasen_id = kaato.jasen_id)))
  ORDER BY kaato.kaato_id DESC;


ALTER VIEW public.kaatoluettelo_indeksilla OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 49634)
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kasittely_kasittelyid_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kasittely_kasittelyid_seq_1 OWNER TO postgres;

--
-- TOC entry 3717 (class 0 OID 0)
-- Dependencies: 246
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kasittely_kasittelyid_seq_1 OWNED BY public.kasittely.kasittelyid;


--
-- TOC entry 264 (class 1259 OID 49887)
-- Name: kayttaja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kayttaja (
    kayttaja_id integer NOT NULL,
    kayttajatunnus character varying(32) NOT NULL,
    salasana_hash character varying(255) NOT NULL,
    sahkoposti character varying(64),
    roolin_nimi character varying(32) NOT NULL
);


ALTER TABLE public.kayttaja OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 49635)
-- Name: lihan_kaytto; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.lihan_kaytto AS
 SELECT kaato.elaimen_nimi AS source,
    kasittely.kasittely_teksti AS target,
    sum(((kaato.ruhopaino * (kaadon_kasittely.kasittely_maara)::double precision) / (100.0)::double precision)) AS value
   FROM ((public.kaadon_kasittely
     JOIN public.kaato ON ((kaadon_kasittely.kaato_id = kaato.kaato_id)))
     JOIN public.kasittely ON ((kaadon_kasittely.kasittelyid = kasittely.kasittelyid)))
  GROUP BY kaato.elaimen_nimi, kasittely.kasittely_teksti;


ALTER VIEW public.lihan_kaytto OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 49640)
-- Name: lupa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lupa (
    luparivi_id integer NOT NULL,
    seura_id integer NOT NULL,
    lupavuosi character varying(4) NOT NULL,
    elaimen_nimi character varying(20) NOT NULL,
    sukupuoli character varying(20) NOT NULL,
    ikaluokka character varying(20) NOT NULL,
    maara integer NOT NULL
);


ALTER TABLE public.lupa OWNER TO postgres;

--
-- TOC entry 3721 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE lupa; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.lupa IS 'Vuosittaiset kaatoluvat';


--
-- TOC entry 249 (class 1259 OID 49643)
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lupa_luparivi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lupa_luparivi_id_seq OWNER TO postgres;

--
-- TOC entry 3723 (class 0 OID 0)
-- Dependencies: 249
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lupa_luparivi_id_seq OWNED BY public.lupa.luparivi_id;


--
-- TOC entry 250 (class 1259 OID 49644)
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


ALTER VIEW public.luvat_kayttamatta_kpl_pros OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 57697)
-- Name: rooli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooli (
    roolin_nimi character varying(32) NOT NULL
);


ALTER TABLE public.rooli OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 49649)
-- Name: ryhmat_jasenilla; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.ryhmat_jasenilla AS
 SELECT jakoryhma.ryhman_nimi AS "Ryhmän Nimi",
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Nimi",
    jasenyys.liittyi AS "Liittynyt",
    jasenyys.poistui AS "Poistunut",
    jasenyys.osuus AS "Osuus"
   FROM ((public.jasenyys
     JOIN public.jasen ON ((jasenyys.jasen_id = jasen.jasen_id)))
     JOIN public.jakoryhma ON ((jakoryhma.ryhma_id = jasenyys.ryhma_id)))
  ORDER BY jakoryhma.ryhman_nimi;


ALTER VIEW public.ryhmat_jasenilla OWNER TO postgres;

--
-- TOC entry 3727 (class 0 OID 0)
-- Dependencies: 251
-- Name: VIEW ryhmat_jasenilla; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.ryhmat_jasenilla IS 'Näkymä joka näyttää ryhmä, jäsen, liittymispvm(,poistumispvm), osuus';


--
-- TOC entry 252 (class 1259 OID 49654)
-- Name: seurue_sankey; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_sankey AS
 SELECT kasittely.kasittely_teksti AS source,
    seurue.seurueen_nimi AS target,
    sum(jakotapahtuma.maara) AS sum
   FROM ((((public.kasittely
     JOIN public.kaadon_kasittely ON ((kasittely.kasittelyid = kaadon_kasittely.kasittelyid)))
     JOIN public.jakotapahtuma ON ((kaadon_kasittely.kaadon_kasittely_id = jakotapahtuma.kaadon_kasittely_id)))
     JOIN public.jakoryhma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
     JOIN public.seurue ON ((jakoryhma.seurue_id = seurue.seurue_id)))
  WHERE (kaadon_kasittely.kasittelyid = 2)
  GROUP BY kasittely.kasittely_teksti, seurue.seurueen_nimi;


ALTER VIEW public.seurue_sankey OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 49659)
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


ALTER VIEW public.sankey_elain_kasittely_seurue OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 49663)
-- Name: sankey_jasen_jako_kg; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sankey_jasen_jako_kg AS
 SELECT seurue.seurueen_nimi AS source,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS target,
    sum(jakotapahtuma_jasen.maara) AS value
   FROM (((public.jasenyys
     JOIN public.seurue ON ((jasenyys.seurue_id = seurue.seurue_id)))
     JOIN public.jakotapahtuma_jasen ON ((jasenyys.jasenyys_id = jakotapahtuma_jasen.jasenyys_id)))
     JOIN public.jasen ON ((jasenyys.jasen_id = jasen.jasen_id)))
  WHERE (seurue.seurue_tyyppi_id = 2)
  GROUP BY seurue.seurueen_nimi, (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER VIEW public.sankey_jasen_jako_kg OWNER TO postgres;

--
-- TOC entry 3731 (class 0 OID 0)
-- Dependencies: 254
-- Name: VIEW sankey_jasen_jako_kg; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.sankey_jasen_jako_kg IS 'Näkymä, joka antaa seureen, jäsenen ja jäsenelle annetun lihan kiloissa';


--
-- TOC entry 255 (class 1259 OID 49668)
-- Name: sankey_jasen_jako_kpl; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sankey_jasen_jako_kpl AS
 SELECT seurue.seurueen_nimi AS source,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS target,
    count(jakotapahtuma_jasen.maara) AS value
   FROM (((public.jasenyys
     JOIN public.seurue ON ((jasenyys.seurue_id = seurue.seurue_id)))
     JOIN public.jakotapahtuma_jasen ON ((jasenyys.jasenyys_id = jakotapahtuma_jasen.jasenyys_id)))
     JOIN public.jasen ON ((jasenyys.jasen_id = jasen.jasen_id)))
  WHERE (seurue.seurue_tyyppi_id = 2)
  GROUP BY seurue.seurueen_nimi, (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER VIEW public.sankey_jasen_jako_kpl OWNER TO postgres;

--
-- TOC entry 3733 (class 0 OID 0)
-- Dependencies: 255
-- Name: VIEW sankey_jasen_jako_kpl; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.sankey_jasen_jako_kpl IS 'Näkymä, joka antaa seurueen, jäsenen ja jäsenelle annetut lihat lukumäärissä';


--
-- TOC entry 256 (class 1259 OID 49673)
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
-- TOC entry 3735 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE seura; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seura IS 'Metsästysseuran tiedot';


--
-- TOC entry 257 (class 1259 OID 49676)
-- Name: seura_seura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seura_seura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seura_seura_id_seq OWNER TO postgres;

--
-- TOC entry 3737 (class 0 OID 0)
-- Dependencies: 257
-- Name: seura_seura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seura_seura_id_seq OWNED BY public.seura.seura_id;


--
-- TOC entry 258 (class 1259 OID 49677)
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


ALTER VIEW public.seurue_lihat OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 49682)
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
  WHERE (jasenyys.poistui IS NULL)
  GROUP BY seurue.seurue_id, seurue.seurueen_nimi, seurue_lihat.sum;


ALTER VIEW public.seurue_lihat_osuus OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 49687)
-- Name: seurue_ryhmilla; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_ryhmilla AS
 SELECT seurue.seurueen_nimi AS "Seurueen Nimi",
    jakoryhma.ryhman_nimi AS "Ryhmän Nimi"
   FROM (public.jakoryhma
     JOIN public.seurue ON ((seurue.seurue_id = jakoryhma.seurue_id)))
  ORDER BY jakoryhma.ryhman_nimi;


ALTER VIEW public.seurue_ryhmilla OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 49691)
-- Name: seurue_seurue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seurue_seurue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seurue_seurue_id_seq OWNER TO postgres;

--
-- TOC entry 3742 (class 0 OID 0)
-- Dependencies: 261
-- Name: seurue_seurue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seurue_seurue_id_seq OWNED BY public.seurue.seurue_id;


--
-- TOC entry 262 (class 1259 OID 49692)
-- Name: seurue_tyyppi_seurue_tyyppi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seurue_tyyppi_seurue_tyyppi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seurue_tyyppi_seurue_tyyppi_id_seq OWNER TO postgres;

--
-- TOC entry 3744 (class 0 OID 0)
-- Dependencies: 262
-- Name: seurue_tyyppi_seurue_tyyppi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seurue_tyyppi_seurue_tyyppi_id_seq OWNED BY public.seurue_tyyppi.seurue_tyyppi_id;


--
-- TOC entry 263 (class 1259 OID 49693)
-- Name: sukupuoli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sukupuoli (
    sukupuoli character varying(20) NOT NULL
);


ALTER TABLE public.sukupuoli OWNER TO postgres;

--
-- TOC entry 3380 (class 2604 OID 49696)
-- Name: jakoryhma ryhma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma ALTER COLUMN ryhma_id SET DEFAULT nextval('public.jakoryhma_ryhma_id_seq'::regclass);


--
-- TOC entry 3381 (class 2604 OID 49697)
-- Name: jakotapahtuma tapahtuma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma ALTER COLUMN tapahtuma_id SET DEFAULT nextval('public.jakotapahtuma_tapahtuma_id_seq'::regclass);


--
-- TOC entry 3384 (class 2604 OID 49698)
-- Name: jakotapahtuma_jasen tapahtuma_jasen_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen ALTER COLUMN tapahtuma_jasen_id SET DEFAULT nextval('public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq'::regclass);


--
-- TOC entry 3385 (class 2604 OID 49699)
-- Name: jasen jasen_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen ALTER COLUMN jasen_id SET DEFAULT nextval('public.jasen_jasen_id_seq_1'::regclass);


--
-- TOC entry 3388 (class 2604 OID 49700)
-- Name: jasenyys jasenyys_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys ALTER COLUMN jasenyys_id SET DEFAULT nextval('public.jasenyys_jasenyys_id_seq'::regclass);


--
-- TOC entry 3382 (class 2604 OID 49701)
-- Name: kaadon_kasittely kaadon_kasittely_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely ALTER COLUMN kaadon_kasittely_id SET DEFAULT nextval('public.kaadon_kasittely_kaadon_kasittely_id_seq_1'::regclass);


--
-- TOC entry 3383 (class 2604 OID 49702)
-- Name: kaato kaato_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato ALTER COLUMN kaato_id SET DEFAULT nextval('public.kaato_kaato_id_seq'::regclass);


--
-- TOC entry 3387 (class 2604 OID 49703)
-- Name: kasittely kasittelyid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely ALTER COLUMN kasittelyid SET DEFAULT nextval('public.kasittely_kasittelyid_seq_1'::regclass);


--
-- TOC entry 3391 (class 2604 OID 49704)
-- Name: lupa luparivi_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa ALTER COLUMN luparivi_id SET DEFAULT nextval('public.lupa_luparivi_id_seq'::regclass);


--
-- TOC entry 3392 (class 2604 OID 49705)
-- Name: seura seura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura ALTER COLUMN seura_id SET DEFAULT nextval('public.seura_seura_id_seq'::regclass);


--
-- TOC entry 3389 (class 2604 OID 49706)
-- Name: seurue seurue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue ALTER COLUMN seurue_id SET DEFAULT nextval('public.seurue_seurue_id_seq'::regclass);


--
-- TOC entry 3390 (class 2604 OID 49707)
-- Name: seurue_tyyppi seurue_tyyppi_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue_tyyppi ALTER COLUMN seurue_tyyppi_id SET DEFAULT nextval('public.seurue_tyyppi_seurue_tyyppi_id_seq'::regclass);


--
-- TOC entry 3625 (class 0 OID 49507)
-- Dependencies: 209
-- Data for Name: aikuinenvasa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.aikuinenvasa VALUES ('Vasa');
INSERT INTO public.aikuinenvasa VALUES ('Aikuinen');


--
-- TOC entry 3626 (class 0 OID 49510)
-- Dependencies: 210
-- Data for Name: elain; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.elain VALUES ('Valkohäntäpeura');
INSERT INTO public.elain VALUES ('Hirvi');


--
-- TOC entry 3627 (class 0 OID 49513)
-- Dependencies: 211
-- Data for Name: jakoryhma; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakoryhma VALUES (1, 1, 'Ryhmä Yksinäiset Sudet');
INSERT INTO public.jakoryhma VALUES (2, 1, 'Tuolit viedään');
INSERT INTO public.jakoryhma VALUES (3, 1, 'Taalasmaat');


--
-- TOC entry 3628 (class 0 OID 49516)
-- Dependencies: 212
-- Data for Name: jakotapahtuma; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakotapahtuma VALUES (1, '2023-10-26', 1, 'Koko', 3, 112);
INSERT INTO public.jakotapahtuma VALUES (2, '2023-11-07', 1, 'Puolikas', 7, 61);
INSERT INTO public.jakotapahtuma VALUES (3, '2023-11-07', 1, 'Neljännes', 5, 56);
INSERT INTO public.jakotapahtuma VALUES (4, '2023-11-30', 3, 'Koko', 10, 221);
INSERT INTO public.jakotapahtuma VALUES (5, '2023-11-30', 2, 'Koko', 11, 120);


--
-- TOC entry 3631 (class 0 OID 49536)
-- Dependencies: 217
-- Data for Name: jakotapahtuma_jasen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakotapahtuma_jasen VALUES (1, '2022-11-15', 4, 'Koko', 78, 2);
INSERT INTO public.jakotapahtuma_jasen VALUES (2, '2022-11-15', 9, 'Koko', 66, 2);
INSERT INTO public.jakotapahtuma_jasen VALUES (3, '2022-11-15', 8, 'Koko', 96, 5);


--
-- TOC entry 3632 (class 0 OID 49544)
-- Dependencies: 219
-- Data for Name: jasen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jasen VALUES (1, 'Eero', 'Leppis', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (2, 'Juha', 'Mieto', 'Yliopistonkatu 19 A 22', '21123', 'Turku', 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (3, 'Mikko', 'Moilanen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (4, 'Jesse', 'Aalto', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (5, 'Kimmo', 'Suominen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (6, 'Niko', 'Aalto', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (7, 'Matti', 'Karhunen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (8, 'Antti', 'Heinonen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (9, 'Antti-Juhani', 'Laitinen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (10, 'Ari', 'Halonen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (11, 'Esko', 'Runola', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (12, 'Miikka', 'Hiivola', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (13, 'Ari', 'Junttila', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (14, 'Timo', 'Nurmi', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (15, 'Risto', 'Leppänen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (16, 'Timo', 'Kyrölä', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (17, 'Ari', 'Kilpeläinen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (18, 'Esa', 'Kilpeläinen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (19, 'Marko', 'Hannula', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (20, 'Jari', 'Kaskinen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (21, 'Arto', 'Ali-Keskikylä', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (22, 'Mikko', 'Luostarinen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (23, 'Niko', 'Rannikko', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (24, 'Matti', 'Van Strien', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (25, 'Juha-Matti', 'Halminen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (26, 'Aleksi', 'Ahlqvist', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (27, 'Pentti', 'Ahlqvist', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (28, 'Tuomas', 'Ahlqvist', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (29, 'Tommi', 'Puntala', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (30, 'Juha-Matti', 'Hannula', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (31, 'Tapio', 'Ranta', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (32, 'Vilho', 'Länsiaho', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (33, 'Antti', 'Keskitalo', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (34, 'Sauli', 'Junttila', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (35, 'Mikko', 'Mäkilä', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (36, 'Mikko', 'Salminen', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (37, 'Erkki', 'Lehto', NULL, NULL, NULL, 'aktiivinen', NULL);
INSERT INTO public.jasen VALUES (38, 'Matti', 'Rinnola', NULL, NULL, NULL, 'aktiivinen', NULL);


--
-- TOC entry 3635 (class 0 OID 49564)
-- Dependencies: 224
-- Data for Name: jasenyys; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jasenyys VALUES (1, 1, 1, 100, '2023-10-26', NULL, 1);
INSERT INTO public.jasenyys VALUES (2, NULL, 2, 100, '2023-10-26', NULL, 2);
INSERT INTO public.jasenyys VALUES (3, 1, 4, 100, '2023-11-07', NULL, 1);
INSERT INTO public.jasenyys VALUES (4, 1, 3, 100, '2023-11-07', NULL, 1);
INSERT INTO public.jasenyys VALUES (5, NULL, 4, 100, '2023-11-07', NULL, 2);
INSERT INTO public.jasenyys VALUES (6, NULL, 3, 100, '2023-11-07', NULL, 2);
INSERT INTO public.jasenyys VALUES (7, 3, 37, 100, '2023-11-30', NULL, 1);
INSERT INTO public.jasenyys VALUES (8, 2, 4, 100, '2023-11-30', NULL, 1);


--
-- TOC entry 3629 (class 0 OID 49523)
-- Dependencies: 214
-- Data for Name: kaadon_kasittely; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kaadon_kasittely VALUES (1, 1, 1, 100);
INSERT INTO public.kaadon_kasittely VALUES (3, 2, 2, 100);
INSERT INTO public.kaadon_kasittely VALUES (4, 5, 3, 100);
INSERT INTO public.kaadon_kasittely VALUES (5, 2, 4, 50);
INSERT INTO public.kaadon_kasittely VALUES (6, 3, 4, 50);
INSERT INTO public.kaadon_kasittely VALUES (7, 2, 5, 100);
INSERT INTO public.kaadon_kasittely VALUES (8, 5, 6, 100);
INSERT INTO public.kaadon_kasittely VALUES (9, 5, 7, 100);
INSERT INTO public.kaadon_kasittely VALUES (10, 2, 8, 100);
INSERT INTO public.kaadon_kasittely VALUES (11, 2, 9, 100);


--
-- TOC entry 3630 (class 0 OID 49526)
-- Dependencies: 215
-- Data for Name: kaato; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kaato VALUES (1, 1, '2023-10-24', 200, 'Turku', NULL, 'Hirvi', 'Uros', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (2, 1, '2023-10-26', 112, 'Tampere', NULL, 'Hirvi', 'Naaras', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (3, 2, '2023-10-26', 78, 'Lieto', NULL, 'Valkohäntäpeura', 'Uros', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (4, 4, '2023-11-07', 224, 'Paimio', NULL, 'Hirvi', 'Uros', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (5, 3, '2023-11-07', 122, 'Laitila', NULL, 'Hirvi', 'Naaras', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (6, 4, '2023-11-07', 96, 'Kustavi', NULL, 'Valkohäntäpeura', 'Uros', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (7, 3, '2023-11-07', 66, 'Masku', NULL, 'Valkohäntäpeura', 'Naaras', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (8, 4, '2023-11-30', 221, 'Asdla', NULL, 'Hirvi', 'Uros', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (9, 4, '2023-11-30', 120, 'Qwertylä', NULL, 'Hirvi', 'Naaras', 'Aikuinen', NULL);


--
-- TOC entry 3633 (class 0 OID 49548)
-- Dependencies: 220
-- Data for Name: kasittely; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kasittely VALUES (1, 'Seuralle');
INSERT INTO public.kasittely VALUES (2, 'Seurueelle');
INSERT INTO public.kasittely VALUES (3, 'Myyntiin');
INSERT INTO public.kasittely VALUES (4, 'Hävitetään');
INSERT INTO public.kasittely VALUES (5, 'Jäsenelle');


--
-- TOC entry 3653 (class 0 OID 49887)
-- Dependencies: 264
-- Data for Name: kayttaja; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kayttaja VALUES (1, 'eero.leppis', '$2b$10$zyMbaGScC0o7fS4sX/gm4u6yOJK7ZiNALuRGMbFexMJOuTGaTHiMO', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (2, 'juha.mieto', '$2b$10$WWXvFtZ8Pbw9M38IRUfp2u7qOVI12FWshjXqKDOh0trBUyQBiPbKG', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (3, 'mikko.moilanen', '$2b$10$2GJzKfOESuG37WTV3MNAFutDOPtt93zFCu.S22Ol1Jqy9Z4TSt/6a', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (4, 'jesse.aalto', '$2b$10$bs4PvKOt/wdWVKDz.KqmyeIj7fVtJDlCX9EKAP40vKm36zP9fDLA6', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (5, 'kimmo.suominen', '$2b$10$WXfTz0jkrLhmkXfxj7AMc.yEyvDC.APLpoqgXQPXO6LwZ//ufI3YO', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (6, 'niko.aalto', '$2b$10$s7e4mGG2ROSCcLV4EphH7O6EcgyIfwzAeJotya3UhsyEBj/9lsc2u', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (29, 'tommi.puntala', '$2b$10$Rv9IBRlQIy3RlbwKhD.w5eSx50OTuMHAuAhHL6JzsCIpZnj57DEXG', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (30, 'juha-matti.hannula', '$2b$10$7iVi5KtheK31U5B9Hi5fQON8eBkX.0N3WgLD.OiTNZdwJoMLSoTku', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (31, 'tapio.ranta', '$2b$10$spB3L27zRry5dWeSf1h5TuspS/KlqcNi0ewiVmBOPVYAKkFK5hvKW', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (32, 'vilho.länsiaho', '$2b$10$yx9zWACjbTL86iMExeX5d.7.A63zaUNdCrAE.PMOYpll.EHWslRgy', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (33, 'antti.keskitalo', '$2b$10$pa/ZOUW3cmyCRxR7X88./OHA0XbNIBtyCU07//jS.2x8DVCSdY0ay', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (34, 'sauli.junttila', '$2b$10$hE9ewL/Y3CmyPO1hZHk7AuWG9TJ4BralSOMYIXSDaA0gxrWjU6Va2', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (35, 'mikko.mäkilä', '$2b$10$gtCgVyO5s6iq/P29yDoMpuo/L1hq7XD1Hgz2trxcj20.s0CwDuTcW', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (36, 'mikko.salminen', '$2b$10$Ol8Q45nK1SddeuKmTJPoR.euPEBQx8GjHTQa0DkufgK8Z6bqMXY.u', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (37, 'erkki.lehto', '$2b$10$pjPI6vuSNVPvLJYb.SY08u4eaCPjDFOUentLwFec9NTPe.awmwfei', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (38, 'matti.rinnola', '$2b$10$UWnTb7BE78oI9ySsdCTI1uHktjshLYis7GwP6sxtHWRuIGf1txC22', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (7, 'matti.karhunen', '$2b$10$ZQN/XOsn2HZL8yg/Muxq2OeECls8sM2Zn82.FpoVwN1dasGC1c/t.', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (8, 'antti.heinonen', '$2b$10$BQal0J.xZswPs8WQqaTWg.efJ4tqCTsCgcSDaZNAVMbS.fLMretXa', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (9, 'antti-juhani.laitinen', '$2b$10$DzzpqgsN3nwdoYyxP3.NkOQ1DgnxO0ZFdumgKyyBH6V0prOPdydvu', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (10, 'ari.halonen', '$2b$10$J9DIre97qCevK.5LAwoPoOCJ9KvKbqrZ2D/pT9nGqR14Dwc2kr0LW', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (11, 'esko.runola', '$2b$10$ALEsZWuKyzvd71eL6g28peaSqGV2FmxomYLxY./tt14cQBQfAI87y', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (12, 'miikka.hiivola', '$2b$10$M/O1WuMGoplwuuO55L4PZ.desVILqabEzTl.naPBpv6S6x0DJNkWq', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (13, 'ari.junttila', '$2b$10$1JLtKrb0zqyhdk580aZDu.vrdKLXZPp.jPrAuXKokW1f9cHaP7lpm', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (14, 'timo.nurmi', '$2b$10$1FULjrsPObrpDZ2Q97.zSOeTqBZF4dlH7p7RzRFi0Drpe/gN/z3h2', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (15, 'risto.leppänen', '$2b$10$jdDlwEMDi8mJTl3ouVzFFu67jytkirVyLRTjKVgXpAKRXlXfyhVeu', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (16, 'timo.kyrölä', '$2b$10$e1/.j539JUxiEAmnZASIXescW/HZpkRmBT2VKg6fmY0fMaQUSJygi', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (17, 'ari.kilpeläinen', '$2b$10$MQu139a2M25VsVKslXX4X.Q3MCb9U3P9a.n80YBjKi4Jqpn1hGDj.', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (18, 'esa.kilpeläinen', '$2b$10$Nt9DTccJSQQ4D5FgGfJuJOkX9CQpNI7Dn6kDWyQ1oXoYO/KYUY5DW', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (19, 'marko.hannula', '$2b$10$NVZE2rDbWW9iL0npVYd3c./IcNGJOoQiDa3tBmNysnJeD/aibuAke', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (20, 'jari.kaskinen', '$2b$10$ka4zzV.I3nKoPoK6twgdO.MkRmuec6wFRchZFYP3BPqjvMyNSmlmK', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (21, 'arto.ali-keskikylä', '$2b$10$LtwIpzTEWVgmt6LXF.4FMOvpYPGInVhk6ZqfASPPII4ItqIRfJLnK', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (22, 'mikko.luostarinen', '$2b$10$ANe4tu8SMgzqmHCYCNYtTe6FDQHN1FQc2bTrl4h6M4X6hCJPP2bP6', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (23, 'niko.rannikko', '$2b$10$GQoKQp7obBVrmMd5kY3sc.yh2YdO/cahQUXkd6HgHSwmd83mBlhIC', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (24, 'matti.van strien', '$2b$10$a5Of40iPwCjSrSTCc5G7beiBwW0s.kkPCAQRoo5F4o6hI8UBkYYWG', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (25, 'juha-matti.halminen', '$2b$10$r61f67KJ7.q4fipiclg0MO0Gs1pQQkDXrmcY0jlPRS4MaGG3u95ka', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (26, 'aleksi.ahlqvist', '$2b$10$XSCK3XAmlGtF2vAJ2eZMBefHPW9DYboFUKYtUcc9LTz2w5/3V7wZC', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (27, 'pentti.ahlqvist', '$2b$10$ZOp4y0HLnAs9yfUlRGqM4etzOANi78esbjGjzTP5S0OkOrRay/7aK', NULL, 'luku');
INSERT INTO public.kayttaja VALUES (28, 'tuomas.ahlqvist', '$2b$10$WfDvzH5xGSLueGK4tqlibO61sH5KW7EGSukMXXhbx1O51ghUmpFoa', NULL, 'luku');


--
-- TOC entry 3646 (class 0 OID 49640)
-- Dependencies: 248
-- Data for Name: lupa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lupa VALUES (2, 1, '2023', 'Hirvi', 'Ei määritelty', 'Vasa', 20);
INSERT INTO public.lupa VALUES (3, 1, '2023', 'Hirvi', 'Uros', 'Aikuinen', 10);
INSERT INTO public.lupa VALUES (4, 1, '2023', 'Hirvi', 'Naaras', 'Aikuinen', 12);


--
-- TOC entry 3654 (class 0 OID 57697)
-- Dependencies: 265
-- Data for Name: rooli; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rooli VALUES ('pääkäyttäjä');
INSERT INTO public.rooli VALUES ('muokkaus');
INSERT INTO public.rooli VALUES ('lisäys');
INSERT INTO public.rooli VALUES ('luku');


--
-- TOC entry 3634 (class 0 OID 49551)
-- Dependencies: 221
-- Data for Name: ruhonosa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ruhonosa VALUES ('Koko', 1);
INSERT INTO public.ruhonosa VALUES ('Neljännes', 0.25);
INSERT INTO public.ruhonosa VALUES ('Puolikas', 0.5);


--
-- TOC entry 3648 (class 0 OID 49673)
-- Dependencies: 256
-- Data for Name: seura; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seura VALUES (1, 'Repo', 'Eeronkuja 3', '21200', 'Raisio');


--
-- TOC entry 3637 (class 0 OID 49577)
-- Dependencies: 228
-- Data for Name: seurue; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seurue VALUES (1, 1, 'Hirvi Seurue', 1, 1);
INSERT INTO public.seurue VALUES (2, 1, 'Peura Seurue', 2, 2);


--
-- TOC entry 3642 (class 0 OID 49614)
-- Dependencies: 240
-- Data for Name: seurue_tyyppi; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seurue_tyyppi VALUES (1, 'Ryhmä');
INSERT INTO public.seurue_tyyppi VALUES (2, 'Jäsen');


--
-- TOC entry 3652 (class 0 OID 49693)
-- Dependencies: 263
-- Data for Name: sukupuoli; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sukupuoli VALUES ('Uros');
INSERT INTO public.sukupuoli VALUES ('Naaras');
INSERT INTO public.sukupuoli VALUES ('Ei määritelty');


--
-- TOC entry 3747 (class 0 OID 0)
-- Dependencies: 227
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakoryhma_ryhma_id_seq', 3, true);


--
-- TOC entry 3748 (class 0 OID 0)
-- Dependencies: 233
-- Name: jakotapahtuma_jasen_tapahtuma_jasen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq', 3, true);


--
-- TOC entry 3749 (class 0 OID 0)
-- Dependencies: 235
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakotapahtuma_tapahtuma_id_seq', 37, true);


--
-- TOC entry 3750 (class 0 OID 0)
-- Dependencies: 236
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jasen_jasen_id_seq_1', 39, true);


--
-- TOC entry 3751 (class 0 OID 0)
-- Dependencies: 238
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jasenyys_jasenyys_id_seq', 8, true);


--
-- TOC entry 3752 (class 0 OID 0)
-- Dependencies: 242
-- Name: kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kaadon_kasittely_kaadon_kasittely_id_seq_1', 11, true);


--
-- TOC entry 3753 (class 0 OID 0)
-- Dependencies: 243
-- Name: kaato_kaato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kaato_kaato_id_seq', 9, true);


--
-- TOC entry 3754 (class 0 OID 0)
-- Dependencies: 246
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kasittely_kasittelyid_seq_1', 1, true);


--
-- TOC entry 3755 (class 0 OID 0)
-- Dependencies: 249
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lupa_luparivi_id_seq', 5, true);


--
-- TOC entry 3756 (class 0 OID 0)
-- Dependencies: 257
-- Name: seura_seura_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seura_seura_id_seq', 1, true);


--
-- TOC entry 3757 (class 0 OID 0)
-- Dependencies: 261
-- Name: seurue_seurue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seurue_seurue_id_seq', 2, true);


--
-- TOC entry 3758 (class 0 OID 0)
-- Dependencies: 262
-- Name: seurue_tyyppi_seurue_tyyppi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seurue_tyyppi_seurue_tyyppi_id_seq', 2, true);


--
-- TOC entry 3394 (class 2606 OID 49709)
-- Name: aikuinenvasa aikuinenvasa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aikuinenvasa
    ADD CONSTRAINT aikuinenvasa_pk PRIMARY KEY (ikaluokka);


--
-- TOC entry 3396 (class 2606 OID 49711)
-- Name: elain elain_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elain
    ADD CONSTRAINT elain_pk PRIMARY KEY (elaimen_nimi);


--
-- TOC entry 3398 (class 2606 OID 49713)
-- Name: jakoryhma jakoryhma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT jakoryhma_pk PRIMARY KEY (ryhma_id);


--
-- TOC entry 3407 (class 2606 OID 49715)
-- Name: jakotapahtuma_jasen jakotapahtuma_jasen_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen
    ADD CONSTRAINT jakotapahtuma_jasen_pk PRIMARY KEY (tapahtuma_jasen_id);


--
-- TOC entry 3400 (class 2606 OID 49717)
-- Name: jakotapahtuma jakotapahtuma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT jakotapahtuma_pk PRIMARY KEY (tapahtuma_id);


--
-- TOC entry 3409 (class 2606 OID 49719)
-- Name: jasen jasen_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen
    ADD CONSTRAINT jasen_pk PRIMARY KEY (jasen_id);


--
-- TOC entry 3416 (class 2606 OID 49721)
-- Name: jasenyys jasenyys_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasenyys_pk PRIMARY KEY (jasenyys_id);


--
-- TOC entry 3402 (class 2606 OID 49723)
-- Name: kaadon_kasittely kaadon_kasittely_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kaadon_kasittely_pk PRIMARY KEY (kaadon_kasittely_id);


--
-- TOC entry 3404 (class 2606 OID 49725)
-- Name: kaato kaato_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT kaato_pk PRIMARY KEY (kaato_id);


--
-- TOC entry 3411 (class 2606 OID 49727)
-- Name: kasittely kasittely_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely
    ADD CONSTRAINT kasittely_pk PRIMARY KEY (kasittelyid);


--
-- TOC entry 3429 (class 2606 OID 49893)
-- Name: kayttaja kayttaja_kayttajatunnus_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kayttaja
    ADD CONSTRAINT kayttaja_kayttajatunnus_key UNIQUE (kayttajatunnus);


--
-- TOC entry 3431 (class 2606 OID 49891)
-- Name: kayttaja kayttaja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kayttaja
    ADD CONSTRAINT kayttaja_pkey PRIMARY KEY (kayttaja_id);


--
-- TOC entry 3423 (class 2606 OID 49729)
-- Name: lupa lupa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT lupa_pk PRIMARY KEY (luparivi_id);


--
-- TOC entry 3433 (class 2606 OID 57701)
-- Name: rooli rooli_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooli
    ADD CONSTRAINT rooli_pkey PRIMARY KEY (roolin_nimi);


--
-- TOC entry 3413 (class 2606 OID 49731)
-- Name: ruhonosa ruhonosa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruhonosa
    ADD CONSTRAINT ruhonosa_pk PRIMARY KEY (osnimitys);


--
-- TOC entry 3425 (class 2606 OID 49733)
-- Name: seura seura_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura
    ADD CONSTRAINT seura_pk PRIMARY KEY (seura_id);


--
-- TOC entry 3419 (class 2606 OID 49735)
-- Name: seurue seurue_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seurue_pk PRIMARY KEY (seurue_id);


--
-- TOC entry 3421 (class 2606 OID 49737)
-- Name: seurue_tyyppi seurue_tyyppi_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue_tyyppi
    ADD CONSTRAINT seurue_tyyppi_pk PRIMARY KEY (seurue_tyyppi_id);


--
-- TOC entry 3427 (class 2606 OID 49739)
-- Name: sukupuoli sukupuoli_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sukupuoli
    ADD CONSTRAINT sukupuoli_pk PRIMARY KEY (sukupuoli);


--
-- TOC entry 3405 (class 1259 OID 49740)
-- Name: fki_jasenyys_jakotapahtuma_jasen_fk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_jasenyys_jakotapahtuma_jasen_fk ON public.jakotapahtuma_jasen USING btree (jasenyys_id);


--
-- TOC entry 3414 (class 1259 OID 49741)
-- Name: fki_seurue_jasenyys_fk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_seurue_jasenyys_fk ON public.jasenyys USING btree (seurue_id);


--
-- TOC entry 3417 (class 1259 OID 49742)
-- Name: fki_seurue_tyyppi_seurue_fk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_seurue_tyyppi_seurue_fk ON public.seurue USING btree (seurue_tyyppi_id);


--
-- TOC entry 3440 (class 2606 OID 49743)
-- Name: kaato aikuinen_vasa_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT aikuinen_vasa_kaato_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3453 (class 2606 OID 49748)
-- Name: lupa aikuinen_vasa_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT aikuinen_vasa_lupa_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3441 (class 2606 OID 49753)
-- Name: kaato elain_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT elain_kaato_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3454 (class 2606 OID 49758)
-- Name: lupa elain_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT elain_lupa_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3447 (class 2606 OID 49763)
-- Name: jasenyys jasen_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasen_jasenyys_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3442 (class 2606 OID 49768)
-- Name: kaato jasen_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT jasen_kaato_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3457 (class 2606 OID 49894)
-- Name: kayttaja jasen_kayttaja_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kayttaja
    ADD CONSTRAINT jasen_kayttaja_fk FOREIGN KEY (kayttaja_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3450 (class 2606 OID 49773)
-- Name: seurue jasen_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT jasen_seurue_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3444 (class 2606 OID 49778)
-- Name: jakotapahtuma_jasen jasenyys_jakotapahtuma_jasen_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen
    ADD CONSTRAINT jasenyys_jakotapahtuma_jasen_fk FOREIGN KEY (jasenyys_id) REFERENCES public.jasenyys(jasenyys_id);


--
-- TOC entry 3435 (class 2606 OID 49783)
-- Name: jakotapahtuma kaadon_kasittely_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT kaadon_kasittely_jakotapahtuma_fk FOREIGN KEY (kaadon_kasittely_id) REFERENCES public.kaadon_kasittely(kaadon_kasittely_id) ON DELETE CASCADE;


--
-- TOC entry 3445 (class 2606 OID 49788)
-- Name: jakotapahtuma_jasen kaadon_kasittely_jakotapahtuma_jasen_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen
    ADD CONSTRAINT kaadon_kasittely_jakotapahtuma_jasen_fk FOREIGN KEY (kaadon_kasittely_id) REFERENCES public.kaadon_kasittely(kaadon_kasittely_id) ON DELETE CASCADE;


--
-- TOC entry 3438 (class 2606 OID 49793)
-- Name: kaadon_kasittely kaato_kaadon_kasittely_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kaato_kaadon_kasittely_fk FOREIGN KEY (kaato_id) REFERENCES public.kaato(kaato_id) ON DELETE CASCADE;


--
-- TOC entry 3439 (class 2606 OID 49798)
-- Name: kaadon_kasittely kasittely_kaadon_kasittely_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kasittely_kaadon_kasittely_fk FOREIGN KEY (kasittelyid) REFERENCES public.kasittely(kasittelyid);


--
-- TOC entry 3458 (class 2606 OID 57702)
-- Name: kayttaja kayttaja_rooli_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kayttaja
    ADD CONSTRAINT kayttaja_rooli_fk FOREIGN KEY (roolin_nimi) REFERENCES public.rooli(roolin_nimi);


--
-- TOC entry 3436 (class 2606 OID 49803)
-- Name: jakotapahtuma ruhonosa_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ruhonosa_jakotapahtuma_fk FOREIGN KEY (osnimitys) REFERENCES public.ruhonosa(osnimitys);


--
-- TOC entry 3446 (class 2606 OID 49808)
-- Name: jakotapahtuma_jasen ruhonosa_jakotapahtuma_jasen_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen
    ADD CONSTRAINT ruhonosa_jakotapahtuma_jasen_fk FOREIGN KEY (osnimitys) REFERENCES public.ruhonosa(osnimitys);


--
-- TOC entry 3437 (class 2606 OID 49813)
-- Name: jakotapahtuma ryhma_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ryhma_jakotapahtuma_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3448 (class 2606 OID 49818)
-- Name: jasenyys ryhma_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT ryhma_jasenyys_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3455 (class 2606 OID 49823)
-- Name: lupa seura_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT seura_lupa_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3451 (class 2606 OID 49828)
-- Name: seurue seura_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seura_seurue_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3449 (class 2606 OID 49833)
-- Name: jasenyys seurue_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT seurue_jasenyys_fk FOREIGN KEY (seurue_id) REFERENCES public.seurue(seurue_id);


--
-- TOC entry 3434 (class 2606 OID 49838)
-- Name: jakoryhma seurue_ryhma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT seurue_ryhma_fk FOREIGN KEY (seurue_id) REFERENCES public.seurue(seurue_id);


--
-- TOC entry 3452 (class 2606 OID 49843)
-- Name: seurue seurue_tyyppi_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seurue_tyyppi_seurue_fk FOREIGN KEY (seurue_tyyppi_id) REFERENCES public.seurue_tyyppi(seurue_tyyppi_id);


--
-- TOC entry 3443 (class 2606 OID 49848)
-- Name: kaato sukupuoli_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT sukupuoli_kaato_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3456 (class 2606 OID 49853)
-- Name: lupa sukupuoli_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT sukupuoli_lupa_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3660 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 3661 (class 0 OID 0)
-- Dependencies: 277
-- Name: FUNCTION get_used_licences(license_year integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_used_licences(license_year integer) TO application;


--
-- TOC entry 3662 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE aikuinenvasa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.aikuinenvasa TO application;


--
-- TOC entry 3663 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE elain; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.elain TO application;


--
-- TOC entry 3665 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma TO application;


--
-- TOC entry 3667 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE jakotapahtuma; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakotapahtuma TO application;


--
-- TOC entry 3668 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE jaetut_lihat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaetut_lihat TO application;


--
-- TOC entry 3669 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE kaadon_kasittely; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaadon_kasittely TO application;


--
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE kaato; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaato TO application;


--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE jaetut_ruhon_osat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaetut_ruhon_osat TO application;


--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE jakotapahtuma_jasen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakotapahtuma_jasen TO application;


--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE jaetut_ruhon_osat_jasenille; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaetut_ruhon_osat_jasenille TO application;


--
-- TOC entry 3679 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE jasen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasen TO application;


--
-- TOC entry 3680 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE kasittely; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kasittely TO application;


--
-- TOC entry 3681 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE ruhonosa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ruhonosa TO application;


--
-- TOC entry 3682 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE jako_kaadot; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jako_kaadot TO application;


--
-- TOC entry 3683 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE jako_kaadot_jasenille; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jako_kaadot_jasenille TO application;


--
-- TOC entry 3685 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE jasenyys; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasenyys TO application;


--
-- TOC entry 3686 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE ryhmien_osuudet; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ryhmien_osuudet TO application;


--
-- TOC entry 3687 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE jakoryhma_osuus_maara; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_osuus_maara TO application;


--
-- TOC entry 3689 (class 0 OID 0)
-- Dependencies: 227
-- Name: SEQUENCE jakoryhma_ryhma_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jakoryhma_ryhma_id_seq TO application;


--
-- TOC entry 3692 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE seurue; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue TO application;


--
-- TOC entry 3693 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE jakoryhma_seurueen_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_seurueen_nimella TO application;


--
-- TOC entry 3694 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE jakoryhma_yhteenveto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_yhteenveto TO application;


--
-- TOC entry 3695 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE nimivalinta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.nimivalinta TO application;


--
-- TOC entry 3696 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE jakotapahtuma_jasen_jasen_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakotapahtuma_jasen_jasen_nimella TO application;


--
-- TOC entry 3698 (class 0 OID 0)
-- Dependencies: 233
-- Name: SEQUENCE jakotapahtuma_jasen_tapahtuma_jasen_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq TO application;


--
-- TOC entry 3699 (class 0 OID 0)
-- Dependencies: 234
-- Name: TABLE jakotapahtuma_ryhman_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakotapahtuma_ryhman_nimella TO application;


--
-- TOC entry 3701 (class 0 OID 0)
-- Dependencies: 235
-- Name: SEQUENCE jakotapahtuma_tapahtuma_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jakotapahtuma_tapahtuma_id_seq TO application;


--
-- TOC entry 3703 (class 0 OID 0)
-- Dependencies: 236
-- Name: SEQUENCE jasen_jasen_id_seq_1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jasen_jasen_id_seq_1 TO application;


--
-- TOC entry 3704 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE jasen_tila; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasen_tila TO application;


--
-- TOC entry 3706 (class 0 OID 0)
-- Dependencies: 238
-- Name: SEQUENCE jasenyys_jasenyys_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jasenyys_jasenyys_id_seq TO application;


--
-- TOC entry 3707 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE jasenyys_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasenyys_nimella TO application;


--
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE seurue_tyyppi; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_tyyppi TO application;


--
-- TOC entry 3710 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE jasenyys_nimella_ryhmalla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasenyys_nimella_ryhmalla TO application;


--
-- TOC entry 3712 (class 0 OID 0)
-- Dependencies: 242
-- Name: SEQUENCE kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.kaadon_kasittely_kaadon_kasittely_id_seq_1 TO application;


--
-- TOC entry 3714 (class 0 OID 0)
-- Dependencies: 243
-- Name: SEQUENCE kaato_kaato_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.kaato_kaato_id_seq TO application;


--
-- TOC entry 3715 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE kaatoluettelo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaatoluettelo TO application;


--
-- TOC entry 3716 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE kaatoluettelo_indeksilla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaatoluettelo_indeksilla TO application;


--
-- TOC entry 3718 (class 0 OID 0)
-- Dependencies: 246
-- Name: SEQUENCE kasittely_kasittelyid_seq_1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.kasittely_kasittelyid_seq_1 TO application;


--
-- TOC entry 3719 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE kayttaja; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kayttaja TO application;


--
-- TOC entry 3720 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE lihan_kaytto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lihan_kaytto TO application;


--
-- TOC entry 3722 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE lupa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lupa TO application;


--
-- TOC entry 3724 (class 0 OID 0)
-- Dependencies: 249
-- Name: SEQUENCE lupa_luparivi_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lupa_luparivi_id_seq TO application;


--
-- TOC entry 3725 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE luvat_kayttamatta_kpl_pros; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.luvat_kayttamatta_kpl_pros TO application;


--
-- TOC entry 3726 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE rooli; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rooli TO application;


--
-- TOC entry 3728 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE ryhmat_jasenilla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ryhmat_jasenilla TO application;


--
-- TOC entry 3729 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE seurue_sankey; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_sankey TO application;


--
-- TOC entry 3730 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE sankey_elain_kasittely_seurue; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sankey_elain_kasittely_seurue TO application;


--
-- TOC entry 3732 (class 0 OID 0)
-- Dependencies: 254
-- Name: TABLE sankey_jasen_jako_kg; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sankey_jasen_jako_kg TO application;


--
-- TOC entry 3734 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE sankey_jasen_jako_kpl; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sankey_jasen_jako_kpl TO application;


--
-- TOC entry 3736 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE seura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seura TO application;


--
-- TOC entry 3738 (class 0 OID 0)
-- Dependencies: 257
-- Name: SEQUENCE seura_seura_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seura_seura_id_seq TO application;


--
-- TOC entry 3739 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE seurue_lihat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_lihat TO application;


--
-- TOC entry 3740 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE seurue_lihat_osuus; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_lihat_osuus TO application;


--
-- TOC entry 3741 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE seurue_ryhmilla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_ryhmilla TO application;


--
-- TOC entry 3743 (class 0 OID 0)
-- Dependencies: 261
-- Name: SEQUENCE seurue_seurue_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seurue_seurue_id_seq TO application;


--
-- TOC entry 3745 (class 0 OID 0)
-- Dependencies: 262
-- Name: SEQUENCE seurue_tyyppi_seurue_tyyppi_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seurue_tyyppi_seurue_tyyppi_id_seq TO application;


--
-- TOC entry 3746 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE sukupuoli; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sukupuoli TO application;


-- Completed on 2024-01-24 10:55:27

--
-- PostgreSQL database dump complete
--


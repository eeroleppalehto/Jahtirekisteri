--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8
-- Dumped by pg_dump version 14.8

-- Started on 2023-10-05 00:09:02

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
-- TOC entry 272 (class 1255 OID 16673)
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
-- TOC entry 209 (class 1259 OID 16674)
-- Name: aikuinenvasa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aikuinenvasa (
    ikaluokka character varying(20) NOT NULL
);


ALTER TABLE public.aikuinenvasa OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16677)
-- Name: elain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.elain (
    elaimen_nimi character varying(20) NOT NULL
);


ALTER TABLE public.elain OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16680)
-- Name: jakoryhma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jakoryhma (
    ryhma_id integer NOT NULL,
    seurue_id integer NOT NULL,
    ryhman_nimi character varying(50) NOT NULL
);


ALTER TABLE public.jakoryhma OWNER TO postgres;

--
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jakoryhma IS 'Ryhmä, jolle lihaa jaetaan';


--
-- TOC entry 212 (class 1259 OID 16683)
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
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN jakotapahtuma.maara; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jakotapahtuma.maara IS 'Jaettu lihamäärä kiloina';


--
-- TOC entry 213 (class 1259 OID 16686)
-- Name: jaetut_lihat; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jaetut_lihat AS
 SELECT jakoryhma.ryhman_nimi AS "Ryhmän Nimi",
    sum(jakotapahtuma.maara) AS "Kg Yhteensä"
   FROM (public.jakoryhma
     LEFT JOIN public.jakotapahtuma ON ((jakotapahtuma.ryhma_id = jakoryhma.ryhma_id)))
  GROUP BY jakoryhma.ryhman_nimi
  ORDER BY jakoryhma.ryhman_nimi;


ALTER TABLE public.jaetut_lihat OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16690)
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
-- TOC entry 215 (class 1259 OID 16693)
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
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE kaato; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.kaato IS 'Ampumatapahtuman tiedot';


--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN kaato.ruhopaino; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.ruhopaino IS 'paino kiloina';


--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN kaato.paikka_koordinaatti; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.paikka_koordinaatti IS 'Tämän kentän tietotyyppi pitää oikeasti olla geometry (Postgis-tietotyyppi)';


--
-- TOC entry 216 (class 1259 OID 16698)
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


ALTER TABLE public.jaetut_ruhon_osat OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16703)
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
-- TOC entry 3604 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE jakotapahtuma_jasen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jakotapahtuma_jasen IS 'Table for storing shares given straight to members';


--
-- TOC entry 218 (class 1259 OID 16706)
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


ALTER TABLE public.jaetut_ruhon_osat_jasenille OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16711)
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
-- TOC entry 3605 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE jasen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jasen IS 'Henkilö joka osallistuu metsästykseen tai lihanjakoon';


--
-- TOC entry 220 (class 1259 OID 16715)
-- Name: kasittely; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kasittely (
    kasittelyid integer NOT NULL,
    kasittely_teksti character varying(50) NOT NULL
);


ALTER TABLE public.kasittely OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16718)
-- Name: jako_kaadot; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jako_kaadot AS
 SELECT kaadon_kasittely.kaato_id AS "KaatoID",
    kaadon_kasittely.kasittely_maara AS "Jako Määrä(%)",
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Kaataja",
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS "Paikka",
    kaato.elaimen_nimi AS "Eläin",
    kaato.ikaluokka AS "Ikäluokka",
    kaato.sukupuoli AS "Sukupuoli",
    kasittely.kasittely_teksti AS "Käyttö",
    kaato.ruhopaino AS "Paino",
    kaadon_kasittely.kaadon_kasittely_id
   FROM (((public.jasen
     JOIN public.kaato ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kaadon_kasittely ON ((kaadon_kasittely.kaato_id = kaato.kaato_id)))
     JOIN public.kasittely ON ((kaadon_kasittely.kasittelyid = kasittely.kasittelyid)))
  WHERE (kaadon_kasittely.kasittelyid = 2)
  ORDER BY kaadon_kasittely.kaato_id DESC;


ALTER TABLE public.jako_kaadot OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16723)
-- Name: jako_kaadot_jasenille; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jako_kaadot_jasenille AS
 SELECT kaadon_kasittely.kaato_id AS "KaatoID",
    kaadon_kasittely.kasittely_maara AS "Jako Määrä(%)",
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS "Kaataja",
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS "Paikka",
    kaato.elaimen_nimi AS "Eläin",
    kaato.ikaluokka AS "Ikäluokka",
    kaato.sukupuoli AS "Sukupuoli",
    kasittely.kasittely_teksti AS "Käyttö",
    kaato.ruhopaino AS "Paino",
    kaadon_kasittely.kaadon_kasittely_id
   FROM (((public.jasen
     JOIN public.kaato ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kaadon_kasittely ON ((kaadon_kasittely.kaato_id = kaato.kaato_id)))
     JOIN public.kasittely ON ((kaadon_kasittely.kasittelyid = kasittely.kasittelyid)))
  WHERE (kaadon_kasittely.kasittelyid = 5)
  ORDER BY kaadon_kasittely.kaato_id DESC;


ALTER TABLE public.jako_kaadot_jasenille OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16728)
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
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN jasenyys.osuus; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jasenyys.osuus IS 'Lihaosuus prosentteina';


--
-- TOC entry 224 (class 1259 OID 16731)
-- Name: ryhmien_osuudet; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.ryhmien_osuudet AS
 SELECT jasenyys.ryhma_id,
    ((sum(jasenyys.osuus))::double precision / (100)::real) AS jakokerroin
   FROM public.jasenyys
  WHERE (jasenyys.poistui IS NULL)
  GROUP BY jasenyys.ryhma_id
  ORDER BY jasenyys.ryhma_id;


ALTER TABLE public.ryhmien_osuudet OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16735)
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
-- TOC entry 226 (class 1259 OID 16740)
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
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 226
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakoryhma_ryhma_id_seq OWNED BY public.jakoryhma.ryhma_id;


--
-- TOC entry 227 (class 1259 OID 16741)
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
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE seurue; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seurue IS 'Metsästystä harjoittavan seurueen tiedot';


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN seurue.jasen_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.seurue.jasen_id IS 'Seurueen johtajan tunniste';


--
-- TOC entry 228 (class 1259 OID 16744)
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
-- TOC entry 229 (class 1259 OID 16748)
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


ALTER TABLE public.jakoryhma_yhteenveto OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16753)
-- Name: jakotapahtuma_jasen_tapahtuma_jasen_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq OWNER TO postgres;

--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 230
-- Name: jakotapahtuma_jasen_tapahtuma_jasen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq OWNED BY public.jakotapahtuma_jasen.tapahtuma_jasen_id;


--
-- TOC entry 231 (class 1259 OID 16754)
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


ALTER TABLE public.jakotapahtuma_ryhman_nimella OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16758)
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
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 232
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakotapahtuma_tapahtuma_id_seq OWNED BY public.jakotapahtuma.tapahtuma_id;


--
-- TOC entry 233 (class 1259 OID 16759)
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
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 233
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasen_jasen_id_seq_1 OWNED BY public.jasen.jasen_id;


--
-- TOC entry 234 (class 1259 OID 16760)
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


ALTER TABLE public.jasen_tila OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16764)
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
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 235
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasenyys_jasenyys_id_seq OWNED BY public.jasenyys.jasenyys_id;


--
-- TOC entry 236 (class 1259 OID 16765)
-- Name: jasenyys_nimella; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jasenyys_nimella AS
 SELECT jasenyys.jasenyys_id,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS kokonimi,
    jasenyys.seurue_id
   FROM (public.jasenyys
     JOIN public.jasen ON ((jasen.jasen_id = jasenyys.jasen_id)));


ALTER TABLE public.jasenyys_nimella OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16769)
-- Name: seurue_tyyppi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seurue_tyyppi (
    seurue_tyyppi_id integer NOT NULL,
    seurue_tyyppi_nimi character varying(20) NOT NULL
);


ALTER TABLE public.seurue_tyyppi OWNER TO postgres;

--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE seurue_tyyppi; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seurue_tyyppi IS 'Taulu, jonka tarkoitus on rajata tyyppi tietueen arvot seurue taulussa';


--
-- TOC entry 238 (class 1259 OID 16772)
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


ALTER TABLE public.jasenyys_nimella_ryhmalla OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16777)
-- Name: kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kaadon_kasittely_kaadon_kasittely_id_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kaadon_kasittely_kaadon_kasittely_id_seq_1 OWNER TO postgres;

--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 239
-- Name: kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kaadon_kasittely_kaadon_kasittely_id_seq_1 OWNED BY public.kaadon_kasittely.kaadon_kasittely_id;


--
-- TOC entry 240 (class 1259 OID 16778)
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
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 240
-- Name: kaato_kaato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kaato_kaato_id_seq OWNED BY public.kaato.kaato_id;


--
-- TOC entry 241 (class 1259 OID 16779)
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


ALTER TABLE public.kaatoluettelo OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16784)
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


ALTER TABLE public.kaatoluettelo_indeksilla OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16789)
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
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 243
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kasittely_kasittelyid_seq_1 OWNED BY public.kasittely.kasittelyid;


--
-- TOC entry 244 (class 1259 OID 16790)
-- Name: lihan_kaytto; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.lihan_kaytto AS
 SELECT kaato.elaimen_nimi AS source,
    kasittely.kasittely_teksti AS target,
    sum(kaato.ruhopaino) AS value
   FROM ((public.kaadon_kasittely
     JOIN public.kaato ON ((kaadon_kasittely.kaato_id = kaato.kaato_id)))
     JOIN public.kasittely ON ((kaadon_kasittely.kasittelyid = kasittely.kasittelyid)))
  GROUP BY kaato.elaimen_nimi, kasittely.kasittely_teksti;


ALTER TABLE public.lihan_kaytto OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16795)
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
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE lupa; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.lupa IS 'Vuosittaiset kaatoluvat';


--
-- TOC entry 246 (class 1259 OID 16798)
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
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 246
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lupa_luparivi_id_seq OWNED BY public.lupa.luparivi_id;


--
-- TOC entry 247 (class 1259 OID 16799)
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
-- TOC entry 248 (class 1259 OID 16804)
-- Name: nimivalinta; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.nimivalinta AS
 SELECT jasen.jasen_id,
    (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text) AS kokonimi
   FROM public.jasen
  WHERE ((jasen.tila)::text = 'aktiivinen'::text)
  ORDER BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER TABLE public.nimivalinta OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16808)
-- Name: ruhonosa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ruhonosa (
    osnimitys character varying(20) NOT NULL
);


ALTER TABLE public.ruhonosa OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 16811)
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


ALTER TABLE public.ryhmat_jasenilla OWNER TO postgres;

--
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 250
-- Name: VIEW ryhmat_jasenilla; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.ryhmat_jasenilla IS 'Näkymä joka näyttää ryhmä, jäsen, liittymispvm(,poistumispvm), osuus';


--
-- TOC entry 251 (class 1259 OID 16816)
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


ALTER TABLE public.seurue_sankey OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 16821)
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
-- TOC entry 253 (class 1259 OID 16825)
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
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE seura; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seura IS 'Metsästysseuran tiedot';


--
-- TOC entry 254 (class 1259 OID 16828)
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
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 254
-- Name: seura_seura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seura_seura_id_seq OWNED BY public.seura.seura_id;


--
-- TOC entry 255 (class 1259 OID 16829)
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
-- TOC entry 256 (class 1259 OID 16834)
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


ALTER TABLE public.seurue_lihat_osuus OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 16839)
-- Name: seurue_ryhmilla; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.seurue_ryhmilla AS
 SELECT seurue.seurueen_nimi AS "Seurueen Nimi",
    jakoryhma.ryhman_nimi AS "Ryhmän Nimi"
   FROM (public.jakoryhma
     JOIN public.seurue ON ((seurue.seurue_id = jakoryhma.seurue_id)))
  ORDER BY jakoryhma.ryhman_nimi;


ALTER TABLE public.seurue_ryhmilla OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 16843)
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
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 258
-- Name: seurue_seurue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seurue_seurue_id_seq OWNED BY public.seurue.seurue_id;


--
-- TOC entry 259 (class 1259 OID 16844)
-- Name: seurue_tyyppi_seurue_tyyppi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seurue_tyyppi_seurue_tyyppi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seurue_tyyppi_seurue_tyyppi_id_seq OWNER TO postgres;

--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 259
-- Name: seurue_tyyppi_seurue_tyyppi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seurue_tyyppi_seurue_tyyppi_id_seq OWNED BY public.seurue_tyyppi.seurue_tyyppi_id;


--
-- TOC entry 260 (class 1259 OID 16845)
-- Name: sukupuoli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sukupuoli (
    sukupuoli character varying(20) NOT NULL
);


ALTER TABLE public.sukupuoli OWNER TO postgres;

--
-- TOC entry 3332 (class 2604 OID 16848)
-- Name: jakoryhma ryhma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma ALTER COLUMN ryhma_id SET DEFAULT nextval('public.jakoryhma_ryhma_id_seq'::regclass);


--
-- TOC entry 3333 (class 2604 OID 16849)
-- Name: jakotapahtuma tapahtuma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma ALTER COLUMN tapahtuma_id SET DEFAULT nextval('public.jakotapahtuma_tapahtuma_id_seq'::regclass);


--
-- TOC entry 3336 (class 2604 OID 16850)
-- Name: jakotapahtuma_jasen tapahtuma_jasen_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen ALTER COLUMN tapahtuma_jasen_id SET DEFAULT nextval('public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq'::regclass);


--
-- TOC entry 3338 (class 2604 OID 16851)
-- Name: jasen jasen_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen ALTER COLUMN jasen_id SET DEFAULT nextval('public.jasen_jasen_id_seq_1'::regclass);


--
-- TOC entry 3340 (class 2604 OID 16852)
-- Name: jasenyys jasenyys_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys ALTER COLUMN jasenyys_id SET DEFAULT nextval('public.jasenyys_jasenyys_id_seq'::regclass);


--
-- TOC entry 3334 (class 2604 OID 16853)
-- Name: kaadon_kasittely kaadon_kasittely_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely ALTER COLUMN kaadon_kasittely_id SET DEFAULT nextval('public.kaadon_kasittely_kaadon_kasittely_id_seq_1'::regclass);


--
-- TOC entry 3335 (class 2604 OID 16854)
-- Name: kaato kaato_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato ALTER COLUMN kaato_id SET DEFAULT nextval('public.kaato_kaato_id_seq'::regclass);


--
-- TOC entry 3339 (class 2604 OID 16855)
-- Name: kasittely kasittelyid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely ALTER COLUMN kasittelyid SET DEFAULT nextval('public.kasittely_kasittelyid_seq_1'::regclass);


--
-- TOC entry 3343 (class 2604 OID 16856)
-- Name: lupa luparivi_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa ALTER COLUMN luparivi_id SET DEFAULT nextval('public.lupa_luparivi_id_seq'::regclass);


--
-- TOC entry 3344 (class 2604 OID 16857)
-- Name: seura seura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura ALTER COLUMN seura_id SET DEFAULT nextval('public.seura_seura_id_seq'::regclass);


--
-- TOC entry 3341 (class 2604 OID 16858)
-- Name: seurue seurue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue ALTER COLUMN seurue_id SET DEFAULT nextval('public.seurue_seurue_id_seq'::regclass);


--
-- TOC entry 3342 (class 2604 OID 16859)
-- Name: seurue_tyyppi seurue_tyyppi_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue_tyyppi ALTER COLUMN seurue_tyyppi_id SET DEFAULT nextval('public.seurue_tyyppi_seurue_tyyppi_id_seq'::regclass);


--
-- TOC entry 3566 (class 0 OID 16674)
-- Dependencies: 209
-- Data for Name: aikuinenvasa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.aikuinenvasa VALUES ('Vasa');
INSERT INTO public.aikuinenvasa VALUES ('Aikuinen');


--
-- TOC entry 3567 (class 0 OID 16677)
-- Dependencies: 210
-- Data for Name: elain; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.elain VALUES ('Valkohäntäpeura');
INSERT INTO public.elain VALUES ('Hirvi');


--
-- TOC entry 3568 (class 0 OID 16680)
-- Dependencies: 211
-- Data for Name: jakoryhma; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakoryhma VALUES (1, 1, 'Ryhmä1');
INSERT INTO public.jakoryhma VALUES (2, 1, 'Ryhmä2');
INSERT INTO public.jakoryhma VALUES (3, 1, 'Ryhmä3');
INSERT INTO public.jakoryhma VALUES (4, 1, 'Ryhmä4');
INSERT INTO public.jakoryhma VALUES (5, 1, 'Ryhmä5');
INSERT INTO public.jakoryhma VALUES (6, 1, 'Ryhmä6');
INSERT INTO public.jakoryhma VALUES (7, 1, 'Ryhmä7');


--
-- TOC entry 3569 (class 0 OID 16683)
-- Dependencies: 212
-- Data for Name: jakotapahtuma; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakotapahtuma VALUES (5, '2023-09-04', 6, 'Neljännes', 1, 50);
INSERT INTO public.jakotapahtuma VALUES (6, '2023-09-05', 3, 'Puolikas', 5, 40);
INSERT INTO public.jakotapahtuma VALUES (7, '2023-09-05', 4, 'Puolikas', 5, 40);
INSERT INTO public.jakotapahtuma VALUES (8, '2023-09-05', 7, 'Neljännes', 1, 50);
INSERT INTO public.jakotapahtuma VALUES (9, '2023-09-05', 1, 'Puolikas', 6, 30);
INSERT INTO public.jakotapahtuma VALUES (10, '2023-09-18', 7, 'Koko', 8, 100);
INSERT INTO public.jakotapahtuma VALUES (1, '2023-09-04', 1, 'Koko', 2, 200);
INSERT INTO public.jakotapahtuma VALUES (4, '2023-09-04', 5, 'Neljännes', 4, 220);
INSERT INTO public.jakotapahtuma VALUES (3, '2023-09-04', 4, 'Puolikas', 1, 100);


--
-- TOC entry 3572 (class 0 OID 16703)
-- Dependencies: 217
-- Data for Name: jakotapahtuma_jasen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakotapahtuma_jasen VALUES (1, '2022-11-15', 9, 'Koko', 89, 37);
INSERT INTO public.jakotapahtuma_jasen VALUES (2, '2022-11-15', 10, 'Puolikas', 45, 38);


--
-- TOC entry 3573 (class 0 OID 16711)
-- Dependencies: 219
-- Data for Name: jasen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jasen VALUES (1, 'Kimmo', 'Suominen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (2, 'Niko', 'Aalto', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (3, 'Matti', 'Karhunen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (4, 'Antti', 'Heinonen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (5, 'Antti-Juhani', 'Laitinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (6, 'Ari', 'Halonen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (7, 'Esko', 'Runola', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (8, 'Miikka', 'Hiivola', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (9, 'Ari', 'Junttila', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (10, 'Timo', 'Nurmi', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (12, 'Risto', 'Leppänen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (13, 'Timo', 'Kyrölä', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (14, 'Ari', 'Kilpeläinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (15, 'Esa', 'Kilpeläinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (16, 'Marko', 'Hannula', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (17, 'Jari', 'Kaskinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (18, 'Arto', 'Ali-Keskikylä', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (19, 'Mikko', 'Luostarinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (20, 'Niko', 'Rannikko', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (21, 'Matti', 'Van Strien', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (22, 'Juha-Matti', 'Halminen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (23, 'Aleksi', 'Ahlqvist', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (24, 'Pentti', 'Ahlqvist', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (25, 'Tuomas', 'Ahlqvist', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (26, 'Tommi', 'Puntala', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (27, 'Juha-Matti', 'Hannula', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (28, 'Tapio', 'Ranta', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (29, 'Vilho', 'Länsiaho', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (30, 'Antti', 'Keskitalo', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (31, 'Sauli', 'Junttila', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (32, 'Mikko', 'Mäkilä', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (33, 'Mikko', 'Salminen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (11, 'Erkki', 'Lehto', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen VALUES (34, 'Matti', 'Rinnola', '-', '-', '-', 'aktiivinen');


--
-- TOC entry 3575 (class 0 OID 16728)
-- Dependencies: 223
-- Data for Name: jasenyys; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jasenyys VALUES (1, 1, 3, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (2, 1, 1, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (3, 1, 4, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (4, 1, 5, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (5, 2, 6, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (6, 2, 33, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (7, 2, 7, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (8, 2, 8, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (9, 3, 9, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (10, 3, 10, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (11, 3, 11, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (12, 3, 12, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (13, 4, 13, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (14, 4, 14, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (15, 4, 15, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (16, 4, 16, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (17, 5, 17, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (18, 5, 34, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (19, 5, 18, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (20, 5, 19, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (21, 6, 20, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (22, 6, 21, 100, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (23, 6, 22, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (24, 6, 23, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (25, 6, 24, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (26, 6, 25, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (27, 7, 26, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (28, 7, 27, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (29, 7, 28, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (30, 7, 29, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (31, 7, 30, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (32, 7, 31, 50, '2023-05-23', NULL, 1);
INSERT INTO public.jasenyys VALUES (37, NULL, 2, 100, '2023-10-03', NULL, 2);
INSERT INTO public.jasenyys VALUES (38, NULL, 23, 100, '2023-10-03', NULL, 2);
INSERT INTO public.jasenyys VALUES (39, NULL, 24, 100, '2023-10-03', NULL, 2);
INSERT INTO public.jasenyys VALUES (40, NULL, 25, 100, '2023-10-03', NULL, 2);
INSERT INTO public.jasenyys VALUES (33, 7, 32, 50, '2023-05-23', NULL, 1);


--
-- TOC entry 3570 (class 0 OID 16690)
-- Dependencies: 214
-- Data for Name: kaadon_kasittely; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kaadon_kasittely VALUES (1, 2, 4, 100);
INSERT INTO public.kaadon_kasittely VALUES (2, 2, 5, 100);
INSERT INTO public.kaadon_kasittely VALUES (6, 2, 8, 50);
INSERT INTO public.kaadon_kasittely VALUES (7, 3, 8, 50);
INSERT INTO public.kaadon_kasittely VALUES (5, 2, 7, 100);
INSERT INTO public.kaadon_kasittely VALUES (3, 1, 6, 75);
INSERT INTO public.kaadon_kasittely VALUES (4, 2, 6, 25);
INSERT INTO public.kaadon_kasittely VALUES (8, 2, 9, 100);
INSERT INTO public.kaadon_kasittely VALUES (9, 5, 11, 100);
INSERT INTO public.kaadon_kasittely VALUES (10, 5, 12, 100);


--
-- TOC entry 3571 (class 0 OID 16693)
-- Dependencies: 215
-- Data for Name: kaato; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kaato VALUES (4, 2, '2023-09-04', 200, 'Turku', NULL, 'Hirvi', 'Uros', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (5, 24, '2023-09-04', 125, 'Raisio', NULL, 'Hirvi', 'Naaras', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (8, 12, '2023-09-05', 60, 'Masku', NULL, 'Valkohäntäpeura', 'Naaras', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (7, 34, '2023-09-05', 80, 'Vantaa', NULL, 'Valkohäntäpeura', 'Uros', 'Aikuinen', 'None');
INSERT INTO public.kaato VALUES (6, 8, '2023-09-04', 220, 'Muuntula', NULL, 'Hirvi', 'Uros', 'Aikuinen', 'None');
INSERT INTO public.kaato VALUES (9, 10, '2023-09-18', 100, 'Turku', NULL, 'Valkohäntäpeura', 'Uros', 'Vasa', NULL);
INSERT INTO public.kaato VALUES (11, 24, '2023-09-28', 89, 'Tampere', NULL, 'Valkohäntäpeura', 'Uros', 'Aikuinen', NULL);
INSERT INTO public.kaato VALUES (12, 9, '2023-10-04', 90, 'Tuolla', NULL, 'Valkohäntäpeura', 'Uros', 'Aikuinen', NULL);


--
-- TOC entry 3574 (class 0 OID 16715)
-- Dependencies: 220
-- Data for Name: kasittely; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kasittely VALUES (1, 'Seuralle');
INSERT INTO public.kasittely VALUES (2, 'Seurueelle');
INSERT INTO public.kasittely VALUES (3, 'Myyntiin');
INSERT INTO public.kasittely VALUES (4, 'Hävitetään');
INSERT INTO public.kasittely VALUES (5, 'Jäsenelle');


--
-- TOC entry 3586 (class 0 OID 16795)
-- Dependencies: 245
-- Data for Name: lupa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lupa VALUES (1, 1, '2023', 'Hirvi', 'Naaras', 'Aikuinen', 8);
INSERT INTO public.lupa VALUES (2, 1, '2023', 'Hirvi', 'Uros', 'Aikuinen', 9);
INSERT INTO public.lupa VALUES (3, 1, '2023', 'Hirvi', 'Ei määritelty', 'Vasa', 16);
INSERT INTO public.lupa VALUES (13, 1, '2023', 'Valkohäntäpeura', 'Ei määritelty', 'Vasa', 200);
INSERT INTO public.lupa VALUES (14, 1, '2023', 'Valkohäntäpeura', 'Uros', 'Aikuinen', 112);
INSERT INTO public.lupa VALUES (15, 1, '2023', 'Valkohäntäpeura', 'Naaras', 'Aikuinen', 128);
INSERT INTO public.lupa VALUES (4, 1, '2022', 'Valkohäntäpeura', 'Uros', 'Aikuinen', 104);
INSERT INTO public.lupa VALUES (10, 1, '2022', 'Valkohäntäpeura', 'Ei määritelty', 'Vasa', 188);
INSERT INTO public.lupa VALUES (12, 1, '2022', 'Valkohäntäpeura', 'Naaras', 'Aikuinen', 84);
INSERT INTO public.lupa VALUES (5, 1, '2021', 'Valkohäntäpeura', 'Uros', 'Aikuinen', 90);
INSERT INTO public.lupa VALUES (9, 1, '2021', 'Valkohäntäpeura', 'Naaras', 'Aikuinen', 90);
INSERT INTO public.lupa VALUES (11, 1, '2021', 'Valkohäntäpeura', 'Ei määritelty', 'Vasa', 150);
INSERT INTO public.lupa VALUES (6, 1, '2020', 'Valkohäntäpeura', 'Uros', 'Aikuinen', 150);
INSERT INTO public.lupa VALUES (7, 1, '2020', 'Valkohäntäpeura', 'Naaras', 'Aikuinen', 185);
INSERT INTO public.lupa VALUES (8, 1, '2020', 'Valkohäntäpeura', 'Ei määritelty', 'Vasa', 250);


--
-- TOC entry 3588 (class 0 OID 16808)
-- Dependencies: 249
-- Data for Name: ruhonosa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ruhonosa VALUES ('Koko');
INSERT INTO public.ruhonosa VALUES ('Puolikas');
INSERT INTO public.ruhonosa VALUES ('Neljännes');


--
-- TOC entry 3589 (class 0 OID 16825)
-- Dependencies: 253
-- Data for Name: seura; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seura VALUES (1, 'Metsästysseura Repo ry', 'Ketoruusuntie 26', '21270', 'Nousiainen');


--
-- TOC entry 3577 (class 0 OID 16741)
-- Dependencies: 227
-- Data for Name: seurue; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seurue VALUES (1, 1, 'Ryhmä Seurue', 1, 1);
INSERT INTO public.seurue VALUES (2, 1, 'Jäsen Seurue', 2, 2);


--
-- TOC entry 3582 (class 0 OID 16769)
-- Dependencies: 237
-- Data for Name: seurue_tyyppi; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seurue_tyyppi VALUES (1, 'Ryhmä');
INSERT INTO public.seurue_tyyppi VALUES (2, 'Jäsen');


--
-- TOC entry 3593 (class 0 OID 16845)
-- Dependencies: 260
-- Data for Name: sukupuoli; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sukupuoli VALUES ('Uros');
INSERT INTO public.sukupuoli VALUES ('Naaras');
INSERT INTO public.sukupuoli VALUES ('Ei määritelty');


--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 226
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakoryhma_ryhma_id_seq', 7, true);


--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 230
-- Name: jakotapahtuma_jasen_tapahtuma_jasen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakotapahtuma_jasen_tapahtuma_jasen_id_seq', 2, true);


--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 232
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakotapahtuma_tapahtuma_id_seq', 10, true);


--
-- TOC entry 3628 (class 0 OID 0)
-- Dependencies: 233
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jasen_jasen_id_seq_1', 34, true);


--
-- TOC entry 3629 (class 0 OID 0)
-- Dependencies: 235
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jasenyys_jasenyys_id_seq', 40, true);


--
-- TOC entry 3630 (class 0 OID 0)
-- Dependencies: 239
-- Name: kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kaadon_kasittely_kaadon_kasittely_id_seq_1', 10, true);


--
-- TOC entry 3631 (class 0 OID 0)
-- Dependencies: 240
-- Name: kaato_kaato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kaato_kaato_id_seq', 12, true);


--
-- TOC entry 3632 (class 0 OID 0)
-- Dependencies: 243
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kasittely_kasittelyid_seq_1', 1, true);


--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 246
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lupa_luparivi_id_seq', 15, true);


--
-- TOC entry 3634 (class 0 OID 0)
-- Dependencies: 254
-- Name: seura_seura_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seura_seura_id_seq', 1, true);


--
-- TOC entry 3635 (class 0 OID 0)
-- Dependencies: 258
-- Name: seurue_seurue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seurue_seurue_id_seq', 3, true);


--
-- TOC entry 3636 (class 0 OID 0)
-- Dependencies: 259
-- Name: seurue_tyyppi_seurue_tyyppi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seurue_tyyppi_seurue_tyyppi_id_seq', 2, true);


--
-- TOC entry 3346 (class 2606 OID 16861)
-- Name: aikuinenvasa aikuinenvasa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aikuinenvasa
    ADD CONSTRAINT aikuinenvasa_pk PRIMARY KEY (ikaluokka);


--
-- TOC entry 3348 (class 2606 OID 16863)
-- Name: elain elain_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elain
    ADD CONSTRAINT elain_pk PRIMARY KEY (elaimen_nimi);


--
-- TOC entry 3350 (class 2606 OID 16865)
-- Name: jakoryhma jakoryhma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT jakoryhma_pk PRIMARY KEY (ryhma_id);


--
-- TOC entry 3359 (class 2606 OID 16867)
-- Name: jakotapahtuma_jasen jakotapahtuma_jasen_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen
    ADD CONSTRAINT jakotapahtuma_jasen_pk PRIMARY KEY (tapahtuma_jasen_id);


--
-- TOC entry 3352 (class 2606 OID 16869)
-- Name: jakotapahtuma jakotapahtuma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT jakotapahtuma_pk PRIMARY KEY (tapahtuma_id);


--
-- TOC entry 3361 (class 2606 OID 16871)
-- Name: jasen jasen_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen
    ADD CONSTRAINT jasen_pk PRIMARY KEY (jasen_id);


--
-- TOC entry 3366 (class 2606 OID 16873)
-- Name: jasenyys jasenyys_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasenyys_pk PRIMARY KEY (jasenyys_id);


--
-- TOC entry 3354 (class 2606 OID 16875)
-- Name: kaadon_kasittely kaadon_kasittely_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kaadon_kasittely_pk PRIMARY KEY (kaadon_kasittely_id);


--
-- TOC entry 3356 (class 2606 OID 16877)
-- Name: kaato kaato_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT kaato_pk PRIMARY KEY (kaato_id);


--
-- TOC entry 3363 (class 2606 OID 16879)
-- Name: kasittely kasittely_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely
    ADD CONSTRAINT kasittely_pk PRIMARY KEY (kasittelyid);


--
-- TOC entry 3373 (class 2606 OID 16881)
-- Name: lupa lupa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT lupa_pk PRIMARY KEY (luparivi_id);


--
-- TOC entry 3375 (class 2606 OID 16883)
-- Name: ruhonosa ruhonosa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruhonosa
    ADD CONSTRAINT ruhonosa_pk PRIMARY KEY (osnimitys);


--
-- TOC entry 3377 (class 2606 OID 16885)
-- Name: seura seura_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura
    ADD CONSTRAINT seura_pk PRIMARY KEY (seura_id);


--
-- TOC entry 3369 (class 2606 OID 16887)
-- Name: seurue seurue_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seurue_pk PRIMARY KEY (seurue_id);


--
-- TOC entry 3371 (class 2606 OID 16889)
-- Name: seurue_tyyppi seurue_tyyppi_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue_tyyppi
    ADD CONSTRAINT seurue_tyyppi_pk PRIMARY KEY (seurue_tyyppi_id);


--
-- TOC entry 3379 (class 2606 OID 16891)
-- Name: sukupuoli sukupuoli_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sukupuoli
    ADD CONSTRAINT sukupuoli_pk PRIMARY KEY (sukupuoli);


--
-- TOC entry 3357 (class 1259 OID 16892)
-- Name: fki_jasenyys_jakotapahtuma_jasen_fk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_jasenyys_jakotapahtuma_jasen_fk ON public.jakotapahtuma_jasen USING btree (jasenyys_id);


--
-- TOC entry 3364 (class 1259 OID 16893)
-- Name: fki_seurue_jasenyys_fk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_seurue_jasenyys_fk ON public.jasenyys USING btree (seurue_id);


--
-- TOC entry 3367 (class 1259 OID 16894)
-- Name: fki_seurue_tyyppi_seurue_fk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_seurue_tyyppi_seurue_fk ON public.seurue USING btree (seurue_tyyppi_id);


--
-- TOC entry 3386 (class 2606 OID 16895)
-- Name: kaato aikuinen_vasa_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT aikuinen_vasa_kaato_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3399 (class 2606 OID 16900)
-- Name: lupa aikuinen_vasa_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT aikuinen_vasa_lupa_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3387 (class 2606 OID 16905)
-- Name: kaato elain_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT elain_kaato_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3400 (class 2606 OID 16910)
-- Name: lupa elain_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT elain_lupa_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3393 (class 2606 OID 16915)
-- Name: jasenyys jasen_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasen_jasenyys_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3388 (class 2606 OID 16920)
-- Name: kaato jasen_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT jasen_kaato_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3396 (class 2606 OID 16925)
-- Name: seurue jasen_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT jasen_seurue_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3390 (class 2606 OID 16930)
-- Name: jakotapahtuma_jasen jasenyys_jakotapahtuma_jasen_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen
    ADD CONSTRAINT jasenyys_jakotapahtuma_jasen_fk FOREIGN KEY (jasenyys_id) REFERENCES public.jasenyys(jasenyys_id);


--
-- TOC entry 3381 (class 2606 OID 16935)
-- Name: jakotapahtuma kaadon_kasittely_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT kaadon_kasittely_jakotapahtuma_fk FOREIGN KEY (kaadon_kasittely_id) REFERENCES public.kaadon_kasittely(kaadon_kasittely_id) ON DELETE CASCADE;


--
-- TOC entry 3391 (class 2606 OID 16940)
-- Name: jakotapahtuma_jasen kaadon_kasittely_jakotapahtuma_jasen_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen
    ADD CONSTRAINT kaadon_kasittely_jakotapahtuma_jasen_fk FOREIGN KEY (kaadon_kasittely_id) REFERENCES public.kaadon_kasittely(kaadon_kasittely_id) ON DELETE CASCADE;


--
-- TOC entry 3384 (class 2606 OID 16945)
-- Name: kaadon_kasittely kaato_kaadon_kasittely_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kaato_kaadon_kasittely_fk FOREIGN KEY (kaato_id) REFERENCES public.kaato(kaato_id) ON DELETE CASCADE;


--
-- TOC entry 3385 (class 2606 OID 16950)
-- Name: kaadon_kasittely kasittely_kaadon_kasittely_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kasittely_kaadon_kasittely_fk FOREIGN KEY (kasittelyid) REFERENCES public.kasittely(kasittelyid);


--
-- TOC entry 3382 (class 2606 OID 16955)
-- Name: jakotapahtuma ruhonosa_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ruhonosa_jakotapahtuma_fk FOREIGN KEY (osnimitys) REFERENCES public.ruhonosa(osnimitys);


--
-- TOC entry 3392 (class 2606 OID 16960)
-- Name: jakotapahtuma_jasen ruhonosa_jakotapahtuma_jasen_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma_jasen
    ADD CONSTRAINT ruhonosa_jakotapahtuma_jasen_fk FOREIGN KEY (osnimitys) REFERENCES public.ruhonosa(osnimitys);


--
-- TOC entry 3383 (class 2606 OID 16965)
-- Name: jakotapahtuma ryhma_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ryhma_jakotapahtuma_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3394 (class 2606 OID 16970)
-- Name: jasenyys ryhma_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT ryhma_jasenyys_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3401 (class 2606 OID 16975)
-- Name: lupa seura_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT seura_lupa_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3397 (class 2606 OID 16980)
-- Name: seurue seura_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seura_seurue_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3395 (class 2606 OID 16985)
-- Name: jasenyys seurue_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT seurue_jasenyys_fk FOREIGN KEY (seurue_id) REFERENCES public.seurue(seurue_id);


--
-- TOC entry 3380 (class 2606 OID 16990)
-- Name: jakoryhma seurue_ryhma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT seurue_ryhma_fk FOREIGN KEY (seurue_id) REFERENCES public.seurue(seurue_id);


--
-- TOC entry 3398 (class 2606 OID 16995)
-- Name: seurue seurue_tyyppi_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seurue_tyyppi_seurue_fk FOREIGN KEY (seurue_tyyppi_id) REFERENCES public.seurue_tyyppi(seurue_tyyppi_id);


--
-- TOC entry 3389 (class 2606 OID 17000)
-- Name: kaato sukupuoli_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT sukupuoli_kaato_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3402 (class 2606 OID 17005)
-- Name: lupa sukupuoli_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT sukupuoli_lupa_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


-- Completed on 2023-10-05 00:09:02

--
-- PostgreSQL database dump complete
--


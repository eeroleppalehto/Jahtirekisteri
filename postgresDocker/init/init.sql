CREATE ROLE application WITH
	LOGIN
	NOSUPERUSER
	CREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'Q2werty';
--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6
-- Dumped by pg_dump version 14.6

-- Started on 2023-05-23 13:49:47

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
-- TOC entry 264 (class 1255 OID 64090)
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
-- TOC entry 209 (class 1259 OID 64091)
-- Name: aikuinenvasa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aikuinenvasa (
    ikaluokka character varying(20) NOT NULL
);


ALTER TABLE public.aikuinenvasa OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 64094)
-- Name: elain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.elain (
    elaimen_nimi character varying(20) NOT NULL
);


ALTER TABLE public.elain OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 64097)
-- Name: jakoryhma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jakoryhma (
    ryhma_id integer NOT NULL,
    seurue_id integer NOT NULL,
    ryhman_nimi character varying(50) NOT NULL
);


ALTER TABLE public.jakoryhma OWNER TO postgres;

--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jakoryhma IS 'Ryhmä, jolle lihaa jaetaan';


--
-- TOC entry 212 (class 1259 OID 64100)
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
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN jakotapahtuma.maara; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jakotapahtuma.maara IS 'Jaettu lihamäärä kiloina';


--
-- TOC entry 213 (class 1259 OID 64103)
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
-- TOC entry 214 (class 1259 OID 64107)
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
-- TOC entry 215 (class 1259 OID 64110)
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
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE kaato; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.kaato IS 'Ampumatapahtuman tiedot';


--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN kaato.ruhopaino; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.ruhopaino IS 'paino kiloina';


--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN kaato.paikka_koordinaatti; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.paikka_koordinaatti IS 'Tämän kentän tietotyyppi pitää oikeasti olla geometry (Postgis-tietotyyppi)';


--
-- TOC entry 216 (class 1259 OID 64115)
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
-- TOC entry 217 (class 1259 OID 64120)
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
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE jasen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jasen IS 'Henkilö joka osallistuu metsästykseen tai lihanjakoon';


--
-- TOC entry 218 (class 1259 OID 64124)
-- Name: kasittely; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kasittely (
    kasittelyid integer NOT NULL,
    kasittely_teksti character varying(50) NOT NULL
);


ALTER TABLE public.kasittely OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 64127)
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
-- TOC entry 220 (class 1259 OID 64132)
-- Name: jasenyys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jasenyys (
    jasenyys_id integer NOT NULL,
    ryhma_id integer NOT NULL,
    jasen_id integer NOT NULL,
    osuus integer NOT NULL,
    liittyi date NOT NULL,
    poistui date
);


ALTER TABLE public.jasenyys OWNER TO postgres;

--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN jasenyys.osuus; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jasenyys.osuus IS 'Lihaosuus prosentteina';


--
-- TOC entry 221 (class 1259 OID 64135)
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
-- TOC entry 222 (class 1259 OID 64139)
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
-- TOC entry 223 (class 1259 OID 64144)
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
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 223
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakoryhma_ryhma_id_seq OWNED BY public.jakoryhma.ryhma_id;


--
-- TOC entry 224 (class 1259 OID 64145)
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
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE seurue; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seurue IS 'Metsästystä harjoittavan seurueen tiedot';


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN seurue.jasen_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.seurue.jasen_id IS 'Seurueen johtajan tunniste';


--
-- TOC entry 225 (class 1259 OID 64148)
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
-- TOC entry 226 (class 1259 OID 64152)
-- Name: jakoryhma_yhteenveto; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.jakoryhma_yhteenveto AS
 SELECT jakoryhma.ryhman_nimi AS "Ryhmä",
    count(jasenyys.jasen_id) AS "Jäseniä",
    ((sum(jasenyys.osuus))::double precision / (100)::real) AS "Osuus Summa"
   FROM (public.jakoryhma
     LEFT JOIN public.jasenyys ON ((jasenyys.ryhma_id = jakoryhma.ryhma_id)))
  GROUP BY jakoryhma.ryhman_nimi
  ORDER BY jakoryhma.ryhman_nimi;


ALTER TABLE public.jakoryhma_yhteenveto OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 64156)
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
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 227
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakotapahtuma_tapahtuma_id_seq OWNED BY public.jakotapahtuma.tapahtuma_id;


--
-- TOC entry 228 (class 1259 OID 64157)
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
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 228
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasen_jasen_id_seq_1 OWNED BY public.jasen.jasen_id;


--
-- TOC entry 229 (class 1259 OID 64158)
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
-- TOC entry 230 (class 1259 OID 64162)
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
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 230
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasenyys_jasenyys_id_seq OWNED BY public.jasenyys.jasenyys_id;


--
-- TOC entry 252 (class 1259 OID 64371)
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
    jasenyys.osuus AS "Osuus"
   FROM ((public.jasenyys
     JOIN public.jasen ON ((jasenyys.jasen_id = jasen.jasen_id)))
     JOIN public.jakoryhma ON ((jakoryhma.ryhma_id = jasenyys.ryhma_id)))
  ORDER BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text);


ALTER TABLE public.jasenyys_nimella_ryhmalla OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 64168)
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
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 231
-- Name: kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kaadon_kasittely_kaadon_kasittely_id_seq_1 OWNED BY public.kaadon_kasittely.kaadon_kasittely_id;


--
-- TOC entry 232 (class 1259 OID 64169)
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
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 232
-- Name: kaato_kaato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kaato_kaato_id_seq OWNED BY public.kaato.kaato_id;


--
-- TOC entry 233 (class 1259 OID 64170)
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
    count(kaadon_kasittely.kaato_id) AS "Käsittelyt"
   FROM ((public.kaato
     JOIN public.jasen ON ((jasen.jasen_id = kaato.jasen_id)))
     JOIN public.kaadon_kasittely ON ((kaato.kaato_id = kaadon_kasittely.kaato_id)))
  GROUP BY (((jasen.sukunimi)::text || ' '::text) || (jasen.etunimi)::text), kaato.kaatopaiva, kaato.paikka_teksti, kaato.elaimen_nimi, kaato.ikaluokka, kaato.sukupuoli, kaato.ruhopaino, kaato.kaato_id
  ORDER BY kaato.kaato_id DESC;


ALTER TABLE public.kaatoluettelo OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 64366)
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
-- TOC entry 234 (class 1259 OID 64180)
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
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 234
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kasittely_kasittelyid_seq_1 OWNED BY public.kasittely.kasittelyid;


--
-- TOC entry 235 (class 1259 OID 64181)
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
-- TOC entry 236 (class 1259 OID 64186)
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
-- TOC entry 3597 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE lupa; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.lupa IS 'Vuosittaiset kaatoluvat';


--
-- TOC entry 237 (class 1259 OID 64189)
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
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 237
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lupa_luparivi_id_seq OWNED BY public.lupa.luparivi_id;


--
-- TOC entry 238 (class 1259 OID 64190)
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
-- TOC entry 239 (class 1259 OID 64195)
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
-- TOC entry 240 (class 1259 OID 64199)
-- Name: ruhonosa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ruhonosa (
    osnimitys character varying(20) NOT NULL
);


ALTER TABLE public.ruhonosa OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 64202)
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
-- TOC entry 3604 (class 0 OID 0)
-- Dependencies: 241
-- Name: VIEW ryhmat_jasenilla; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.ryhmat_jasenilla IS 'Näkymä joka näyttää ryhmä, jäsen, liittymispvm(,poistumispvm), osuus';


--
-- TOC entry 242 (class 1259 OID 64207)
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
-- TOC entry 243 (class 1259 OID 64212)
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
-- TOC entry 244 (class 1259 OID 64216)
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
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE seura; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seura IS 'Metsästysseuran tiedot';


--
-- TOC entry 245 (class 1259 OID 64219)
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
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 245
-- Name: seura_seura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seura_seura_id_seq OWNED BY public.seura.seura_id;


--
-- TOC entry 246 (class 1259 OID 64220)
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
-- TOC entry 247 (class 1259 OID 64224)
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
-- TOC entry 248 (class 1259 OID 64229)
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
-- TOC entry 249 (class 1259 OID 64233)
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
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 249
-- Name: seurue_seurue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seurue_seurue_id_seq OWNED BY public.seurue.seurue_id;


--
-- TOC entry 250 (class 1259 OID 64234)
-- Name: sukupuoli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sukupuoli (
    sukupuoli character varying(20) NOT NULL
);


ALTER TABLE public.sukupuoli OWNER TO postgres;

--
-- TOC entry 3306 (class 2604 OID 64237)
-- Name: jakoryhma ryhma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma ALTER COLUMN ryhma_id SET DEFAULT nextval('public.jakoryhma_ryhma_id_seq'::regclass);


--
-- TOC entry 3307 (class 2604 OID 64238)
-- Name: jakotapahtuma tapahtuma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma ALTER COLUMN tapahtuma_id SET DEFAULT nextval('public.jakotapahtuma_tapahtuma_id_seq'::regclass);


--
-- TOC entry 3311 (class 2604 OID 64239)
-- Name: jasen jasen_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen ALTER COLUMN jasen_id SET DEFAULT nextval('public.jasen_jasen_id_seq_1'::regclass);


--
-- TOC entry 3313 (class 2604 OID 64240)
-- Name: jasenyys jasenyys_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys ALTER COLUMN jasenyys_id SET DEFAULT nextval('public.jasenyys_jasenyys_id_seq'::regclass);


--
-- TOC entry 3308 (class 2604 OID 64241)
-- Name: kaadon_kasittely kaadon_kasittely_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely ALTER COLUMN kaadon_kasittely_id SET DEFAULT nextval('public.kaadon_kasittely_kaadon_kasittely_id_seq_1'::regclass);


--
-- TOC entry 3309 (class 2604 OID 64242)
-- Name: kaato kaato_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato ALTER COLUMN kaato_id SET DEFAULT nextval('public.kaato_kaato_id_seq'::regclass);


--
-- TOC entry 3312 (class 2604 OID 64243)
-- Name: kasittely kasittelyid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely ALTER COLUMN kasittelyid SET DEFAULT nextval('public.kasittely_kasittelyid_seq_1'::regclass);


--
-- TOC entry 3315 (class 2604 OID 64244)
-- Name: lupa luparivi_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa ALTER COLUMN luparivi_id SET DEFAULT nextval('public.lupa_luparivi_id_seq'::regclass);


--
-- TOC entry 3316 (class 2604 OID 64245)
-- Name: seura seura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura ALTER COLUMN seura_id SET DEFAULT nextval('public.seura_seura_id_seq'::regclass);


--
-- TOC entry 3314 (class 2604 OID 64246)
-- Name: seurue seurue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue ALTER COLUMN seurue_id SET DEFAULT nextval('public.seurue_seurue_id_seq'::regclass);


--
-- TOC entry 3522 (class 0 OID 64091)
-- Dependencies: 209
-- Data for Name: aikuinenvasa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.aikuinenvasa (ikaluokka) VALUES ('Vasa');
INSERT INTO public.aikuinenvasa (ikaluokka) VALUES ('Aikuinen');


--
-- TOC entry 3523 (class 0 OID 64094)
-- Dependencies: 210
-- Data for Name: elain; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.elain (elaimen_nimi) VALUES ('Valkohäntäpeura');
INSERT INTO public.elain (elaimen_nimi) VALUES ('Hirvi');


--
-- TOC entry 3524 (class 0 OID 64097)
-- Dependencies: 211
-- Data for Name: jakoryhma; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (1, 1, 'Ryhmä1');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (2, 1, 'Ryhmä2');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (3, 1, 'Ryhmä3');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (4, 1, 'Ryhmä4');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (5, 1, 'Ryhmä5');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (6, 1, 'Ryhmä6');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (7, 1, 'Ryhmä7');


--
-- TOC entry 3525 (class 0 OID 64100)
-- Dependencies: 212
-- Data for Name: jakotapahtuma; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3528 (class 0 OID 64120)
-- Dependencies: 217
-- Data for Name: jasen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (1, 'Kimmo', 'Suominen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (2, 'Niko', 'Aalto', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (3, 'Matti', 'Karhunen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (4, 'Antti', 'Heinonen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (5, 'Antti-Juhani', 'Laitinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (6, 'Ari', 'Halonen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (7, 'Esko', 'Runola', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (8, 'Miikka', 'Hiivola', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (9, 'Ari', 'Junttila', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (10, 'Timo', 'Nurmi', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (12, 'Risto', 'Leppänen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (13, 'Timo', 'Kyrölä', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (14, 'Ari', 'Kilpeläinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (15, 'Esa', 'Kilpeläinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (16, 'Marko', 'Hannula', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (17, 'Jari', 'Kaskinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (18, 'Arto', 'Ali-Keskikylä', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (19, 'Mikko', 'Luostarinen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (20, 'Niko', 'Rannikko', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (21, 'Matti', 'Van Strien', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (22, 'Juha-Matti', 'Halminen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (23, 'Aleksi', 'Ahlqvist', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (24, 'Pentti', 'Ahlqvist', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (25, 'Tuomas', 'Ahlqvist', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (26, 'Tommi', 'Puntala', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (27, 'Juha-Matti', 'Hannula', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (28, 'Tapio', 'Ranta', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (29, 'Vilho', 'Länsiaho', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (30, 'Antti', 'Keskitalo', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (31, 'Sauli', 'Junttila', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (32, 'Mikko', 'Mäkilä', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (33, 'Mikko', 'Salminen', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (11, 'Erkki', 'Lehto', '-', '-', '-', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (34, 'Matti', 'Rinnola', '-', '-', '-', 'aktiivinen');


--
-- TOC entry 3530 (class 0 OID 64132)
-- Dependencies: 220
-- Data for Name: jasenyys; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (1, 1, 3, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (2, 1, 1, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (3, 1, 4, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (4, 1, 5, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (5, 2, 6, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (6, 2, 33, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (7, 2, 7, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (8, 2, 8, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (9, 3, 9, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (10, 3, 10, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (11, 3, 11, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (12, 3, 12, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (13, 4, 13, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (14, 4, 14, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (15, 4, 15, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (16, 4, 16, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (17, 5, 17, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (18, 5, 34, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (19, 5, 18, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (20, 5, 19, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (21, 6, 20, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (22, 6, 21, 100, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (23, 6, 22, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (24, 6, 23, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (25, 6, 24, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (26, 6, 25, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (27, 7, 26, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (28, 7, 27, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (29, 7, 28, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (30, 7, 29, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (31, 7, 30, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (32, 7, 31, 50, '2023-05-23', NULL);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, osuus, liittyi, poistui) VALUES (33, 7, 32, 50, '2023-05-23', NULL);


--
-- TOC entry 3526 (class 0 OID 64107)
-- Dependencies: 214
-- Data for Name: kaadon_kasittely; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3527 (class 0 OID 64110)
-- Dependencies: 215
-- Data for Name: kaato; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3529 (class 0 OID 64124)
-- Dependencies: 218
-- Data for Name: kasittely; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kasittely (kasittelyid, kasittely_teksti) VALUES (1, 'Seuralle');
INSERT INTO public.kasittely (kasittelyid, kasittely_teksti) VALUES (2, 'Seurueelle');
INSERT INTO public.kasittely (kasittelyid, kasittely_teksti) VALUES (3, 'Myyntiin');
INSERT INTO public.kasittely (kasittelyid, kasittely_teksti) VALUES (4, 'Hävitetään');


--
-- TOC entry 3539 (class 0 OID 64186)
-- Dependencies: 236
-- Data for Name: lupa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (1, 1, '2023', 'Hirvi', 'Naaras', 'Aikuinen', 8);
INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (2, 1, '2023', 'Hirvi', 'Uros', 'Aikuinen', 9);
INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (3, 1, '2023', 'Hirvi', 'Ei määritelty', 'Vasa', 16);


--
-- TOC entry 3541 (class 0 OID 64199)
-- Dependencies: 240
-- Data for Name: ruhonosa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ruhonosa (osnimitys) VALUES ('Koko');
INSERT INTO public.ruhonosa (osnimitys) VALUES ('Puolikas');
INSERT INTO public.ruhonosa (osnimitys) VALUES ('Neljännes');


--
-- TOC entry 3542 (class 0 OID 64216)
-- Dependencies: 244
-- Data for Name: seura; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seura (seura_id, seuran_nimi, jakeluosoite, postinumero, postitoimipaikka) VALUES (1, 'Metsästysseura Repo ry', 'Ketoruusuntie 26', '21270', 'Nousiainen');


--
-- TOC entry 3532 (class 0 OID 64145)
-- Dependencies: 224
-- Data for Name: seurue; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seurue (seurue_id, seura_id, seurueen_nimi, jasen_id) VALUES (1, 1, 'Seurue1', 1);


--
-- TOC entry 3545 (class 0 OID 64234)
-- Dependencies: 250
-- Data for Name: sukupuoli; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sukupuoli (sukupuoli) VALUES ('Uros');
INSERT INTO public.sukupuoli (sukupuoli) VALUES ('Naaras');
INSERT INTO public.sukupuoli (sukupuoli) VALUES ('Ei määritelty');


--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 223
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakoryhma_ryhma_id_seq', 7, true);


--
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 227
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakotapahtuma_tapahtuma_id_seq', 1, false);


--
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 228
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jasen_jasen_id_seq_1', 34, true);


--
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 230
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jasenyys_jasenyys_id_seq', 33, true);


--
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 231
-- Name: kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kaadon_kasittely_kaadon_kasittely_id_seq_1', 1, false);


--
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 232
-- Name: kaato_kaato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kaato_kaato_id_seq', 1, false);


--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 234
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kasittely_kasittelyid_seq_1', 1, false);


--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 237
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lupa_luparivi_id_seq', 3, true);


--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 245
-- Name: seura_seura_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seura_seura_id_seq', 1, true);


--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 249
-- Name: seurue_seurue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seurue_seurue_id_seq', 1, true);


--
-- TOC entry 3318 (class 2606 OID 64248)
-- Name: aikuinenvasa aikuinenvasa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aikuinenvasa
    ADD CONSTRAINT aikuinenvasa_pk PRIMARY KEY (ikaluokka);


--
-- TOC entry 3320 (class 2606 OID 64250)
-- Name: elain elain_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elain
    ADD CONSTRAINT elain_pk PRIMARY KEY (elaimen_nimi);


--
-- TOC entry 3322 (class 2606 OID 64252)
-- Name: jakoryhma jakoryhma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT jakoryhma_pk PRIMARY KEY (ryhma_id);


--
-- TOC entry 3324 (class 2606 OID 64254)
-- Name: jakotapahtuma jakotapahtuma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT jakotapahtuma_pk PRIMARY KEY (tapahtuma_id);


--
-- TOC entry 3330 (class 2606 OID 64256)
-- Name: jasen jasen_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen
    ADD CONSTRAINT jasen_pk PRIMARY KEY (jasen_id);


--
-- TOC entry 3334 (class 2606 OID 64258)
-- Name: jasenyys jasenyys_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasenyys_pk PRIMARY KEY (jasenyys_id);


--
-- TOC entry 3326 (class 2606 OID 64260)
-- Name: kaadon_kasittely kaadon_kasittely_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kaadon_kasittely_pk PRIMARY KEY (kaadon_kasittely_id);


--
-- TOC entry 3328 (class 2606 OID 64262)
-- Name: kaato kaato_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT kaato_pk PRIMARY KEY (kaato_id);


--
-- TOC entry 3332 (class 2606 OID 64264)
-- Name: kasittely kasittely_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely
    ADD CONSTRAINT kasittely_pk PRIMARY KEY (kasittelyid);


--
-- TOC entry 3338 (class 2606 OID 64266)
-- Name: lupa lupa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT lupa_pk PRIMARY KEY (luparivi_id);


--
-- TOC entry 3340 (class 2606 OID 64268)
-- Name: ruhonosa ruhonosa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruhonosa
    ADD CONSTRAINT ruhonosa_pk PRIMARY KEY (osnimitys);


--
-- TOC entry 3342 (class 2606 OID 64270)
-- Name: seura seura_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura
    ADD CONSTRAINT seura_pk PRIMARY KEY (seura_id);


--
-- TOC entry 3336 (class 2606 OID 64272)
-- Name: seurue seurue_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seurue_pk PRIMARY KEY (seurue_id);


--
-- TOC entry 3344 (class 2606 OID 64274)
-- Name: sukupuoli sukupuoli_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sukupuoli
    ADD CONSTRAINT sukupuoli_pk PRIMARY KEY (sukupuoli);


--
-- TOC entry 3351 (class 2606 OID 64275)
-- Name: kaato aikuinen_vasa_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT aikuinen_vasa_kaato_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3359 (class 2606 OID 64280)
-- Name: lupa aikuinen_vasa_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT aikuinen_vasa_lupa_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3352 (class 2606 OID 64285)
-- Name: kaato elain_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT elain_kaato_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3360 (class 2606 OID 64290)
-- Name: lupa elain_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT elain_lupa_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3355 (class 2606 OID 64295)
-- Name: jasenyys jasen_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasen_jasenyys_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3353 (class 2606 OID 64300)
-- Name: kaato jasen_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT jasen_kaato_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3357 (class 2606 OID 64305)
-- Name: seurue jasen_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT jasen_seurue_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3346 (class 2606 OID 64310)
-- Name: jakotapahtuma kaadon_kasittely_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT kaadon_kasittely_jakotapahtuma_fk FOREIGN KEY (kaadon_kasittely_id) REFERENCES public.kaadon_kasittely(kaadon_kasittely_id);


--
-- TOC entry 3349 (class 2606 OID 64315)
-- Name: kaadon_kasittely kaato_kaadon_kasittely_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kaato_kaadon_kasittely_fk FOREIGN KEY (kaato_id) REFERENCES public.kaato(kaato_id);


--
-- TOC entry 3350 (class 2606 OID 64320)
-- Name: kaadon_kasittely kasittely_kaadon_kasittely_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaadon_kasittely
    ADD CONSTRAINT kasittely_kaadon_kasittely_fk FOREIGN KEY (kasittelyid) REFERENCES public.kasittely(kasittelyid);


--
-- TOC entry 3347 (class 2606 OID 64325)
-- Name: jakotapahtuma ruhonosa_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ruhonosa_jakotapahtuma_fk FOREIGN KEY (osnimitys) REFERENCES public.ruhonosa(osnimitys);


--
-- TOC entry 3348 (class 2606 OID 64330)
-- Name: jakotapahtuma ryhma_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ryhma_jakotapahtuma_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3356 (class 2606 OID 64335)
-- Name: jasenyys ryhma_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT ryhma_jasenyys_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3361 (class 2606 OID 64340)
-- Name: lupa seura_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT seura_lupa_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3358 (class 2606 OID 64345)
-- Name: seurue seura_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seura_seurue_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3345 (class 2606 OID 64350)
-- Name: jakoryhma seurue_ryhma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT seurue_ryhma_fk FOREIGN KEY (seurue_id) REFERENCES public.seurue(seurue_id);


--
-- TOC entry 3354 (class 2606 OID 64355)
-- Name: kaato sukupuoli_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT sukupuoli_kaato_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3362 (class 2606 OID 64360)
-- Name: lupa sukupuoli_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT sukupuoli_lupa_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 264
-- Name: FUNCTION get_used_licences(license_year integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_used_licences(license_year integer) TO application;


--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE aikuinenvasa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.aikuinenvasa TO application;


--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE elain; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.elain TO application;


--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma TO application;


--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE jakotapahtuma; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakotapahtuma TO application;


--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE jaetut_lihat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaetut_lihat TO application;


--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE kaadon_kasittely; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaadon_kasittely TO application;


--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE kaato; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaato TO application;


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE jaetut_ruhon_osat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaetut_ruhon_osat TO application;


--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE jasen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasen TO application;


--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE kasittely; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kasittely TO application;


--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE jako_kaadot; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jako_kaadot TO application;


--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE jasenyys; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasenyys TO application;


--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE ryhmien_osuudet; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ryhmien_osuudet TO application;


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE jakoryhma_osuus_maara; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_osuus_maara TO application;


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 223
-- Name: SEQUENCE jakoryhma_ryhma_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jakoryhma_ryhma_id_seq TO application;


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE seurue; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue TO application;


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE jakoryhma_seurueen_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_seurueen_nimella TO application;


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE jakoryhma_yhteenveto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jakoryhma_yhteenveto TO application;


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 227
-- Name: SEQUENCE jakotapahtuma_tapahtuma_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jakotapahtuma_tapahtuma_id_seq TO application;


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 228
-- Name: SEQUENCE jasen_jasen_id_seq_1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jasen_jasen_id_seq_1 TO application;


--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE jasen_tila; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasen_tila TO application;


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 230
-- Name: SEQUENCE jasenyys_jasenyys_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jasenyys_jasenyys_id_seq TO application;


--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE jasenyys_nimella_ryhmalla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasenyys_nimella_ryhmalla TO application;


--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 231
-- Name: SEQUENCE kaadon_kasittely_kaadon_kasittely_id_seq_1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.kaadon_kasittely_kaadon_kasittely_id_seq_1 TO application;


--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 232
-- Name: SEQUENCE kaato_kaato_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.kaato_kaato_id_seq TO application;


--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE kaatoluettelo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaatoluettelo TO application;


--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE kaatoluettelo_indeksilla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaatoluettelo_indeksilla TO application;


--
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 234
-- Name: SEQUENCE kasittely_kasittelyid_seq_1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.kasittely_kasittelyid_seq_1 TO application;


--
-- TOC entry 3596 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE lihan_kaytto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lihan_kaytto TO application;


--
-- TOC entry 3598 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE lupa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lupa TO application;


--
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 237
-- Name: SEQUENCE lupa_luparivi_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lupa_luparivi_id_seq TO application;


--
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE luvat_kayttamatta_kpl_pros; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.luvat_kayttamatta_kpl_pros TO application;


--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE nimivalinta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.nimivalinta TO application;


--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE ruhonosa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ruhonosa TO application;


--
-- TOC entry 3605 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE ryhmat_jasenilla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ryhmat_jasenilla TO application;


--
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 242
-- Name: TABLE seurue_sankey; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_sankey TO application;


--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE sankey_elain_kasittely_seurue; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sankey_elain_kasittely_seurue TO application;


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE seura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seura TO application;


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 245
-- Name: SEQUENCE seura_seura_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seura_seura_id_seq TO application;


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE seurue_lihat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_lihat TO application;


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE seurue_lihat_osuus; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_lihat_osuus TO application;


--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE seurue_ryhmilla; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seurue_ryhmilla TO application;


--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 249
-- Name: SEQUENCE seurue_seurue_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seurue_seurue_id_seq TO application;


--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE sukupuoli; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sukupuoli TO application;


-- Completed on 2023-05-23 13:49:48

--
-- PostgreSQL database dump complete
--


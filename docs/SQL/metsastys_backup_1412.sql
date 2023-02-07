--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

-- Started on 2022-12-14 13:12:30

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
-- TOC entry 250 (class 1255 OID 19655)
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
-- TOC entry 216 (class 1259 OID 19202)
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
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE jasen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jasen IS 'Henkilö joka osallistuu metsästykseen tai lihanjakoon';


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN jasen.tila; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jasen.tila IS 'Jäsenen tila, joka kertoo onko hän yhä mukana toiminnassa';


--
-- TOC entry 249 (class 1255 OID 19659)
-- Name: get_member(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_member(id integer) RETURNS SETOF public.jasen
    LANGUAGE sql
    AS $$
SELECT * FROM public.jasen WHERE jasen_id = id;
$$;


ALTER FUNCTION public.get_member(id integer) OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 19176)
-- Name: aikuinenvasa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aikuinenvasa (
    ikaluokka character varying(10) NOT NULL
);


ALTER TABLE public.aikuinenvasa OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 27989)
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
-- TOC entry 210 (class 1259 OID 19179)
-- Name: elain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.elain (
    elaimen_nimi character varying(20) NOT NULL
);


ALTER TABLE public.elain OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19207)
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
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE kaato; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.kaato IS 'Ampumatapahtuman tiedot';


--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN kaato.ruhopaino; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.ruhopaino IS 'paino kiloina';


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN kaato.paikka_koordinaatti; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kaato.paikka_koordinaatti IS 'Tämän kentän tietotyyppi pitää oikeasti olla geometry (Postgis-tietotyyppi)';


--
-- TOC entry 221 (class 1259 OID 19211)
-- Name: kasittely; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kasittely (
    kasittelyid integer NOT NULL,
    kasittely_teksti character varying(50) NOT NULL
);


ALTER TABLE public.kasittely OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 27962)
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
-- TOC entry 211 (class 1259 OID 19182)
-- Name: jakoryhma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jakoryhma (
    ryhma_id integer NOT NULL,
    seurue_id integer NOT NULL,
    ryhman_nimi character varying(50) NOT NULL
);


ALTER TABLE public.jakoryhma OWNER TO postgres;

--
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.jakoryhma IS 'Ryhmä, jolle lihaa jaetaan';


--
-- TOC entry 212 (class 1259 OID 19185)
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
-- TOC entry 3546 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN jakotapahtuma.maara; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jakotapahtuma.maara IS 'Jaettu lihamäärä kiloina';


--
-- TOC entry 232 (class 1259 OID 19362)
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
-- TOC entry 240 (class 1259 OID 27914)
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
-- TOC entry 213 (class 1259 OID 19192)
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
-- TOC entry 3549 (class 0 OID 0)
-- Dependencies: 213
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakoryhma_ryhma_id_seq OWNED BY public.jakoryhma.ryhma_id;


--
-- TOC entry 214 (class 1259 OID 19193)
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
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN jasenyys.osuus; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.jasenyys.osuus IS 'Muuta pakolliseksi (NOT NULL)';


--
-- TOC entry 241 (class 1259 OID 27933)
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
-- TOC entry 215 (class 1259 OID 19201)
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
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 215
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jakotapahtuma_tapahtuma_id_seq OWNED BY public.jakotapahtuma.tapahtuma_id;


--
-- TOC entry 217 (class 1259 OID 19205)
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
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 217
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasen_jasen_id_seq_1 OWNED BY public.jasen.jasen_id;


--
-- TOC entry 218 (class 1259 OID 19206)
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
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 218
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jasenyys_jasenyys_id_seq OWNED BY public.jasenyys.jasenyys_id;


--
-- TOC entry 242 (class 1259 OID 27952)
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
-- TOC entry 235 (class 1259 OID 19429)
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
-- TOC entry 234 (class 1259 OID 19425)
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
-- TOC entry 220 (class 1259 OID 19210)
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
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 220
-- Name: kaato_kaato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kaato_kaato_id_seq OWNED BY public.kaato.kaato_id;


--
-- TOC entry 238 (class 1259 OID 27879)
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
-- TOC entry 222 (class 1259 OID 19214)
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
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 222
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kasittely_kasittelyid_seq_1 OWNED BY public.kasittely.kasittelyid;


--
-- TOC entry 245 (class 1259 OID 27972)
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
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 245
-- Name: VIEW kaytto_ryhmille; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.kaytto_ryhmille IS 'Näkymä, joka kertoo, paljonko lihaa on annettu ryhmille, kun käyttönä on seurueelle';


--
-- TOC entry 246 (class 1259 OID 27977)
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
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 246
-- Name: VIEW lihan_kaytto; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.lihan_kaytto IS 'Kertoo, miten liha on haluttu käyttää: seurueelle, seuralle, myyntiin tai hävitykseen';


--
-- TOC entry 223 (class 1259 OID 19215)
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
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE lupa; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.lupa IS 'Vuosittaiset kaatoluvat';


--
-- TOC entry 224 (class 1259 OID 19218)
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
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 224
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lupa_luparivi_id_seq OWNED BY public.lupa.luparivi_id;


--
-- TOC entry 237 (class 1259 OID 19443)
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
-- TOC entry 236 (class 1259 OID 19438)
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
-- TOC entry 239 (class 1259 OID 27884)
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
-- TOC entry 225 (class 1259 OID 19219)
-- Name: ruhonosa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ruhonosa (
    osnimitys character varying(20) NOT NULL
);


ALTER TABLE public.ruhonosa OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 19378)
-- Name: ryhmien_osuudet; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.ryhmien_osuudet AS
 SELECT jasenyys.ryhma_id AS "ryhmä",
    ((sum(jasenyys.osuus))::double precision / (100)::real) AS jakokerroin
   FROM public.jasenyys
  GROUP BY jasenyys.ryhma_id
  ORDER BY jasenyys.ryhma_id;


ALTER TABLE public.ryhmien_osuudet OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 27981)
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
-- TOC entry 226 (class 1259 OID 19226)
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
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE seura; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seura IS 'Metsästysseuran tiedot';


--
-- TOC entry 227 (class 1259 OID 19229)
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
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 227
-- Name: seura_seura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seura_seura_id_seq OWNED BY public.seura.seura_id;


--
-- TOC entry 228 (class 1259 OID 19230)
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
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE seurue; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seurue IS 'Metsästystä harjoittavan seurueen tiedot
';


--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN seurue.jasen_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.seurue.jasen_id IS 'Seurueen johtajan tunniste';


--
-- TOC entry 229 (class 1259 OID 19233)
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
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 229
-- Name: seurue_seurue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seurue_seurue_id_seq OWNED BY public.seurue.seurue_id;


--
-- TOC entry 244 (class 1259 OID 27967)
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
-- TOC entry 230 (class 1259 OID 19234)
-- Name: sukupuoli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sukupuoli (
    sukupuoli character varying(20) NOT NULL
);


ALTER TABLE public.sukupuoli OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 19237)
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
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 231
-- Name: testi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.testi_seq OWNED BY public.jakoryhma.ryhma_id;


--
-- TOC entry 3291 (class 2604 OID 19238)
-- Name: jakoryhma ryhma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma ALTER COLUMN ryhma_id SET DEFAULT nextval('public.jakoryhma_ryhma_id_seq'::regclass);


--
-- TOC entry 3292 (class 2604 OID 19239)
-- Name: jakotapahtuma tapahtuma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma ALTER COLUMN tapahtuma_id SET DEFAULT nextval('public.jakotapahtuma_tapahtuma_id_seq'::regclass);


--
-- TOC entry 3295 (class 2604 OID 19240)
-- Name: jasen jasen_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen ALTER COLUMN jasen_id SET DEFAULT nextval('public.jasen_jasen_id_seq_1'::regclass);


--
-- TOC entry 3294 (class 2604 OID 19241)
-- Name: jasenyys jasenyys_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys ALTER COLUMN jasenyys_id SET DEFAULT nextval('public.jasenyys_jasenyys_id_seq'::regclass);


--
-- TOC entry 3297 (class 2604 OID 19242)
-- Name: kaato kaato_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato ALTER COLUMN kaato_id SET DEFAULT nextval('public.kaato_kaato_id_seq'::regclass);


--
-- TOC entry 3298 (class 2604 OID 19243)
-- Name: kasittely kasittelyid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely ALTER COLUMN kasittelyid SET DEFAULT nextval('public.kasittely_kasittelyid_seq_1'::regclass);


--
-- TOC entry 3299 (class 2604 OID 19244)
-- Name: lupa luparivi_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa ALTER COLUMN luparivi_id SET DEFAULT nextval('public.lupa_luparivi_id_seq'::regclass);


--
-- TOC entry 3300 (class 2604 OID 19245)
-- Name: seura seura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura ALTER COLUMN seura_id SET DEFAULT nextval('public.seura_seura_id_seq'::regclass);


--
-- TOC entry 3301 (class 2604 OID 19246)
-- Name: seurue seurue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue ALTER COLUMN seurue_id SET DEFAULT nextval('public.seurue_seurue_id_seq'::regclass);


--
-- TOC entry 3501 (class 0 OID 19176)
-- Dependencies: 209
-- Data for Name: aikuinenvasa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.aikuinenvasa (ikaluokka) VALUES ('Aikuinen');
INSERT INTO public.aikuinenvasa (ikaluokka) VALUES ('Vasa');


--
-- TOC entry 3502 (class 0 OID 19179)
-- Dependencies: 210
-- Data for Name: elain; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.elain (elaimen_nimi) VALUES ('Hirvi');
INSERT INTO public.elain (elaimen_nimi) VALUES ('Valkohäntäpeura');


--
-- TOC entry 3503 (class 0 OID 19182)
-- Dependencies: 211
-- Data for Name: jakoryhma; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (1, 1, 'Ryhmä 1');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (2, 1, 'Ryhmä 2');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (3, 2, 'Ryhmä 3');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (4, 1, 'Ryhmä 4');
INSERT INTO public.jakoryhma (ryhma_id, seurue_id, ryhman_nimi) VALUES (6, 1, 'Testiryhmä');


--
-- TOC entry 3504 (class 0 OID 19185)
-- Dependencies: 212
-- Data for Name: jakotapahtuma; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jakotapahtuma (tapahtuma_id, paiva, ryhma_id, osnimitys, maara, kaato_id) VALUES (1, '2022-10-05', 1, 'Koko', 210, NULL);
INSERT INTO public.jakotapahtuma (tapahtuma_id, paiva, ryhma_id, osnimitys, maara, kaato_id) VALUES (2, '2022-10-02', 1, 'Puolikas', 75, NULL);
INSERT INTO public.jakotapahtuma (tapahtuma_id, paiva, ryhma_id, osnimitys, maara, kaato_id) VALUES (3, '2022-10-02', 2, 'Puolikas', 75, NULL);
INSERT INTO public.jakotapahtuma (tapahtuma_id, paiva, ryhma_id, osnimitys, maara, kaato_id) VALUES (4, '2022-11-30', 3, 'Koko', 100, 4);
INSERT INTO public.jakotapahtuma (tapahtuma_id, paiva, ryhma_id, osnimitys, maara, kaato_id) VALUES (5, '2022-12-05', 1, 'Koko', 100, 4);


--
-- TOC entry 3508 (class 0 OID 19202)
-- Dependencies: 216
-- Data for Name: jasen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (1, 'Janne', 'Jousi', 'Kotikatu 2', '21200', 'Raisio', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (2, 'Tauno', 'Tappara', 'Viertotie 5', '23100', 'Mynämäki', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (3, 'Kalle', 'Kaaripyssy', 'Isotie 144', '23100', 'Mynämäki', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (4, 'Heikki', 'Haulikko', 'Pikkutie 22', '23100', 'Mynämäki', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (5, 'Tauno', 'Tussari', 'Isotie 210', '23100', 'Mynämäki', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (6, 'Piia', 'Pyssy', 'Jokikatu 2', '23100', 'Mynämäki', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (7, 'Tiina', 'Talikko', 'Kirkkotie 7', '23100', 'Mynämäki', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (8, 'Bertil', 'Bössa', 'Hemväg 4', '20100', 'Åbo', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (9, 'Ville', 'Vesuri', 'Jokikatu 2', '23100', 'Mynämäki', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (10, 'Kurt', 'Kirves', 'Pohjanperkontie 122', '23101', 'Mynämäki', 'aktiivinen');
INSERT INTO public.jasen (jasen_id, etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila) VALUES (15, 'Kurt', 'Kalma', 'Isotie', 'Isotie 155', 'Mynämäki', 'poistunut');


--
-- TOC entry 3506 (class 0 OID 19193)
-- Dependencies: 214
-- Data for Name: jasenyys; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (1, 1, 1, '2022-01-01', NULL, 100);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (2, 1, 2, '2022-01-01', NULL, 100);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (3, 1, 3, '2022-01-01', NULL, 100);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (4, 2, 4, '2022-01-01', NULL, 100);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (6, 2, 6, '2022-01-01', NULL, 100);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (7, 3, 7, '2022-01-01', NULL, 100);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (8, 3, 8, '2022-01-01', NULL, 100);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (9, 3, 9, '2022-01-01', NULL, 50);
INSERT INTO public.jasenyys (jasenyys_id, ryhma_id, jasen_id, liittyi, poistui, osuus) VALUES (10, 6, 8, '2021-12-03', NULL, 50);


--
-- TOC entry 3511 (class 0 OID 19207)
-- Dependencies: 219
-- Data for Name: kaato; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kaato (kaato_id, jasen_id, kaatopaiva, ruhopaino, paikka_teksti, paikka_koordinaatti, kasittelyid, elaimen_nimi, sukupuoli, ikaluokka, lisatieto) VALUES (1, 5, '2022-09-28', 250, 'Takapellon eteläpää, Jyrkkälä', '61.58,21.54', 1, 'Hirvi', 'Uros', 'Aikuinen', NULL);
INSERT INTO public.kaato (kaato_id, jasen_id, kaatopaiva, ruhopaino, paikka_teksti, paikka_koordinaatti, kasittelyid, elaimen_nimi, sukupuoli, ikaluokka, lisatieto) VALUES (2, 6, '2022-09-28', 200, 'Takapellon eteläpää, Jyrkkälä', '61.58,21.54', 2, 'Hirvi', 'Naaras', 'Aikuinen', NULL);
INSERT INTO public.kaato (kaato_id, jasen_id, kaatopaiva, ruhopaino, paikka_teksti, paikka_koordinaatti, kasittelyid, elaimen_nimi, sukupuoli, ikaluokka, lisatieto) VALUES (3, 8, '2022-11-15', 100, 'Turku', NULL, 1, 'Hirvi', 'Uros', 'Aikuinen', 'lol');
INSERT INTO public.kaato (kaato_id, jasen_id, kaatopaiva, ruhopaino, paikka_teksti, paikka_koordinaatti, kasittelyid, elaimen_nimi, sukupuoli, ikaluokka, lisatieto) VALUES (4, 10, '2022-11-23', 180, 'Turku', NULL, 2, 'Hirvi', 'Uros', 'Aikuinen', 'Testi');
INSERT INTO public.kaato (kaato_id, jasen_id, kaatopaiva, ruhopaino, paikka_teksti, paikka_koordinaatti, kasittelyid, elaimen_nimi, sukupuoli, ikaluokka, lisatieto) VALUES (5, 8, '2022-12-07', 180, 'Jokula', NULL, 2, 'Hirvi', 'Uros', 'Aikuinen', '');
INSERT INTO public.kaato (kaato_id, jasen_id, kaatopaiva, ruhopaino, paikka_teksti, paikka_koordinaatti, kasittelyid, elaimen_nimi, sukupuoli, ikaluokka, lisatieto) VALUES (6, 5, '2022-12-07', 120, 'Joku', NULL, 2, 'Hirvi', 'Naaras', 'Aikuinen', '');


--
-- TOC entry 3513 (class 0 OID 19211)
-- Dependencies: 221
-- Data for Name: kasittely; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kasittely (kasittelyid, kasittely_teksti) VALUES (1, 'Seuralle');
INSERT INTO public.kasittely (kasittelyid, kasittely_teksti) VALUES (2, 'Seurueelle');
INSERT INTO public.kasittely (kasittelyid, kasittely_teksti) VALUES (3, 'Myyntiin');
INSERT INTO public.kasittely (kasittelyid, kasittely_teksti) VALUES (4, 'Hävitetään');


--
-- TOC entry 3515 (class 0 OID 19215)
-- Dependencies: 223
-- Data for Name: lupa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (1, 1, '2022', 'Hirvi', 'Uros', 'Aikuinen', 10);
INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (2, 1, '2022', 'Hirvi', 'Naaras', 'Aikuinen', 15);
INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (3, 1, '2022', 'Valkohäntäpeura', 'Uros', 'Aikuinen', 100);
INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (4, 1, '2022', 'Valkohäntäpeura', 'Naaras', 'Aikuinen', 200);
INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (5, 1, '2022', 'Hirvi', 'Ei määritelty', 'Vasa', 20);
INSERT INTO public.lupa (luparivi_id, seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES (6, 1, '2022', 'Valkohäntäpeura', 'Ei määritelty', 'Vasa', 300);


--
-- TOC entry 3517 (class 0 OID 19219)
-- Dependencies: 225
-- Data for Name: ruhonosa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ruhonosa (osnimitys) VALUES ('Koko');
INSERT INTO public.ruhonosa (osnimitys) VALUES ('Puolikas');
INSERT INTO public.ruhonosa (osnimitys) VALUES ('Neljännes');


--
-- TOC entry 3518 (class 0 OID 19226)
-- Dependencies: 226
-- Data for Name: seura; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seura (seura_id, seuran_nimi, jakeluosoite, postinumero, postitoimipaikka) VALUES (1, 'Punaiset hatut ja nenät', 'Keskuskatu 1', '23100', 'Mynämäki');


--
-- TOC entry 3520 (class 0 OID 19230)
-- Dependencies: 228
-- Data for Name: seurue; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.seurue (seurue_id, seura_id, seurueen_nimi, jasen_id) VALUES (1, 1, 'Seurue1', 6);
INSERT INTO public.seurue (seurue_id, seura_id, seurueen_nimi, jasen_id) VALUES (2, 1, 'Seurue2', 1);


--
-- TOC entry 3522 (class 0 OID 19234)
-- Dependencies: 230
-- Data for Name: sukupuoli; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sukupuoli (sukupuoli) VALUES ('Uros');
INSERT INTO public.sukupuoli (sukupuoli) VALUES ('Naaras');
INSERT INTO public.sukupuoli (sukupuoli) VALUES ('Ei määritelty');


--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 213
-- Name: jakoryhma_ryhma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakoryhma_ryhma_id_seq', 7, true);


--
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 215
-- Name: jakotapahtuma_tapahtuma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jakotapahtuma_tapahtuma_id_seq', 5, true);


--
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 217
-- Name: jasen_jasen_id_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jasen_jasen_id_seq_1', 15, true);


--
-- TOC entry 3596 (class 0 OID 0)
-- Dependencies: 218
-- Name: jasenyys_jasenyys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jasenyys_jasenyys_id_seq', 10, true);


--
-- TOC entry 3597 (class 0 OID 0)
-- Dependencies: 220
-- Name: kaato_kaato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kaato_kaato_id_seq', 6, true);


--
-- TOC entry 3598 (class 0 OID 0)
-- Dependencies: 222
-- Name: kasittely_kasittelyid_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kasittely_kasittelyid_seq_1', 4, true);


--
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 224
-- Name: lupa_luparivi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lupa_luparivi_id_seq', 6, true);


--
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 227
-- Name: seura_seura_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seura_seura_id_seq', 1, true);


--
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 229
-- Name: seurue_seurue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seurue_seurue_id_seq', 3, true);


--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 231
-- Name: testi_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.testi_seq', 1, false);


--
-- TOC entry 3303 (class 2606 OID 19248)
-- Name: aikuinenvasa aikuinenvasa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aikuinenvasa
    ADD CONSTRAINT aikuinenvasa_pk PRIMARY KEY (ikaluokka);


--
-- TOC entry 3305 (class 2606 OID 19250)
-- Name: elain elain_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elain
    ADD CONSTRAINT elain_pk PRIMARY KEY (elaimen_nimi);


--
-- TOC entry 3307 (class 2606 OID 19252)
-- Name: jakoryhma jakoryhma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT jakoryhma_pk PRIMARY KEY (ryhma_id);


--
-- TOC entry 3309 (class 2606 OID 19254)
-- Name: jakotapahtuma jakotapahtuma_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT jakotapahtuma_pk PRIMARY KEY (tapahtuma_id);


--
-- TOC entry 3313 (class 2606 OID 19256)
-- Name: jasen jasen_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasen
    ADD CONSTRAINT jasen_pk PRIMARY KEY (jasen_id);


--
-- TOC entry 3311 (class 2606 OID 19258)
-- Name: jasenyys jasenyys_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasenyys_pk PRIMARY KEY (jasenyys_id);


--
-- TOC entry 3315 (class 2606 OID 19260)
-- Name: kaato kaato_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT kaato_pk PRIMARY KEY (kaato_id);


--
-- TOC entry 3317 (class 2606 OID 19262)
-- Name: kasittely kasittely_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kasittely
    ADD CONSTRAINT kasittely_pk PRIMARY KEY (kasittelyid);


--
-- TOC entry 3319 (class 2606 OID 19264)
-- Name: lupa lupa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT lupa_pk PRIMARY KEY (luparivi_id);


--
-- TOC entry 3321 (class 2606 OID 19266)
-- Name: ruhonosa ruhonosa_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruhonosa
    ADD CONSTRAINT ruhonosa_pk PRIMARY KEY (osnimitys);


--
-- TOC entry 3323 (class 2606 OID 19268)
-- Name: seura seura_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seura
    ADD CONSTRAINT seura_pk PRIMARY KEY (seura_id);


--
-- TOC entry 3325 (class 2606 OID 19270)
-- Name: seurue seurue_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seurue_pk PRIMARY KEY (seurue_id);


--
-- TOC entry 3327 (class 2606 OID 19386)
-- Name: sukupuoli sukupuoli_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sukupuoli
    ADD CONSTRAINT sukupuoli_pk PRIMARY KEY (sukupuoli);


--
-- TOC entry 3334 (class 2606 OID 19273)
-- Name: kaato aikuinen_vasa_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT aikuinen_vasa_kaato_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3341 (class 2606 OID 19402)
-- Name: lupa aikuinen_vasa_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT aikuinen_vasa_lupa_fk FOREIGN KEY (ikaluokka) REFERENCES public.aikuinenvasa(ikaluokka);


--
-- TOC entry 3335 (class 2606 OID 19283)
-- Name: kaato elain_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT elain_kaato_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3339 (class 2606 OID 19288)
-- Name: lupa elain_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT elain_lupa_fk FOREIGN KEY (elaimen_nimi) REFERENCES public.elain(elaimen_nimi);


--
-- TOC entry 3332 (class 2606 OID 19293)
-- Name: jasenyys jasen_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT jasen_jasenyys_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3336 (class 2606 OID 19298)
-- Name: kaato jasen_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT jasen_kaato_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3343 (class 2606 OID 19303)
-- Name: seurue jasen_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT jasen_seurue_fk FOREIGN KEY (jasen_id) REFERENCES public.jasen(jasen_id);


--
-- TOC entry 3329 (class 2606 OID 19308)
-- Name: jakotapahtuma kaato_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT kaato_jakotapahtuma_fk FOREIGN KEY (kaato_id) REFERENCES public.kaato(kaato_id) NOT VALID;


--
-- TOC entry 3337 (class 2606 OID 19313)
-- Name: kaato kasittely_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT kasittely_kaato_fk FOREIGN KEY (kasittelyid) REFERENCES public.kasittely(kasittelyid);


--
-- TOC entry 3330 (class 2606 OID 19318)
-- Name: jakotapahtuma ruhonosa_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ruhonosa_jakotapahtuma_fk FOREIGN KEY (osnimitys) REFERENCES public.ruhonosa(osnimitys);


--
-- TOC entry 3331 (class 2606 OID 19323)
-- Name: jakotapahtuma ryhma_jakotapahtuma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakotapahtuma
    ADD CONSTRAINT ryhma_jakotapahtuma_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3333 (class 2606 OID 19328)
-- Name: jasenyys ryhma_jasenyys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jasenyys
    ADD CONSTRAINT ryhma_jasenyys_fk FOREIGN KEY (ryhma_id) REFERENCES public.jakoryhma(ryhma_id);


--
-- TOC entry 3340 (class 2606 OID 19333)
-- Name: lupa seura_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT seura_lupa_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3344 (class 2606 OID 19338)
-- Name: seurue seura_seurue_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seurue
    ADD CONSTRAINT seura_seurue_fk FOREIGN KEY (seura_id) REFERENCES public.seura(seura_id);


--
-- TOC entry 3328 (class 2606 OID 19343)
-- Name: jakoryhma seurue_ryhma_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jakoryhma
    ADD CONSTRAINT seurue_ryhma_fk FOREIGN KEY (seurue_id) REFERENCES public.seurue(seurue_id);


--
-- TOC entry 3338 (class 2606 OID 19416)
-- Name: kaato sukupuoli_kaato_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kaato
    ADD CONSTRAINT sukupuoli_kaato_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3342 (class 2606 OID 19411)
-- Name: lupa sukupuoli_lupa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lupa
    ADD CONSTRAINT sukupuoli_lupa_fk FOREIGN KEY (sukupuoli) REFERENCES public.sukupuoli(sukupuoli);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: application
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO application;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 250
-- Name: PROCEDURE add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON PROCEDURE public.add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying) FROM postgres;
GRANT ALL ON PROCEDURE public.add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying) TO postgres WITH GRANT OPTION;
GRANT ALL ON PROCEDURE public.add_jakoryhma(IN seurue_id integer, IN ryhman_nimi character varying) TO application;


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE jasen; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jasen FROM postgres;
GRANT ALL ON TABLE public.jasen TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jasen TO application;


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 249
-- Name: FUNCTION get_member(id integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.get_member(id integer) FROM postgres;
GRANT ALL ON FUNCTION public.get_member(id integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION public.get_member(id integer) TO application;


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE aikuinenvasa; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.aikuinenvasa FROM postgres;
GRANT ALL ON TABLE public.aikuinenvasa TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.aikuinenvasa TO application;


--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE aktiivijasenet; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.aktiivijasenet TO application;


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE elain; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.elain FROM postgres;
GRANT ALL ON TABLE public.elain TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.elain TO application;


--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE kaato; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.kaato FROM postgres;
GRANT ALL ON TABLE public.kaato TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.kaato TO application;


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE kasittely; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.kasittely FROM postgres;
GRANT ALL ON TABLE public.kasittely TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.kasittely TO application;


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE jaettavat_lihat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jaettavat_lihat TO application;


--
-- TOC entry 3545 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE jakoryhma; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jakoryhma FROM postgres;
GRANT ALL ON TABLE public.jakoryhma TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jakoryhma TO application;


--
-- TOC entry 3547 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE jakotapahtuma; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jakotapahtuma FROM postgres;
GRANT ALL ON TABLE public.jakotapahtuma TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jakotapahtuma TO application;


--
-- TOC entry 3548 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE jaetut_lihat; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jaetut_lihat FROM postgres;
GRANT ALL ON TABLE public.jaetut_lihat TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jaetut_lihat TO application;


--
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 213
-- Name: SEQUENCE jakoryhma_ryhma_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.jakoryhma_ryhma_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.jakoryhma_ryhma_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.jakoryhma_ryhma_id_seq TO application;


--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE jasenyys; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jasenyys FROM postgres;
GRANT ALL ON TABLE public.jasenyys TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jasenyys TO application;


--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE jakoryhma_yhteenveto; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.jakoryhma_yhteenveto FROM postgres;
GRANT ALL ON TABLE public.jakoryhma_yhteenveto TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.jakoryhma_yhteenveto TO application;


--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 215
-- Name: SEQUENCE jakotapahtuma_tapahtuma_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.jakotapahtuma_tapahtuma_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.jakotapahtuma_tapahtuma_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.jakotapahtuma_tapahtuma_id_seq TO application;


--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 217
-- Name: SEQUENCE jasen_jasen_id_seq_1; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.jasen_jasen_id_seq_1 FROM postgres;
GRANT ALL ON SEQUENCE public.jasen_jasen_id_seq_1 TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.jasen_jasen_id_seq_1 TO application;


--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 218
-- Name: SEQUENCE jasenyys_jasenyys_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.jasenyys_jasenyys_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.jasenyys_jasenyys_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.jasenyys_jasenyys_id_seq TO application;


--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 242
-- Name: TABLE jasenyys_nimella; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jasenyys_nimella TO application;


--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE kaadot_ampujittain; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.kaadot_ampujittain FROM postgres;
GRANT ALL ON TABLE public.kaadot_ampujittain TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.kaadot_ampujittain TO application;


--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 234
-- Name: TABLE kaadot_elaimittain; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.kaadot_elaimittain FROM postgres;
GRANT ALL ON TABLE public.kaadot_elaimittain TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.kaadot_elaimittain TO application;


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 220
-- Name: SEQUENCE kaato_kaato_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.kaato_kaato_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.kaato_kaato_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.kaato_kaato_id_seq TO application;


--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 222
-- Name: SEQUENCE kasittely_kasittelyid_seq_1; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.kasittely_kasittelyid_seq_1 FROM postgres;
GRANT ALL ON SEQUENCE public.kasittely_kasittelyid_seq_1 TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.kasittely_kasittelyid_seq_1 TO application;


--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE kaytto_ryhmille; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.kaytto_ryhmille TO application;


--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE lihan_kaytto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lihan_kaytto TO application;


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE lupa; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.lupa FROM postgres;
GRANT ALL ON TABLE public.lupa TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.lupa TO application;


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 224
-- Name: SEQUENCE lupa_luparivi_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.lupa_luparivi_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.lupa_luparivi_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.lupa_luparivi_id_seq TO application;


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE luvat_kayttamatta_kpl; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.luvat_kayttamatta_kpl FROM postgres;
GRANT ALL ON TABLE public.luvat_kayttamatta_kpl TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.luvat_kayttamatta_kpl TO application;


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE luvat_kayttamatta_pros; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.luvat_kayttamatta_pros FROM postgres;
GRANT ALL ON TABLE public.luvat_kayttamatta_pros TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.luvat_kayttamatta_pros TO application;


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE ruhonosa; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.ruhonosa FROM postgres;
GRANT ALL ON TABLE public.ruhonosa TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.ruhonosa TO application;


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE ryhmien_osuudet; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.ryhmien_osuudet FROM postgres;
GRANT ALL ON TABLE public.ryhmien_osuudet TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.ryhmien_osuudet TO application;


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE sankey_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sankey_data TO application;


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE seura; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.seura FROM postgres;
GRANT ALL ON TABLE public.seura TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.seura TO application;


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 227
-- Name: SEQUENCE seura_seura_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.seura_seura_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.seura_seura_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.seura_seura_id_seq TO application;


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE seurue; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.seurue FROM postgres;
GRANT ALL ON TABLE public.seurue TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.seurue TO application;


--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 229
-- Name: SEQUENCE seurue_seurue_id_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.seurue_seurue_id_seq FROM postgres;
GRANT ALL ON SEQUENCE public.seurue_seurue_id_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.seurue_seurue_id_seq TO application;


--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE simple_sankey; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.simple_sankey TO application;


--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE sukupuoli; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE public.sukupuoli FROM postgres;
GRANT ALL ON TABLE public.sukupuoli TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE public.sukupuoli TO application;


--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 231
-- Name: SEQUENCE testi_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.testi_seq FROM postgres;
GRANT ALL ON SEQUENCE public.testi_seq TO postgres WITH GRANT OPTION;
GRANT ALL ON SEQUENCE public.testi_seq TO application;


-- Completed on 2022-12-14 13:12:31

--
-- PostgreSQL database dump complete
--


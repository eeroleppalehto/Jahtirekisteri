-- Table: public.kayttaja

-- DROP TABLE IF EXISTS public.kayttaja;

CREATE TABLE IF NOT EXISTS public.kayttaja
(
    kayttaja_id integer NOT NULL DEFAULT nextval('kayttaja_kayttaja_id_seq'::regclass),
    kayttajatunnus character varying(32) COLLATE pg_catalog."default" NOT NULL,
    jasen_id integer NOT NULL,
    salasana_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    sahkoposti character varying(64) COLLATE pg_catalog."default",
    roolin_nimi character varying(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT kayttaja_pkey PRIMARY KEY (kayttaja_id),
    CONSTRAINT kayttaja_kayttajatunnus_key UNIQUE (kayttajatunnus),
    CONSTRAINT jasen_kayttaja_fk FOREIGN KEY (jasen_id)
        REFERENCES public.jasen (jasen_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT kayttaja_rooli_fk FOREIGN KEY (roolin_nimi)
        REFERENCES public.rooli (roolin_nimi) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.kayttaja
    OWNER to postgres;
-- Alter table jasen so details are not required and add phone number. Additionally make tila required.

ALTER TABLE IF EXISTS public.jasen
    ALTER COLUMN jakeluosoite DROP NOT NULL;

ALTER TABLE IF EXISTS public.jasen
    ALTER COLUMN postinumero DROP NOT NULL;

ALTER TABLE IF EXISTS public.jasen
    ALTER COLUMN postitoimipaikka DROP NOT NULL;

ALTER TABLE IF EXISTS public.jasen
    ALTER COLUMN tila SET NOT NULL;

ALTER TABLE IF EXISTS public.jasen
    ADD COLUMN puhelinnumero character varying(15);
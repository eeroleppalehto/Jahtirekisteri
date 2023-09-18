-- Update kaadon_kasittely table to cascade delete kaato ie. if kaato is deleted, kaadon_kasittely with same kaato_id is deleted as well

ALTER TABLE public.kaadon_kasittely
DROP CONSTRAINT kaato_kaadon_kasittely_fk,
ADD CONSTRAINT kaato_kaadon_kasittely_fk
    FOREIGN KEY (kaato_id)
    REFERENCES public.kaato(kaato_id)
    ON DELETE CASCADE;
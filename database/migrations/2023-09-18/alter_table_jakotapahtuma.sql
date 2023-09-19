-- Update jakotapahtuma table to cascade delete kaadon_kasittely ie. if kaadon_kasittely is deleted, jakotapahtuma with same kaadon_kasittely_id is deleted as well

ALTER TABLE public.jakotapahtuma
DROP CONSTRAINT kaadon_kasittely_jakotapahtuma_fk,
ADD CONSTRAINT kaadon_kasittely_jakotapahtuma_fk
    FOREIGN KEY (kaadon_kasittely_id)
    REFERENCES public.kaadon_kasittely(kaadon_kasittely_id)
    ON DELETE CASCADE;
-- Add column osnimitys_suhdeluku to table ruhonosa for giving a numeric value to osnimitys

ALTER TABLE IF EXISTS public.ruhonosa
    ADD COLUMN osnimitys_suhdeluku real;

-- Assign osnimitys_suhdeluku values to the rows
UPDATE public.ruhonosa SET osnimitys_suhdeluku = 1 WHERE osnimitys = 'Koko';
UPDATE public.ruhonosa SET osnimitys_suhdeluku = 0.5 WHERE osnimitys = 'Puolikas';
UPDATE public.ruhonosa SET osnimitys_suhdeluku = 0.25 WHERE osnimitys = 'Neljännes';
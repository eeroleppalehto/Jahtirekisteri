CREATE TABLE rooli (
    roolin_nimi VARCHAR(32) PRIMARY KEY
);

INSERT INTO rooli (roolin_nimi) VALUES ('pääkäyttäjä');
INSERT INTO rooli (roolin_nimi) VALUES ('muokkaus');
INSERT INTO rooli (roolin_nimi) VALUES ('lisäys');
INSERT INTO rooli (roolin_nimi) VALUES ('luku');
INSERT INTO rooli (roolin_nimi) VALUES ('ei oikeuksia');

ALTER TABLE kayttaja
    ADD COLUMN roolin_nimi VARCHAR(32);

ALTER TABLE kayttaja
    ADD CONSTRAINT kayttaja_rooli_fk FOREIGN KEY (roolin_nimi) 
    REFERENCES rooli (roolin_nimi);


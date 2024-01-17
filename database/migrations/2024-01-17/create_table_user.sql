CREATE TABLE kayttaja (
 kayttaja_id  INT PRIMARY KEY,
 kayttajatunnus VARCHAR(32) UNIQUE NOT NULL,
 salasana_hash VARCHAR(255) NOT NULL,
 sahkoposti   VARCHAR(64)
);

ALTER TABLE kayttaja
ADD CONSTRAINT jasen_kayttaja_fk FOREIGN KEY(kayttaja_id)
 REFERENCES jasen(jasen_id);
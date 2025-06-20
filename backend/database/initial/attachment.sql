CREATE TABLE PUBLIC.ATTACHMENT (
    ID INTEGER PRIMARY KEY,
    NAME VARCHAR(20) NOT NULL,
    CONTENT BYTEA NOT NULL,
    FILE_TYPE VARCHAR(15) NOT NULL
);

-- Explanations:
-- Only one of DIRECT_MESSAGE_ID and GROUP_MESSAGE_ID can be null.
-- Since an attachment can only belong to one message.


CREATE TABLE PUBLIC.ATTACHMENT_MESSAGE (

    ATTACHMENT_ID INTEGER NOT NULL,
    DIRECT_MESSAGE_ID INTEGER,
    GROUP_MESSAGE_ID INTEGER,
    CONSTRAINT ATTACHMENT_MESSAGE_ATTACHMENT_ID FOREIGN KEY (ATTACHMENT_ID) REFERENCES PUBLIC.ATTACHMENT(ID),
    CONSTRAINT ATTACHMENT_MESSAGE_DIRECT_MESSAGE_ID FOREIGN KEY (DIRECT_MESSAGE_ID) REFERENCES PUBLIC.MESSAGE(ID),
    CONSTRAINT ATTACHMENT_MESSAGE_GROUP_MESSAGE_ID FOREIGN KEY (GROUP_MESSAGE_ID) REFERENCES PUBLIC.GROUP_MESSAGE(ID),
    CONSTRAINT CHK_ATTACHMENT_MESSAGE_MESSAGE_ID CHECK (
        (DIRECT_MESSAGE_ID IS NOT NULL AND GROUP_MESSAGE_ID IS NULL) 
            OR (DIRECT_MESSAGE_ID IS NULL AND GROUP_MESSAGE_ID IS NOT NULL)
    ),
    UNIQUE(ATTACHMENT_ID)
);

CREATE SEQUENCE PUBLIC.ATTACHMENT_ID_SEQ AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY PUBLIC.ATTACHMENT 
    ALTER COLUMN ID 
    SET DEFAULT NEXTVAL('PUBLIC.ATTACHMENT_ID_SEQ'::regclass);

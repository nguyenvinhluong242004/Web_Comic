-- Xóa bảng nếu đã tồn tại
DROP TABLE IF EXISTS ComicFavor;
DROP TABLE IF EXISTS CommentComic;
DROP TABLE IF EXISTS LevelUser;
DROP TABLE IF EXISTS NameLevel;
DROP TABLE IF EXISTS Users;


-- Tạo bảng Users
CREATE TABLE Users (
    ID_User SERIAL PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Username VARCHAR(100) NOT NULL,
    Password VARCHAR(255),
    GoogleID VARCHAR(255),
    Type VARCHAR(50)
);

-- Tạo bảng NameLevel
CREATE TABLE NameLevel (
    ID_NameLevel SERIAL PRIMARY KEY,
    Type VARCHAR(100) NOT NULL,
    Level INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
	CONSTRAINT unique_level_type UNIQUE (Level, Type)
);

-- Tạo bảng LevelUser
CREATE TABLE LevelUser (
    ID_Level SERIAL PRIMARY KEY,
    ID_User INT NOT NULL,
    Total_Chaps INT NOT NULL CHECK (Total_Chaps >= 0),
    Level INT NOT NULL,
    Type VARCHAR(100) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (ID_User) REFERENCES Users(ID_User),
    CONSTRAINT fk_name_level FOREIGN KEY (Level, Type) REFERENCES NameLevel(Level, Type),
    CONSTRAINT check_level CHECK (
        (Total_Chaps < 100 AND Level = 1) OR
        (Total_Chaps BETWEEN 100 AND 999 AND Level = 2) OR
        (Total_Chaps BETWEEN 1000 AND 9999 AND Level = 3) OR
        (Total_Chaps BETWEEN 10000 AND 99999 AND Level = 4) OR
        (Total_Chaps BETWEEN 100000 AND 999999 AND Level = 5) OR
        (Total_Chaps >= 1000000 AND Level = 6)
    )
);

-- Tạo bảng CommentComic
CREATE TABLE CommentComic (
    ID_Cmt SERIAL PRIMARY KEY,
    ID_User INT NOT NULL,
    ID_Truyen TEXT NOT NULL,
    ID_Chapter TEXT,
    Content TEXT NOT NULL,
    Total_Favor INT,
    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    ID_User_Respond INT,
    CONSTRAINT fk_user_comment FOREIGN KEY (ID_User) REFERENCES Users(ID_User),
    CONSTRAINT fk_user_respond FOREIGN KEY (ID_User_Respond) REFERENCES Users(ID_User)
);

-- Tạo bảng ComicFavor
CREATE TABLE ComicFavor (
    ID_Favor SERIAL PRIMARY KEY,
    ID_User INT NOT NULL,
    ID_Truyen TEXT NOT NULL,
    Ten_Truyen TEXT NOT NULL,
    CONSTRAINT fk_user_favor FOREIGN KEY (ID_User) REFERENCES Users(ID_User)
);

CREATE OR REPLACE FUNCTION update_level_based_on_chaps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.Level := CASE
        WHEN NEW.Total_Chaps < 100 THEN 1
        WHEN NEW.Total_Chaps BETWEEN 100 AND 999 THEN 2
        WHEN NEW.Total_Chaps BETWEEN 1000 AND 9999 THEN 3
        WHEN NEW.Total_Chaps BETWEEN 10000 AND 99999 THEN 4
        WHEN NEW.Total_Chaps BETWEEN 100000 AND 999999 THEN 5
        ELSE 6
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_level
BEFORE INSERT OR UPDATE ON LevelUser
FOR EACH ROW
EXECUTE FUNCTION update_level_based_on_chaps();


-- Thêm dữ liệu vào bảng NameLevel
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 1, 'Luyện Khí Kỳ');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 2, 'Trúc Cơ');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 3, 'Kim Đan');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 4, 'Nguyên Anh');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 5, 'Hóa Thần');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 6, 'Luyện Hư');

INSERT INTO NameLevel (Type, Level, Name) VALUES ('Vũ trụ', 1, 'Hành Tinh');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Vũ trụ', 2, 'Hằng Tinh');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Vũ trụ', 3, 'Vũ Trụ');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Vũ trụ', 4, 'Vực Chủ');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Vũ trụ', 5, 'Giới Chủ');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Vũ trụ', 6, 'Bất Hủ');

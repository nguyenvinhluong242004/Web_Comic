-- Xóa bảng nếu đã tồn tại
DROP TABLE IF EXISTS ComicFavor;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS NameLevel;
DROP TABLE IF EXISTS LevelUser;
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
    Type VARCHAR(50) NOT NULL,
    Level INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
	CONSTRAINT unique_level_type UNIQUE (Level, Type)
);

-- Tạo bảng LevelUser
CREATE TABLE LevelUser (
    ID_Level SERIAL PRIMARY KEY,
    ID_User INT NOT NULL,
    Total_Chaps INT,
    Level INT NOT NULL,
    Type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (ID_User) REFERENCES Users(ID_User),
    CONSTRAINT fk_name_level FOREIGN KEY (Level, Type) REFERENCES NameLevel(Level, Type)
);

-- Tạo bảng Comment
CREATE TABLE Comment (
    ID_Cmt SERIAL PRIMARY KEY,
    ID_User INT NOT NULL,
    Content TEXT NOT NULL,
    Total_Favor INT,
    ID_User_Respond INT,
    CONSTRAINT fk_user_comment FOREIGN KEY (ID_User) REFERENCES Users(ID_User),
    CONSTRAINT fk_user_respond FOREIGN KEY (ID_User_Respond) REFERENCES Users(ID_User)
);

-- Tạo bảng ComicFavor
CREATE TABLE ComicFavor (
    ID_Favor SERIAL PRIMARY KEY,
    ID_User INT NOT NULL,
    ID_Truyen VARCHAR(50) NOT NULL,
    CONSTRAINT fk_user_favor FOREIGN KEY (ID_User) REFERENCES Users(ID_User)
);


-- Thêm dữ liệu vào bảng NameLevel
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 1, 'Luyện Khí Kỳ');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 2, 'Trúc Cơ');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 3, 'Kim Đan');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 4, 'Nguyên Anh');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 5, 'Hóa Thần');
INSERT INTO NameLevel (Type, Level, Name) VALUES ('Tu tiên', 6, 'Luyện Hư');

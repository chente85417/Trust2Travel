DROP DATABASE IF EXISTS trust2traveldb;
CREATE DATABASE IF NOT EXISTS trust2traveldb;
USE trust2traveldb;

CREATE TABLE IF NOT EXISTS usuarios (
	USRID int NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 2^32 usuarios',
    EMAIL varchar(255) NOT NULL COMMENT 'Nombre de usuario basado en email. Obligatorio',
    FECHAREGISTRO datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de registro del usuario. Puede usarse para comprobar la antigüedad del usuario',
    FECHANACIMIENTO date COMMENT 'Fecha de nacimiento del usuario sin hora. Puede emplearse para conocer su edad',
    GENERO enum('masculino', 'femenino', 'otro'),
    CONFIRMACIONREGISTRO varchar(128) COMMENT 'Hash de confirmación de operación de registro de nuevo usuario',
    ONBOARDING tinyint NOT NULL DEFAULT '1' COMMENT 'Flag para determinar si se presentará el onboarding al usuario en su próximo acceso',
    PENDINGRESETPASS varchar(128) COMMENT 'Flag para determinar si el usuario está pendiente de realizar un cambio de contraseña',
    PRIMARY KEY(USRID)
) COMMENT 'Tabla que almacena los usuarios registrado';

CREATE TABLE IF NOT EXISTS perfiles (
	EXT_USRID int NOT NULL COMMENT 'Clave externa correspondiente a la clave primaria de la tabla de usuarios',
    PERFIL enum('registrado', 'oauth') COMMENT 'Se asignan dos perfiles, uno para los usuarios registrados y otro para los que acceden mediante OAuth',
    PASS varchar(128) COMMENT 'Contraseña como cadena encriptada en backend para los perfiles registrados',
    PRIMARY KEY(EXT_USRID, PERFIL),
    FOREIGN KEY (EXT_USRID)
        REFERENCES usuarios(USRID)
        ON DELETE CASCADE
) COMMENT 'Tabla de los perfiles de los usuarios tanto registrados como de OAuth';

CREATE TABLE IF NOT EXISTS alojamientos (
	ALID int NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 2^32 establecimientos',
    LICENCIA varchar(50) COMMENT 'Número de licencia del establecimiento. Opcional',
    NOMBRE varchar(1024) NOT NULL COMMENT 'Nombre del establecimiento. Obligatorio',
    LONGITUD float NOT NULL COMMENT 'Coordenada longitud del establecimiento. Obligatorio',
    LATITUD float NOT NULL COMMENT 'Coordenada latitud del establecimiento. Obligatorio',
    DIRECCION varchar(1024) NOT NULL COMMENT 'Dirección del establecimiento. Obligatorio',
    LOCALIDAD varchar(128) COMMENT 'Localidad o entorno de localización del establecimiento. Opcional',
    PROVINCIA varchar(50) COMMENT 'Provincia del establecimiento. Opcional',
    COMUNIDAD varchar(50) COMMENT 'Comunidad autónoma o región del establecimiento. Opcional',
    PAIS varchar(50) COMMENT 'País del establecimiento. Opcional',
    TELEFONO longtext COMMENT 'Teléfonos de contacto del establecimiento en formato JSON. Opcional',
    WEBSITE varchar(1024) COMMENT 'Url del sitio web del establecimiento. Opcional',
    EMAIL varchar(255) COMMENT 'Dirección de email de contacto del establecimiento. Opcional',
    LOGO varchar(1024) COMMENT 'Ruta al archivo del logo del establecimiento en el servidor. Opcional',
    PRIMARY KEY(ALID)
) COMMENT 'Tabla que almacena los establecimientos localizados por la aplicación';

CREATE TABLE IF NOT EXISTS certificados (
	CERTID smallint NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 65535 certificados',
    NOMBRE varchar(128) NOT NULL COMMENT 'Nombre del certificado. Obligatorio',
    WEBSITE varchar(255) COMMENT 'Url del sitio web de la entidad certificadora. Opcional',
    DESCRIPCION text COMMENT 'Texto descriptivo de las características del certificado. Opcional',
    ORGANISMO varchar(255) COMMENT 'Nombre del organismo o entidad certificadora. Obligatorio',
    SECTOR varchar(50) COMMENT 'Sector al que aplica el certificado. Opcional',
    LOGO varchar(255) COMMENT 'Ruta al archivo del logo del certificado en el servidor. Opcional',
    PRIMARY KEY(CERTID)
) COMMENT 'Tabla que almacena los certificados de los que se hace seguimiento en la aplicación';

CREATE TABLE IF NOT EXISTS favoritos (
	EXT_USRID int NOT NULL COMMENT 'Clave del usuario. Obligatorio',
    EXT_ALID int NOT NULL COMMENT 'Clave del establecimiento seleccionado como favorito por el usuario. Obligatorio',
    PRIMARY KEY(EXT_USRID, EXT_ALID),
    FOREIGN KEY (EXT_USRID)
        REFERENCES usuarios(USRID)
        ON DELETE CASCADE,
	FOREIGN KEY (EXT_ALID)
        REFERENCES alojamientos(ALID)
        ON DELETE CASCADE
) COMMENT 'Tabla que almacena las asignaciones de alojamientos como favoritos para los usuarios';

CREATE TABLE IF NOT EXISTS union_alojamientos_certificados (
	EXT_ALID int NOT NULL COMMENT 'Clave del establecimiento. Obligatorio',
    EXT_CERTID smallint NOT NULL COMMENT 'Clave del certificado asignado al establecimiento. Obligatorio',
    PRIMARY KEY(EXT_ALID, EXT_CERTID),
    FOREIGN KEY (EXT_ALID)
        REFERENCES alojamientos(ALID)
        ON DELETE CASCADE,
	FOREIGN KEY (EXT_CERTID)
        REFERENCES certificados(CERTID)
        ON DELETE CASCADE
) COMMENT 'Tabla que almacena las asignaciones de certificados a los alojamientos';

CREATE TABLE IF NOT EXISTS tags (
	TAGID smallint NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 65535 tags',
    NOMBRE varchar(128) NOT NULL COMMENT 'Nombre del tag de búsqueda. Obligatorio',
    PRIMARY KEY(TAGID)
) COMMENT 'Tabla que almacena los tags o keywords para búsquedas';

CREATE TABLE IF NOT EXISTS union_alojamientos_tags (
	EXT_ALID int NOT NULL COMMENT 'Clave del establecimiento. Obligatorio',
    EXT_TAGID smallint NOT NULL COMMENT 'Clave del tag asignado al establecimiento. Obligatorio',
    PRIMARY KEY(EXT_ALID, EXT_TAGID),
    FOREIGN KEY (EXT_ALID)
        REFERENCES alojamientos(ALID)
        ON DELETE CASCADE,
	FOREIGN KEY (EXT_TAGID)
        REFERENCES tags(TAGID)
        ON DELETE CASCADE
) COMMENT 'Tabla que almacena las asignaciones de tags a los alojamientos';

CREATE TABLE IF NOT EXISTS actividades (
	ACTID smallint NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 65535 actividades',
    NOMBRE varchar(128) NOT NULL COMMENT 'Nombre de la actividad. Obligatorio',
    LONGITUD float NOT NULL COMMENT 'Coordenada longitud de la actividad. Obligatorio',
    LATITUD float NOT NULL COMMENT 'Coordenada latitud de la actividad. Obligatorio',
    EXT_TAGID smallint NOT NULL COMMENT 'Clave externa de la tabla de tags para relacionar la actividad con su tag',
    PRIMARY KEY(ACTID),
    FOREIGN KEY (EXT_TAGID)
		REFERENCES tags(TAGID)
        ON DELETE CASCADE
) COMMENT 'Tabla que almacena las actividades disponibles';

CREATE TABLE IF NOT EXISTS categorias (
	CATID smallint NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 65535 categorías',
    NOMBRE varchar(128) NOT NULL COMMENT 'Nombre de la categoría de búsqueda. Obligatorio',
    PRIMARY KEY(CATID)
) COMMENT 'Tabla que almacena las categorías para búsquedas';

CREATE TABLE IF NOT EXISTS union_certificados_categorias (
	EXT_CERTID smallint NOT NULL COMMENT 'Clave del certificado. Obligatorio',
    EXT_CATID smallint NOT NULL COMMENT 'Clave de la categoría a la que pertenece el certificado. Obligatorio',
    PRIMARY KEY(EXT_CERTID, EXT_CATID),
    FOREIGN KEY (EXT_CERTID)
        REFERENCES certificados(CERTID)
        ON DELETE CASCADE,
	FOREIGN KEY (EXT_CATID)
        REFERENCES categorias(CATID)
        ON DELETE CASCADE
) COMMENT 'Tabla que almacena las asignaciones de categorías a los certificados';

CREATE TABLE IF NOT EXISTS union_establecimientos_imagenes (
	EXT_ALID int NOT NULL COMMENT 'Clave del establecimiento. Obligatorio',
    RUTA varchar(255) NOT NULL COMMENT 'Ruta al archivo de la imagen asociada al establecimiento. Obligatorio',
    PRIMARY KEY(EXT_ALID, RUTA),
    FOREIGN KEY (EXT_ALID)
        REFERENCES alojamientos(ALID)
        ON DELETE CASCADE
) COMMENT 'Tabla que almacena las asignaciones de imágenes a los establecimientos';

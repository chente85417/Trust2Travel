DROP DATABASE IF EXISTS trust2traveldb;
CREATE DATABASE IF NOT EXISTS trust2traveldb;
USE trust2traveldb;

CREATE TABLE IF NOT EXISTS usuarios (
	USRID int NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 2^32 usuarios',
    EMAIL varchar(255) NOT NULL COMMENT 'Nombre de usuario basado en email. Obligatorio',
    PASS varchar(128) NOT NULL COMMENT 'Contraseña como cadena encriptada en backend. Obligatorio',
    FECHAREGISTRO datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de registro del usuario. Puede usarse para comprobar la antigüedad del usuario',
    FECHANACIMIENTO date COMMENT 'Fecha de nacimiento del usuario sin hora. Puede emplearse para conocer su edad',
    GENERO enum('Hombre', 'Mujer', 'Otro'),
    PRIMARY KEY(USRID)
) COMMENT 'Tabla que almacena los usuarios registrado';

CREATE TABLE IF NOT EXISTS alojamientos (
	ALID int NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 2^32 establecimientos',
    LICENCIA varchar(50) COMMENT 'Número de licencia del establecimiento. Opcional',
    NOMBRE varchar(128) NOT NULL COMMENT 'Nombre del establecimiento. Obligatorio',
    LONGITUD float NOT NULL COMMENT 'Coordenada longitud del establecimiento. Obligatorio',
    LATITUD float NOT NULL COMMENT 'Coordenada latitud del establecimiento. Obligatorio',
    DIRECCION varchar(255) NOT NULL COMMENT 'Dirección del establecimiento. Obligatorio',
    LOCALIDAD varchar(128) COMMENT 'Localidad o entorno de localización del establecimiento. Opcional',
    PROVINCIA varchar(50) COMMENT 'Provincia del establecimiento. Opcional',
    COMUNIDAD varchar(50) COMMENT 'Comunidad autónoma o región del establecimiento. Opcional',
    PAIS varchar(50) COMMENT 'País del establecimiento. Opcional',
    TELEFONO longtext COMMENT 'Teléfonos de contacto del establecimiento en formato JSON. Opcional',
    WEBSITE varchar(255) COMMENT 'Url del sitio web del establecimiento. Opcional',
    EMAIL varchar(255) COMMENT 'Dirección de email de contacto del establecimiento. Opcional',
    LOGO varchar(255) COMMENT 'Ruta al archivo del logo del establecimiento en el servidor. Opcional',
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

CREATE TABLE IF NOT EXISTS actividades (
	ACTID smallint NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 65535 actividades',
    NOMBRE varchar(128) NOT NULL COMMENT 'Nombre de la actividad. Obligatorio',
    PRIMARY KEY(ACTID)
) COMMENT 'Tabla que almacena las actividades disponibles';

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

CREATE TABLE IF NOT EXISTS imagenes (
	IMGID smallint NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 65535 imágenes',
    NOMBRE varchar(255) NOT NULL COMMENT 'Ruta al archivo de la imagen asociada al establecimiento en el servidor. Obligatorio',
    PRIMARY KEY(IMGID)
) COMMENT 'Tabla que almacena las rutas de las imágenes asociadas a los establecimientos';

CREATE TABLE IF NOT EXISTS union_establecimientos_imagenes (
	EXT_ALID int NOT NULL COMMENT 'Clave del establecimiento. Obligatorio',
    EXT_IMGID smallint NOT NULL COMMENT 'Clave de la imagen asociada al establecimiento. Obligatorio',
    PRIMARY KEY(EXT_ALID, EXT_IMGID),
    FOREIGN KEY (EXT_ALID)
        REFERENCES alojamientos(ALID)
        ON DELETE CASCADE,
	FOREIGN KEY (EXT_IMGID)
        REFERENCES imagenes(IMGID)
        ON DELETE CASCADE
) COMMENT 'Tabla que almacena las asignaciones de imágenes a los establecimientos';

CREATE TABLE IF NOT EXISTS targets (
	TARID smallint NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla. Acepta hasta 65535 targets',
    NOMBRE varchar(255) NOT NULL COMMENT 'Nombre del target al que va dirigido el certificado. Obligatorio',
    PRIMARY KEY(TARID)
) COMMENT 'Tabla que almacena los targets a los que pueden ir asignados certificados';

CREATE TABLE IF NOT EXISTS union_certificados_targets (
	EXT_CERTID smallint NOT NULL COMMENT 'Clave del certificado. Obligatorio',
    EXT_TARID smallint NOT NULL COMMENT 'Clave del tipo de target. Obligatorio',
    PRIMARY KEY(EXT_CERTID, EXT_TARID),
    FOREIGN KEY (EXT_CERTID)
        REFERENCES certificados(CERTID)
        ON DELETE CASCADE,
	FOREIGN KEY (EXT_TARID)
        REFERENCES targets(TARID)
        ON DELETE CASCADE
) COMMENT 'Tabla que almacena las asignaciones de tipos de targets a los certificados';
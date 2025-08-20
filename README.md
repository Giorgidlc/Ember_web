# WordPress wp-content Repository

Este repositorio contiene únicamente la carpeta `wp-content` de una instalación de WordPress para el proyecto Ember Web.

## Contenido incluido

- **Themes**: Tema de WordPress (twentytwentyfive)
- **Plugins**: Plugins instalados (Akismet, Hello Dolly)
- **Must-Use Plugins**: Plugin de integración con SQLite
- **Languages**: Archivos de traducción al español
- **Database**: Base de datos SQLite (si aplica)

## Estructura del repositorio

```
wp-content/
├── database/           # Base de datos SQLite
├── languages/          # Traducciones
├── mu-plugins/         # Must-use plugins
├── plugins/            # Plugins estándar
└── themes/             # Temas de WordPress
```

## Uso

Para sincronizar con tu instalación de WordPress:

1. Clona este repositorio
2. Copia el contenido de `wp-content/` a tu instalación de WordPress
3. Configura los permisos apropiados en el servidor

## Notas importantes

- Este repositorio excluye los archivos principales de WordPress (wp-admin, wp-includes, etc.)
- Solo se incluye el contenido personalizable de WordPress
- Los archivos de cache y logs temporales están excluidos del control de versiones

<?php
/**
 * Plugin Name: REST Menús públicos
 * Author: Giorgi Visual
 * Version: 1.0
 */

add_action('rest_api_init', function () {
    /**
     * Registramos una ruta dinámica.
     * La parte '(?P<slug>[a-zA-Z0-9-]+)' crea un parámetro llamado 'slug'
     * que acepta letras, números y guiones (lo habitual en un slug).
     */
    register_rest_route('wp/v2', '/menu-public/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => function($request) {
            
            // 1. Obtenemos el slug del menú DESDE la URL
            $menu_slug = $request->get_param('slug');

            if (empty($menu_slug)) {
                 // Por si acaso, aunque la ruta lo requiere
                return new WP_Error( 'no_slug', 'No se especificó un slug de menú', [ 'status' => 400 ] );
            }

            // 2. Usamos ese slug dinámico para llamar a la función
            $items = wp_get_nav_menu_items($menu_slug);

            if (!$items) {
                // Es buena práctica devolver un error 404 si no se encuentra
                return new WP_Error( 'no_menu', 'Menú no encontrado con ese slug', [ 'status' => 404 ] );
            }

            // 3. Transformamos los items (tu código original, que está perfecto)
            return array_map(function($item) {
                return [
                    'title' => $item->title,
                    'url'   => $item->url,
                ];
            }, $items);
        },
        // Sigue siendo público, como querías
        'permission_callback' => '__return_true', 
    ]);
});
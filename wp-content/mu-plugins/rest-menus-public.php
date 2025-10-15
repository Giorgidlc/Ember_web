<?php
/**
 * Plugin Name: REST Menús públicos
 * Author: Giorgi Visual
 * Version: 1.0
 */

/* add_filter( 'rest_authentication_errors', function( $result ) { 

    if ( strpos( $_SERVER['REQUEST_URI'], 
        '/wp-json/wp/v2/menu-items' ) === 0 || 
        strpos( $_SERVER['REQUEST_URI'], '/wp-json/wp/v2/menus' ) === 0 ) { 
        return true;
    } 
        return $result; 
}, 20 );
 */


// 1️⃣ Opción previa con rest_authentication_errors (puedes dejarla o eliminarla)
/* add_filter('rest_authentication_errors', function ($result) {
    $prefix = rest_get_url_prefix();
    $request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if ($_SERVER['REQUEST_METHOD'] === 'GET' &&
        strpos($request_uri, "/$prefix/wp/v2/menu-items") === 0
    ) {
        return null; // request público
    }

    return $result;
}, 20);

 */
// 2️⃣ Sobrescribir permission_callback de /wp/v2/menu-items
/* add_action('rest_api_init', function () {

    // Obtenemos todas las rutas registradas
    $routes = rest_get_server()->get_routes();

    if (isset($routes['/wp/v2/menu-items'])) {

        foreach ($routes['/wp/v2/menu-items'] as $i => $route) {

            // Sobrescribimos el permission_callback para permitir GET público
            $original_callback = $route['callback'] ?? null;

            $routes['/wp/v2/menu-items'][$i]['permission_callback'] = function($request) use ($original_callback) {

                // Solo permitir GET
                if ($request->get_method() !== 'GET') {
                    return new WP_Error(
                        'rest_cannot_view',
                        __('Método no permitido.'),
                        ['status' => 405]
                    );
                }

                // Permitir acceso público al endpoint
                return true;
            };

        }
    }
}); */


add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/menu-items-public', [
        'methods' => 'GET',
        'callback' => function($request) {
            $menu_name = 'main-menu'; // Cambia por el slug de tu menú
            $items = wp_get_nav_menu_items($menu_name);

            if (!$items) {
                return [];
            }

            // Transformamos los items a formato simple
            return array_map(function($item) {
                return [
                    'title' => $item->title,
                    'url'   => $item->url,
                ];
            }, $items);
        },
        'permission_callback' => '__return_true', // público
    ]);
});

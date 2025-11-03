<?php
/**
 * Plugin Name: REST Menús públicos
 * Author: Giorgi Visual
 * Version: 1.0
 */

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

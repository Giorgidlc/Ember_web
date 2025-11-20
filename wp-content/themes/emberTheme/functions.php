<?php

function disable_wp_frontend() {
    if (is_admin() || strpos($_SERVER['REQUEST_URI'], '/wp-json/') === 0 ) {
        return;
    }
    
    wp_redirect('http://localhost:4321', 301);
    exit;
}

add_action('template_redirect', 'disable_wp_frontend');


function setup_theme_supports() {
    add_theme_support('post-thumbnails');
    add_theme_support('menus');
}

add_action('after_setup_theme', 'setup_theme_supports');



/**
 * Filtra los resultados de la API REST por idioma (parámetro 'lang').
 * Esto replica la funcionalidad de Polylang Pro.
 *
 * @param array $args Argumentos de la consulta de WP_Query.
 * @param WP_REST_Request $request La petición REST.
 * @return array Los argumentos modificados.
 */
function mi_filtro_rest_por_idioma($args, $request) {
    
    // 1. Obtiene el parámetro 'lang' de la URL (ej. 'es' o 'en')
    $lang = $request->get_param('lang');

    // 2. Si el parámetro 'lang' no está presente, no hacemos nada
    if (empty($lang)) {
        return $args;
    }

    // 3. Si 'lang' está presente, añadimos un 'tax_query'
    // Esto le dice a WordPress que solo busque posts en el idioma solicitado
    $args['tax_query'] = [
        [
            'taxonomy' => 'language', // La taxonomía que usa Polylang
            'field'    => 'slug',     // Buscamos por el slug del idioma (ej. 'en', 'es')
            'terms'    => $lang,      // El idioma que nos pidieron
        ]
    ];

    return $args;
}

// 4. "Enganchamos" nuestra función a los tipos de contenido que usamos
// Tienes que añadir un filtro por cada tipo de contenido que quieras filtrar

add_filter('rest_post_query', 'mi_filtro_rest_por_idioma', 10, 2);      // Para Entradas (Posts)
add_filter('rest_page_query', 'mi_filtro_rest_por_idioma', 10, 2);      // Para Páginas (Pages)

// Viendo tu código de apiWP.js, también usas 'servicio' y 'programa'.
// ¡Necesitas añadir filtros para ellos también!
add_filter('rest_servicio_query', 'mi_filtro_rest_por_idioma', 10, 2);  // Para tu CPT 'servicio'
add_filter('rest_programa_query', 'mi_filtro_rest_por_idioma', 10, 2);  // Para tu CPT 'programa'

// Añade más filtros aquí si tienes más tipos de contenido personalizados...
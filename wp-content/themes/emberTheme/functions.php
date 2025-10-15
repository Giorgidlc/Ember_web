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

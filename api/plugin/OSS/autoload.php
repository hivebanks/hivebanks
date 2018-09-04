<?php

function classLoader($class)
{
    $path = str_replace('\\', DIRECTORY_SEPARATOR, $class);
    print_r(dirname(__FILE__)."\n");
    $file = __DIR__  . DIRECTORY_SEPARATOR . $path . '.php';
    print_r($file);
    if (file_exists($file)) {
        require_once $file;
    }
}
spl_autoload_register('classLoader');

<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/7/18
 * Time: 上午11:01
 *
 *  index.php
 */

require_once 'db/la_func_config.php';
/**
 * 检查La是否安装，如果已安装则进入重装确认页面，否则进入安装页面；
 */
//if(!install_check()){
    
    header('location:la_setting.php?step=1');

//}else{
//
//    header('location:la_setting.php?step=reinstall');
//
//}
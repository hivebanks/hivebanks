<?php

//require_once '../inc/upload_ba_bit_address_csv.php'
//function read_csv_lines($csv_file = '', $lines = 0, $offset = 0)
//{
//
//    $file_name = $csv_file['tmp_name'];
//    if($file_name == '')
//    {
//        die("请选择要上传的csv文件");
//    }
//    $handle = fopen($file_name, 'r');
//
//    if($handle === FALSE) die("打开文件资源失败");
//    $i = $j = 0;
//    while(($data = fgetcsv($handle)) !== FALSE){
//        if ($i++ < $offset) {
//            print_r($i."\n");
//            continue;
//        }
//        break;
//    }
//    $data = array();
//    while (($j++ < $lines) && !feof($handle)) {
//        print_r($j."j\n");
//        $data[] = fgetcsv($handle);
//    }
//    fclose($handle);
//    return $data;
//}

function getCSVdata($filename)
{
    $dataName = array();
    $row = 1;//第一行开始
    $file_names = $filename['tmp_name'];
    if(($handle = fopen($file_names, "r")) !== false)
    {
        while(($dataSrc = fgetcsv($handle)) !== false)
        {
            $num = count($dataSrc);
            for ($c=0; $c < $num; $c++)//列 column
            {
                if($row === 1)//第一行作为字段
                {
                    $dataName[] = $dataSrc[$c];//字段名称
                }
                else
                {
                    foreach ($dataName as $k=>$v)
                    {
                        if($k == $c)//对应的字段
                        {
                            $data[$v] = $dataSrc[$c];
                        }
                    }
                }
            }
            if(!empty($data))
            {
                $dataRtn[] = $data;
                unset($data);
            }
            $row++;
        }
        fclose($handle);
        return $dataRtn;
    }
}

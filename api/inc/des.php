<?php
class Des
{
    private static function pkcs5_pad($text, $block_size)
    {
        $pad = $block_size - (strlen($text) % $block_size);
        return $text . str_repeat(chr($pad), $pad);
    }

    /**
     * 加密
     * @param $input 输入字符串
     * @param $key 密钥字符串
     * @return string 加密字符串
     */
    public static function encrypt($input, $key)
    {
        $size = mcrypt_get_block_size(MCRYPT_DES, MCRYPT_MODE_ECB);
        $input = Des::pkcs5_pad($input, $size);
        $td = mcrypt_module_open(MCRYPT_DES, '', MCRYPT_MODE_ECB, '');
        $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
        mcrypt_generic_init($td, $key, $iv);
        $data = mcrypt_generic($td, $input);
        return base64_encode($data);
    }

    /**
     * 解密
     * @param $input 输入字符串
     * @param $key 密钥字符串
     * @return string 解密字符串
     */
    public static function decrypt($input, $key)
    {
        $td = mcrypt_module_open(MCRYPT_DES, '', MCRYPT_MODE_ECB, '');
        $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
        mcrypt_generic_init($td, $key, $iv);
        $result = mdecrypt_generic($td, base64_decode($input));
//        $result = mdecrypt_generic($td, $input);
        return $result;
    }
}
?>

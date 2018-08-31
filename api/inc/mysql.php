<?php
class Mysql {

  protected $server = '';
  protected $user = '';
  protected $password = '';
  protected $database = '';
  protected $linkMode = 0;
  protected $link_id = 0;
  protected $query_id = 0;
  protected $query_times = 0;
  protected $record = array ();
  protected $fetchMode = MYSQL_ASSOC;
  protected $err_no = 0;
  protected $err_msg;
  protected $character = '';
  protected $trans_status = false;//true,当前连接已经开启事务;false，未开启事务
  
  //======================================
  // 函数: mysql()
  // 功能: 构造函数
  // 参数: 参数类的变量定义
  // 说明: 构造函数将自动连接数据库
  //======================================
  public function __construct() {
      $this->connect();
  }

  //======================================
  // 函数: connect($server,$user,$password,$database)
  // 功能: 连接数据库
  // 参数: $server  主机名, $user  用户名
  // 参数: $password  密码, $database  数据库名称
  // 返回: 0:失败
  // 说明: 默认使用类中变量的初始值
  //======================================
  public function connect($server = "", $user = "", $password = "", $database = "") {
    $server = $server ? $server : $this->server;
    $user = $user ? $user : $this->user;
    $password = $password ? $password : $this->password;
    $database = $database ? $database : $this->database;
    @$this->link_id = $this->linkMode ? mysql_pconnect ($server, $user, $password, $database ) : mysql_connect ($server, $user, $password, $database );
    if (!$this->link_id) {
      //数据库连接失败！请检查各项参数！
      $this->halt ($server . "Db Connect error, pls check palameta!");
      return 0;
    }
    
    if (!mysql_select_db($database, $this->link_id)) {
      //无法选择数据库
      $this->halt ("Can not select database!");
      return 0;
    }
    
    //if ($this->character != "GBK" && $this->character != "UTF8") {
      //输入的编码模式不正确
      //$this->halt ("unknow character");
      //return 0;
    //}

    $this->query('SET NAMES ' . $this->character);
    return $this->link_id;
  }
  
  //======================================
  // 函数: query($sql)
  // 功能: 数据查询
  // 参数: $sql  要查询的SQL 语句
  // 返回: 0:失败
  //======================================
  public function query($sql) {

    $this->query_times ++;
    $this->query_id = mysql_query($sql, $this->link_id);
    if (!$this->query_id) {
      $this->errno = mysql_errno ();
      $this->error = mysql_error ();
      //$this->halt ( "<font color=red>" . $sql . "</font>  failed" );
      $this->halt($this->error);
      return 0;
    }
    return $this->query_id;
  }
  
  //======================================
  // 函数: setFetchMode($mode)
  // 功能: 设置取得记录的模式
  // 参数: $mode   模式  MYSQL_ASSOC, MYSQL_NUM, MYSQL_BOTH
  // 返回: 0:失败
  //======================================
  public function setFetchMode($mode) {
    if ($mode == MYSQL_ASSOC || $mode == MYSQL_NUM || $mode == MYSQL_BOTH) {
      $this->fetchMode = $mode;
      return 1;
    } else {
      $this->halt ( "error mode" );
      return 0;
    }
  }
  
  //======================================
  // 函数: fetchRow()
  // 功能: 从记录集中取出一条记录
  // 返回: 0:   出错 record:     一条记录
  //======================================
  public function fetchRow() {
    $this->record = mysql_fetch_array($this->query_id, $this->fetchMode);
    return $this->record;
  }
  
  //======================================
  // 函数: fetchAll()
  // 功能: 从记录集中取出所有记录
  // 返回: 记录集数组
  //======================================
  public function fetchAll() {
    $arr = array();
    while ($this->record = mysql_fetch_array($this->query_id, $this->fetchMode))
      $arr[] = $this->record;
    mysql_free_result($this->query_id);
    return $arr;
  }
  
  //======================================
  // 函数: getValue()
  // 功能: 返回记录中指定字段的数据
  // 参数: $field  字段名或字段索引
  // 返回: 指定字段的值
  //======================================
  public function getValue($filed) {
    return $this->record [$filed];
  }

  //======================================
  // 函数: getField($sql, $filed) 
  // 功能: 返回SQL语句查询结果中指定字段的数据
  // 参数: $sql    SQL语句
  // 参数: $field  字段名或字段索引
  // 返回: 指定字段的值
  //======================================
  public function getField($sql, $filed) {
    $this->query($sql);
    $this->fetchRow();
    return $this->record [$filed];
  }
  
  //======================================
  // 函数: getquery_id()
  // 功能:  返回查询号
  //======================================
  public function getQuery_id() {
    return $this->query_id;
  }
  
  //======================================
  // 函数: affectedRows()
  // 功能: 返回影响的记录数
  //======================================
  public function affectedRows() {
    return mysql_affected_rows($this->link_id);
  }
  
  //======================================
  // 函数: recordCount()
  // 功能: 返回查询记录的总数
  // 参数: 无
  // 返回: 记录总数
  //======================================
  public function recordCount() {
    return mysql_num_rows($this->query_id);
  }
  
  //======================================
  // 函数: getquery_times()
  // 功能: 返回查询的次数
  // 参数: 无
  // 返回: 查询的次数
  //======================================
  public function getquery_times() {
    return $this->query_times;
  }
  
  //======================================
  // 函数: getVersion()
  // 功能:  返回mysql 的版本
  // 参数:  无
  //======================================
  public function getVersion() {
    $this->query("select version() as ver");
    $this->fetchRow();
    return $this->getValue("ver");
  }
  
  //======================================
  // 函数: getDBSize($database, $tblPrefix=null)
  // 功能:  返回数据库占用空间大小
  // 参数: $database  数据库名
  // 参数: $tblPrefix  表的前缀,可选
  //======================================
  public function getDBSize($database, $tblPrefix = null) {
    $sql = "SHOW TABLE STATUS FROM " . $database;
    if ($tblPrefix != null) {
      $sql .= " LIKE '$tblPrefix%'";
    }
    $this->query ( $sql );
    $size = 0;
    while ($this->fetchRow())
      $size += $this->getValue("Data_length") + $this->getValue("Index_length");
      return $size;
  }
  
  //======================================
  // 函数: halt($err_msg)
  // 功能:  处理所有出错信息
  // 参数: $err_msg        自定义的出错信息
  //=====================================
  public function halt($err_msg = "") {
    if ($err_msg == "") {
      $this->errno = mysql_errno ();
      $this->error = mysql_error ();
      echo "<b>mysql error:<b><br>";
      echo $this->errno . ":" . $this->error . "<br>";
      exit ();
    } else {
      echo "<b>mysql error:<b><br>";
      echo $err_msg . "<br>";
      exit ();
    }
  }
  
  //======================================
  // 函数: sqlSelect()
  // 功能: 返回组合的select 查询值
  // 参数: $tbname  查询的表名
  // 参数: $where   条件
  // 参数: $limit   取得记录的条数,0,8
  // 参数: $fields  字段值
  // 参数: $orderby 按某字段排序
  // 参数: $sort    正序ASC,倒序DESC,$orderby   不为空是有效
  // 返回: 查询语句
  //======================================
  function sqlSelect($tbname, $where = "", $limit = 0, $fields = "*", $orderby = "", $sort = "DESC") {
    $sql = "SELECT " . $fields . " FROM " . $tbname . ($where ? " WHERE " . $where : "") . ($orderby ? " ORDER BY " . $orderby . " " . $sort : "") . ($limit ? " limit " . $limit : "");
    return $sql;
  }
  
  //======================================
  // 函数: sqlInsert()
  // 功能: Insert 插入数据函数
  // 参数: $taname  要插入数据的表名
  // 参数: $row  要插入的内容 (数组)
  // 返回: 记录总数
  // 返回: 插入语句
  //======================================
  function sqlInsert($tbname, $row) {
    $sqlfield = '';
    $sqlvalue = '';
    foreach($row as $key => $value) {
      $sqlfield .= $key . ",";
      $sqlvalue .= "'" . $value . "',";
    }
    return "INSERT INTO " . $tbname . "(" . substr ( $sqlfield, 0, - 1 ) . ") VALUES (" . substr ($sqlvalue, 0, - 1) . ")";
  }
  
  //======================================
  // 函数: sqlUpdate()
  // 功能: Update 更新数据的函数
  // 参数: $taname  要更新数据的表名
  // 参数: $row  要更新的内容 (数组)
  // 参数: $where  要更新的内容 的条件
  // 返回: Update 语句
  //======================================
  function sqlUpdate($tbname, $row, $where) {
    $sqlud = '';
    foreach ($row as $key => $value) {
      $sqlud .= $key . "= '" . $value . "',";
    }
    return "UPDATE " . $tbname . " SET " . substr ( $sqlud, 0, - 1 ) . " WHERE " . $where;
  }
  
  //======================================
  // 函数: sqlDelete()
  // 功能: 删除指定条件的行
  // 参数: $taname  要插入数据的表名
  // 参数: $where   要插入的内容 的条件
  // 返回: DELETE 语句
  //======================================
  function sqlDelete($tbname, $where) {
    if (! $where) {
      $this->halt ( "删除函数没有指定条件！" );
      return 0;
    }
    return "DELETE FROM " . $tbname . " WHERE " . $where;
  }
  
  //======================================
  // 函数: insertID()
  // 功能: 返回最后一次插入的自增ID
  // 参数: 无
  //======================================
  public function insertID() {
    return mysql_insert_id ();
  }
  
  //======================================
  //函数：close()
  //功能：关闭非永久的数据库连接
  //参数：无
  //======================================
  public function close() {
    @$link_id = $link_id ? $link_id : $this->link_id;
    mysql_close($link_id);
  }

  //======================================
  // 函数：析构函数
  // 功能：释放类，关闭非永久的数据库连接
  //======================================
  public function __destruct() {
    $this->close();
  }


    /**
     * 判断当前连接是否，已经开启事务
     */
   public function InTransaction()
    {
        return $this->trans_status;
    }

    /**
     * 开启事务
     * return boolean $pInTrans
     */
   public function StartTrans()
    {
        $pInTrans = true;
        if ($this->InTransaction()) {
            $pInTrans = false;
        } else {
            $this->query("start transaction");
            $this->trans_status = true;
            $pInTrans = true;

        }
        return $pInTrans;
    }

    /**
     * 提交事务
     * @param boolean $pInTrans
     */
   public function Commit($pInTrans)
    {
        if ($pInTrans && $this->InTransaction()) {
            $this->query("commit");
            $this->trans_status = false;
        }
    }

    /**
     *回滚事务
     * @param boolean $pInTrans
     */
  public  function Rollback($pInTrans)
    {
        if ($pInTrans && $this->InTransaction()) {
            $this->query("rollback");
            $this->trans_status = false;
        }
    }

}
?>

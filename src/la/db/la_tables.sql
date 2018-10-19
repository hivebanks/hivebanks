set NAMES utf8mb4;

DROP TABLE IF EXISTS `la_base`;
CREATE TABLE `la_base` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `base_currency` varchar(55) DEFAULT NULL COMMENT '基准货币',
  `unit` decimal(32,0) DEFAULT NULL COMMENT '单位',
  `h5_url` varchar(255) DEFAULT NULL,
  `api_url` varchar(255) DEFAULT NULL,
  `ca_currency` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `la_admin`;
CREATE TABLE `la_admin` (
  `id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户id',
  `user` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户名',
  `pwd` char(64) CHARACTER SET ascii NOT NULL COMMENT '密码',
  `real_name` varchar(99) DEFAULT NULL COMMENT '真实姓名',
  `email` varchar(255) NOT NULL COMMENT '管理员邮箱',
  `pid` varchar(99) DEFAULT NULL COMMENT '权限id',
  `last_login_ip` varchar(255) DEFAULT NULL COMMENT '最后一次登陆成功ip',
  `last_login_city` varchar(255) DEFAULT NULL COMMENT '最后一次登陆成功城市',
  `last_login_time` bigint(20) DEFAULT NULL COMMENT '最后一次登陆成功时间',
  `ctime` bigint(20) DEFAULT NULL COMMENT '创建时间',
  `key_code` varchar(64) DEFAULT NULL COMMENT '第三方服务key_code',
  PRIMARY KEY (`user`,`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='管理员表';


DROP TABLE IF EXISTS `com_feedback`;
CREATE TABLE `com_feedback` (
  `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `sub_id` char(3) CHARACTER SET ascii DEFAULT NULL COMMENT '模块ID',
  `end_type` char(3) CHARACTER SET ascii DEFAULT NULL COMMENT '终端类型',
  `submit_time` datetime DEFAULT NULL COMMENT '提交时间',
  `submit_id` char(36) CHARACTER SET ascii DEFAULT NULL COMMENT '提交ID',
  `submit_name` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '提交用户昵称',
  `submit_info` text CHARACTER SET utf8mb4 COMMENT '提交信息',
  `analyse_time` datetime DEFAULT NULL COMMENT '分析时间',
  `analyse_info` text CHARACTER SET utf8mb4 COMMENT '原因分析',
  `analyse_id` char(36) CHARACTER SET ascii DEFAULT NULL COMMENT '分析人ID',
  `analyse_name` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '分析人昵称',
  `deal_time` datetime DEFAULT NULL COMMENT '处理时间',
  `deal_id` char(36) CHARACTER SET ascii DEFAULT NULL COMMENT '处理人ID',
  `deal_name` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '处理人昵称',
  `deal_info` text CHARACTER SET utf8mb4 COMMENT '处理意见',
  `log_status` tinyint(1) unsigned DEFAULT '0' COMMENT '处理状态( 0 未处理 1 已受理 2 已分析 9 已处理)',
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='故障申报表';

CREATE TABLE `base_asset_account` (
  `account_id` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '账号ID',
  `base_id` char(36) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '代理ID',
  `bit_type` varchar(36) CHARACTER SET ascii NOT NULL COMMENT '数字货币类型',
  `bit_address` varchar(512) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '数字货币地址',
  `bind_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '绑定标志',
  `bind_agent_id` char(36) CHARACTER SET ascii DEFAULT NULL COMMENT '绑定用户ID',
  `bind_hash` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '绑定Hash',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`account_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='基准货币代理商保证金账号';

CREATE TABLE `base_recharge_request` (
  `qa_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '请求ID',
  `agent_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `base_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '基准BAID',
  `base_account_id` varchar(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '充值账号ID（Hash）',
  `base_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '充值资产金额',
  `tx_hash` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '交易HASH',
  `tx_type` char(10) CHARACTER SET ascii NOT NULL DEFAULT '1' COMMENT '交易类型',
  `tx_detail` text COMMENT '交易明细（JSON）',
  `tx_fee` decimal(30,4) DEFAULT '0.0000' COMMENT '交易手续费',
  `tx_time` int(11) DEFAULT '0' COMMENT '请求时间戳',
  `qa_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '订单状态',
  PRIMARY KEY (`qa_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='代理商数字资产充值请求';

CREATE TABLE `base_withdraw_request` (
  `qa_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '请求ID',
  `agent_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `base_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '基准BAID',
  `agent_account_id` varchar(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '代理商账号ID（Hash）',
  `base_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '提现资产金额',
  `tx_hash` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '交易HASH',
  `tx_type` char(10) CHARACTER SET ascii NOT NULL DEFAULT '1' COMMENT '交易类型',
  `tx_detail` text COMMENT '交易明细（JSON）',
  `tx_fee` decimal(30,4) DEFAULT '0.0000' COMMENT '交易手续费',
  `tx_time` int(11) DEFAULT '0' COMMENT '请求时间戳',
  `qa_flag` tinyint(1) DEFAULT '0' COMMENT '订单状态1:已处理，2拒绝，0：未处理',
  PRIMARY KEY (`qa_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='代理商数字资产提现请求';

DROP TABLE IF EXISTS `la_permit`;
CREATE TABLE `la_permit` (
  `data_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(11) DEFAULT NULL,
  `pname` varchar(99) COLLATE utf8mb4_bin DEFAULT NULL,
  `subname` varchar(99) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`data_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `la_login_log`;
CREATE TABLE `la_login_log` (
  `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user` varchar(99) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '管理员昵称',
  `login_time` bigint(20) DEFAULT NULL COMMENT '登陆时间',
  `login_status` char(1) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '登陆状态：0失败1成功',
  `login_ip` varchar(99) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '登陆ip',
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `ba_asset_account`;
CREATE TABLE `ba_asset_account` (
  `account_id` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '账号ID',
  `ba_id` char(36) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '用户ID',
  `batch_id` varchar(36) CHARACTER SET ascii DEFAULT '' COMMENT '生产批号',
  `bit_type` varchar(36) CHARACTER SET ascii NOT NULL COMMENT '数字货币类型',
  `bit_address` varchar(512) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '数字货币地址',
  `bind_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '绑定标志',
  `bind_us_id` char(36) CHARACTER SET ascii DEFAULT NULL COMMENT '绑定用户ID',
  `bind_hash` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '绑定Hash',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`account_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='BA数字资产外部账号';

DROP TABLE IF EXISTS `ba_base`;
CREATE TABLE `ba_base` (
  `ba_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `ba_nm` int(11) unsigned DEFAULT '0' COMMENT '代理商编号（内部唯一）',
  `ba_account` varchar(50) CHARACTER SET ascii DEFAULT '' COMMENT '代理商表示账号（内部唯一）',
  `base_amount` decimal(32,0) unsigned NOT NULL DEFAULT '0.000000' COMMENT '基准资产余额',
  `lock_amount` decimal(32,0) unsigned NOT NULL DEFAULT '0.000000' COMMENT '锁定余额',
  `ba_type` varchar(50) CHARACTER SET ascii DEFAULT '' COMMENT '代理商类型',
  `ba_level` tinyint(4) NOT NULL DEFAULT '0' COMMENT '代理商等级',
  `security_level` tinyint(4) DEFAULT '0' COMMENT '安全等级',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`ba_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='BA主表';

DROP TABLE IF EXISTS `ba_bind`;
CREATE TABLE `ba_bind` (
  `bind_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '绑定ID',
  `ba_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `bind_type` char(4) CHARACTER SET ascii NOT NULL COMMENT '绑定类型',
  `bind_name` varchar(50) NOT NULL DEFAULT '' COMMENT '绑定名称',
  `bind_info` text CHARACTER SET utf8mb4 NOT NULL COMMENT '绑定内容',
  `bind_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '绑定标志',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`bind_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='BA绑定信息表';

DROP TABLE IF EXISTS `ba_log_bind`;
CREATE TABLE `ba_log_bind` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '绑定日志ID',
  `ba_id` char(36) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '用户ID',
  `bind_type` char(4) CHARACTER SET ascii NOT NULL COMMENT '绑定类型',
  `bind_name` varchar(50) NOT NULL DEFAULT '' COMMENT '绑定名称',
  `bind_info` text CHARACTER SET utf8mb4 NOT NULL COMMENT '绑定内容',
  `bind_salt` varchar(50) CHARACTER SET ascii DEFAULT NULL COMMENT '绑定验证码',
  `count_error` tinyint(4) DEFAULT '0' COMMENT '验证错误次数',
  `limt_time` int(11) DEFAULT '0' COMMENT '限制时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='BA绑定信息记录';

DROP TABLE IF EXISTS `ba_log_login`;
CREATE TABLE `ba_log_login` (
  `hash_id` char(64) CHARACTER SET ascii NOT NULL COMMENT 'HASH值',
  `prvs_hash` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '上一HASH值',
  `ba_id` char(36) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '用户ID',
  `lgn_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '登录类型',
  `ba_ip` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户IP地址',
  `ip_area` varchar(255) DEFAULT NULL COMMENT 'IP地区',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '提交时间',
  PRIMARY KEY (`hash_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='BA登录记录';

DROP TABLE IF EXISTS `ba_log_login_fail`;
CREATE TABLE `ba_log_login_fail` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `ba_id` char(36) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '用户ID',
  `ba_ip` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户IP地址',
  `lgn_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '登录类型',
  `count_error` tinyint(4) DEFAULT '0' COMMENT '登录错误次数',
  `limt_time` int(11) DEFAULT '0' COMMENT '限制时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '错误时间',
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=FIXED COMMENT='BA登录失败记录';

DROP TABLE IF EXISTS `ba_rate_setting`;
CREATE TABLE `ba_rate_setting` (
  `set_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '设定ID',
  `ba_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `bit_type` varchar(50) CHARACTER SET ascii DEFAULT NULL COMMENT '代理数字货币类型',
  `rate_type` tinyint(1) DEFAULT '0' COMMENT '汇率类型 1 充值 2 提现',
  `base_rate` decimal(30,16) DEFAULT '1.0000000000000000' COMMENT '基本汇率',
  `tx_fee` decimal(30,4) DEFAULT '0.0000' COMMENT '交易手续费率',
  `min_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '最小额度',
  `max_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '最大额度',
  `us_level` tinyint(4) NOT NULL DEFAULT '0' COMMENT '用户等级要求',
  `limit_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `set_time` int(11) DEFAULT '0' COMMENT '设定时间戳',
  PRIMARY KEY (`set_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='BA汇率设定表';

DROP TABLE IF EXISTS `ca_asset_account`;
CREATE TABLE `ca_asset_account` (
  `account_id` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '账号ID',
  `ca_id` char(36) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '用户ID',
  `ca_channel` varchar(36) CHARACTER SET ascii DEFAULT '' COMMENT '充值渠道',
  `lgl_address` text CHARACTER SET utf8mb4 NOT NULL COMMENT '法定货币地址（JSON格式数据类型）',
  `use_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '使用标志（0 未使用 1 已使用）',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`account_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='CA法币资产外部账号';

DROP TABLE IF EXISTS `ca_base`;
CREATE TABLE `ca_base` (
  `ca_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `ca_nm` int(11) unsigned DEFAULT '0' COMMENT '代理商编号（内部唯一）',
  `ca_account` varchar(50) CHARACTER SET ascii DEFAULT '' COMMENT '代理商表示账号（内部唯一）',
  `base_amount` decimal(32,0) unsigned NOT NULL DEFAULT '0.000000' COMMENT '基准资产余额',
  `lock_amount` decimal(32,0) unsigned NOT NULL DEFAULT '0.000000' COMMENT '锁定余额',
  `ca_type` varchar(50) CHARACTER SET ascii DEFAULT '' COMMENT '代理商类型',
  `ca_level` tinyint(4) NOT NULL DEFAULT '0' COMMENT '代理商等级',
  `security_level` tinyint(4) DEFAULT '0' COMMENT '安全等级',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`ca_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='CA主表';

DROP TABLE IF EXISTS `ca_bind`;
CREATE TABLE `ca_bind` (
  `bind_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '绑定ID',
  `ca_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `bind_type` char(4) CHARACTER SET ascii NOT NULL COMMENT '绑定类型',
  `bind_name` varchar(50) NOT NULL DEFAULT '' COMMENT '绑定名称',
  `bind_info` text CHARACTER SET utf8mb4 NOT NULL COMMENT '绑定内容',
  `bind_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '绑定标志',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`bind_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='CA绑定信息表';

DROP TABLE IF EXISTS `ca_log_bind`;
CREATE TABLE `ca_log_bind` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '绑定日志ID',
  `ca_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `bind_type` char(4) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '绑定类型,1：注册，2：登录，3：忘记密码，4：绑定，5：交易',
  `bind_name` varchar(50) NOT NULL DEFAULT '' COMMENT '绑定名称',
  `bind_info` text CHARACTER SET utf8mb4 NOT NULL COMMENT '绑定内容',
  `bind_salt` varchar(50) CHARACTER SET ascii DEFAULT NULL COMMENT '绑定验证码',
  `count_error` tinyint(4) DEFAULT '0' COMMENT '验证错误次数',
  `limt_time` int(11) DEFAULT '0' COMMENT '限制时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='CA绑定信息记录';

DROP TABLE IF EXISTS `ca_log_login`;
CREATE TABLE `ca_log_login` (
  `hash_id` char(64) CHARACTER SET ascii NOT NULL COMMENT 'HASH值',
  `prvs_hash` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '上一HASH值',
  `ca_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `lgn_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '登录类型',
  `ca_ip` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户IP地址',
  `ip_area` varchar(255) DEFAULT NULL COMMENT 'IP地区',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '提交时间',
  PRIMARY KEY (`hash_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='CA登录记录';

DROP TABLE IF EXISTS `ca_log_login_fail`;
CREATE TABLE `ca_log_login_fail` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `ca_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `ca_ip` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户IP地址',
  `lgn_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '登录类型',
  `count_error` tinyint(4) DEFAULT '0' COMMENT '登录错误次数',
  `limt_time` int(11) DEFAULT '0' COMMENT '限制时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '错误时间',
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='CA登录失败记录';

DROP TABLE IF EXISTS `ca_rate_setting`;
CREATE TABLE `ca_rate_setting` (
  `set_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '设定ID',
  `ca_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `ca_channel` varchar(36) CHARACTER SET ascii DEFAULT NULL COMMENT '充值渠道',
  `rate_type` tinyint(1) DEFAULT '0' COMMENT '汇率类型 1 充值 2 提现',
  `base_rate` decimal(30,16) DEFAULT '1.0000000000000000' COMMENT '基本汇率',
  `tx_fee` decimal(30,4) DEFAULT '0.0000' COMMENT '交易手续费率',
  `min_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '最小额度',
  `max_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '最大额度',
  `us_level` tinyint(4) NOT NULL DEFAULT '0' COMMENT '用户等级要求',
  `limit_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `set_time` int(11) DEFAULT '0' COMMENT '设定时间戳',
  PRIMARY KEY (`set_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='CA汇率设定表';

DROP TABLE IF EXISTS `com_base_balance`;
CREATE TABLE `com_base_balance` (
  `hash_id` char(64) CHARACTER SET ascii NOT NULL COMMENT 'HASH值',
  `prvs_hash` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '借方上次交易HASH值',
  `tx_id` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '交易ID（借贷双方同）',
  `credit_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '借方ID',
  `debit_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '贷方ID',
  `tx_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '交易类型',
  `tx_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '交易金额',
  `credit_balance` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '借方交易后余额',
  `utime` int(11) DEFAULT '0' COMMENT '变动时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '变动时间',
  PRIMARY KEY (`hash_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='基准资产变动记录';

DROP TABLE IF EXISTS `com_option_config`;
CREATE TABLE `com_option_config` (
  `option_name` varchar(255) CHARACTER SET ascii NOT NULL COMMENT '选项名称',
  `option_key` varchar(255) CHARACTER SET ascii NOT NULL COMMENT '选项关键字',
  `option_value` varchar(255) NOT NULL DEFAULT 'value' COMMENT '选项内容',
  `option_sort` decimal(30,16) NOT NULL DEFAULT '0.0000000000000000' COMMENT '选项排序',
  `sub_id` char(3) CHARACTER SET ascii NOT NULL DEFAULT 'US' COMMENT '模块ID',
  `status` tinyint(4) DEFAULT NULL COMMENT '有效标志',
  `option_src` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`option_name`,`option_key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='共通选项配置表';

INSERT INTO `com_option_config` VALUES ('ba_lock','ba_lock','0',0,'BA',0,0),('ca_lock','ca_lock','0',0,'CA',0,0),
('user_lock','user_lock','0',0,'US',0,0);

DROP TABLE IF EXISTS `la_black_list`;
CREATE TABLE `la_black_list` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '绑定日志ID',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `black_type` char(4) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '处罚性质：1：禁止登录 2 禁止提现 3 禁止充值',
  `black_info` varchar(255) NOT NULL DEFAULT '' COMMENT '处罚原因',
  `ttl_id` char(36) CHARACTER SET ascii DEFAULT '' COMMENT '操作者ID',
  `limt_time` int(11) DEFAULT '0' COMMENT '处罚到期时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COMMENT='LA黑名单记录';



DROP TABLE IF EXISTS `us_asset_bit_account`;
CREATE TABLE `us_asset_bit_account` (
  `account_id` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '账号ID（Hash）',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `bit_type` varchar(36) CHARACTER SET ascii NOT NULL COMMENT '数字货币类型',
  `bit_address` varchar(256) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '数字货币地址',
  `bind_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '绑定标志',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`account_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户数字资产外部账号';

DROP TABLE IF EXISTS `us_asset_cash_account`;
CREATE TABLE `us_asset_cash_account` (
  `account_id` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '账号ID（Hash）',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `cash_type` varchar(36) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '法定货币类型',
  `cash_channel` varchar(36) CHARACTER SET ascii DEFAULT '' COMMENT '法币渠道',
  `lgl_address` text NOT NULL COMMENT '法定货币地址（JSON格式数据类型）',
  `bind_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '绑定标志',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`account_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户法币资产外部账号';

DROP TABLE IF EXISTS `us_ba_recharge_request`;
CREATE TABLE `us_ba_recharge_request` (
  `qa_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '请求ID',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `ba_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `asset_id` varchar(36) CHARACTER SET ascii NOT NULL COMMENT '充值资产ID',
  `ba_account_id` varchar(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '代理商账号ID（Hash）',
  `bit_amount` decimal(32,16) NOT NULL DEFAULT '0.000000' COMMENT '数字货币金额',
  `base_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '充值资产金额',
  `tx_hash` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '交易HASH',
  `tx_type` char(10) CHARACTER SET ascii NOT NULL DEFAULT '1' COMMENT '交易类型',
  `tx_detail` text COMMENT '交易明细（JSON）',
  `tx_fee` decimal(30,4) DEFAULT '0.0000' COMMENT '交易手续费',
  `tx_time` int(11) DEFAULT '0' COMMENT '请求时间戳',
  `qa_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '订单状态',
  PRIMARY KEY (`qa_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='用户数字资产充值请求';

DROP TABLE IF EXISTS `us_ba_withdraw_request`;
CREATE TABLE `us_ba_withdraw_request` (
  `qa_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '请求ID',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `ba_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `asset_id` varchar(36) CHARACTER SET ascii NOT NULL COMMENT '提现资产ID',
  `us_account_id` varchar(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '用户账号ID（Hash）',
  `bit_amount` decimal(32,16) NOT NULL DEFAULT '0.00000000' COMMENT '数字货币金额',
  `base_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '提现资产金额',
  `tx_hash` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '交易HASH',
  `tx_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '交易类型',
  `tx_detail` text COMMENT '交易明细（JSON）',
  `tx_fee` decimal(30,4) DEFAULT '0.0000' COMMENT '交易手续费',
  `tx_time` int(11) DEFAULT '0' COMMENT '请求时间戳',
  `qa_flag` tinyint(1) unsigned DEFAULT '0' COMMENT '订单状态1:已处理，2拒绝，0：未处理',
  PRIMARY KEY (`qa_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='用户数字资产提现请求';

DROP TABLE IF EXISTS `us_base`;
CREATE TABLE `us_base` (
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `us_nm` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户编号（内部唯一）',
  `us_account` varchar(50) CHARACTER SET ascii DEFAULT '' COMMENT '用户账号（内部唯一）',
  `base_amount` decimal(32,0) unsigned NOT NULL DEFAULT '0' COMMENT '基准资产余额',
  `lock_amount` decimal(32,0) unsigned NOT NULL DEFAULT '0' COMMENT '锁定余额',
  `us_type` varchar(50) CHARACTER SET ascii DEFAULT '' COMMENT '用户类型',
  `us_level` tinyint(4) NOT NULL DEFAULT '0' COMMENT '用户等级',
  `security_level` tinyint(4) DEFAULT '0' COMMENT '安全等级',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  `invite_code` int(11) DEFAULT NULL COMMENT '邀请人',
  PRIMARY KEY (`us_nm`,`us_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=100184 DEFAULT CHARSET=utf8 COMMENT='用户主表';

DROP TABLE IF EXISTS `us_bind`;
CREATE TABLE `us_bind` (
  `bind_id` char(36) NOT NULL COMMENT '绑定ID',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `bind_type` char(4) CHARACTER SET ascii NOT NULL COMMENT '绑定类型',
  `bind_name` varchar(50) NOT NULL DEFAULT '' COMMENT '绑定名称',
  `bind_info` text CHARACTER SET utf8mb4 NOT NULL COMMENT '绑定内容',
  `bind_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '绑定标志',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`bind_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户绑定信息表';

DROP TABLE IF EXISTS `us_ca_recharge_request`;
CREATE TABLE `us_ca_recharge_request` (
  `qa_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '请求ID',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `ca_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `ca_account_id` varchar(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '代理商账号ID（Hash）',
  `lgl_amount` decimal(32,16) NOT NULL DEFAULT '0.0000000000000000' COMMENT '法定货币金额',
  `base_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '充值资产金额',
  `tx_type` char(10) CHARACTER SET ascii NOT NULL DEFAULT '1' COMMENT '交易类型',
  `tx_detail` text COMMENT '交易明细（JSON）',
  `tx_fee` decimal(30,4) DEFAULT '0.0000' COMMENT '交易手续费',
  `tx_time` int(11) DEFAULT '0' COMMENT '请求时间戳',
  `qa_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '订单状态',
  `tx_hash` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '订单hash',
  PRIMARY KEY (`qa_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='用户法币资产充值请求';

DROP TABLE IF EXISTS `us_ca_withdraw_request`;
CREATE TABLE `us_ca_withdraw_request` (
  `qa_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '请求ID',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `ca_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '代理商ID',
  `us_account_id` varchar(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '用户账号ID（Hash）',
  `lgl_amount` decimal(32,16) NOT NULL DEFAULT '0.0000000000000000' COMMENT '法定货币金额',
  `base_amount` decimal(32,0) NOT NULL DEFAULT '0' COMMENT '提现资产金额',
  `tx_hash` char(64) CHARACTER SET ascii DEFAULT NULL COMMENT '交易HASH',
  `tx_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '交易类型',
  `tx_detail` text COMMENT '交易明细（JSON）',
  `tx_fee` decimal(30,4) DEFAULT '0.0000' COMMENT '交易手续费',
  `tx_time` int(11) DEFAULT '0' COMMENT '请求时间戳',
  `qa_flag` tinyint(1) DEFAULT '0' COMMENT '订单状态1:已处理，2拒绝，0：未处理',
  PRIMARY KEY (`qa_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='用户法币资产提现请求';


DROP TABLE IF EXISTS `us_log_bind`;
CREATE TABLE `us_log_bind` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '绑定日志ID',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `bind_type` char(4) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '绑定类型,1：注册，2：登录，3：忘记密码，4：绑定，5：交易',
  `bind_name` varchar(50) NOT NULL DEFAULT '' COMMENT '绑定名称',
  `bind_info` text CHARACTER SET utf8mb4 NOT NULL COMMENT '绑定内容',
  `bind_salt` varchar(50) CHARACTER SET ascii DEFAULT NULL COMMENT '绑定验证码',
  `count_error` tinyint(4) DEFAULT '0' COMMENT '验证错误次数',
  `limt_time` int(11) DEFAULT '0' COMMENT '限制时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='用户绑定信息记录';

DROP TABLE IF EXISTS `us_log_login`;
CREATE TABLE `us_log_login` (
  `hash_id` char(64) CHARACTER SET ascii NOT NULL COMMENT 'HASH值',
  `prvs_hash` char(64) CHARACTER SET ascii NOT NULL DEFAULT '' COMMENT '上一HASH值',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `lgn_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '登录类型',
  `us_ip` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户IP地址',
  `ip_area` varchar(255) DEFAULT NULL COMMENT 'IP地区',
  `utime` int(11) DEFAULT '0' COMMENT '更新时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '提交时间',
  PRIMARY KEY (`hash_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户登录记录';

DROP TABLE IF EXISTS `us_log_login_fail`;
CREATE TABLE `us_log_login_fail` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `us_id` char(36) CHARACTER SET ascii NOT NULL COMMENT '用户ID',
  `us_ip` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户IP地址',
  `lgn_type` char(10) CHARACTER SET ascii NOT NULL COMMENT '登录类型',
  `count_error` tinyint(4) DEFAULT '0' COMMENT '登录错误次数',
  `limt_time` int(11) DEFAULT '0' COMMENT '限制时间戳',
  `ctime` datetime DEFAULT NULL COMMENT '错误时间',
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='用户登录失败记录';

/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : vipadmin

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2015-09-21 17:53:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `customer`
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mobile` int(50) DEFAULT NULL,
  `storeid` int(10) NOT NULL,
  `creattime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `remark` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of customer
-- ----------------------------
INSERT INTO `customer` VALUES ('1', '1586477151', '12', '2015-09-21 15:05:32', '12');

-- ----------------------------
-- Table structure for `money`
-- ----------------------------
DROP TABLE IF EXISTS `money`;
CREATE TABLE `money` (
  `id` int(10) NOT NULL,
  `userid` int(10) NOT NULL,
  `storeid` int(10) NOT NULL,
  `money` float(20,2) NOT NULL,
  `time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `status` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of money
-- ----------------------------

-- ----------------------------
-- Table structure for `msgcode`
-- ----------------------------
DROP TABLE IF EXISTS `msgcode`;
CREATE TABLE `msgcode` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `mobile` int(20) DEFAULT NULL,
  `code` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of msgcode
-- ----------------------------

-- ----------------------------
-- Table structure for `store`
-- ----------------------------
DROP TABLE IF EXISTS `store`;
CREATE TABLE `store` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `storename` text,
  `mobile` bigint(50) NOT NULL,
  `pwd` text NOT NULL,
  `status` int(10) NOT NULL,
  `time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of store
-- ----------------------------
INSERT INTO `store` VALUES ('1', '谁谁', '15867107162', '123456', '1', '2015-09-21 16:12:10');
